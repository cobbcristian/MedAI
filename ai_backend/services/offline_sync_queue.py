import asyncio
import json
import logging
import sqlite3
import threading
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import hashlib
import uuid
import os
import mysql.connector
from mysql.connector import Error

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SyncStatus(Enum):
    PENDING = "pending"
    SYNCING = "syncing"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRY = "retry"

class QueuePriority(Enum):
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4

@dataclass
class SyncItem:
    id: str
    action: str
    data: Dict[str, Any]
    timestamp: datetime
    priority: QueuePriority
    status: SyncStatus
    retry_count: int = 0
    max_retries: int = 3
    error_message: Optional[str] = None
    user_id: Optional[str] = None
    device_id: Optional[str] = None
    network_quality: Optional[str] = None

class OfflineSyncQueue:
    """
    Offline-first synchronization queue for telemedicine operations
    Handles data queuing when offline and synchronization when back online
    """
    
    def __init__(self, db_path: str = "offline_sync.db", max_queue_size: int = 1000):
        self.db_path = db_path
        self.max_queue_size = max_queue_size
        self.is_syncing = False
        self.sync_lock = threading.Lock()
        self.network_monitor = NetworkMonitor()
        
        # Database configuration from environment
        self.use_mysql = os.getenv('MYSQL_HOST') is not None
        self.mysql_config = {
            'host': os.getenv('MYSQL_HOST', 'localhost'),
            'user': os.getenv('MYSQL_USER', 'ai_telemedicine_user'),
            'password': os.getenv('MYSQL_PASSWORD', 'ai_telemedicine_password_2024'),
            'database': os.getenv('MYSQL_DATABASE', 'ai_telemedicine'),
            'port': int(os.getenv('MYSQL_PORT', 3306))
        }
        
        # Initialize database
        self._init_database()
        
        # Start background sync process
        self.sync_thread = threading.Thread(target=self._background_sync_worker, daemon=True)
        self.sync_thread.start()
        
        logger.info("OfflineSyncQueue initialized")
    
    def _init_database(self):
        """Initialize database (SQLite for local, MySQL for production)"""
        if self.use_mysql:
            self._init_mysql_database()
        else:
            self._init_sqlite_database()
    
    def _init_sqlite_database(self):
        """Initialize SQLite database for offline queue"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sync_queue (
                id TEXT PRIMARY KEY,
                action TEXT NOT NULL,
                data TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                priority INTEGER NOT NULL,
                status TEXT NOT NULL,
                retry_count INTEGER DEFAULT 0,
                max_retries INTEGER DEFAULT 3,
                error_message TEXT,
                user_id TEXT,
                device_id TEXT,
                network_quality TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_status_priority 
            ON sync_queue(status, priority DESC)
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_timestamp 
            ON sync_queue(timestamp)
        ''')
        
        conn.commit()
        conn.close()
    
    def _init_mysql_database(self):
        """Initialize MySQL database for offline queue"""
        try:
            conn = mysql.connector.connect(**self.mysql_config)
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sync_queue (
                    id VARCHAR(255) PRIMARY KEY,
                    action VARCHAR(255) NOT NULL,
                    data JSON NOT NULL,
                    timestamp DATETIME NOT NULL,
                    priority INT NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    retry_count INT DEFAULT 0,
                    max_retries INT DEFAULT 3,
                    error_message TEXT,
                    user_id VARCHAR(255),
                    device_id VARCHAR(255),
                    network_quality VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_status_priority 
                ON sync_queue(status, priority DESC)
            ''')
            
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_timestamp 
                ON sync_queue(timestamp)
            ''')
            
            conn.commit()
            conn.close()
            logger.info("MySQL database initialized successfully")
            
        except Error as e:
            logger.error(f"Error initializing MySQL database: {e}")
            logger.info("Falling back to SQLite database")
            self.use_mysql = False
            self._init_sqlite_database()
    
    def _get_connection(self):
        """Get database connection"""
        if self.use_mysql:
            return mysql.connector.connect(**self.mysql_config)
        else:
            return sqlite3.connect(self.db_path)
    
    def add_to_queue(self, action: str, data: Dict[str, Any], 
                    priority: QueuePriority = QueuePriority.NORMAL,
                    user_id: Optional[str] = None,
                    device_id: Optional[str] = None) -> str:
        """
        Add an item to the offline sync queue
        
        Args:
            action: The action to perform (e.g., 'create_appointment', 'update_medical_record')
            data: The data payload
            priority: Priority level for sync order
            user_id: User identifier
            device_id: Device identifier
            
        Returns:
            Queue item ID
        """
        item_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        sync_item = SyncItem(
            id=item_id,
            action=action,
            data=data,
            timestamp=datetime.fromisoformat(timestamp),
            priority=priority,
            status=SyncStatus.PENDING,
            user_id=user_id,
            device_id=device_id,
            network_quality=self.network_monitor.get_network_quality()
        )
        
        # Check queue size limit
        if self._get_queue_size() >= self.max_queue_size:
            # Remove lowest priority items
            self._cleanup_old_items()
        
        self._save_item(sync_item)
        logger.info(f"Added item to queue: {action} (ID: {item_id})")
        
        # Trigger sync if online
        if self.network_monitor.is_online():
            self._trigger_sync()
        
        return item_id
    
    def _save_item(self, item: SyncItem):
        """Save sync item to database"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        if self.use_mysql:
            cursor.execute('''
                INSERT OR REPLACE INTO sync_queue 
                (id, action, data, timestamp, priority, status, retry_count, 
                 max_retries, error_message, user_id, device_id, network_quality)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                item.id,
                item.action,
                json.dumps(item.data),
                item.timestamp.isoformat(),
                item.priority.value,
                item.status.value,
                item.retry_count,
                item.max_retries,
                item.error_message,
                item.user_id,
                item.device_id,
                item.network_quality
            ))
        else:
            cursor.execute('''
                INSERT OR REPLACE INTO sync_queue 
                (id, action, data, timestamp, priority, status, retry_count, 
                 max_retries, error_message, user_id, device_id, network_quality)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                item.id,
                item.action,
                json.dumps(item.data),
                item.timestamp.isoformat(),
                item.priority.value,
                item.status.value,
                item.retry_count,
                item.max_retries,
                item.error_message,
                item.user_id,
                item.device_id,
                item.network_quality
            ))
        
        conn.commit()
        conn.close()
    
    def _get_queue_size(self) -> int:
        """Get current queue size"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        if self.use_mysql:
            cursor.execute('SELECT COUNT(*) FROM sync_queue WHERE status IN (%s, %s)', 
                          (SyncStatus.PENDING.value, SyncStatus.RETRY.value))
        else:
            cursor.execute('SELECT COUNT(*) FROM sync_queue WHERE status IN (?, ?)', 
                          (SyncStatus.PENDING.value, SyncStatus.RETRY.value))
        
        size = cursor.fetchone()[0]
        conn.close()
        return size
    
    def _cleanup_old_items(self):
        """Remove old completed/failed items to free space"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Remove items older than 30 days
        cutoff_date = (datetime.now() - timedelta(days=30)).isoformat()
        
        if self.use_mysql:
            cursor.execute('''
                DELETE FROM sync_queue 
                WHERE status IN (%s, %s) AND timestamp < %s
            ''', (SyncStatus.COMPLETED.value, SyncStatus.FAILED.value, cutoff_date))
        else:
            cursor.execute('''
                DELETE FROM sync_queue 
                WHERE status IN (?, ?) AND timestamp < ?
            ''', (SyncStatus.COMPLETED.value, SyncStatus.FAILED.value, cutoff_date))
        
        deleted_count = cursor.rowcount
        conn.commit()
        conn.close()
        
        if deleted_count > 0:
            logger.info(f"Cleaned up {deleted_count} old sync items")
    
    def get_pending_items(self, limit: int = 50) -> List[SyncItem]:
        """Get pending items ordered by priority and timestamp"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        if self.use_mysql:
            cursor.execute('''
                SELECT id, action, data, timestamp, priority, status, retry_count,
                       max_retries, error_message, user_id, device_id, network_quality
                FROM sync_queue 
                WHERE status IN (%s, %s)
                ORDER BY priority DESC, timestamp ASC
                LIMIT %s
            ''', (SyncStatus.PENDING.value, SyncStatus.RETRY.value, limit))
        else:
            cursor.execute('''
                SELECT id, action, data, timestamp, priority, status, retry_count,
                       max_retries, error_message, user_id, device_id, network_quality
                FROM sync_queue 
                WHERE status IN (?, ?)
                ORDER BY priority DESC, timestamp ASC
                LIMIT ?
            ''', (SyncStatus.PENDING.value, SyncStatus.RETRY.value, limit))
        
        items = []
        for row in cursor.fetchall():
            item = SyncItem(
                id=row[0],
                action=row[1],
                data=json.loads(row[2]),
                timestamp=datetime.fromisoformat(row[3]),
                priority=QueuePriority(row[4]),
                status=SyncStatus(row[5]),
                retry_count=row[6],
                max_retries=row[7],
                error_message=row[8],
                user_id=row[9],
                device_id=row[10],
                network_quality=row[11]
            )
            items.append(item)
        
        conn.close()
        return items
    
    def update_item_status(self, item_id: str, status: SyncStatus, 
                          error_message: Optional[str] = None):
        """Update sync item status"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        if status == SyncStatus.FAILED:
            # Increment retry count
            if self.use_mysql:
                cursor.execute('''
                    UPDATE sync_queue 
                    SET status = %s, error_message = %s, retry_count = retry_count + 1
                    WHERE id = %s
                ''', (status.value, error_message, item_id))
            else:
                cursor.execute('''
                    UPDATE sync_queue 
                    SET status = ?, error_message = ?, retry_count = retry_count + 1
                    WHERE id = ?
                ''', (status.value, error_message, item_id))
        else:
            if self.use_mysql:
                cursor.execute('''
                    UPDATE sync_queue 
                    SET status = %s, error_message = %s
                    WHERE id = %s
                ''', (status.value, error_message, item_id))
            else:
                cursor.execute('''
                    UPDATE sync_queue 
                    SET status = ?, error_message = ?
                    WHERE id = ?
                ''', (status.value, error_message, item_id))
        
        conn.commit()
        conn.close()
    
    def _trigger_sync(self):
        """Trigger background sync if not already running"""
        if not self.is_syncing and self.network_monitor.is_online():
            with self.sync_lock:
                if not self.is_syncing:
                    self.is_syncing = True
                    threading.Thread(target=self._sync_pending_items, daemon=True).start()
    
    def _background_sync_worker(self):
        """Background worker that periodically checks for sync opportunities"""
        while True:
            try:
                if self.network_monitor.is_online() and not self.is_syncing:
                    self._trigger_sync()
                
                # Sleep for 30 seconds before next check
                time.sleep(30)
                
            except Exception as e:
                logger.error(f"Background sync worker error: {e}")
                time.sleep(60)  # Wait longer on error
    
    def _sync_pending_items(self):
        """Sync all pending items"""
        try:
            pending_items = self.get_pending_items()
            
            if not pending_items:
                return
            
            logger.info(f"Starting sync of {len(pending_items)} items")
            
            for item in pending_items:
                try:
                    # Update status to syncing
                    self.update_item_status(item.id, SyncStatus.SYNCING)
                    
                    # Process the item based on action
                    success = self._process_sync_item(item)
                    
                    if success:
                        self.update_item_status(item.id, SyncStatus.COMPLETED)
                        logger.info(f"Successfully synced item: {item.action}")
                    else:
                        if item.retry_count < item.max_retries:
                            self.update_item_status(item.id, SyncStatus.RETRY, 
                                                  f"Sync failed, will retry")
                        else:
                            self.update_item_status(item.id, SyncStatus.FAILED, 
                                                  f"Max retries exceeded")
                
                except Exception as e:
                    logger.error(f"Error syncing item {item.id}: {e}")
                    self.update_item_status(item.id, SyncStatus.FAILED, str(e))
                
                # Small delay between items to avoid overwhelming the server
                time.sleep(0.5)
        
        finally:
            self.is_syncing = False
    
    def _process_sync_item(self, item: SyncItem) -> bool:
        """
        Process a sync item based on its action type
        
        Args:
            item: The sync item to process
            
        Returns:
            True if successful, False otherwise
        """
        try:
            if item.action == "create_appointment":
                return self._sync_appointment(item)
            elif item.action == "update_medical_record":
                return self._sync_medical_record(item)
            elif item.action == "create_prescription":
                return self._sync_prescription(item)
            elif item.action == "update_vitals":
                return self._sync_vitals(item)
            elif item.action == "create_chat_message":
                return self._sync_chat_message(item)
            elif item.action == "upload_medical_image":
                return self._sync_medical_image(item)
            else:
                logger.warning(f"Unknown sync action: {item.action}")
                return False
                
        except Exception as e:
            logger.error(f"Error processing sync item {item.id}: {e}")
            return False
    
    def _sync_appointment(self, item: SyncItem) -> bool:
        """Sync appointment data"""
        # Simulate API call to backend
        # In real implementation, this would call your backend API
        try:
            # Mock API call
            time.sleep(0.1)  # Simulate network delay
            return True
        except Exception as e:
            logger.error(f"Appointment sync failed: {e}")
            return False
    
    def _sync_medical_record(self, item: SyncItem) -> bool:
        """Sync medical record data"""
        try:
            # Mock API call
            time.sleep(0.1)
            return True
        except Exception as e:
            logger.error(f"Medical record sync failed: {e}")
            return False
    
    def _sync_prescription(self, item: SyncItem) -> bool:
        """Sync prescription data"""
        try:
            # Mock API call
            time.sleep(0.1)
            return True
        except Exception as e:
            logger.error(f"Prescription sync failed: {e}")
            return False
    
    def _sync_vitals(self, item: SyncItem) -> bool:
        """Sync vitals data"""
        try:
            # Mock API call
            time.sleep(0.1)
            return True
        except Exception as e:
            logger.error(f"Vitals sync failed: {e}")
            return False
    
    def _sync_chat_message(self, item: SyncItem) -> bool:
        """Sync chat message data"""
        try:
            # Mock API call
            time.sleep(0.1)
            return True
        except Exception as e:
            logger.error(f"Chat message sync failed: {e}")
            return False
    
    def _sync_medical_image(self, item: SyncItem) -> bool:
        """Sync medical image data"""
        try:
            # Mock API call
            time.sleep(0.1)
            return True
        except Exception as e:
            logger.error(f"Medical image sync failed: {e}")
            return False
    
    def get_sync_stats(self) -> Dict[str, Any]:
        """Get synchronization statistics"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Get counts by status
        if self.use_mysql:
            cursor.execute('SELECT status, COUNT(*) FROM sync_queue GROUP BY status')
        else:
            cursor.execute('SELECT status, COUNT(*) FROM sync_queue GROUP BY status')
        
        status_counts = dict(cursor.fetchall())
        
        # Get queue size
        total_items = sum(status_counts.values())
        
        # Get oldest pending item
        if self.use_mysql:
            cursor.execute('''
                SELECT timestamp 
                FROM sync_queue 
                WHERE status IN (%s, %s)
                ORDER BY timestamp ASC 
                LIMIT 1
            ''', (SyncStatus.PENDING.value, SyncStatus.RETRY.value))
        else:
            cursor.execute('''
                SELECT timestamp 
                FROM sync_queue 
                WHERE status IN (?, ?)
                ORDER BY timestamp ASC 
                LIMIT 1
            ''', (SyncStatus.PENDING.value, SyncStatus.RETRY.value))
        
        oldest_item = cursor.fetchone()
        oldest_timestamp = oldest_item[0] if oldest_item else None
        
        conn.close()
        
        return {
            "total_items": total_items,
            "status_counts": status_counts,
            "oldest_pending_item": oldest_timestamp,
            "is_online": self.network_monitor.is_online(),
            "network_quality": self.network_monitor.get_network_quality(),
            "is_syncing": self.is_syncing,
            "database_type": "mysql" if self.use_mysql else "sqlite"
        }
    
    def force_sync(self):
        """Force immediate sync of all pending items"""
        if not self.is_syncing:
            self._trigger_sync()
    
    def clear_failed_items(self):
        """Clear all failed items from queue"""
        conn = self._get_connection()
        cursor = conn.cursor()
        
        if self.use_mysql:
            cursor.execute('DELETE FROM sync_queue WHERE status = %s', 
                          (SyncStatus.FAILED.value,))
        else:
            cursor.execute('DELETE FROM sync_queue WHERE status = ?', 
                          (SyncStatus.FAILED.value,))
        
        deleted_count = cursor.rowcount
        conn.commit()
        conn.close()
        
        logger.info(f"Cleared {deleted_count} failed items")
        return deleted_count

class NetworkMonitor:
    """Monitor network connectivity and quality"""
    
    def __init__(self):
        self.last_check = 0
        self.is_online_cache = True
        self.network_quality_cache = "good"
        self.cache_duration = 30  # seconds
    
    def is_online(self) -> bool:
        """Check if network is online"""
        current_time = time.time()
        
        if current_time - self.last_check > self.cache_duration:
            self._update_network_status()
            self.last_check = current_time
        
        return self.is_online_cache
    
    def get_network_quality(self) -> str:
        """Get network quality assessment"""
        current_time = time.time()
        
        if current_time - self.last_check > self.cache_duration:
            self._update_network_status()
            self.last_check = current_time
        
        return self.network_quality_cache
    
    def _update_network_status(self):
        """Update network status and quality"""
        try:
            # In a real implementation, this would check actual network connectivity
            # For now, we'll simulate network checks
            
            # Simulate network check
            import socket
            socket.create_connection(("8.8.8.8", 53), timeout=3)
            
            self.is_online_cache = True
            self.network_quality_cache = "good"
            
        except OSError:
            self.is_online_cache = False
            self.network_quality_cache = "offline"
        except Exception as e:
            logger.warning(f"Network check error: {e}")
            self.is_online_cache = False
            self.network_quality_cache = "unknown"

# Global instance for easy access
offline_sync_queue = OfflineSyncQueue()

# Convenience functions for easy integration
def queue_appointment(appointment_data: Dict[str, Any], user_id: str, 
                     device_id: Optional[str] = None) -> str:
    """Queue appointment creation for offline sync"""
    return offline_sync_queue.add_to_queue(
        action="create_appointment",
        data=appointment_data,
        priority=QueuePriority.HIGH,
        user_id=user_id,
        device_id=device_id
    )

def queue_medical_record(record_data: Dict[str, Any], user_id: str,
                        device_id: Optional[str] = None) -> str:
    """Queue medical record update for offline sync"""
    return offline_sync_queue.add_to_queue(
        action="update_medical_record",
        data=record_data,
        priority=QueuePriority.CRITICAL,
        user_id=user_id,
        device_id=device_id
    )

def queue_prescription(prescription_data: Dict[str, Any], user_id: str,
                      device_id: Optional[str] = None) -> str:
    """Queue prescription creation for offline sync"""
    return offline_sync_queue.add_to_queue(
        action="create_prescription",
        data=prescription_data,
        priority=QueuePriority.HIGH,
        user_id=user_id,
        device_id=device_id
    )

def get_sync_status() -> Dict[str, Any]:
    """Get current sync status and statistics"""
    return offline_sync_queue.get_sync_stats()

def force_sync_now():
    """Force immediate synchronization"""
    offline_sync_queue.force_sync()

if __name__ == "__main__":
    # Example usage
    print("Offline Sync Queue Service")
    print("=" * 40)
    
    # Add some test items
    test_appointment = {
        "patient_id": "12345",
        "doctor_id": "67890",
        "appointment_date": "2024-01-15T10:00:00",
        "reason": "Follow-up consultation"
    }
    
    item_id = queue_appointment(test_appointment, "user123", "device456")
    print(f"Queued appointment with ID: {item_id}")
    
    # Get sync stats
    stats = get_sync_status()
    print(f"Sync stats: {stats}")
    
    # Force sync
    force_sync_now()
    print("Forced sync triggered") 
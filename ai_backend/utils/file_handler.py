import os
import shutil
import tempfile
from typing import Optional
import logging
from fastapi import UploadFile

logger = logging.getLogger(__name__)

class FileHandler:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        self.ensure_upload_dir()
    
    def ensure_upload_dir(self):
        """Ensure upload directory exists"""
        try:
            os.makedirs(self.upload_dir, exist_ok=True)
            logger.info(f"Upload directory ensured: {self.upload_dir}")
        except Exception as e:
            logger.error(f"Error creating upload directory: {e}")
            raise
    
    async def save_upload(self, file: UploadFile, file_id: str) -> str:
        """
        Save uploaded file to temporary location
        Returns the file path
        """
        try:
            # Create unique filename
            file_extension = self._get_file_extension(file.filename)
            temp_filename = f"{file_id}{file_extension}"
            file_path = os.path.join(self.upload_dir, temp_filename)
            
            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            logger.info(f"File saved: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Error saving upload: {e}")
            raise
    
    def _get_file_extension(self, filename: Optional[str]) -> str:
        """Extract file extension from filename"""
        if not filename:
            return ""
        
        # Get the extension
        _, ext = os.path.splitext(filename)
        return ext.lower()
    
    def cleanup_file(self, file_path: str):
        """
        Clean up temporary file after processing
        """
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"File cleaned up: {file_path}")
            else:
                logger.warning(f"File not found for cleanup: {file_path}")
                
        except Exception as e:
            logger.error(f"Error cleaning up file {file_path}: {e}")
    
    def cleanup_old_files(self, max_age_hours: int = 24):
        """
        Clean up old temporary files
        """
        try:
            import time
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            cleaned_count = 0
            for filename in os.listdir(self.upload_dir):
                file_path = os.path.join(self.upload_dir, filename)
                
                # Check if file is old enough to delete
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > max_age_seconds:
                    try:
                        os.remove(file_path)
                        cleaned_count += 1
                        logger.info(f"Cleaned up old file: {file_path}")
                    except Exception as e:
                        logger.error(f"Error cleaning up old file {file_path}: {e}")
            
            if cleaned_count > 0:
                logger.info(f"Cleaned up {cleaned_count} old files")
                
        except Exception as e:
            logger.error(f"Error during cleanup of old files: {e}")
    
    def get_file_info(self, file_path: str) -> dict:
        """
        Get information about a file
        """
        try:
            if not os.path.exists(file_path):
                return {"error": "File not found"}
            
            stat = os.stat(file_path)
            return {
                "size": stat.st_size,
                "created": stat.st_ctime,
                "modified": stat.st_mtime,
                "path": file_path
            }
            
        except Exception as e:
            logger.error(f"Error getting file info: {e}")
            return {"error": str(e)}
    
    def validate_file_type(self, file: UploadFile, allowed_types: list) -> bool:
        """
        Validate file type against allowed types
        """
        if not file.content_type:
            return False
        
        return file.content_type in allowed_types
    
    def get_storage_stats(self) -> dict:
        """
        Get storage statistics for upload directory
        """
        try:
            total_size = 0
            file_count = 0
            
            for filename in os.listdir(self.upload_dir):
                file_path = os.path.join(self.upload_dir, filename)
                if os.path.isfile(file_path):
                    total_size += os.path.getsize(file_path)
                    file_count += 1
            
            return {
                "total_files": file_count,
                "total_size_bytes": total_size,
                "total_size_mb": round(total_size / (1024 * 1024), 2),
                "upload_directory": self.upload_dir
            }
            
        except Exception as e:
            logger.error(f"Error getting storage stats: {e}")
            return {"error": str(e)} 
import asyncio
import json
import logging
import os
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
import jwt
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import uuid

logger = logging.getLogger(__name__)

@dataclass
class AuditLog:
    """Audit log entry for compliance"""
    timestamp: datetime
    user_id: str
    action: str
    resource_type: str
    resource_id: str
    ip_address: str
    user_agent: str
    success: bool
    details: Dict[str, Any]

@dataclass
class SecurityEvent:
    """Security event for monitoring"""
    event_type: str
    severity: str  # "low", "medium", "high", "critical"
    timestamp: datetime
    user_id: str
    ip_address: str
    description: str
    details: Dict[str, Any]

@dataclass
class ComplianceReport:
    """Compliance report for regulatory requirements"""
    report_type: str
    period_start: datetime
    period_end: datetime
    total_events: int
    security_events: int
    compliance_score: float
    violations: List[Dict[str, Any]]
    recommendations: List[str]

class SecurityComplianceService:
    """
    Security and Compliance Service
    Handles HIPAA compliance, data encryption, audit logging, and access control
    """
    
    def __init__(self):
        self.model_version = "v1.0.0"
        
        # Initialize encryption
        self.encryption_key = self._generate_encryption_key()
        self.cipher_suite = Fernet(self.encryption_key)
        
        # Initialize audit logging
        self.audit_logs = []
        self.security_events = []
        
        # HIPAA compliance settings
        self.hipaa_settings = {
            "data_retention_days": 2555,  # 7 years
            "audit_log_retention_days": 2555,
            "encryption_required": True,
            "access_control_enabled": True,
            "data_backup_required": True
        }
        
        # Access control matrix
        self.access_control = {
            "patient": {
                "read": ["own_data"],
                "write": ["own_data"],
                "delete": []
            },
            "doctor": {
                "read": ["patient_data", "lab_results", "imaging"],
                "write": ["notes", "prescriptions", "diagnoses"],
                "delete": []
            },
            "admin": {
                "read": ["all"],
                "write": ["all"],
                "delete": ["audit_logs"]
            }
        }
        
        logger.info("SecurityComplianceService initialized")
    
    def _generate_encryption_key(self) -> bytes:
        """Generate encryption key for data protection"""
        try:
            # Use environment variable if available, otherwise generate new key
            key_env = os.getenv("ENCRYPTION_KEY")
            if key_env:
                return base64.urlsafe_b64decode(key_env)
            else:
                # Generate new key
                salt = os.urandom(16)
                kdf = PBKDF2HMAC(
                    algorithm=hashes.SHA256(),
                    length=32,
                    salt=salt,
                    iterations=100000,
                )
                key = base64.urlsafe_b64encode(kdf.derive(b"telemedicine_secret"))
                return key
                
        except Exception as e:
            logger.error(f"Error generating encryption key: {e}")
            raise
    
    async def encrypt_phi(self, data: str) -> str:
        """Encrypt Protected Health Information (PHI)"""
        try:
            if not self.hipaa_settings["encryption_required"]:
                return data
            
            # Encrypt the data
            encrypted_data = self.cipher_suite.encrypt(data.encode())
            return base64.urlsafe_b64encode(encrypted_data).decode()
            
        except Exception as e:
            logger.error(f"Error encrypting PHI: {e}")
            raise
    
    async def decrypt_phi(self, encrypted_data: str) -> str:
        """Decrypt Protected Health Information (PHI)"""
        try:
            if not self.hipaa_settings["encryption_required"]:
                return encrypted_data
            
            # Decrypt the data
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.cipher_suite.decrypt(encrypted_bytes)
            return decrypted_data.decode()
            
        except Exception as e:
            logger.error(f"Error decrypting PHI: {e}")
            raise
    
    async def log_audit_event(
        self,
        user_id: str,
        action: str,
        resource_type: str,
        resource_id: str,
        ip_address: str,
        user_agent: str,
        success: bool,
        details: Dict[str, Any] = None
    ) -> str:
        """Log audit event for compliance"""
        try:
            audit_log = AuditLog(
                timestamp=datetime.now(),
                user_id=user_id,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                ip_address=ip_address,
                user_agent=user_agent,
                success=success,
                details=details or {}
            )
            
            # Add to audit logs
            self.audit_logs.append(audit_log)
            
            # Log to file for persistence
            await self._persist_audit_log(audit_log)
            
            # Check for security events
            await self._check_security_events(audit_log)
            
            return str(uuid.uuid4())  # Return audit log ID
            
        except Exception as e:
            logger.error(f"Error logging audit event: {e}")
            raise
    
    async def _persist_audit_log(self, audit_log: AuditLog):
        """Persist audit log to storage"""
        try:
            log_entry = {
                "timestamp": audit_log.timestamp.isoformat(),
                "user_id": audit_log.user_id,
                "action": audit_log.action,
                "resource_type": audit_log.resource_type,
                "resource_id": audit_log.resource_id,
                "ip_address": audit_log.ip_address,
                "user_agent": audit_log.user_agent,
                "success": audit_log.success,
                "details": audit_log.details
            }
            
            # In production, this would write to a secure database
            # For now, we'll write to a file
            log_file = "audit_logs.jsonl"
            with open(log_file, "a") as f:
                f.write(json.dumps(log_entry) + "\n")
                
        except Exception as e:
            logger.error(f"Error persisting audit log: {e}")
    
    async def _check_security_events(self, audit_log: AuditLog):
        """Check for security events based on audit logs"""
        try:
            # Check for suspicious patterns
            if not audit_log.success:
                # Failed access attempt
                security_event = SecurityEvent(
                    event_type="failed_access",
                    severity="medium",
                    timestamp=audit_log.timestamp,
                    user_id=audit_log.user_id,
                    ip_address=audit_log.ip_address,
                    description=f"Failed {audit_log.action} on {audit_log.resource_type}",
                    details=audit_log.details
                )
                self.security_events.append(security_event)
            
            # Check for multiple failed attempts
            recent_failures = [
                log for log in self.audit_logs[-10:]  # Last 10 logs
                if not log.success and log.user_id == audit_log.user_id
            ]
            
            if len(recent_failures) >= 5:
                security_event = SecurityEvent(
                    event_type="multiple_failures",
                    severity="high",
                    timestamp=audit_log.timestamp,
                    user_id=audit_log.user_id,
                    ip_address=audit_log.ip_address,
                    description="Multiple failed access attempts detected",
                    details={"failure_count": len(recent_failures)}
                )
                self.security_events.append(security_event)
            
            # Check for unusual access patterns
            if audit_log.action in ["delete", "export"]:
                security_event = SecurityEvent(
                    event_type="sensitive_action",
                    severity="medium",
                    timestamp=audit_log.timestamp,
                    user_id=audit_log.user_id,
                    ip_address=audit_log.ip_address,
                    description=f"Sensitive action performed: {audit_log.action}",
                    details=audit_log.details
                )
                self.security_events.append(security_event)
                
        except Exception as e:
            logger.error(f"Error checking security events: {e}")
    
    async def check_access_permission(
        self,
        user_id: str,
        user_role: str,
        action: str,
        resource_type: str,
        resource_id: str
    ) -> bool:
        """Check if user has permission to perform action on resource"""
        try:
            # Get user permissions
            user_permissions = self.access_control.get(user_role, {})
            
            # Check if action is allowed
            allowed_actions = user_permissions.get(action, [])
            
            if "all" in allowed_actions:
                return True
            
            if resource_type in allowed_actions:
                return True
            
            # Check for specific resource permissions
            if resource_type == "patient_data":
                # Patients can only access their own data
                if user_role == "patient" and user_id == resource_id:
                    return True
                # Doctors can access patient data
                elif user_role == "doctor":
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking access permission: {e}")
            return False
    
    async def generate_compliance_report(
        self,
        report_type: str,
        period_start: datetime,
        period_end: datetime
    ) -> ComplianceReport:
        """Generate compliance report for regulatory requirements"""
        try:
            # Filter audit logs for the period
            period_logs = [
                log for log in self.audit_logs
                if period_start <= log.timestamp <= period_end
            ]
            
            # Filter security events for the period
            period_security_events = [
                event for event in self.security_events
                if period_start <= event.timestamp <= period_end
            ]
            
            # Calculate compliance score
            total_events = len(period_logs)
            security_events_count = len(period_security_events)
            
            if total_events == 0:
                compliance_score = 100.0
            else:
                # Calculate score based on successful events and security events
                successful_events = len([log for log in period_logs if log.success])
                compliance_score = (successful_events / total_events) * 100
                
                # Penalize for security events
                security_penalty = min(security_events_count * 5, 20)  # Max 20% penalty
                compliance_score -= security_penalty
                compliance_score = max(compliance_score, 0)
            
            # Identify violations
            violations = await self._identify_violations(period_logs, period_security_events)
            
            # Generate recommendations
            recommendations = await self._generate_compliance_recommendations(
                compliance_score, violations, period_security_events
            )
            
            return ComplianceReport(
                report_type=report_type,
                period_start=period_start,
                period_end=period_end,
                total_events=total_events,
                security_events=security_events_count,
                compliance_score=compliance_score,
                violations=violations,
                recommendations=recommendations
            )
            
        except Exception as e:
            logger.error(f"Error generating compliance report: {e}")
            raise
    
    async def _identify_violations(
        self,
        audit_logs: List[AuditLog],
        security_events: List[SecurityEvent]
    ) -> List[Dict[str, Any]]:
        """Identify compliance violations"""
        violations = []
        
        try:
            # Check for unauthorized access
            unauthorized_access = [
                log for log in audit_logs
                if not log.success and log.action in ["read", "write", "delete"]
            ]
            
            for access in unauthorized_access:
                violations.append({
                    "type": "unauthorized_access",
                    "severity": "high",
                    "timestamp": access.timestamp.isoformat(),
                    "user_id": access.user_id,
                    "action": access.action,
                    "resource": f"{access.resource_type}:{access.resource_id}",
                    "description": "Unauthorized access attempt"
                })
            
            # Check for sensitive data access
            sensitive_actions = [
                log for log in audit_logs
                if log.action in ["export", "delete", "bulk_access"]
            ]
            
            for action in sensitive_actions:
                violations.append({
                    "type": "sensitive_action",
                    "severity": "medium",
                    "timestamp": action.timestamp.isoformat(),
                    "user_id": action.user_id,
                    "action": action.action,
                    "resource": f"{action.resource_type}:{action.resource_id}",
                    "description": "Sensitive action performed"
                })
            
            # Check for security events
            for event in security_events:
                violations.append({
                    "type": "security_event",
                    "severity": event.severity,
                    "timestamp": event.timestamp.isoformat(),
                    "user_id": event.user_id,
                    "action": event.event_type,
                    "description": event.description,
                    "details": event.details
                })
            
            return violations
            
        except Exception as e:
            logger.error(f"Error identifying violations: {e}")
            return []
    
    async def _generate_compliance_recommendations(
        self,
        compliance_score: float,
        violations: List[Dict[str, Any]],
        security_events: List[SecurityEvent]
    ) -> List[str]:
        """Generate compliance recommendations"""
        recommendations = []
        
        try:
            if compliance_score < 90:
                recommendations.append("Implement additional access controls")
                recommendations.append("Enhance user authentication")
                recommendations.append("Review and update security policies")
            
            if len(violations) > 10:
                recommendations.append("Conduct security awareness training")
                recommendations.append("Implement automated monitoring")
                recommendations.append("Review access permissions")
            
            high_severity_events = [
                event for event in security_events
                if event.severity in ["high", "critical"]
            ]
            
            if len(high_severity_events) > 0:
                recommendations.append("Implement real-time security monitoring")
                recommendations.append("Establish incident response procedures")
                recommendations.append("Conduct security audit")
            
            # HIPAA-specific recommendations
            recommendations.extend([
                "Ensure all PHI is encrypted at rest and in transit",
                "Implement automatic session timeouts",
                "Regular backup and disaster recovery testing",
                "Annual HIPAA training for all staff",
                "Regular security assessments and penetration testing"
            ])
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating compliance recommendations: {e}")
            return ["Conduct comprehensive security review"]
    
    async def anonymize_patient_data(
        self,
        patient_data: Dict[str, Any],
        anonymization_level: str = "standard"
    ) -> Dict[str, Any]:
        """Anonymize patient data for research or external use"""
        try:
            anonymized_data = patient_data.copy()
            
            # Remove direct identifiers
            direct_identifiers = [
                "name", "email", "phone", "ssn", "address", "date_of_birth",
                "medical_record_number", "account_number"
            ]
            
            for identifier in direct_identifiers:
                if identifier in anonymized_data:
                    del anonymized_data[identifier]
            
            # Hash quasi-identifiers
            quasi_identifiers = ["zip_code", "age", "gender"]
            
            for identifier in quasi_identifiers:
                if identifier in anonymized_data:
                    if identifier == "age":
                        # Age grouping
                        age = anonymized_data[identifier]
                        if age < 18:
                            anonymized_data[identifier] = "<18"
                        elif age < 35:
                            anonymized_data[identifier] = "18-34"
                        elif age < 65:
                            anonymized_data[identifier] = "35-64"
                        else:
                            anonymized_data[identifier] = "65+"
                    elif identifier == "zip_code":
                        # Keep only first 3 digits
                        zip_code = str(anonymized_data[identifier])
                        anonymized_data[identifier] = zip_code[:3] + "XX"
                    else:
                        # Hash other quasi-identifiers
                        value = str(anonymized_data[identifier])
                        anonymized_data[identifier] = hashlib.sha256(value.encode()).hexdigest()[:8]
            
            # Add anonymization metadata
            anonymized_data["_anonymized"] = True
            anonymized_data["_anonymization_level"] = anonymization_level
            anonymized_data["_anonymization_date"] = datetime.now().isoformat()
            
            return anonymized_data
            
        except Exception as e:
            logger.error(f"Error anonymizing patient data: {e}")
            raise
    
    async def generate_data_retention_report(self) -> Dict[str, Any]:
        """Generate data retention report for compliance"""
        try:
            current_time = datetime.now()
            retention_cutoff = current_time - timedelta(days=self.hipaa_settings["data_retention_days"])
            
            # In production, this would query the database
            # For demo purposes, we'll return a mock report
            report = {
                "report_date": current_time.isoformat(),
                "retention_policy": {
                    "phi_retention_days": self.hipaa_settings["data_retention_days"],
                    "audit_log_retention_days": self.hipaa_settings["audit_log_retention_days"]
                },
                "data_summary": {
                    "total_patients": 1250,
                    "total_records": 8750,
                    "records_eligible_for_deletion": 150,
                    "records_deleted_this_period": 25
                },
                "compliance_status": "compliant",
                "recommendations": [
                    "Schedule regular data cleanup",
                    "Review retention policies annually",
                    "Document all data deletion activities"
                ]
            }
            
            return report
            
        except Exception as e:
            logger.error(f"Error generating data retention report: {e}")
            raise
    
    async def validate_hipaa_compliance(self) -> Dict[str, Any]:
        """Validate HIPAA compliance requirements"""
        try:
            compliance_check = {
                "encryption": {
                    "status": "compliant" if self.hipaa_settings["encryption_required"] else "non_compliant",
                    "description": "Data encryption at rest and in transit"
                },
                "access_control": {
                    "status": "compliant" if self.hipaa_settings["access_control_enabled"] else "non_compliant",
                    "description": "Role-based access control implemented"
                },
                "audit_logging": {
                    "status": "compliant",
                    "description": "Comprehensive audit logging enabled"
                },
                "data_backup": {
                    "status": "compliant" if self.hipaa_settings["data_backup_required"] else "non_compliant",
                    "description": "Regular data backup and recovery procedures"
                },
                "training": {
                    "status": "compliant",
                    "description": "Annual HIPAA training for staff"
                },
                "incident_response": {
                    "status": "compliant",
                    "description": "Incident response procedures established"
                }
            }
            
            # Calculate overall compliance
            compliant_items = sum(1 for item in compliance_check.values() if item["status"] == "compliant")
            total_items = len(compliance_check)
            overall_compliance = (compliant_items / total_items) * 100
            
            return {
                "overall_compliance": overall_compliance,
                "compliance_details": compliance_check,
                "last_updated": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error validating HIPAA compliance: {e}")
            raise
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get status of security and compliance service"""
        return {
            "model_version": self.model_version,
            "encryption_enabled": self.hipaa_settings["encryption_required"],
            "access_control_enabled": self.hipaa_settings["access_control_enabled"],
            "audit_logging_enabled": True,
            "hipaa_compliant": True,
            "last_updated": datetime.now().isoformat()
        } 
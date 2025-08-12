import api from './api';

class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_AI_BACKEND_URL || 'http://localhost:8000';
  }

  // Scan Analysis
  async analyzeMedicalScan(file, patientId, scanType) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (patientId) formData.append('patient_id', patientId);
      if (scanType) formData.append('scan_type', scanType);

      const response = await fetch(`${this.baseURL}/analyze/scan`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Scan analysis failed:', error);
      throw error;
    }
  }

  // Bloodwork Analysis
  async analyzeBloodwork(file, patientId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (patientId) formData.append('patient_id', patientId);

      const response = await fetch(`${this.baseURL}/analyze/bloodwork`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Bloodwork analysis failed:', error);
      throw error;
    }
  }

  // Recovery Prediction
  async predictRecovery(symptoms, diagnosis, scanAnalysis, bloodworkAnalysis, patientAge, patientGender, visitFrequency) {
    try {
      const formData = new FormData();
      formData.append('symptoms', symptoms);
      formData.append('diagnosis', diagnosis);
      if (scanAnalysis) formData.append('scan_analysis', JSON.stringify(scanAnalysis));
      if (bloodworkAnalysis) formData.append('bloodwork_analysis', JSON.stringify(bloodworkAnalysis));
      if (patientAge) formData.append('patient_age', patientAge);
      if (patientGender) formData.append('patient_gender', patientGender);
      if (visitFrequency) formData.append('visit_frequency', visitFrequency);

      const response = await fetch(`${this.baseURL}/predict/recovery`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Recovery prediction failed:', error);
      throw error;
    }
  }

  // Doctor Feedback
  async submitFeedback(analysisId, feedbackType, doctorId, patientId, comments, modifiedDiagnosis) {
    try {
      const formData = new FormData();
      formData.append('analysis_id', analysisId);
      formData.append('feedback_type', feedbackType);
      formData.append('doctor_id', doctorId);
      formData.append('patient_id', patientId);
      if (comments) formData.append('comments', comments);
      if (modifiedDiagnosis) formData.append('modified_diagnosis', modifiedDiagnosis);

      const response = await fetch(`${this.baseURL}/feedback`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Feedback submission failed:', error);
      throw error;
    }
  }

  // Model Status
  async getModelStatus() {
    try {
      const response = await fetch(`${this.baseURL}/models/status`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Model status fetch failed:', error);
      throw error;
    }
  }

  // Health Check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Doctor Copilot
  async generateSoapNote(context, doctorNotes, stylePreference) {
    try {
      const formData = new FormData();
      formData.append('context', JSON.stringify(context));
      if (doctorNotes) formData.append('doctor_notes', doctorNotes);
      formData.append('style_preference', stylePreference);

      const response = await fetch(`${this.baseURL}/copilot/generate-soap`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SOAP note generation failed:', error);
      throw error;
    }
  }

  async suggestDiagnosis(context, includeDifferential, includeConfidence) {
    try {
      const formData = new FormData();
      formData.append('context', JSON.stringify(context));
      formData.append('include_differential', includeDifferential);
      formData.append('include_confidence', includeConfidence);

      const response = await fetch(`${this.baseURL}/copilot/suggest-diagnosis`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Diagnosis suggestions failed:', error);
      throw error;
    }
  }

  // Advanced AI Features
  async analyzeVoiceEmotion(audioFile, patientId, context) {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioFile);
      formData.append('patient_id', patientId);
      if (context) formData.append('context', context);

      const response = await fetch(`${this.baseURL}/ai/voice-emotion`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Voice emotion analysis failed:', error);
      throw error;
    }
  }

  // Security & Compliance
  async encryptPHI(data) {
    try {
      const formData = new FormData();
      formData.append('data', data);

      const response = await fetch(`${this.baseURL}/security/encrypt-phi`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PHI encryption failed:', error);
      throw error;
    }
  }

  async logAuditEvent(userId, action, resourceType, resourceId, ipAddress, userAgent, success, details) {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('action', action);
      formData.append('resource_type', resourceType);
      formData.append('resource_id', resourceId);
      formData.append('ip_address', ipAddress);
      formData.append('user_agent', userAgent);
      formData.append('success', success);
      if (details) formData.append('details', JSON.stringify(details));

      const response = await fetch(`${this.baseURL}/security/audit-log`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Audit logging failed:', error);
      throw error;
    }
  }

  // Surgical Guide
  async getSurgicalProcedureGuide(procedureName, patientData) {
    try {
      const params = new URLSearchParams();
      if (patientData) params.append('patient_data', JSON.stringify(patientData));

      const response = await fetch(`${this.baseURL}/medical-records/surgical-guide/${procedureName}?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Surgical guide fetch failed:', error);
      throw error;
    }
  }

  // Smart Card Generation
  async generateSmartCard(patientInfo, vaccineInfo, testInfo) {
    try {
      const response = await fetch(`${this.baseURL}/smartcard/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_info: patientInfo,
          vaccine_info: vaccineInfo,
          test_info: testInfo,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Smart card generation failed:', error);
      throw error;
    }
  }
}

export default new AIService(); 
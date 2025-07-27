import api from './api';

const AI_BASE_URL = process.env.REACT_APP_AI_BACKEND_URL || 'http://localhost:8000';

class AIService {
  constructor() {
    this.baseURL = AI_BASE_URL;
  }

  // Health check for AI backend
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      console.error('AI backend health check failed:', error);
      return false;
    }
  }

  // Get model status
  async getModelStatus() {
    try {
      const response = await fetch(`${this.baseURL}/models/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get model status:', error);
      throw error;
    }
  }

  // Analyze medical scan
  async analyzeScan(file, patientId = null, scanType = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (patientId) {
        formData.append('patient_id', patientId);
      }
      
      if (scanType) {
        formData.append('scan_type', scanType);
      }

      const response = await fetch(`${this.baseURL}/analyze/scan`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Scan analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Scan analysis failed:', error);
      throw error;
    }
  }

  // Analyze bloodwork
  async analyzeBloodwork(file, patientId = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (patientId) {
        formData.append('patient_id', patientId);
      }

      const response = await fetch(`${this.baseURL}/analyze/bloodwork`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Bloodwork analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Bloodwork analysis failed:', error);
      throw error;
    }
  }

  // Predict recovery
  async predictRecovery({
    symptoms,
    diagnosis,
    scanAnalysis = null,
    bloodworkAnalysis = null,
    patientAge = null,
    patientGender = null,
    visitFrequency = 1
  }) {
    try {
      const formData = new FormData();
      formData.append('symptoms', symptoms);
      formData.append('diagnosis', diagnosis);
      formData.append('visit_frequency', visitFrequency.toString());
      
      if (scanAnalysis) {
        formData.append('scan_analysis', JSON.stringify(scanAnalysis));
      }
      
      if (bloodworkAnalysis) {
        formData.append('bloodwork_analysis', JSON.stringify(bloodworkAnalysis));
      }
      
      if (patientAge) {
        formData.append('patient_age', patientAge.toString());
      }
      
      if (patientGender) {
        formData.append('patient_gender', patientGender);
      }

      const response = await fetch(`${this.baseURL}/predict/recovery`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Recovery prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Recovery prediction failed:', error);
      throw error;
    }
  }

  // Submit feedback
  async submitFeedback({
    analysisId,
    feedbackType,
    doctorId,
    patientId,
    comments = null,
    modifiedDiagnosis = null
  }) {
    try {
      const formData = new FormData();
      formData.append('analysis_id', analysisId);
      formData.append('feedback_type', feedbackType);
      formData.append('doctor_id', doctorId);
      formData.append('patient_id', patientId);
      
      if (comments) {
        formData.append('comments', comments);
      }
      
      if (modifiedDiagnosis) {
        formData.append('modified_diagnosis', modifiedDiagnosis);
      }

      const response = await fetch(`${this.baseURL}/feedback`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Feedback submission failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Feedback submission failed:', error);
      throw error;
    }
  }

  // Get feedback statistics
  async getFeedbackStats(doctorId = null) {
    try {
      const url = doctorId 
        ? `${this.baseURL}/feedback/stats?doctor_id=${doctorId}`
        : `${this.baseURL}/feedback/stats`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get feedback stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get feedback stats:', error);
      throw error;
    }
  }

  // Get feedback history
  async getFeedbackHistory({ doctorId = null, patientId = null, limit = 50 } = {}) {
    try {
      const params = new URLSearchParams();
      if (doctorId) params.append('doctor_id', doctorId);
      if (patientId) params.append('patient_id', patientId);
      if (limit) params.append('limit', limit.toString());
      
      const url = `${this.baseURL}/feedback/history?${params.toString()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get feedback history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get feedback history:', error);
      throw error;
    }
  }

  // Process feedback batch
  async processFeedbackBatch() {
    try {
      const response = await fetch(`${this.baseURL}/feedback/process`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process feedback batch');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to process feedback batch:', error);
      throw error;
    }
  }

  // Get model improvement metrics
  async getModelImprovementMetrics() {
    try {
      const response = await fetch(`${this.baseURL}/feedback/metrics`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get model improvement metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get model improvement metrics:', error);
      throw error;
    }
  }

  // Utility method to handle file upload with progress
  async uploadFileWithProgress(file, uploadType, onProgress = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      const formData = new FormData();
      formData.append('file', file);

      const url = uploadType === 'scan' 
        ? `${this.baseURL}/analyze/scan`
        : `${this.baseURL}/analyze/bloodwork`;

      xhr.open('POST', url);
      xhr.send(formData);
    });
  }

  // Batch analysis of multiple files
  async analyzeMultipleFiles(files, patientId = null) {
    const results = {
      scans: [],
      bloodwork: [],
      errors: []
    };

    for (const file of files) {
      try {
        let result;
        
        if (file.type.startsWith('image/')) {
          result = await this.analyzeScan(file, patientId);
          results.scans.push(result);
        } else if (file.type === 'application/pdf' || file.type === 'text/csv') {
          result = await this.analyzeBloodwork(file, patientId);
          results.bloodwork.push(result);
        }
      } catch (error) {
        results.errors.push({
          filename: file.name,
          error: error.message
        });
      }
    }

    return results;
  }

  // Comprehensive analysis combining scan and bloodwork results
  async performComprehensiveAnalysis({
    scanFile = null,
    bloodworkFile = null,
    symptoms = '',
    diagnosis = '',
    patientAge = null,
    patientGender = null,
    patientId = null
  }) {
    try {
      const results = {
        scan_analysis: null,
        bloodwork_analysis: null,
        recovery_prediction: null,
        errors: []
      };

      // Analyze scan if provided
      if (scanFile) {
        try {
          const scanResult = await this.analyzeScan(scanFile, patientId);
          results.scan_analysis = scanResult.analysis;
        } catch (error) {
          results.errors.push(`Scan analysis failed: ${error.message}`);
        }
      }

      // Analyze bloodwork if provided
      if (bloodworkFile) {
        try {
          const bloodworkResult = await this.analyzeBloodwork(bloodworkFile, patientId);
          results.bloodwork_analysis = bloodworkResult.analysis;
        } catch (error) {
          results.errors.push(`Bloodwork analysis failed: ${error.message}`);
        }
      }

      // Predict recovery if we have symptoms and diagnosis
      if (symptoms && diagnosis) {
        try {
          const predictionResult = await this.predictRecovery({
            symptoms,
            diagnosis,
            scanAnalysis: results.scan_analysis,
            bloodworkAnalysis: results.bloodwork_analysis,
            patientAge,
            patientGender
          });
          results.recovery_prediction = predictionResult.prediction;
        } catch (error) {
          results.errors.push(`Recovery prediction failed: ${error.message}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Comprehensive analysis failed:', error);
      throw error;
    }
  }

  // AI Training Sandbox Methods
  async uploadDataset(formData) {
    try {
      const response = await fetch(`${this.baseURL}/ai-training/upload-dataset`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Dataset upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Dataset upload failed:', error);
      throw error;
    }
  }

  async startTraining(trainingData) {
    try {
      const response = await fetch(`${this.baseURL}/ai-training/start-training`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Training start failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Training start failed:', error);
      throw error;
    }
  }

  async getDatasets(clinicId) {
    try {
      const response = await fetch(`${this.baseURL}/ai-training/datasets/${clinicId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get datasets:', error);
      throw error;
    }
  }

  async getTrainings(clinicId) {
    try {
      const response = await fetch(`${this.baseURL}/ai-training/trainings/${clinicId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get trainings:', error);
      throw error;
    }
  }

  // Model Comparison Dashboard Methods
  async getAvailableModels() {
    try {
      const response = await fetch(`${this.baseURL}/model-comparison/available-models`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get available models:', error);
      throw error;
    }
  }

  async compareModels(comparisonData) {
    try {
      const response = await fetch(`${this.baseURL}/model-comparison/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comparisonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Model comparison failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Model comparison failed:', error);
      throw error;
    }
  }

  async addDoctorFeedback(feedbackData) {
    try {
      const response = await fetch(`${this.baseURL}/model-comparison/doctor-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Doctor feedback failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Doctor feedback failed:', error);
      throw error;
    }
  }

  async getComparisonHistory(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/model-comparison/history?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get comparison history:', error);
      throw error;
    }
  }

  // Patient Feedback Loop Methods
  async getAiOutputs(patientId) {
    try {
      const response = await fetch(`${this.baseURL}/patient-feedback/ai-outputs/${patientId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get AI outputs:', error);
      throw error;
    }
  }

  async submitPatientFeedback(feedbackData) {
    try {
      const response = await fetch(`${this.baseURL}/patient-feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Feedback submission failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Feedback submission failed:', error);
      throw error;
    }
  }

  async getPatientFeedbackHistory(patientId) {
    try {
      const response = await fetch(`${this.baseURL}/patient-feedback/history/${patientId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get feedback history:', error);
      throw error;
    }
  }

  async getTrustMetrics(patientId) {
    try {
      const response = await fetch(`${this.baseURL}/patient-feedback/trust-metrics/${patientId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get trust metrics:', error);
      throw error;
    }
  }
}

export default new AIService(); 
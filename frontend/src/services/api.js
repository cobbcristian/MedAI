import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://medai-production-3c09.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock API responses for medical records endpoints
const mockApiService = {
  get: async (url) => {
    // Mock surgical procedures endpoint
    if (url === '/medical-records/surgical-procedures') {
      return {
        success: true,
        procedures: [
          'Appendectomy',
          'Cholecystectomy',
          'Hernia Repair',
          'Cataract Surgery',
          'Knee Replacement',
          'Cardiac Bypass',
          'Hip Replacement',
          'Laparoscopic Surgery'
        ]
      };
    }
    
    // Mock surgical guide endpoint
    if (url.startsWith('/medical-records/surgical-guide/')) {
      const procedureName = url.split('/').pop();
      return {
        success: true,
        procedure_name: procedureName,
        aiGuide: {
          preOp: [
            'Complete blood work and imaging',
            'Stop blood thinners 7 days prior',
            'Fast for 8 hours before surgery',
            'Arrange post-operative care',
            'Complete pre-operative assessment'
          ],
          procedure: [
            'Administer anesthesia',
            'Make surgical incision',
            'Perform surgical procedure',
            'Close incision with sutures',
            'Apply sterile dressing'
          ],
          postOp: [
            'Monitor vital signs',
            'Manage pain with prescribed medications',
            'Encourage early ambulation',
            'Monitor for complications',
            'Schedule follow-up appointment'
          ],
          complications: [
            'Infection at surgical site',
            'Bleeding or hematoma',
            'Blood clots (DVT)',
            'Anesthesia complications',
            'Delayed wound healing'
          ]
        }
      };
    }
    
    // Default to original API call
    return api.get(url);
  },
  
  post: async (url, data) => {
    // Mock comprehensive analysis endpoint
    if (url === '/medical-records/comprehensive-analysis') {
      return {
        success: true,
        comprehensive_analysis: {
          patient_id: data.patient_id || 'P12345',
          bloodwork_analysis: {
            hemoglobin: { value: 12.5, unit: 'g/dL', normal: '12.0-15.5', status: 'normal' },
            whiteBloodCells: { value: 11.2, unit: 'K/µL', normal: '4.5-11.0', status: 'high' },
            platelets: { value: 250, unit: 'K/µL', normal: '150-450', status: 'normal' },
            glucose: { value: 95, unit: 'mg/dL', normal: '70-100', status: 'normal' },
            cholesterol: { value: 220, unit: 'mg/dL', normal: '<200', status: 'high' },
            creatinine: { value: 1.2, unit: 'mg/dL', normal: '0.6-1.2', status: 'borderline' }
          },
          medication_analysis: [
            {
              medication_name: 'Lisinopril',
              dosage: '10mg daily',
              reason: 'Hypertension',
              effectiveness: 'Good - BP reduced from 150/95 to 125/80',
              side_effects: ['Mild dry cough'],
              ai_recommendation: 'Continue current dosage, monitor kidney function',
              life_impact: 'Positive - reduces cardiovascular risk'
            },
            {
              medication_name: 'Metformin',
              dosage: '500mg twice daily',
              reason: 'Type 2 Diabetes',
              effectiveness: 'Excellent - A1C reduced from 7.2% to 6.1%',
              side_effects: ['Mild gastrointestinal upset'],
              ai_recommendation: 'Continue current dosage, consider adding exercise',
              life_impact: 'Positive - significantly reduces diabetes complications'
            }
          ],
          vaccination_analysis: {
            completed_vaccines: [
              { name: 'COVID-19', date: '2023-12-15', type: 'Booster', reaction: 'Mild arm soreness' },
              { name: 'Flu Shot', date: '2023-10-20', type: 'Annual', reaction: 'None' }
            ],
            missing_vaccines: [
              { name: 'Tetanus', due_date: '2024-06-15', importance: 'High' },
              { name: 'Pneumonia', due_date: '2024-09-20', importance: 'Medium' }
            ],
            overall_risk: 'Low'
          },
          overall_health_assessment: {
            risk_level: 'low',
            recommendations: ['Continue current medications', 'Monitor cholesterol levels'],
            priority_actions: ['Schedule annual physical'],
            health_score: 85
          }
        }
      };
    }
    
    // Default to original API call
    return api.post(url, data);
  }
};

// Export both api and apiService for compatibility
export default api;
export const apiService = mockApiService; 
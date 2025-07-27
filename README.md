# AI Telemedicine Platform

A comprehensive full-stack AI-powered telemedicine platform that enables virtual connections between patients and doctors, leveraging AI for symptom checking, diagnosis suggestions, medical scan analysis, and real-time consultations.

## 🚀 Features

### Core Platform
- **User Authentication**: Patient, Doctor, Admin roles with JWT + Refresh Tokens
- **Patient Dashboard**: Schedule appointments, chat, view medical records, payments
- **Doctor Dashboard**: View appointments, access patient history, generate prescriptions
- **Admin Panel**: User management, appointment logs, system settings
- **Real-time Chat**: WebSocket-based communication between patients and doctors
- **Video Conferencing**: WebRTC integration for virtual consultations
- **Payment Integration**: Stripe payment processing

### AI/ML Capabilities 🧠
- **Medical Scan Analysis**: Analyze MRI, CT, X-ray, Ultrasound images
  - Supports DICOM, PNG, JPG formats
  - AI-powered condition detection with confidence scores
  - Image quality assessment and recommendations
- **Bloodwork Analysis**: Parse and analyze lab reports
  - Supports PDF and CSV formats
  - Automatic abnormality detection
  - Clinical recommendations and urgency assessment
- **Recovery Prediction**: ML-powered recovery time and complication risk prediction
  - Uses symptoms, diagnosis, scan results, and patient demographics
  - Provides confidence intervals and risk factors
- **Doctor Feedback System**: Continuous model improvement through doctor feedback
  - Approve/reject/modify AI suggestions
  - Track model performance and accuracy

## 🛠️ Tech Stack

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Database**: MySQL/PostgreSQL with Flyway migrations
- **Security**: JWT, BCrypt, Role-Based Access Control
- **Real-time**: WebSocket for chat and notifications
- **AI Integration**: OpenAI API for symptom analysis and medical assistance
- **Payments**: Stripe API integration

### AI Backend (Python FastAPI)
- **Framework**: FastAPI
- **ML Libraries**: PyTorch, scikit-learn, OpenCV
- **Image Processing**: pydicom, Pillow
- **PDF Processing**: pdfplumber, tabula-py
- **Models**: DenseNet121 for medical imaging, Random Forest for predictions

### Frontend (React)
- **Framework**: React 18 with Material-UI
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.io client
- **Forms**: React Hook Form with validation

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Caching**: Redis for sessions and caching

## 📦 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- MySQL/PostgreSQL

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI_Telemedicine
```

### 2. Start with Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Manual Setup

#### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

#### AI Backend (Python FastAPI)
```bash
cd ai_backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## 🔌 API Endpoints

### Core Platform APIs
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `POST /api/ai/symptoms` - AI symptom analysis
- `POST /api/payments/create-intent` - Create payment intent

### AI/ML APIs
- `POST /analyze/scan` - Analyze medical scans
- `POST /analyze/bloodwork` - Analyze lab reports
- `POST /predict/recovery` - Predict recovery time
- `POST /feedback` - Submit doctor feedback
- `GET /models/status` - Get model status

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### AI Backend Tests
```bash
cd ai_backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Monitoring & Health Checks

### Core Platform
- Backend: `http://localhost:8080/actuator/health`
- Frontend: `http://localhost:3000`

### AI Backend
- Health: `http://localhost:8000/health`
- Model Status: `http://localhost:8000/models/status`

## 🔒 Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Password encryption with BCrypt
- CORS configuration
- Input validation and sanitization
- Rate limiting and brute-force prevention
- HIPAA-compliant audit logging

## 🚀 Deployment

### Production Deployment
1. **Environment Setup**: Configure production environment variables
2. **Database**: Set up production database with migrations
3. **SSL/TLS**: Configure certificates for HTTPS
4. **Monitoring**: Set up Prometheus + Grafana
5. **CI/CD**: Configure GitHub Actions for automated deployment

### Cloud Deployment Options
- **AWS**: ECS/EKS for containers, RDS for database
- **GCP**: Cloud Run for containers, Cloud SQL for database
- **Azure**: Container Instances, Azure SQL Database
- **Railway**: Simple container deployment
- **Vercel**: Frontend deployment

## 📈 Performance Optimization

### Backend
- Database connection pooling
- Redis caching for sessions
- Async processing for heavy operations
- JVM tuning for production

### AI Backend
- GPU acceleration for model inference
- Model caching and optimization
- Async file processing
- Request queuing for high load

### Frontend
- Code splitting and lazy loading
- Image optimization
- Service worker for caching
- Bundle optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [Backend API Documentation](backend/README.md)
- [AI Backend Documentation](ai_backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🔮 Roadmap

### Phase 1 (Current) ✅
- Core platform with authentication
- Basic AI symptom analysis
- Real-time chat
- Payment integration

### Phase 2 (In Progress) 🚧
- Medical scan analysis
- Bloodwork parsing
- Recovery prediction
- Doctor feedback system

### Phase 3 (Planned) 📋
- Mobile app (React Native)
- Advanced AI features
- FHIR integration
- Insurance eligibility
- Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@aitelemedicine.com or create an issue in the repository.

---

**Built with ❤️ for better healthcare through technology** 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Rating,
  Slider,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Paper,
  Divider,
  Badge,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  HealthAndSafety,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  Add,
  Remove,
  Search,
  FilterList,
  Sort,
  Download,
  Share,
  Print,
  LocalHospital,
  Medication,
  Timeline,
  TrendingUp,
  TrendingDown,
  Assessment,
  Psychology,
  Science,
  Lightbulb,
  Notifications,
  NotificationsOff,
  Visibility,
  VisibilityOff,
  Refresh,
  Save,
  Edit,
  Delete,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbDown,
  Comment,
  Bookmark,
  BookmarkBorder,
  History,
  Schedule,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  Web,
  CloudDownload,
  CloudUpload,
  Sync,
  Autorenew,
  Build,
  Settings,
  Help,
  Support,
  Feedback,
  Report,
  BugReport,
  Security,
  PrivacyTip,
  VerifiedUser,
  GppGood,
  GppBad,
  GppMaybe,
} from '@mui/icons-material';

// Comprehensive symptoms database with 100+ symptoms
const mockSymptoms = [
  // Neurological (20 symptoms)
  { id: 1, name: 'Headache', category: 'Neurological', severity: 'moderate', duration: '2 days', common: true },
  { id: 2, name: 'Migraine', category: 'Neurological', severity: 'severe', duration: '4 hours', common: true },
  { id: 3, name: 'Dizziness', category: 'Neurological', severity: 'moderate', duration: '1 hour', common: true },
  { id: 4, name: 'Confusion', category: 'Neurological', severity: 'severe', duration: '30 minutes', common: false },
  { id: 5, name: 'Seizures', category: 'Neurological', severity: 'critical', duration: '5 minutes', common: false },
  { id: 6, name: 'Numbness', category: 'Neurological', severity: 'moderate', duration: '2 hours', common: true },
  { id: 7, name: 'Tingling', category: 'Neurological', severity: 'mild', duration: '1 hour', common: true },
  { id: 8, name: 'Memory Loss', category: 'Neurological', severity: 'severe', duration: '1 day', common: false },
  { id: 9, name: 'Speech Problems', category: 'Neurological', severity: 'severe', duration: '30 minutes', common: false },
  { id: 10, name: 'Vision Changes', category: 'Neurological', severity: 'moderate', duration: '2 hours', common: true },
  { id: 11, name: 'Balance Problems', category: 'Neurological', severity: 'moderate', duration: '1 hour', common: true },
  { id: 12, name: 'Tremors', category: 'Neurological', severity: 'moderate', duration: '1 day', common: true },
  { id: 13, name: 'Muscle Twitching', category: 'Neurological', severity: 'mild', duration: '1 hour', common: true },
  { id: 14, name: 'Loss of Consciousness', category: 'Neurological', severity: 'critical', duration: '1 minute', common: false },
  { id: 15, name: 'Difficulty Concentrating', category: 'Neurological', severity: 'mild', duration: '1 day', common: true },
  { id: 16, name: 'Brain Fog', category: 'Neurological', severity: 'mild', duration: '1 day', common: true },
  { id: 17, name: 'Sensitivity to Light', category: 'Neurological', severity: 'moderate', duration: '2 hours', common: true },
  { id: 18, name: 'Sensitivity to Sound', category: 'Neurological', severity: 'moderate', duration: '2 hours', common: true },
  { id: 19, name: 'Facial Drooping', category: 'Neurological', severity: 'severe', duration: '30 minutes', common: false },
  { id: 20, name: 'Slurred Speech', category: 'Neurological', severity: 'severe', duration: '30 minutes', common: false },

  // Cardiovascular (15 symptoms)
  { id: 21, name: 'Chest Pain', category: 'Cardiovascular', severity: 'severe', duration: '30 minutes', common: true },
  { id: 22, name: 'Heart Palpitations', category: 'Cardiovascular', severity: 'moderate', duration: '1 hour', common: true },
  { id: 23, name: 'High Blood Pressure', category: 'Cardiovascular', severity: 'moderate', duration: '1 day', common: true },
  { id: 24, name: 'Irregular Heartbeat', category: 'Cardiovascular', severity: 'severe', duration: '30 minutes', common: false },
  { id: 25, name: 'Swelling in Legs', category: 'Cardiovascular', severity: 'moderate', duration: '1 day', common: true },
  { id: 26, name: 'Cold Extremities', category: 'Cardiovascular', severity: 'mild', duration: '2 hours', common: true },
  { id: 27, name: 'Fainting', category: 'Cardiovascular', severity: 'severe', duration: '5 minutes', common: false },
  { id: 28, name: 'Rapid Heartbeat', category: 'Cardiovascular', severity: 'moderate', duration: '1 hour', common: true },
  { id: 29, name: 'Slow Heartbeat', category: 'Cardiovascular', severity: 'moderate', duration: '1 hour', common: true },
  { id: 30, name: 'Chest Tightness', category: 'Cardiovascular', severity: 'moderate', duration: '1 hour', common: true },
  { id: 31, name: 'Pain Radiating to Arm', category: 'Cardiovascular', severity: 'severe', duration: '30 minutes', common: false },
  { id: 32, name: 'Pain Radiating to Jaw', category: 'Cardiovascular', severity: 'severe', duration: '30 minutes', common: false },
  { id: 33, name: 'Blue Lips', category: 'Cardiovascular', severity: 'severe', duration: '30 minutes', common: false },
  { id: 34, name: 'Blue Fingernails', category: 'Cardiovascular', severity: 'moderate', duration: '1 hour', common: true },
  { id: 35, name: 'Pulse Irregularity', category: 'Cardiovascular', severity: 'moderate', duration: '1 hour', common: true },

  // Respiratory (15 symptoms)
  { id: 36, name: 'Shortness of Breath', category: 'Respiratory', severity: 'severe', duration: '1 hour', common: true },
  { id: 37, name: 'Cough', category: 'Respiratory', severity: 'moderate', duration: '3 days', common: true },
  { id: 38, name: 'Wheezing', category: 'Respiratory', severity: 'moderate', duration: '2 hours', common: true },
  { id: 39, name: 'Chest Tightness', category: 'Respiratory', severity: 'moderate', duration: '1 hour', common: true },
  { id: 40, name: 'Difficulty Breathing', category: 'Respiratory', severity: 'severe', duration: '30 minutes', common: false },
  { id: 41, name: 'Sore Throat', category: 'Respiratory', severity: 'mild', duration: '2 days', common: true },
  { id: 42, name: 'Runny Nose', category: 'Respiratory', severity: 'mild', duration: '3 days', common: true },
  { id: 43, name: 'Sneezing', category: 'Respiratory', severity: 'mild', duration: '1 day', common: true },
  { id: 44, name: 'Hoarseness', category: 'Respiratory', severity: 'mild', duration: '1 day', common: true },
  { id: 45, name: 'Chest Congestion', category: 'Respiratory', severity: 'moderate', duration: '2 days', common: true },
  { id: 46, name: 'Rapid Breathing', category: 'Respiratory', severity: 'moderate', duration: '1 hour', common: true },
  { id: 47, name: 'Shallow Breathing', category: 'Respiratory', severity: 'moderate', duration: '1 hour', common: true },
  { id: 48, name: 'Coughing Up Blood', category: 'Respiratory', severity: 'severe', duration: '30 minutes', common: false },
  { id: 49, name: 'Pleural Effusion', category: 'Respiratory', severity: 'severe', duration: '1 day', common: false },
  { id: 50, name: 'Sleep Apnea', category: 'Respiratory', severity: 'moderate', duration: '1 week', common: true },

  // Digestive (20 symptoms)
  { id: 51, name: 'Nausea', category: 'Digestive', severity: 'moderate', duration: '3 hours', common: true },
  { id: 52, name: 'Vomiting', category: 'Digestive', severity: 'moderate', duration: '2 hours', common: true },
  { id: 53, name: 'Abdominal Pain', category: 'Digestive', severity: 'moderate', duration: '4 hours', common: true },
  { id: 54, name: 'Diarrhea', category: 'Digestive', severity: 'moderate', duration: '1 day', common: true },
  { id: 55, name: 'Constipation', category: 'Digestive', severity: 'mild', duration: '3 days', common: true },
  { id: 56, name: 'Bloating', category: 'Digestive', severity: 'mild', duration: '2 hours', common: true },
  { id: 57, name: 'Acid Reflux', category: 'Digestive', severity: 'moderate', duration: '1 hour', common: true },
  { id: 58, name: 'Loss of Appetite', category: 'Digestive', severity: 'mild', duration: '1 day', common: true },
  { id: 59, name: 'Food Poisoning', category: 'Digestive', severity: 'severe', duration: '6 hours', common: false },
  { id: 60, name: 'Heartburn', category: 'Digestive', severity: 'moderate', duration: '1 hour', common: true },
  { id: 61, name: 'Indigestion', category: 'Digestive', severity: 'mild', duration: '2 hours', common: true },
  { id: 62, name: 'Gas', category: 'Digestive', severity: 'mild', duration: '1 hour', common: true },
  { id: 63, name: 'Stomach Cramps', category: 'Digestive', severity: 'moderate', duration: '2 hours', common: true },
  { id: 64, name: 'Blood in Stool', category: 'Digestive', severity: 'severe', duration: '1 day', common: false },
  { id: 65, name: 'Black Stool', category: 'Digestive', severity: 'severe', duration: '1 day', common: false },
  { id: 66, name: 'Yellow Stool', category: 'Digestive', severity: 'moderate', duration: '1 day', common: true },
  { id: 67, name: 'Difficulty Swallowing', category: 'Digestive', severity: 'moderate', duration: '1 hour', common: true },
  { id: 68, name: 'Jaundice', category: 'Digestive', severity: 'severe', duration: '1 day', common: false },
  { id: 69, name: 'Abdominal Swelling', category: 'Digestive', severity: 'moderate', duration: '1 day', common: true },
  { id: 70, name: 'Rectal Pain', category: 'Digestive', severity: 'moderate', duration: '1 day', common: true },

  // Musculoskeletal (15 symptoms)
  { id: 71, name: 'Joint Pain', category: 'Musculoskeletal', severity: 'moderate', duration: '1 day', common: true },
  { id: 72, name: 'Back Pain', category: 'Musculoskeletal', severity: 'moderate', duration: '2 days', common: true },
  { id: 73, name: 'Muscle Cramps', category: 'Musculoskeletal', severity: 'mild', duration: '30 minutes', common: true },
  { id: 74, name: 'Stiffness', category: 'Musculoskeletal', severity: 'mild', duration: '1 hour', common: true },
  { id: 75, name: 'Swelling', category: 'Musculoskeletal', severity: 'moderate', duration: '1 day', common: true },
  { id: 76, name: 'Limited Range of Motion', category: 'Musculoskeletal', severity: 'moderate', duration: '1 day', common: true },
  { id: 77, name: 'Bone Pain', category: 'Musculoskeletal', severity: 'severe', duration: '1 day', common: false },
  { id: 78, name: 'Muscle Weakness', category: 'Musculoskeletal', severity: 'moderate', duration: '1 day', common: true },
  { id: 79, name: 'Muscle Spasms', category: 'Musculoskeletal', severity: 'moderate', duration: '1 hour', common: true },
  { id: 80, name: 'Joint Stiffness', category: 'Musculoskeletal', severity: 'moderate', duration: '1 hour', common: true },
  { id: 81, name: 'Joint Swelling', category: 'Musculoskeletal', severity: 'moderate', duration: '1 day', common: true },
  { id: 82, name: 'Difficulty Walking', category: 'Musculoskeletal', severity: 'moderate', duration: '1 day', common: true },
  { id: 83, name: 'Limping', category: 'Musculoskeletal', severity: 'moderate', duration: '1 day', common: true },
  { id: 84, name: 'Bruising', category: 'Musculoskeletal', severity: 'mild', duration: '1 day', common: true },
  { id: 85, name: 'Fracture Pain', category: 'Musculoskeletal', severity: 'severe', duration: '1 day', common: false },

  // General (15 symptoms)
  { id: 86, name: 'Fever', category: 'General', severity: 'high', duration: '1 day', common: true },
  { id: 87, name: 'Fatigue', category: 'General', severity: 'moderate', duration: '1 day', common: true },
  { id: 88, name: 'Chills', category: 'General', severity: 'moderate', duration: '2 hours', common: true },
  { id: 89, name: 'Night Sweats', category: 'General', severity: 'moderate', duration: '1 week', common: true },
  { id: 90, name: 'Weight Loss', category: 'General', severity: 'moderate', duration: '1 month', common: true },
  { id: 91, name: 'Weight Gain', category: 'General', severity: 'mild', duration: '1 month', common: true },
  { id: 92, name: 'Loss of Energy', category: 'General', severity: 'moderate', duration: '1 day', common: true },
  { id: 93, name: 'Insomnia', category: 'General', severity: 'mild', duration: '1 week', common: true },
  { id: 94, name: 'Excessive Thirst', category: 'General', severity: 'moderate', duration: '1 day', common: true },
  { id: 95, name: 'Frequent Urination', category: 'General', severity: 'moderate', duration: '1 day', common: true },
  { id: 96, name: 'Excessive Hunger', category: 'General', severity: 'moderate', duration: '1 day', common: true },
  { id: 97, name: 'Cold Intolerance', category: 'General', severity: 'mild', duration: '1 day', common: true },
  { id: 98, name: 'Heat Intolerance', category: 'General', severity: 'mild', duration: '1 day', common: true },
  { id: 99, name: 'Hair Loss', category: 'General', severity: 'mild', duration: '1 month', common: true },
  { id: 100, name: 'Nail Changes', category: 'General', severity: 'mild', duration: '1 month', common: true },

  // Emergency Symptoms (10 symptoms)
  { id: 101, name: 'Severe Chest Pain', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false },
  { id: 102, name: 'Difficulty Breathing', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false },
  { id: 103, name: 'Unconsciousness', category: 'Emergency', severity: 'critical', duration: '1 minute', common: false },
  { id: 104, name: 'Severe Bleeding', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false },
  { id: 105, name: 'Stroke Symptoms', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false },
  { id: 106, name: 'Severe Allergic Reaction', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false },
  { id: 107, name: 'Severe Head Injury', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false },
  { id: 108, name: 'Severe Abdominal Pain', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false },
  { id: 109, name: 'Poisoning', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false },
  { id: 110, name: 'Severe Burns', category: 'Emergency', severity: 'critical', duration: '5 minutes', common: false }
];

const mockConditions = [
  { id: 1, name: 'Common Cold', probability: 85, severity: 'low', description: 'Viral upper respiratory infection' },
  { id: 2, name: 'Migraine', probability: 65, severity: 'moderate', description: 'Recurrent headache disorder' },
  { id: 3, name: 'Anxiety', probability: 45, severity: 'low', description: 'Mental health condition' },
  { id: 4, name: 'Hypertension', probability: 30, severity: 'moderate', description: 'High blood pressure' },
];

// AI Drug Recommendations Database
const mockDrugRecommendations = [
  {
    id: 1,
    name: 'Acetaminophen (Tylenol)',
    generic: 'acetaminophen',
    dosage: '500-1000mg every 4-6 hours',
    maxDaily: '4000mg',
    category: 'Analgesic',
    symptoms: ['Headache', 'Fever', 'Joint Pain', 'Back Pain'],
    contraindications: ['Liver disease', 'Alcohol abuse'],
    sideEffects: ['Nausea', 'Liver damage in high doses'],
    insurance: {
      covered: true,
      tier: 1,
      copay: '$5',
      priorAuth: false
    },
    alternatives: ['Ibuprofen', 'Naproxen'],
    interactions: ['Warfarin', 'Alcohol'],
    pregnancy: 'Safe',
    breastfeeding: 'Safe',
    otc: true,
    prescription: false
  },
  {
    id: 2,
    name: 'Ibuprofen (Advil)',
    generic: 'ibuprofen',
    dosage: '200-400mg every 4-6 hours',
    maxDaily: '3200mg',
    category: 'NSAID',
    symptoms: ['Headache', 'Joint Pain', 'Back Pain', 'Muscle Cramps'],
    contraindications: ['Stomach ulcers', 'Kidney disease', 'Heart disease'],
    sideEffects: ['Stomach upset', 'Bleeding risk'],
    insurance: {
      covered: true,
      tier: 1,
      copay: '$3',
      priorAuth: false
    },
    alternatives: ['Acetaminophen', 'Naproxen'],
    interactions: ['Blood thinners', 'ACE inhibitors'],
    pregnancy: 'Avoid in third trimester',
    breastfeeding: 'Safe',
    otc: true,
    prescription: false
  },
  {
    id: 3,
    name: 'Omeprazole (Prilosec)',
    generic: 'omeprazole',
    dosage: '20mg once daily',
    maxDaily: '40mg',
    category: 'Proton Pump Inhibitor',
    symptoms: ['Heartburn', 'Acid Reflux', 'Stomach Pain'],
    contraindications: ['Pregnancy', 'Liver disease'],
    sideEffects: ['Headache', 'Diarrhea', 'Vitamin B12 deficiency'],
    insurance: {
      covered: true,
      tier: 2,
      copay: '$15',
      priorAuth: false
    },
    alternatives: ['Pantoprazole', 'Esomeprazole'],
    interactions: ['Iron supplements', 'Vitamin B12'],
    pregnancy: 'Consult doctor',
    breastfeeding: 'Safe',
    otc: true,
    prescription: true
  },
  {
    id: 4,
    name: 'Loratadine (Claritin)',
    generic: 'loratadine',
    dosage: '10mg once daily',
    maxDaily: '10mg',
    category: 'Antihistamine',
    symptoms: ['Runny Nose', 'Sneezing', 'Itching', 'Hives'],
    contraindications: ['Severe liver disease'],
    sideEffects: ['Drowsiness', 'Dry mouth'],
    insurance: {
      covered: true,
      tier: 1,
      copay: '$5',
      priorAuth: false
    },
    alternatives: ['Cetirizine', 'Fexofenadine'],
    interactions: ['Ketoconazole', 'Erythromycin'],
    pregnancy: 'Safe',
    breastfeeding: 'Safe',
    otc: true,
    prescription: false
  },
  {
    id: 5,
    name: 'Metformin (Glucophage)',
    generic: 'metformin',
    dosage: '500mg twice daily',
    maxDaily: '2550mg',
    category: 'Antidiabetic',
    symptoms: ['Excessive Thirst', 'Excessive Hunger', 'Frequent Urination'],
    contraindications: ['Kidney disease', 'Heart failure'],
    sideEffects: ['Nausea', 'Diarrhea', 'Lactic acidosis'],
    insurance: {
      covered: true,
      tier: 1,
      copay: '$10',
      priorAuth: true
    },
    alternatives: ['Sulfonylureas', 'DPP-4 inhibitors'],
    interactions: ['Alcohol', 'Contrast dye'],
    pregnancy: 'Category B',
    breastfeeding: 'Safe',
    otc: false,
    prescription: true
  },
  {
    id: 6,
    name: 'Amlodipine (Norvasc)',
    generic: 'amlodipine',
    dosage: '5mg once daily',
    maxDaily: '10mg',
    category: 'Calcium Channel Blocker',
    symptoms: ['High Blood Pressure', 'Chest Pain'],
    contraindications: ['Severe aortic stenosis', 'Heart failure'],
    sideEffects: ['Swelling', 'Dizziness', 'Flushing'],
    insurance: {
      covered: true,
      tier: 1,
      copay: '$10',
      priorAuth: false
    },
    alternatives: ['Nifedipine', 'Diltiazem'],
    interactions: ['Simvastatin', 'Digoxin'],
    pregnancy: 'Category C',
    breastfeeding: 'Safe',
    otc: false,
    prescription: true
  },
  {
    id: 7,
    name: 'Sertraline (Zoloft)',
    generic: 'sertraline',
    dosage: '50mg once daily',
    maxDaily: '200mg',
    category: 'SSRI',
    symptoms: ['Anxiety', 'Depression', 'Panic Attacks'],
    contraindications: ['MAO inhibitors', 'Pregnancy'],
    sideEffects: ['Nausea', 'Insomnia', 'Sexual dysfunction'],
    insurance: {
      covered: true,
      tier: 2,
      copay: '$20',
      priorAuth: true
    },
    alternatives: ['Fluoxetine', 'Escitalopram'],
    interactions: ['MAO inhibitors', 'NSAIDs'],
    pregnancy: 'Category C',
    breastfeeding: 'Consult doctor',
    otc: false,
    prescription: true
  },
  {
    id: 8,
    name: 'Albuterol (Ventolin)',
    generic: 'albuterol',
    dosage: '2 puffs every 4-6 hours',
    maxDaily: '8 puffs',
    category: 'Bronchodilator',
    symptoms: ['Shortness of Breath', 'Wheezing', 'Chest Tightness'],
    contraindications: ['Severe heart disease'],
    sideEffects: ['Tremors', 'Rapid heartbeat', 'Nervousness'],
    insurance: {
      covered: true,
      tier: 1,
      copay: '$15',
      priorAuth: false
    },
    alternatives: ['Levalbuterol', 'Formoterol'],
    interactions: ['Beta-blockers', 'Diuretics'],
    pregnancy: 'Category C',
    breastfeeding: 'Safe',
    otc: false,
    prescription: true
  }
];

// Insurance Plans Database
const mockInsurancePlans = [
  {
    id: 1,
    name: 'Blue Cross Blue Shield',
    type: 'PPO',
    deductible: 1500,
    copay: {
      tier1: 10,
      tier2: 25,
      tier3: 50,
      tier4: 100
    },
    coverage: {
      generic: 100,
      preferred: 80,
      nonPreferred: 60,
      specialty: 50
    }
  },
  {
    id: 2,
    name: 'Aetna',
    type: 'HMO',
    deductible: 1000,
    copay: {
      tier1: 5,
      tier2: 15,
      tier3: 30,
      tier4: 75
    },
    coverage: {
      generic: 100,
      preferred: 85,
      nonPreferred: 70,
      specialty: 60
    }
  },
  {
    id: 3,
    name: 'UnitedHealth',
    type: 'PPO',
    deductible: 2000,
    copay: {
      tier1: 15,
      tier2: 30,
      tier3: 60,
      tier4: 125
    },
    coverage: {
      generic: 95,
      preferred: 75,
      nonPreferred: 50,
      specialty: 40
    }
  },
  {
    id: 4,
    name: 'Medicare Part D',
    type: 'Medicare',
    deductible: 480,
    copay: {
      tier1: 0,
      tier2: 0,
      tier3: 0,
      tier4: 0
    },
    coverage: {
      generic: 100,
      preferred: 80,
      nonPreferred: 60,
      specialty: 25
    }
  }
];

const mockRecommendations = [
  { id: 1, type: 'immediate', title: 'Seek Emergency Care', description: 'Chest pain requires immediate medical attention', icon: <Warning />, color: 'error' },
  { id: 2, type: 'urgent', title: 'Schedule Appointment', description: 'Schedule with your primary care physician within 24 hours', icon: <LocalHospital />, color: 'warning' },
  { id: 3, type: 'self-care', title: 'Rest and Hydration', description: 'Get plenty of rest and stay hydrated', icon: <HealthAndSafety />, color: 'info' },
  { id: 4, type: 'monitoring', title: 'Monitor Symptoms', description: 'Keep track of your symptoms and report any changes', icon: <Timeline />, color: 'primary' },
];

const SymptomCheckerPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomDetails, setSymptomDetails] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [riskLevel, setRiskLevel] = useState('low');
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [expandedSymptom, setExpandedSymptom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [openRecommendationDialog, setOpenRecommendationDialog] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  
  // Drug recommendation states
  const [drugRecommendations, setDrugRecommendations] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [patientAllergies, setPatientAllergies] = useState([]);
  const [currentMedications, setCurrentMedications] = useState([]);
  const [showDrugDialog, setShowDrugDialog] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [insurancePlans] = useState(mockInsurancePlans);
  const [showInsuranceDialog, setShowInsuranceDialog] = useState(false);
  const [doctorCollaboration, setDoctorCollaboration] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [testRecommendations, setTestRecommendations] = useState([]);
  
  // User role - this would typically come from authentication context
  const [userRole, setUserRole] = useState('patient'); // 'patient' or 'doctor'

  // Mock test recommendations for doctors
  const mockTestRecommendations = [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      category: 'Blood Test',
      urgency: 'high',
      symptoms: ['fever', 'fatigue', 'weakness', 'pale skin'],
      description: 'Measures red blood cells, white blood cells, and platelets',
      cost: '$50-150',
      insuranceCoverage: 90,
      turnaroundTime: '24-48 hours',
      preparation: 'Fasting may be required',
      followUp: 'Schedule follow-up appointment to review results'
    },
    {
      id: 2,
      name: 'Chest X-Ray',
      category: 'Imaging',
      urgency: 'medium',
      symptoms: ['chest pain', 'shortness of breath', 'cough', 'fever'],
      description: 'Imaging of the chest to evaluate heart, lungs, and bones',
      cost: '$200-500',
      insuranceCoverage: 85,
      turnaroundTime: 'Same day',
      preparation: 'No special preparation needed',
      followUp: 'Review with radiologist if abnormalities found'
    },
    {
      id: 3,
      name: 'Electrocardiogram (ECG/EKG)',
      category: 'Cardiac',
      urgency: 'high',
      symptoms: ['chest pain', 'palpitations', 'shortness of breath', 'dizziness'],
      description: 'Records electrical activity of the heart',
      cost: '$100-300',
      insuranceCoverage: 90,
      turnaroundTime: 'Immediate',
      preparation: 'No special preparation needed',
      followUp: 'Immediate interpretation available'
    },
    {
      id: 4,
      name: 'Comprehensive Metabolic Panel',
      category: 'Blood Test',
      urgency: 'medium',
      symptoms: ['fatigue', 'nausea', 'abdominal pain', 'dehydration'],
      description: 'Measures kidney function, liver function, and electrolyte levels',
      cost: '$80-200',
      insuranceCoverage: 85,
      turnaroundTime: '24-48 hours',
      preparation: 'Fasting for 8-12 hours required',
      followUp: 'Schedule follow-up if abnormal results'
    },
    {
      id: 5,
      name: 'Urinalysis',
      category: 'Urine Test',
      urgency: 'low',
      symptoms: ['frequent urination', 'burning sensation', 'cloudy urine', 'abdominal pain'],
      description: 'Analyzes urine for infection, kidney problems, or diabetes',
      cost: '$30-80',
      insuranceCoverage: 95,
      turnaroundTime: 'Same day',
      preparation: 'Clean catch urine sample',
      followUp: 'Antibiotics if infection detected'
    },
    {
      id: 6,
      name: 'CT Scan of Chest',
      category: 'Imaging',
      urgency: 'high',
      symptoms: ['severe chest pain', 'trauma', 'suspected pulmonary embolism'],
      description: 'Detailed cross-sectional imaging of the chest',
      cost: '$500-1500',
      insuranceCoverage: 80,
      turnaroundTime: 'Same day',
      preparation: 'May require contrast dye',
      followUp: 'Immediate review by radiologist'
    },
    {
      id: 7,
      name: 'Troponin Test',
      category: 'Blood Test',
      urgency: 'critical',
      symptoms: ['severe chest pain', 'pressure in chest', 'pain radiating to arm'],
      description: 'Measures heart muscle damage (heart attack indicator)',
      cost: '$100-300',
      insuranceCoverage: 95,
      turnaroundTime: '1-2 hours',
      preparation: 'No special preparation needed',
      followUp: 'Immediate if elevated levels'
    },
    {
      id: 8,
      name: 'D-Dimer Test',
      category: 'Blood Test',
      urgency: 'high',
      symptoms: ['sudden shortness of breath', 'chest pain', 'leg swelling'],
      description: 'Screens for blood clots (pulmonary embolism)',
      cost: '$80-200',
      insuranceCoverage: 90,
      turnaroundTime: '2-4 hours',
      preparation: 'No special preparation needed',
      followUp: 'CT scan if positive'
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.find(s => s.id === symptom.id)
        ? prev.filter(s => s.id !== symptom.id)
        : [...prev, { ...symptom, userSeverity: 'moderate', userDuration: '1 hour' }]
    );
  };

  const handleSymptomSeverityChange = (symptomId, severity) => {
    setSelectedSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === symptomId 
          ? { ...symptom, userSeverity: severity }
          : symptom
      )
    );
  };

  const handleSymptomDurationChange = (symptomId, duration) => {
    setSelectedSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === symptomId 
          ? { ...symptom, userDuration: duration }
          : symptom
      )
    );
  };

  const handleSymptomDetailChange = (symptomId, field, value) => {
    setSymptomDetails(prev => ({
      ...prev,
      [symptomId]: {
        ...prev[symptomId],
        [field]: value
      }
    }));
  };

  const handleAnalyzeSymptoms = async () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Calculate risk level based on user-defined severity
      const hasCriticalSymptoms = selectedSymptoms.some(s => s.userSeverity === 'critical');
      const hasSevereSymptoms = selectedSymptoms.some(s => s.userSeverity === 'severe');
      const hasModerateSymptoms = selectedSymptoms.some(s => s.userSeverity === 'moderate');
      
      let riskLevel = 'low';
      if (hasCriticalSymptoms) riskLevel = 'critical';
      else if (hasSevereSymptoms) riskLevel = 'high';
      else if (hasModerateSymptoms) riskLevel = 'moderate';
      
      // Check for emergency symptoms
      const emergencySymptoms = ['Chest Pain', 'Difficulty Breathing', 'Severe Chest Pain', 'Unconsciousness', 'Severe Bleeding'];
      const hasEmergencySymptoms = selectedSymptoms.some(s => 
        emergencySymptoms.includes(s.name) && (s.userSeverity === 'severe' || s.userSeverity === 'critical')
      );
      
      const result = {
        conditions: mockConditions,
        recommendations: mockRecommendations,
        riskLevel: riskLevel,
        confidence: 85,
        analysis: `Based on your symptoms and their severity levels, the AI analysis suggests several possible conditions. ${hasEmergencySymptoms ? 'EMERGENCY: Some symptoms require immediate medical attention!' : 'The most likely diagnosis is a common cold.'}`,
        emergency: hasEmergencySymptoms,
        severityAnalysis: selectedSymptoms.map(s => ({
          symptom: s.name,
          severity: s.userSeverity,
          duration: s.userDuration,
          risk: s.userSeverity === 'critical' ? 'Immediate medical attention required' : 
                 s.userSeverity === 'severe' ? 'Medical attention recommended' :
                 s.userSeverity === 'moderate' ? 'Monitor closely' : 'Continue monitoring'
        }))
      };
      
      setAnalysisResult(result);
      setRiskLevel(result.riskLevel);
      setShowEmergencyAlert(result.emergency);
      
      // Generate drug recommendations based on symptoms and severity
      const recommendedDrugs = generateDrugRecommendations(selectedSymptoms);
      setDrugRecommendations(recommendedDrugs);
      
      // Generate test recommendations for doctors
      if (userRole === 'doctor') {
        const recommendedTests = generateTestRecommendations(selectedSymptoms);
        setTestRecommendations(recommendedTests);
      }
      
      setLoading(false);
      setActiveStep(4);
    }, 3000);
  };

  const generateDrugRecommendations = (symptoms) => {
    const symptomNames = symptoms.map(s => s.name);
    let filteredDrugs = mockDrugRecommendations.filter(drug => 
      drug.symptoms.some(symptom => symptomNames.includes(symptom))
    );
    
    // Filter based on user role
    if (userRole === 'patient') {
      // Patients only see OTC drugs
      filteredDrugs = filteredDrugs.filter(drug => drug.otc);
    } else if (userRole === 'doctor') {
      // Doctors see both OTC and prescription drugs
      // No filtering needed - doctors can see all drugs
    }
    
    return filteredDrugs.map(drug => ({
      ...drug,
      matchScore: calculateMatchScore(drug, symptoms, patientAllergies, currentMedications),
      insuranceCoverage: selectedInsurance ? calculateInsuranceCoverage(drug, selectedInsurance) : null
    })).sort((a, b) => b.matchScore - a.matchScore);
  };

  const generateTestRecommendations = (symptoms) => {
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    const filteredTests = mockTestRecommendations.filter(test => 
      test.symptoms.some(symptom => 
        symptomNames.some(symptomName => 
          symptomName.includes(symptom) || symptom.includes(symptomName)
        )
      )
    );
    
    return filteredTests.sort((a, b) => {
      // Sort by urgency: critical > high > medium > low
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
  };

  const calculateMatchScore = (drug, symptoms, allergies, currentMeds) => {
    let score = 0;
    
    // Symptom match score with severity weighting
    symptoms.forEach(symptom => {
      const isMatch = drug.symptoms.includes(symptom.name);
      if (isMatch) {
        // Weight by severity level
        const severityWeight = {
          'mild': 10,
          'moderate': 20,
          'severe': 35,
          'critical': 50
        };
        score += severityWeight[symptom.userSeverity] || 20;
      }
    });
    
    // Allergy penalty
    const allergyPenalty = allergies.some(allergy => 
      drug.name.toLowerCase().includes(allergy.toLowerCase()) ||
      drug.generic.toLowerCase().includes(allergy.toLowerCase())
    ) ? -100 : 0;
    score += allergyPenalty;
    
    // Drug interaction penalty
    const interactionPenalty = currentMeds.some(med => 
      drug.interactions.includes(med)
    ) ? -50 : 0;
    score += interactionPenalty;
    
    // OTC bonus for mild/moderate symptoms
    const hasSevereSymptoms = symptoms.some(s => s.userSeverity === 'severe' || s.userSeverity === 'critical');
    if (drug.otc && !hasSevereSymptoms) score += 10;
    
    // Prescription bonus for severe/critical symptoms
    if (!drug.otc && hasSevereSymptoms) score += 15;
    
    return Math.max(0, score);
  };

  const calculateInsuranceCoverage = (drug, insurance) => {
    const tier = drug.insurance.tier;
    const copay = insurance.copay[`tier${tier}`];
    const coverage = drug.otc ? 0 : insurance.coverage.generic;
    
    return {
      copay,
      coverage,
      covered: drug.insurance.covered,
      priorAuth: drug.insurance.priorAuth
    };
  };

  const handleDrugSelect = (drug) => {
    setSelectedDrug(drug);
    setShowDrugDialog(true);
  };

  const handleInsuranceSelect = (insurance) => {
    setSelectedInsurance(insurance);
    setShowInsuranceDialog(false);
  };

  const addAllergy = (allergy) => {
    if (!patientAllergies.includes(allergy)) {
      setPatientAllergies([...patientAllergies, allergy]);
    }
  };

  const removeAllergy = (allergy) => {
    setPatientAllergies(patientAllergies.filter(a => a !== allergy));
  };

  const addCurrentMedication = (medication) => {
    if (!currentMedications.includes(medication)) {
      setCurrentMedications([...currentMedications, medication]);
    }
  };

  const removeCurrentMedication = (medication) => {
    setCurrentMedications(currentMedications.filter(m => m !== medication));
  };

  const handleEmergencyAction = () => {
    // In real app, this would trigger emergency protocols
    alert('Emergency protocols activated. Contacting emergency services...');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'success';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'success';
      case 'moderate': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const filteredSymptoms = mockSymptoms.filter(symptom => {
    const matchesSearch = symptom.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || symptom.category === selectedCategory;
    const matchesSeverity = severityFilter === 'all' || symptom.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const categories = ['all', ...new Set(mockSymptoms.map(s => s.category))];
  const severities = ['all', 'mild', 'moderate', 'severe'];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            AI Symptom Checker
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<History />}
            >
              History
            </Button>
            <Button
              variant="contained"
              startIcon={<HealthAndSafety />}
            >
              Emergency
            </Button>
          </Box>
        </Box>

        {/* Emergency Alert */}
        {showEmergencyAlert && (
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleEmergencyAction}>
                CALL 911
              </Button>
            }
            sx={{ mb: 3 }}
          >
            <Typography variant="h6">EMERGENCY ALERT</Typography>
            <Typography variant="body2">
              Chest pain detected. This may be a medical emergency. Please seek immediate medical attention.
            </Typography>
          </Alert>
        )}

        {/* Analysis Progress */}
        <Paper sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Select Symptoms</StepLabel>
            </Step>
            <Step>
              <StepLabel>Provide Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Medical History</StepLabel>
            </Step>
            <Step>
              <StepLabel>AI Analysis</StepLabel>
            </Step>
            <Step>
              <StepLabel>Results & Recommendations</StepLabel>
            </Step>
            <Step>
              <StepLabel>Drug Recommendations</StepLabel>
            </Step>
          </Stepper>
        </Paper>

        {/* Step Content */}
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Select Your Symptoms
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Select all symptoms that apply to you. Be as specific as possible for better analysis.
                  </Typography>

                  {/* Search and Filters */}
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Search symptoms..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          InputProps={{
                            startAdornment: <Search />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>Category</InputLabel>
                          <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Category"
                          >
                            {categories.map(category => (
                              <MenuItem key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>Severity</InputLabel>
                          <Select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            label="Severity"
                          >
                            {severities.map(severity => (
                              <MenuItem key={severity} value={severity}>
                                {severity === 'all' ? 'All Severities' : severity}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Symptoms List */}
                  <List>
                    {filteredSymptoms.map((symptom) => (
                      <ListItem
                        key={symptom.id}
                        button
                        selected={selectedSymptoms.some(s => s.id === symptom.id)}
                        onClick={() => handleSymptomToggle(symptom)}
                        sx={{ mb: 1, borderRadius: 1 }}
                      >
                        <ListItemIcon>
                          <CheckCircle color={selectedSymptoms.some(s => s.id === symptom.id) ? 'primary' : 'disabled'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1">{symptom.name}</Typography>
                              <Chip
                                label={symptom.severity}
                                color={getSeverityColor(symptom.severity)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {symptom.category} • Duration: {symptom.duration}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Selected Symptoms
                  </Typography>
                  {selectedSymptoms.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No symptoms selected
                    </Typography>
                  ) : (
                    <List>
                      {selectedSymptoms.map((symptom) => (
                        <ListItem key={symptom.id} dense>
                          <ListItemIcon>
                            <HealthAndSafety color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={symptom.name}
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Grid container spacing={1} alignItems="center">
                                  <Grid item>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                      <Select
                                        value={symptom.userSeverity || symptom.severity}
                                        onChange={(e) => handleSymptomSeverityChange(symptom.id, e.target.value)}
                                        displayEmpty
                                        sx={{ height: 32 }}
                                      >
                                        <MenuItem value="mild">Mild</MenuItem>
                                        <MenuItem value="moderate">Moderate</MenuItem>
                                        <MenuItem value="severe">Severe</MenuItem>
                                        <MenuItem value="critical">Critical</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item>
                                    <Chip
                                      label={symptom.userSeverity || symptom.severity}
                                      color={getSeverityColor(symptom.userSeverity || symptom.severity)}
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Typography variant="caption" color="text.secondary">
                                      {symptom.userDuration || symptom.duration}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleSymptomToggle(symptom)}
                            color="error"
                          >
                            <Remove />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Provide Symptom Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Help us understand your symptoms better by providing additional details.
              </Typography>

              {selectedSymptoms.map((symptom) => (
                <Accordion
                  key={symptom.id}
                  expanded={expandedSymptom === symptom.id}
                  onChange={() => setExpandedSymptom(expandedSymptom === symptom.id ? null : symptom.id)}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">{symptom.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Severity Level</InputLabel>
                          <Select
                            value={symptomDetails[symptom.id]?.severity || symptom.severity}
                            onChange={(e) => handleSymptomDetailChange(symptom.id, 'severity', e.target.value)}
                            label="Severity Level"
                          >
                            <MenuItem value="mild">Mild</MenuItem>
                            <MenuItem value="moderate">Moderate</MenuItem>
                            <MenuItem value="severe">Severe</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Duration"
                          value={symptomDetails[symptom.id]?.duration || symptom.duration}
                          onChange={(e) => handleSymptomDetailChange(symptom.id, 'duration', e.target.value)}
                          placeholder="e.g., 2 days, 3 hours"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Additional Details"
                          value={symptomDetails[symptom.id]?.details || ''}
                          onChange={(e) => handleSymptomDetailChange(symptom.id, 'details', e.target.value)}
                          placeholder="Describe your symptoms in detail..."
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        )}

        {activeStep === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medical History & Insurance
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Provide your medical history to get personalized drug recommendations and insurance coverage.
              </Typography>

              {/* Role Selector for Testing */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        User Role (for testing)
                      </Typography>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          value={userRole}
                          onChange={(e) => setUserRole(e.target.value)}
                        >
                          <FormControlLabel
                            value="patient"
                            control={<Radio />}
                            label="Patient (OTC drugs only)"
                          />
                          <FormControlLabel
                            value="doctor"
                            control={<Radio />}
                            label="Doctor (All drugs)"
                          />
                        </RadioGroup>
                      </FormControl>
                      <Alert severity="info" sx={{ mt: 2 }}>
                        {userRole === 'patient' 
                          ? 'Patients will only see over-the-counter drug recommendations for safety.'
                          : 'Doctors can see both OTC and prescription drug recommendations.'
                        }
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                {/* Insurance Selection */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Insurance Plan
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Insurance</InputLabel>
                        <Select
                          value={selectedInsurance?.id || ''}
                          onChange={(e) => {
                            const insurance = insurancePlans.find(p => p.id === e.target.value);
                            setSelectedInsurance(insurance);
                          }}
                          label="Select Insurance"
                        >
                          <MenuItem value="">No Insurance</MenuItem>
                          {insurancePlans.map(plan => (
                            <MenuItem key={plan.id} value={plan.id}>
                              {plan.name} ({plan.type})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {selectedInsurance && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Deductible: ${selectedInsurance.deductible}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Generic Coverage: {selectedInsurance.coverage.generic}%
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Allergies */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Allergies
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          placeholder="Add allergy (e.g., Penicillin, Sulfa)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              addAllergy(e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {patientAllergies.map(allergy => (
                          <Chip
                            key={allergy}
                            label={allergy}
                            onDelete={() => removeAllergy(allergy)}
                            color="error"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Current Medications */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Current Medications
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          placeholder="Add current medication (e.g., Warfarin, Lisinopril)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              addCurrentMedication(e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {currentMedications.map(medication => (
                          <Chip
                            key={medication}
                            label={medication}
                            onDelete={() => removeCurrentMedication(medication)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeStep === 3 && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI Analysis in Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is analyzing your symptoms and comparing them with medical databases...
              </Typography>
              <LinearProgress sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        )}

        {activeStep === 4 && analysisResult && (
          <Grid container spacing={3}>
            {/* Risk Assessment */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Chip
                      label={riskLevel.toUpperCase()}
                      color={getRiskColor(riskLevel)}
                      size="large"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Confidence: {analysisResult.confidence}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Possible Conditions */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Possible Conditions
                  </Typography>
                  <List>
                    {analysisResult.conditions.map((condition) => (
                      <ListItem key={condition.id}>
                        <ListItemIcon>
                          <Assessment color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1">{condition.name}</Typography>
                              <Typography variant="h6" color="primary">
                                {condition.probability}%
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {condition.description}
                              </Typography>
                              <Chip
                                label={condition.severity}
                                color={getSeverityColor(condition.severity)}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Recommendations */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <Grid container spacing={2}>
                    {analysisResult.recommendations.map((recommendation) => (
                      <Grid item xs={12} md={6} key={recommendation.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{ color: `${recommendation.color}.main` }}>
                                {recommendation.icon}
                              </Box>
                              <Typography variant="subtitle1">{recommendation.title}</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {recommendation.description}
                            </Typography>
                            <Button
                              variant="contained"
                              color={recommendation.color}
                              onClick={() => {
                                setSelectedRecommendation(recommendation);
                                setOpenRecommendationDialog(true);
                              }}
                            >
                              Learn More
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Severity Analysis */}
            {analysisResult.severityAnalysis && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Symptom Severity Analysis
                    </Typography>
                    <Grid container spacing={2}>
                      {analysisResult.severityAnalysis.map((item, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1">{item.symptom}</Typography>
                                <Chip
                                  label={item.severity}
                                  color={getSeverityColor(item.severity)}
                                  size="small"
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Duration: {item.duration}
                              </Typography>
                              <Alert severity={
                                item.severity === 'critical' ? 'error' :
                                item.severity === 'severe' ? 'warning' :
                                item.severity === 'moderate' ? 'info' : 'success'
                              } sx={{ mt: 1 }}>
                                {item.risk}
                              </Alert>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Analysis Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Analysis Summary
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {analysisResult.analysis}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="outlined" startIcon={<Download />}>
                      Download Report
                    </Button>
                    <Button variant="outlined" startIcon={<Share />}>
                      Share Results
                    </Button>
                    <Button variant="outlined" startIcon={<Schedule />}>
                      Schedule Follow-up
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeStep === 5 && drugRecommendations.length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Drug Recommendations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Based on your symptoms, medical history, and insurance coverage, here are personalized drug recommendations.
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Current Role:</strong> {userRole === 'patient' ? 'Patient' : 'Doctor'} - 
                      {userRole === 'patient' 
                        ? ' Showing only over-the-counter (OTC) medications for safety.'
                        : ' Showing both OTC and prescription medications.'
                      }
                    </Typography>
                  </Alert>

                  <Grid container spacing={2}>
                    {drugRecommendations.map((drug) => (
                      <Grid item xs={12} md={6} key={drug.id}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6">{drug.name}</Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip 
                                  label={drug.otc ? 'OTC' : 'Prescription'} 
                                  color={drug.otc ? 'success' : 'primary'}
                                  size="small"
                                />
                                <Chip 
                                  label={`Score: ${drug.matchScore}`} 
                                  color={drug.matchScore > 50 ? 'success' : drug.matchScore > 30 ? 'warning' : 'error'}
                                  size="small"
                                />
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              <strong>Generic:</strong> {drug.generic}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              <strong>Dosage:</strong> {drug.dosage}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              <strong>Category:</strong> {drug.category}
                            </Typography>

                            {drug.insuranceCoverage && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Insurance:</strong> ${drug.insuranceCoverage.copay} copay
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Coverage:</strong> {drug.insuranceCoverage.coverage}%
                                </Typography>
                              </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              {drug.otc && <Chip label="OTC" color="success" size="small" />}
                              {drug.prescription && <Chip label="Prescription" color="warning" size="small" />}
                              {drug.pregnancy !== 'Safe' && <Chip label={`Pregnancy: ${drug.pregnancy}`} color="error" size="small" />}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="contained" 
                                size="small"
                                onClick={() => handleDrugSelect(drug)}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => alert('Scheduling appointment with doctor...')}
                              >
                                Consult Doctor
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Doctor Collaboration */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Doctor-Patient Collaboration
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Patient Notes
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Add your notes or questions for the doctor..."
                        value={patientNotes}
                        onChange={(e) => setPatientNotes(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Doctor Notes
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Doctor's notes will appear here..."
                        value={doctorNotes}
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="contained" startIcon={<Schedule />}>
                      Schedule Appointment
                    </Button>
                    <Button variant="outlined" startIcon={<Share />}>
                      Share with Doctor
                    </Button>
                    <Button variant="outlined" startIcon={<Download />}>
                      Download Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Test Recommendations for Doctors */}
            {userRole === 'doctor' && testRecommendations.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommended Tests for Further Evaluation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Based on the patient's symptoms, these tests are recommended for proper diagnosis and treatment planning.
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {testRecommendations.map((test) => (
                        <Grid item xs={12} md={6} key={test.id}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6">{test.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Chip 
                                    label={test.urgency.toUpperCase()} 
                                    color={test.urgency === 'critical' ? 'error' : 
                                           test.urgency === 'high' ? 'warning' : 
                                           test.urgency === 'medium' ? 'info' : 'success'}
                                    size="small"
                                  />
                                  <Chip 
                                    label={test.category} 
                                    color="primary"
                                    size="small"
                                  />
                                </Box>
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {test.description}
                              </Typography>
                              
                              <Grid container spacing={1} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Cost:</strong> {test.cost}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Coverage:</strong> {test.insuranceCoverage}%
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Turnaround:</strong> {test.turnaroundTime}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Preparation:</strong> {test.preparation}
                                  </Typography>
                                </Grid>
                              </Grid>

                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                <strong>Follow-up:</strong> {test.followUp}
                              </Typography>

                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  color={test.urgency === 'critical' ? 'error' : 'primary'}
                                >
                                  Order Test
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                >
                                  Schedule
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            {activeStep === 0 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={selectedSymptoms.length === 0}
              >
                Next
              </Button>
            )}
            {activeStep === 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
            {activeStep === 2 && (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
            {activeStep === 3 && (
              <Button
                variant="contained"
                onClick={handleAnalyzeSymptoms}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Analyze Symptoms'}
              </Button>
            )}
            {activeStep === 4 && (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                View Drug Recommendations
              </Button>
            )}
            {activeStep === 5 && (
              <Button
                variant="contained"
                onClick={() => setActiveStep(0)}
              >
                Start Over
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Recommendation Dialog */}
      <Dialog open={openRecommendationDialog} onClose={() => setOpenRecommendationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecommendation?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedRecommendation?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This recommendation is based on AI analysis of your symptoms and should not replace professional medical advice.
            Always consult with a healthcare provider for proper diagnosis and treatment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRecommendationDialog(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Schedule Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Drug Details Dialog */}
      <Dialog open={showDrugDialog} onClose={() => setShowDrugDialog(false)} maxWidth="md" fullWidth>
        {selectedDrug && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedDrug.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedDrug.generic} • {selectedDrug.category}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Dosage Information</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Recommended Dosage:</strong> {selectedDrug.dosage}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Maximum Daily:</strong> {selectedDrug.maxDaily}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Indications</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedDrug.symptoms.map(symptom => (
                      <Chip key={symptom} label={symptom} size="small" />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Safety Information</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Contraindications:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {selectedDrug.contraindications.map(contra => (
                      <Chip key={contra} label={contra} color="error" size="small" />
                    ))}
                  </Box>
                  
                  <Typography variant="body2" paragraph>
                    <strong>Side Effects:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {selectedDrug.sideEffects.map(effect => (
                      <Chip key={effect} label={effect} color="warning" size="small" />
                    ))}
                  </Box>
                  
                  <Typography variant="body2" paragraph>
                    <strong>Drug Interactions:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedDrug.interactions.map(interaction => (
                      <Chip key={interaction} label={interaction} color="info" size="small" />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Insurance & Cost</Typography>
                  {selectedDrug.insuranceCoverage ? (
                    <Box>
                      <Typography variant="body2">
                        <strong>Copay:</strong> ${selectedDrug.insuranceCoverage.copay}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Coverage:</strong> {selectedDrug.insuranceCoverage.coverage}%
                      </Typography>
                      {selectedDrug.insuranceCoverage.priorAuth && (
                        <Typography variant="body2" color="warning.main">
                          <strong>Prior Authorization Required</strong>
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No insurance information available
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Alternatives</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedDrug.alternatives.map(alt => (
                      <Chip key={alt} label={alt} variant="outlined" size="small" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDrugDialog(false)}>Close</Button>
              <Button variant="contained" color="primary">
                Schedule Doctor Consultation
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default SymptomCheckerPage; 
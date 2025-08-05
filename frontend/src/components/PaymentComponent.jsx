import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Payment,
  CreditCard,
  CheckCircle,
  Error,
  Schedule,
  LocalHospital,
} from '@mui/icons-material';
import api from '../services/api';

const PaymentComponent = ({ onPaymentSuccess, onPaymentError }) => {
  const [pricing, setPricing] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const response = await api.get('/payments/pricing');
      setPricing(response.data.pricing);
    } catch (error) {
      console.error('Error loading pricing:', error);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      // Create payment intent
      const paymentIntentResponse = await api.post('/payments/create-payment-intent', {
        amount: selectedPlan.price,
        currency: 'usd',
        patient_id: 'demo-patient-123'
      });

      if (paymentIntentResponse.data.success) {
        // In a real app, you would integrate with Stripe Elements here
        // For demo purposes, we'll simulate a successful payment
        setTimeout(() => {
          setPaymentStatus('success');
          setLoading(false);
          setShowPaymentDialog(false);
          if (onPaymentSuccess) {
            onPaymentSuccess({
              plan: selectedPlan,
              payment_intent_id: paymentIntentResponse.data.payment_intent_id
            });
          }
        }, 2000);
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setLoading(false);
      if (onPaymentError) {
        onPaymentError(error);
      }
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment successful! Your consultation is scheduled.';
      case 'error':
        return 'Payment failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        Consultation Payment
      </Typography>

      {paymentStatus && (
        <Alert 
          severity={paymentStatus === 'success' ? 'success' : 'error'}
          icon={getStatusIcon()}
          sx={{ mb: 3 }}
        >
          {getStatusMessage()}
        </Alert>
      )}

      <Grid container spacing={3}>
        {pricing.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => handlePlanSelect(plan)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {plan.name}
                  </Typography>
                  <Chip 
                    label={`$${(plan.price / 100).toFixed(2)}`}
                    color="primary"
                    variant="filled"
                  />
                </Box>
                
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  {plan.duration}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {plan.features.map((feature, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      • {feature}
                    </Typography>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Payment />}
                  disabled={loading}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment Dialog */}
      <Dialog 
        open={showPaymentDialog} 
        onClose={() => setShowPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CreditCard sx={{ mr: 1 }} />
            Payment for {selectedPlan?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total: ${selectedPlan ? (selectedPlan.price / 100).toFixed(2) : '0.00'}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={paymentData.name}
                onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
              />
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            This is a demo payment. No real charges will be made.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePayment}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentComponent; 
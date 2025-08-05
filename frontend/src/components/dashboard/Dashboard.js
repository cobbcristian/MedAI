import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import PatientDashboard from './PatientDashboard';

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Telemedicine Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mb: 1 }}
                  href="/patient-dashboard"
                >
                  Patient Dashboard
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mb: 1 }}
                  href="/payment"
                >
                  Payment
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mb: 1 }}
                  href="/ai-features"
                >
                  AI Features
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mb: 1 }}
                  href="/security"
                >
                  Security Dashboard
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  href="/crisis"
                >
                  Crisis Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Platform Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • AI Backend: Running
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Database: Connected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Security: Active
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Monitoring: Enabled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    );
};

export default Dashboard; 
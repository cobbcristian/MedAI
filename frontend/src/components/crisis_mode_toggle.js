import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import aiService from '../services/aiService';

const CrisisModeToggle = ({ onModeChange }) => {
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [crisisType, setCrisisType] = useState('pandemic'); // 'pandemic', 'disaster', 'refugee'
  const [crisisLevel, setCrisisLevel] = useState('medium'); // 'low', 'medium', 'high', 'critical'
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Crisis mode configurations
  const crisisConfigs = {
    pandemic: {
      title: 'Pandemic Mode',
      description: 'Enhanced screening, vaccine tracking, and outbreak monitoring',
      features: [
        'Enhanced symptom screening',
        'Vaccine certificate generation',
        'Outbreak heatmap tracking',
        'Contact tracing integration',
        'Resource allocation optimization'
      ],
      color: 'bg-red-500',
      icon: '🦠'
    },
    disaster: {
      title: 'Disaster Response Mode',
      description: 'Emergency triage, resource routing, and field clinic support',
      features: [
        'Emergency triage protocols',
        'Resource routing system',
        'Field clinic coordination',
        'Disaster zone mapping',
        'Emergency contact networks'
      ],
      color: 'bg-orange-500',
      icon: '🌪️'
    },
    refugee: {
      title: 'Refugee Support Mode',
      description: 'Offline-first operations, multi-language support, stateless health IDs',
      features: [
        'Offline-first operations',
        'Multi-language AI translation',
        'QR-code health IDs',
        'NGO partnership dashboard',
        'Low-resource optimization'
      ],
      color: 'bg-blue-500',
      icon: '🏕️'
    }
  };

  useEffect(() => {
    // Load saved crisis mode state from localStorage
    const savedMode = localStorage.getItem('crisisMode');
    const savedType = localStorage.getItem('crisisType');
    const savedLevel = localStorage.getItem('crisisLevel');
    
    if (savedMode) {
      setIsCrisisMode(JSON.parse(savedMode));
      setCrisisType(savedType || 'pandemic');
      setCrisisLevel(savedLevel || 'medium');
    }
  }, []);

  const handleCrisisModeToggle = async () => {
    setIsLoading(true);
    try {
      const newMode = !isCrisisMode;
      setIsCrisisMode(newMode);
      
      // Save to localStorage
      localStorage.setItem('crisisMode', JSON.stringify(newMode));
      localStorage.setItem('crisisType', crisisType);
      localStorage.setItem('crisisLevel', crisisLevel);
      
      // Notify parent component
      if (onModeChange) {
        onModeChange({
          isActive: newMode,
          type: crisisType,
          level: crisisLevel,
          config: crisisConfigs[crisisType]
        });
      }
      
      // Update backend crisis mode status
      try {
        await api.post('/api/crisis-mode', {
          isActive: newMode,
          crisisType,
          crisisLevel,
          userId: user?.id
        });
      } catch (error) {
        console.warn('Backend crisis mode update failed:', error);
        // Continue with local state even if backend fails
      }
      
      // Trigger crisis mode workflows
      if (newMode) {
        await activateCrisisWorkflows();
      } else {
        await deactivateCrisisWorkflows();
      }
      
    } catch (error) {
      console.error('Error toggling crisis mode:', error);
      // Revert state on error
      setIsCrisisMode(!isCrisisMode);
      // Show user-friendly error message
      alert('Failed to update crisis mode. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const activateCrisisWorkflows = async () => {
    try {
      // Activate crisis-specific features
      await api.post('/api/crisis-workflows/activate', {
        crisisType,
        crisisLevel,
        userId: user?.id
      });
      
      // Force offline sync in crisis mode
      await aiService.forceOfflineSync();
      
      // Show crisis mode notification
      if ('serviceWorker' in navigator && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('Crisis Mode Activated', {
            body: `${crisisConfigs[crisisType].title} is now active. Enhanced protocols are in place.`,
            icon: '/icon-192x192.png'
          });
        }
      }
    } catch (error) {
      console.error('Error activating crisis workflows:', error);
    }
  };

  const deactivateCrisisWorkflows = async () => {
    try {
      await api.post('/api/crisis-workflows/deactivate', {
        userId: user?.id
      });
    } catch (error) {
      console.error('Error deactivating crisis workflows:', error);
    }
  };

  const currentConfig = crisisConfigs[crisisType];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{currentConfig.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentConfig.title}
            </h3>
            <p className="text-sm text-gray-600">
              {currentConfig.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Crisis Type Selector */}
          <select
            value={crisisType}
            onChange={(e) => setCrisisType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="pandemic">Pandemic</option>
            <option value="disaster">Disaster Response</option>
            <option value="refugee">Refugee Support</option>
          </select>
          
          {/* Crisis Level Selector */}
          <select
            value={crisisLevel}
            onChange={(e) => setCrisisLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          
          {/* Toggle Switch */}
          <button
            onClick={handleCrisisModeToggle}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isCrisisMode ? currentConfig.color : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isCrisisMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Crisis Mode Status */}
      {isCrisisMode && (
        <div className={`${currentConfig.color} text-white rounded-lg p-4 mb-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Crisis Mode Active</h4>
              <p className="text-sm opacity-90">
                Level: {crisisLevel.toUpperCase()} | Type: {crisisType}
              </p>
            </div>
            <div className="animate-pulse">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Features List */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Active Features:</h4>
        <ul className="space-y-1">
          {currentConfig.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Crisis Mode Indicators */}
      {isCrisisMode && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🔔</span>
            <span className="text-sm text-yellow-800">
              Enhanced protocols are active. All workflows have been updated for crisis response.
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Updating crisis mode...</span>
        </div>
      )}
    </div>
  );
};

export default CrisisModeToggle; 
<template>
  <div class="symptom-heatmap-container">
    <!-- Header with controls -->
    <div class="heatmap-header">
      <div class="header-left">
        <h2 class="text-2xl font-bold text-gray-900">Global Symptom Heatmap</h2>
        <p class="text-gray-600">Real-time outbreak monitoring and early warning system</p>
      </div>
      
      <div class="header-controls">
        <!-- Time Range Selector -->
        <select 
          v-model="selectedTimeRange" 
          @change="updateHeatmapData"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
        
        <!-- Symptom Filter -->
        <select 
          v-model="selectedSymptom" 
          @change="updateHeatmapData"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Symptoms</option>
          <option value="fever">Fever</option>
          <option value="cough">Cough</option>
          <option value="fatigue">Fatigue</option>
          <option value="shortness_of_breath">Shortness of Breath</option>
          <option value="headache">Headache</option>
          <option value="loss_of_taste">Loss of Taste/Smell</option>
          <option value="sore_throat">Sore Throat</option>
          <option value="diarrhea">Diarrhea</option>
        </select>
        
        <!-- Crisis Mode Indicator -->
        <div v-if="crisisMode" class="crisis-indicator">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span class="animate-pulse mr-1">⚠️</span>
            Crisis Mode Active
          </span>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="map-container">
      <div id="symptom-heatmap" class="w-full h-96 rounded-lg border border-gray-200"></div>
    </div>

    <!-- Statistics Panel -->
    <div class="stats-panel">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Total Cases -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">📊</span>
            <h3 class="stat-title">Total Cases</h3>
          </div>
          <div class="stat-value">{{ formatNumber(totalCases) }}</div>
          <div class="stat-change" :class="getChangeClass(caseChange)">
            {{ formatChange(caseChange) }}
          </div>
        </div>

        <!-- Active Outbreaks -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">🔥</span>
            <h3 class="stat-title">Active Outbreaks</h3>
          </div>
          <div class="stat-value">{{ activeOutbreaks }}</div>
          <div class="stat-change" :class="getChangeClass(outbreakChange)">
            {{ formatChange(outbreakChange) }}
          </div>
        </div>

        <!-- Risk Level -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">⚠️</span>
            <h3 class="stat-title">Global Risk Level</h3>
          </div>
          <div class="stat-value" :class="getRiskClass(globalRiskLevel)">
            {{ globalRiskLevel }}
          </div>
          <div class="stat-description">
            {{ getRiskDescription(globalRiskLevel) }}
          </div>
        </div>

        <!-- Response Time -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">⚡</span>
            <h3 class="stat-title">Avg Response Time</h3>
          </div>
          <div class="stat-value">{{ avgResponseTime }}h</div>
          <div class="stat-description">
            Time to outbreak detection
          </div>
        </div>
      </div>
    </div>

    <!-- Outbreak Alerts -->
    <div v-if="outbreakAlerts.length > 0" class="alerts-panel">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">Recent Outbreak Alerts</h3>
      <div class="space-y-2">
        <div 
          v-for="alert in outbreakAlerts" 
          :key="alert.id"
          class="alert-item"
          :class="getAlertClass(alert.severity)"
        >
          <div class="alert-header">
            <span class="alert-icon">{{ getAlertIcon(alert.severity) }}</span>
            <span class="alert-location">{{ alert.location }}</span>
            <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
          </div>
          <div class="alert-description">
            {{ alert.description }}
          </div>
          <div class="alert-metrics">
            <span class="metric">Cases: {{ alert.cases }}</span>
            <span class="metric">Growth: {{ alert.growthRate }}%</span>
            <span class="metric">Risk: {{ alert.riskLevel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-sm text-gray-600">Loading heatmap data...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { api } from '../services/api'

export default {
  name: 'GlobalSymptomMap',
  props: {
    crisisMode: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // Reactive data
    const selectedTimeRange = ref('7d')
    const selectedSymptom = ref('all')
    const isLoading = ref(false)
    const map = ref(null)
    
    // Statistics
    const totalCases = ref(0)
    const caseChange = ref(0)
    const activeOutbreaks = ref(0)
    const outbreakChange = ref(0)
    const globalRiskLevel = ref('Medium')
    const avgResponseTime = ref(4.2)
    
    // Outbreak alerts
    const outbreakAlerts = ref([])
    
    // Heatmap data
    const heatmapData = ref([])
    
    // Initialize map
    const initMap = () => {
      // Initialize Leaflet map
      if (typeof L !== 'undefined') {
        map.value = L.map('symptom-heatmap').setView([20, 0], 2)
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map.value)
        
        // Add heatmap layer
        const heatmapLayer = L.heatLayer([], {
          radius: 25,
          blur: 15,
          maxZoom: 10,
          gradient: {
            0.0: '#00ff00',
            0.2: '#ffff00',
            0.4: '#ff8000',
            0.6: '#ff4000',
            0.8: '#ff0000',
            1.0: '#800000'
          }
        }).addTo(map.value)
        
        // Store reference to heatmap layer
        map.value.heatmapLayer = heatmapLayer
      }
    }
    
    // Update heatmap data
    const updateHeatmapData = async () => {
      isLoading.value = true
      
      try {
        const response = await api.get('/api/symptom-heatmap', {
          params: {
            timeRange: selectedTimeRange.value,
            symptom: selectedSymptom.value,
            crisisMode: props.crisisMode
          }
        })
        
        const data = response.data
        
        // Update statistics
        totalCases.value = data.totalCases
        caseChange.value = data.caseChange
        activeOutbreaks.value = data.activeOutbreaks
        outbreakChange.value = data.outbreakChange
        globalRiskLevel.value = data.globalRiskLevel
        avgResponseTime.value = data.avgResponseTime
        
        // Update outbreak alerts
        outbreakAlerts.value = data.outbreakAlerts
        
        // Update heatmap
        updateHeatmapLayer(data.heatmapData)
        
      } catch (error) {
        console.error('Error loading heatmap data:', error)
        // Load mock data for demonstration
        loadMockData()
      } finally {
        isLoading.value = false
      }
    }
    
    // Update heatmap layer with new data
    const updateHeatmapLayer = (data) => {
      if (map.value && map.value.heatmapLayer) {
        const heatmapPoints = data.map(point => [
          point.lat,
          point.lng,
          point.intensity
        ])
        
        map.value.heatmapLayer.setLatLngs(heatmapPoints)
      }
    }
    
    // Load mock data for demonstration
    const loadMockData = () => {
      // Mock heatmap data
      const mockHeatmapData = [
        { lat: 40.7128, lng: -74.0060, intensity: 0.8 }, // New York
        { lat: 34.0522, lng: -118.2437, intensity: 0.6 }, // Los Angeles
        { lat: 51.5074, lng: -0.1278, intensity: 0.7 }, // London
        { lat: 48.8566, lng: 2.3522, intensity: 0.5 }, // Paris
        { lat: 35.6762, lng: 139.6503, intensity: 0.9 }, // Tokyo
        { lat: 39.9042, lng: 116.4074, intensity: 0.4 }, // Beijing
        { lat: -33.8688, lng: 151.2093, intensity: 0.3 }, // Sydney
        { lat: -23.5505, lng: -46.6333, intensity: 0.6 }, // São Paulo
        { lat: 19.0760, lng: 72.8777, intensity: 0.8 }, // Mumbai
        { lat: 28.6139, lng: 77.2090, intensity: 0.7 } // New Delhi
      ]
      
      updateHeatmapLayer(mockHeatmapData)
      
      // Mock statistics
      totalCases.value = 15420
      caseChange.value = 12.5
      activeOutbreaks.value = 8
      outbreakChange.value = -2
      globalRiskLevel.value = 'High'
      avgResponseTime.value = 3.8
      
      // Mock alerts
      outbreakAlerts.value = [
        {
          id: 1,
          location: 'New York, USA',
          severity: 'high',
          description: 'Rapid increase in respiratory symptoms detected',
          cases: 1247,
          growthRate: 23.5,
          riskLevel: 'High',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 2,
          location: 'Tokyo, Japan',
          severity: 'medium',
          description: 'Elevated fever cases in metropolitan area',
          cases: 892,
          growthRate: 15.2,
          riskLevel: 'Medium',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ]
    }
    
    // Utility functions
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num)
    }
    
    const formatChange = (change) => {
      const sign = change >= 0 ? '+' : ''
      return `${sign}${change.toFixed(1)}%`
    }
    
    const getChangeClass = (change) => {
      return change >= 0 ? 'text-red-600' : 'text-green-600'
    }
    
    const getRiskClass = (risk) => {
      const classes = {
        'Low': 'text-green-600',
        'Medium': 'text-yellow-600',
        'High': 'text-red-600',
        'Critical': 'text-red-800 font-bold'
      }
      return classes[risk] || 'text-gray-600'
    }
    
    const getRiskDescription = (risk) => {
      const descriptions = {
        'Low': 'Minimal outbreak risk',
        'Medium': 'Moderate outbreak risk',
        'High': 'High outbreak risk',
        'Critical': 'Critical outbreak risk'
      }
      return descriptions[risk] || ''
    }
    
    const getAlertClass = (severity) => {
      const classes = {
        'low': 'border-l-4 border-yellow-400 bg-yellow-50',
        'medium': 'border-l-4 border-orange-400 bg-orange-50',
        'high': 'border-l-4 border-red-400 bg-red-50',
        'critical': 'border-l-4 border-red-600 bg-red-100'
      }
      return classes[severity] || classes.medium
    }
    
    const getAlertIcon = (severity) => {
      const icons = {
        'low': '⚠️',
        'medium': '🔥',
        'high': '🚨',
        'critical': '💥'
      }
      return icons[severity] || icons.medium
    }
    
    const formatTime = (timestamp) => {
      const now = new Date()
      const diff = now - timestamp
      const hours = Math.floor(diff / (1000 * 60 * 60))
      
      if (hours < 1) return 'Just now'
      if (hours === 1) return '1 hour ago'
      return `${hours} hours ago`
    }
    
    // Watch for crisis mode changes
    watch(() => props.crisisMode, (newValue) => {
      if (newValue) {
        // Update refresh interval for crisis mode
        updateHeatmapData()
      }
    })
    
    // Lifecycle
    onMounted(() => {
      initMap()
      updateHeatmapData()
      
      // Set up periodic refresh
      const refreshInterval = setInterval(() => {
        if (!isLoading.value) {
          updateHeatmapData()
        }
      }, props.crisisMode ? 30000 : 60000) // More frequent updates in crisis mode
      
      // Cleanup on unmount
      return () => {
        clearInterval(refreshInterval)
        if (map.value) {
          map.value.remove()
        }
      }
    })
    
    return {
      selectedTimeRange,
      selectedSymptom,
      isLoading,
      totalCases,
      caseChange,
      activeOutbreaks,
      outbreakChange,
      globalRiskLevel,
      avgResponseTime,
      outbreakAlerts,
      updateHeatmapData,
      formatNumber,
      formatChange,
      getChangeClass,
      getRiskClass,
      getRiskDescription,
      getAlertClass,
      getAlertIcon,
      formatTime
    }
  }
}
</script>

<style scoped>
.symptom-heatmap-container {
  @apply bg-white rounded-lg shadow-lg p-6;
}

.heatmap-header {
  @apply flex flex-col md:flex-row md:items-center md:justify-between mb-6;
}

.header-left {
  @apply mb-4 md:mb-0;
}

.header-controls {
  @apply flex flex-wrap items-center space-x-3;
}

.crisis-indicator {
  @apply ml-4;
}

.map-container {
  @apply mb-6;
}

.stats-panel {
  @apply mb-6;
}

.stat-card {
  @apply bg-gray-50 rounded-lg p-4;
}

.stat-header {
  @apply flex items-center mb-2;
}

.stat-icon {
  @apply text-lg mr-2;
}

.stat-title {
  @apply text-sm font-medium text-gray-600;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900;
}

.stat-change {
  @apply text-sm font-medium;
}

.stat-description {
  @apply text-xs text-gray-500 mt-1;
}

.alerts-panel {
  @apply mt-6;
}

.alert-item {
  @apply p-3 rounded-lg;
}

.alert-header {
  @apply flex items-center justify-between mb-2;
}

.alert-icon {
  @apply text-lg mr-2;
}

.alert-location {
  @apply font-medium text-gray-900;
}

.alert-time {
  @apply text-xs text-gray-500;
}

.alert-description {
  @apply text-sm text-gray-700 mb-2;
}

.alert-metrics {
  @apply flex space-x-4 text-xs text-gray-600;
}

.metric {
  @apply font-medium;
}

.loading-overlay {
  @apply absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center;
}

.loading-content {
  @apply flex items-center;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-controls {
    @apply flex-col items-start space-y-2 space-x-0;
  }
  
  .crisis-indicator {
    @apply ml-0;
  }
  
  .stats-panel .grid {
    @apply grid-cols-2;
  }
}
</style> 
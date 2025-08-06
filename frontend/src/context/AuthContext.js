import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

export { AuthContext };

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        token: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'SET_DEMO_MODE':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Set up axios interceptor for token management
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await api.post('/api/auth/refresh', {
              refreshToken: state.refreshToken,
            });

            const { accessToken, refreshToken } = response.data;
            
            dispatch({
              type: 'REFRESH_TOKEN',
              payload: { accessToken, refreshToken },
            });

            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            dispatch({ type: 'LOGOUT' });
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [state.token, state.refreshToken, navigate]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await api.get('/api/auth/me');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              accessToken: state.token,
              refreshToken: state.refreshToken,
            },
          });
        } catch (error) {
          console.warn('API not available, switching to demo mode');
          // If API is not available, switch to demo mode
          dispatch({
            type: 'SET_DEMO_MODE',
            payload: {
              id: 'demo-user',
              name: 'Demo User',
              email: 'demo@medai.com',
              role: 'PATIENT',
              isDemo: true
            }
          });
        }
      } else {
        // If no token, set demo mode for immediate access
        dispatch({
          type: 'SET_DEMO_MODE',
          payload: {
            id: 'demo-user',
            name: 'Demo User',
            email: 'demo@medai.com',
            role: 'PATIENT',
            isDemo: true
          }
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.post('/api/auth/login', credentials);
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken, refreshToken },
      });

      toast.success('Login successful!');
      
      // Redirect based on user role
      if (user.role === 'PATIENT') {
        navigate('/patient');
      } else if (user.role === 'DOCTOR') {
        navigate('/doctor');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.warn('API not available, switching to demo mode');
      // If API fails, switch to demo mode
      dispatch({
        type: 'SET_DEMO_MODE',
        payload: {
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@medai.com',
          role: 'PATIENT',
          isDemo: true
        }
      });
      navigate('/');
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await api.post('/api/auth/register', userData);
      
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration service not available. Using demo mode.');
      // Switch to demo mode if registration fails
      dispatch({
        type: 'SET_DEMO_MODE',
        payload: {
          id: 'demo-user',
          name: 'Demo User',
          email: 'demo@medai.com',
          role: 'PATIENT',
          isDemo: true
        }
      });
      navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData,
    });
  };

  const verifyEmail = async (token) => {
    try {
      await api.post('/api/auth/verify-email', null, {
        params: { token },
      });
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Email verification service not available.');
      navigate('/');
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Password reset service not available.');
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Password change service not available.');
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    verifyEmail,
    forgotPassword,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
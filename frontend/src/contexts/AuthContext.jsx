import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
    LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
        case AUTH_ACTIONS.REGISTER_START:
            return {
                ...state,
                loading: true,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.REGISTER_SUCCESS:
        case AUTH_ACTIONS.LOAD_USER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.REGISTER_FAILURE:
        case AUTH_ACTIONS.LOAD_USER_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (token && user) {
                try {
                    // Verify token with API
                    const response = await authAPI.getProfile();
                    if (response.success) {
                        dispatch({
                            type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
                            payload: {
                                user: response.data.user,
                                token: token
                            }
                        });
                    } else {
                        // Token invalid, clear localStorage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        dispatch({
                            type: AUTH_ACTIONS.LOAD_USER_FAILURE,
                            payload: 'Session expired'
                        });
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    dispatch({
                        type: AUTH_ACTIONS.LOAD_USER_FAILURE,
                        payload: 'Session expired'
                    });
                }
            } else {
                dispatch({
                    type: AUTH_ACTIONS.LOAD_USER_FAILURE,
                    payload: null
                });
            }
        };

        loadUser();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });
            
            const response = await authAPI.login(credentials);
            
            dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                    user: response.data.user,
                    token: response.data.token
                }
            });

            return response;
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.REGISTER_START });
            
            const response = await authAPI.register(userData);
            
            dispatch({
                type: AUTH_ACTIONS.REGISTER_SUCCESS,
                payload: {
                    user: response.data.user,
                    token: response.data.token
                }
            });

            return response;
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.REGISTER_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        authAPI.logout();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            const response = await authAPI.updateProfile(userData);
            
            if (response.success) {
                dispatch({
                    type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
                    payload: {
                        user: response.data.user,
                        token: state.token
                    }
                });
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    // Check user role
    const isSuperAdmin = () => {
        return state.user?.role === 'super_admin';
    };

    const isShopOwner = () => {
        return state.user?.role === 'shop_owner';
    };

    const isUser = () => {
        return state.user?.role === 'user';
    };

    const hasRole = (role) => {
        return state.user?.role === role;
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        clearError,
        updateProfile,
        isSuperAdmin,
        isShopOwner,
        isUser,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;

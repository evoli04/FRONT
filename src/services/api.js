import apiClient from './apiClient';

// ——— Auth ———
export const login = (credentials) =>
  apiClient.post('/api/auth/login', credentials).then(res => res.data);

export const register = (data) =>
  apiClient.post('/api/auth/signup', data).then(res => res.data);

/*
export const forgotPassword = (email) => 
  apiClient.post('/api/auth/forgot-password', { email })
    .then(res => res.data);


export const resetPassword = (data) => 
  apiClient.post('/api/auth/reset-password', data)
    .then(res => res.data);
    */

export const forgotPassword = (email) =>
  apiClient.post('/api/auth/forgot-password', { email })
    .then(res => res.data)
    .catch(error => {
      console.error('Forgot password error:', error.response?.data);
      throw new Error(error.response?.data?.message ||
        'Şifre sıfırlama isteği gönderilemedi');
    });

export const resetPassword = (data) =>
  apiClient.post('/api/auth/reset-password', data)
    .then(res => res.data)
    .catch(error => {
      console.error('Reset password error:', error.response?.data);
      throw new Error(error.response?.data?.message ||
        'Şifre güncelleme başarısız oldu');
    });


export const logout = () =>
  apiClient.post('/api/auth/logout').then(res => res.data);

// ——— Google Auth ———
export const googleAuth = (token) =>
  apiClient.post('/api/auth/google', { token }).then(res => res.data);

export const testGoogleAuth = () =>
  apiClient.get('/api/auth/google/test').then(res => res.data);

// ——— Admin ———
export const getAdminDashboard = () =>
  apiClient.get('/api/admin/dashboard').then(res => res.data);

export const getAdminWorkspaces = () =>
  apiClient.get('/api/admin/workspaces').then(res => res.data);

export const getAdminWorkspacesCount = () =>
  apiClient.get('/api/admin/workspaces/count').then(res => res.data);

export const getAdminUsersActiveCount = () =>
  apiClient.get('/api/admin/users/active/count').then(res => res.data);

// ——— Workspaces ———
export const getWorkspaces = () =>
  apiClient.get('/api/workspaces').then(res => res.data);

export const getWorkspacesAsMember = () =>
  apiClient.get('/api/workspaces/member').then(res => res.data);

// ——— Boards ———
export const getBoards = () =>
  apiClient.get('/api/boards').then(res => res.data);


// frontend/src/services/authService.ts

const API_BASE_URL = '/api/auth';

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    // Attach backend-specific error properties if available
    Object.assign(error, data);
    throw error;
  }
  return data;
};

export const verifyEmailToken = async (token: string) => {
  console.log("Verifying email token:", token);
  const response = await fetch(`${API_BASE_URL}/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  return handleResponse(response);
};

export const requestPasswordReset = async (email: string) => {
  console.log("Requesting password reset for:", email);
  const response = await fetch(`${API_BASE_URL}/request-password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

export const requestResendVerificationEmail = async (email: string) => {
  console.log("Requesting resend verification email for:", email);
  const response = await fetch(`${API_BASE_URL}/resend-verification-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

export const resetPassword = async (token: string, newPassword: string) => {
  console.log("Resetting password with token:", token);
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  });
  return handleResponse(response);
};

export const signupWithEmailPassword = async (email: string, password: string, name: string) => {
  console.log("Signing up with email:", email);
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });
  return handleResponse(response);
};

export const loginWithEmailPassword = async (email: string, password: string) => {
  console.log("Logging in with email:", email);
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  console.log("Changing password for user:", userId);
  const response = await fetch(`${API_BASE_URL}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, currentPassword, newPassword }),
  });
  return handleResponse(response);
};

export const deleteAccount = async (userId: string, password?: string) => {
  console.log("Deleting account for user:", userId);
  const response = await fetch(`${API_BASE_URL}/delete-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });
  return handleResponse(response);
};

export const signInWithGoogleIdToken = async (idToken: string) => {
  console.log("Signing in with Google ID token");
  const response = await fetch(`${API_BASE_URL}/google-signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });
  return handleResponse(response);
};

export const logout = async () => {
  console.log("Logging out");
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
  });
  return handleResponse(response);
};
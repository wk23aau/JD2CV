// frontend/src/services/geminiService.ts

import { User } from '../types';

const API_BASE_URL = '/api/ai'; // Assuming an AI API endpoint

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    Object.assign(error, data);
    throw error;
  }
  return data;
};

export const generateCVContent = async (jobInfo: string, userProfile: User | null) => {
  console.log("Generating CV content with job info:", jobInfo, "and user profile:", userProfile);
  const response = await fetch(`${API_BASE_URL}/generate-cv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobInfo, userProfile }),
  });
  return handleResponse(response);
};
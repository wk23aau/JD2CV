

import type { User } from '../types';

export const generateCVContent = async (jobInfo: string, user?: User | null): Promise<string> => {
  try {
    const response = await fetch('/api/cv/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobInfo, userProfile: user }), // Pass the full user profile
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw an error with the message from the backend for the UI to display
      throw new Error(data.message || `Error: ${response.status}`);
    }

    return data.cvContent;
  } catch (error) {
    console.error('Error generating CV content:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred during CV generation.');
  }
};
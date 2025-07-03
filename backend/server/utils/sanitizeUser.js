export const sanitizeUserForResponse = (user) => {
  if (!user) return null;
  
  const hasLocalPassword = !!user.password; 

  const {
    password,
    email_verification_token,
    email_verification_token_expires_at,
    password_reset_token,
    password_reset_token_expires_at,
    ...safeUser
  } = user;

  const credits_available = typeof safeUser.credits_available === 'number' ? safeUser.credits_available : 0;

  return { 
    ...safeUser, 
    hasLocalPassword,
    credits_available: credits_available,
    credits_last_reset_date: safeUser.credits_last_reset_date
  };
};

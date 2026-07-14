// region imports
// endregion

// validate email
export const isValidEmail = (email?: string): boolean => {
  const targetEmail = email ?? '';
  return targetEmail.includes('@');
};

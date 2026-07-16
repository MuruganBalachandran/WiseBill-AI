// region imports
import { ISpendInput } from '../types/index.js';
// endregion

// region validations
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateTeamSize = (teamSize: any): { valid: boolean; error?: string } => {
  if (!teamSize || typeof teamSize !== 'number' || teamSize < 1) {
    return { valid: false, error: 'Invalid team size. Must be a number >= 1.' };
  }
  return { valid: true };
};

export const validatePrimaryUseCase = (useCase: any): { valid: boolean; error?: string } => {
  if (!useCase || !['coding', 'writing', 'data', 'research', 'mixed'].includes(useCase)) {
    return { valid: false, error: 'Invalid primary use case.' };
  }
  return { valid: true };
};

export const validateSpendInputs = (inputs: any): { valid: boolean; error?: string } => {
  if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
    return { valid: false, error: 'Invalid spend inputs. Must be a non-empty array.' };
  }
  return { valid: true };
};
// endregion

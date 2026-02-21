import { create } from 'zustand';
import type { ValidationResult } from '../types';

interface ValidationState {
  result: ValidationResult | null;
  setResult: (result: ValidationResult | null) => void;
}

const useValidationStore = create<ValidationState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
}));

/**
 * Hook to read the current validation result.
 * Returns null when no validation has been run.
 */
export function useValidationResult(): ValidationResult | null {
  return useValidationStore((s) => s.result);
}

/**
 * Hook to set validation results (called from notebook execution output).
 */
export function useSetValidationResult() {
  return useValidationStore((s) => s.setResult);
}

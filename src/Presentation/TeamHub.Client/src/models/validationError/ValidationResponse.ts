import type { ValidationError } from "./ValidationError";

export interface ValidationResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors: ValidationError[];
}
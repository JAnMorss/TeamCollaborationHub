import { useState } from "react";
import type { ZodIssue } from "zod";

import { registerRequestSchema } from "@/schemas/auth/register.schema";
import { registerApiConnector } from "@/api/auth/register.api";

type ValidationError = {
  propertyName: string;
  errorMessage: string;
};

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setErrors([]);
    setIsLoading(true);

    const parsed = registerRequestSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
    });

    if (!parsed.success) {
      setErrors(
        parsed.error.issues.map((err: ZodIssue) => ({
          propertyName:
            err.path[0]
              ? String(err.path[0]).charAt(0).toUpperCase() +
                String(err.path[0]).slice(1)
              : "Unknown",
          errorMessage: err.message,
        }))
      );
      setIsLoading(false);
      return false;
    }

    try {
      const response = await registerApiConnector.register(parsed.data);

      if ("data" in response) {
        console.info("Register success:", response.data.id);
        return true;
      }

      if ("errors" in response) {
        setErrors(response.errors);
        return false;
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldErrors = (field: string) =>
    errors.filter((e) => e.propertyName === field);

  return {
    register,
    isLoading,
    errors,
    getFieldErrors,
  };
}

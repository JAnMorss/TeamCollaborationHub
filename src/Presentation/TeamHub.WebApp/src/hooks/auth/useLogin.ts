import { useState } from "react";
import type { ZodIssue } from "zod";
import { loginRequestSchema } from "@/schemas/auth/login.schema";
import { loginApiConnector } from "@/api/auth/login.api";
import { useAuth } from "./useAuth";

type ValidationError = {
  propertyName: string;
  errorMessage: string;
};

export function useLogin() {
  const { login: saveAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const login = async (email: string, password: string) => {
    setErrors([]);
    setIsLoading(true);

    const parsed = loginRequestSchema.safeParse({ email, password });

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
      const response = await loginApiConnector.login(parsed.data);

      if ("data" in response) {
        saveAuth(response.data.token);
        return true;
      }

      if ("errors" in response) {
        setErrors(response.errors ?? []);
      }

      return false;
    } catch (err: any) {
      setErrors([
        {
          propertyName: "Form",
          errorMessage:
            err?.response?.data?.detail ||
            "Something went wrong. Please try again.",
        },
      ]);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldErrors = (field: string) =>
    errors.filter((e) => e.propertyName === field);

  return { login, isLoading, errors, getFieldErrors };
}

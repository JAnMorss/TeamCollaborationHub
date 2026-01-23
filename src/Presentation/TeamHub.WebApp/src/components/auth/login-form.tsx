import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import navigate
import { Mail, Github } from "lucide-react";
import type { ZodIssue } from "zod";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  loginRequestSchema,
  loginApiResponseSchema,
} from "@/schemas/auth/login.schema";
import { loginApiConnector } from "@/api/auth/login.api";
import { useAuth } from "@/hooks/auth/useAuth"; // 👈 to save token

type ValidationError = {
  propertyName: string;
  errorMessage: string;
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const { login: saveAuth } = useAuth(); 
  const navigate = useNavigate();     

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      return;
    }

    try {
      const response = await loginApiConnector.login(parsed.data);
      const parsedResponse = loginApiResponseSchema.parse(response);

      if ("data" in parsedResponse) {
        saveAuth(parsedResponse.data.token);
        navigate("/dashboard");
        return;
      }

      if (
        "type" in parsedResponse &&
        parsedResponse.type === "ValidationFailure"
      ) {
        setErrors(parsedResponse.errors);
        return;
      }
    } catch (err: any) {
      setErrors([
        {
          propertyName: "Form",
          errorMessage:
            err?.response?.data?.detail ||
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldErrors = (field: string) =>
    errors.filter((e) => e.propertyName === field);

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-3">
        <Button variant="outline" className="w-full" type="button">
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" type="button">
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </div>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
          OR
        </span>
      </div>

      {getFieldErrors("Form").map((e, i) => (
        <p key={i} className="text-sm text-red-600 text-center">
          {e.errorMessage}
        </p>
      ))}

      <div className="space-y-1">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {getFieldErrors("Email").map((e, i) => (
          <p key={i} className="text-sm text-red-600">
            {e.errorMessage}
          </p>
        ))}
      </div>

      <div className="space-y-1">
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {getFieldErrors("Password").map((e, i) => (
          <p key={i} className="text-sm text-red-600">
            {e.errorMessage}
          </p>
        ))}
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ValidationError } from "../../models/validationError/ValidationError";
import type { ValidationResponse } from "../../models/validationError/ValidationResponse";
import { authApiConnector } from "../../services/api/authApiConnector";

interface LoginDto {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginDto>({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    setIsLoading(true);

    try {
        const requestData = {
        Email: loginData.email,
        Password: loginData.password,
        };

        await authApiConnector.login(requestData);
        navigate("/dashboard");
    } catch (error: any) {
        if (error.response?.status === 400) {
        const data: ValidationResponse = error.response.data;
        setValidationErrors(data.errors);
        } else {
        console.error("Login failed:", error);
        }
    } finally {
        setIsLoading(false);
    }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {validationErrors
                .filter((err) => err.propertyName === "Email")
                .map((err, idx) => (
                    <p key={idx} className="text-error text-sm mt-1">
                        {err.errorMessage}
                    </p>
                ))}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {validationErrors
                .filter((err) => err.propertyName === "Password")
                .map((err, idx) => (
                    <p key={idx} className="text-error text-sm mt-1">
                        {err.errorMessage}
                    </p>
                ))}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

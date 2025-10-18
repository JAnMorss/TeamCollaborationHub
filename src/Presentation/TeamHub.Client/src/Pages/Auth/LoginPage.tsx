import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApiConnector } from "../../services/api/authApiConnector";
import Navbar from "../../components/common/Navbar/Navbar";
import Loader from "../../components/common/Loader/Loader";
import type { ValidationError } from "../../models/validationError/ValidationError";
import type { ValidationResponse } from "../../models/validationError/ValidationResponse";
import type { LoginDto } from "../../models/auth/login/LoginDto";
import LoginForm from "../../components/common/LoginForm/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (loginData: LoginDto) => {
    setValidationErrors([]);  
    setIsLoading(true);  

    try {
      const requestData = {
        email: loginData.email,
        password: loginData.password,
      };

      const response = await authApiConnector.login(requestData);

      const token = response.data?.token;
      if (token) {
        localStorage.setItem("authToken", token);
        navigate("/dashboard");
      } else {
        console.error("No token found in response");
      }
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
    <div className="flex items-center justify-center min-h-screen bg-base-200 bg-gradient-to-b from-blue-100 via-white to-blue-50">
      <Navbar />

      {isLoading ? (
        <Loader />
      ) : (
        <LoginForm
          onSubmit={handleSubmit}
          validationErrors={validationErrors}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

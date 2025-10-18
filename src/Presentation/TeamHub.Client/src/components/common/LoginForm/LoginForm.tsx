import { useState } from "react";
import type { LoginDto } from "../../../models/auth/login/LoginDto";
import type { ValidationError } from "../../../models/validationError/ValidationError";

interface LoginFormProps {
  onSubmit: (data: LoginDto) => void;
  validationErrors: ValidationError[];
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, validationErrors, isLoading }) => {
  const [loginData, setLoginData] = useState<LoginDto>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(loginData);
  };

  return (
    <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl blur opacity-50"></div>
        
        <div className="relative backdrop-blur-xl bg-white/70 rounded-2xl shadow-2xl border border-white/40 p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h2>
            <p className="text-blue-600">Sign in to continue</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={loginData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
              {validationErrors
                .filter((err) => err.propertyName === "Email")
                .map((err, idx) => (
                  <p key={idx} className="text-red-600 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {err.errorMessage}
                  </p>
                ))}
            </div>

            <div>
              <label className="block text-sm font-medium  text-blue-900 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleChange}
                 className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
              {validationErrors
                .filter((err) => err.propertyName === "Password")
                .map((err, idx) => (
                  <p key={idx} className="text-red-600 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {err.errorMessage}
                  </p>
                ))}
            </div>

            <button
              type="button"
              onClick={handleFormSubmit}
              className="w-full py-3 px-4 bg-blue-200 text-purple-600 rounded-xl font-semibold shadow-lg hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition disabled:opacity-50 cursor-pointer flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-900 hover:text-blue-400 transition">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
  );
};

export default LoginForm;

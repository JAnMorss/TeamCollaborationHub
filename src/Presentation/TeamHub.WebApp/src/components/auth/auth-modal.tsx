import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AuthCard from "./auth-card";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({ open, onOpenChange, defaultTab = "signup" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-xl p-0 max-h-[90vh] overflow-y-auto">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <DialogHeader className="px-6 pt-6 sm:px-8 md:px-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl sm:text-2xl font-semibold text-gray-900">TeamHub</span>
            </div>

            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </DialogHeader>

          <TabsContent value="login" className="px-6 pb-6 mt-6 sm:px-8 md:px-10">
            <AuthCard
              title="Welcome back"
              description="Enter your credentials to access your account"
              footer={
                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("signup")}
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign up for free
                  </button>
                </p>
              }
            >
              <LoginForm />
            </AuthCard>
          </TabsContent>

          <TabsContent value="signup" className="px-6 pb-6 mt-6 sm:px-8 md:px-10">
            <AuthCard
              title="Create an account"
              description="Get started with TeamHub in seconds"
              footer={
                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              }
            >
              <SignupForm />
            </AuthCard>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

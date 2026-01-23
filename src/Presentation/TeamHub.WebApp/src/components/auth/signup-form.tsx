import { useState } from "react";
import { Mail, Github } from "lucide-react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

import { useRegister } from "@/hooks/auth/useRegister";

export default function SignupForm() {
  const { register, isLoading, getFieldErrors } = useRegister();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) return;

    await register(firstName, lastName, email, password);
  };

  const renderErrors = (field: string) =>
    getFieldErrors(field).map((e, i) => (
      <p key={i} className="text-xs text-red-500">
        {e.errorMessage}
      </p>
    ));

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {renderErrors("FirstName")}
          </div>

          <div className="space-y-2">
            <Label>Last name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {renderErrors("LastName")}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {renderErrors("Email")}
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {renderErrors("Password")}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={(v) => setAcceptedTerms(Boolean(v))}
          />
          <label className="text-sm text-gray-700 leading-tight">
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}

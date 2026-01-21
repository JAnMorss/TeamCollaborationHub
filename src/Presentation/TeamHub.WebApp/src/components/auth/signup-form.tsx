import { Mail, Github } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";


export default function SignupForm() {
  return (
    <form className="space-y-4">
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
            <Label htmlFor="signup-firstname">First name</Label>
            <Input id="signup-firstname" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-lastname">Last name</Label>
            <Input id="signup-lastname" placeholder="Doe" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" placeholder="name@example.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input id="signup-password" type="password" placeholder="••••••••" required />
          <p className="text-xs text-gray-500">Must be at least 8 characters</p>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="terms" required />
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-tight">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
        Create Account
      </Button>
    </form>
  );
}

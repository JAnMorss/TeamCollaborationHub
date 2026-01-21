
import { Mail, Github } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

export default function LoginForm() {
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
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" placeholder="name@example.com" required />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="login-password">Password</Label>
            <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot password?
            </button>
          </div>
          <Input id="login-password" type="password" placeholder="••••••••" required />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
            Remember me for 30 days
          </label>
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
        Sign In
      </Button>
    </form>
  );
}

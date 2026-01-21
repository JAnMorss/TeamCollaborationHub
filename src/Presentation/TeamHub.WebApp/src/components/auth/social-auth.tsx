import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";

export default function SocialAuth() {
  return (
    <div className="space-y-3">
      <Button variant="outline" className="w-full">
        <Mail className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
      <Button variant="outline" className="w-full">
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}

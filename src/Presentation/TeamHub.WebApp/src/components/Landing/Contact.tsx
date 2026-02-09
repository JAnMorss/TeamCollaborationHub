import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function Contact() {
  return (
    <section
      id="contact"
      className="
        px-4 sm:px-6 py-20
        bg-gray-50
        dark:bg-background
      "
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto px-4">
            Have feedback, questions, or want to connect? Feel free to reach out.
          </p>
        </div>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          <div className="bg-white dark:bg-card border border-gray-200 dark:border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-md">
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>

              <Input type="email" placeholder="Email" />
              <Textarea placeholder="Your message..." className="min-h-30" />

              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary/90"
              >
                Send Message
              </Button>
            </form>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-foreground mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600 dark:text-muted-foreground text-sm sm:text-base">
                You can also reach me directly through the following details.
              </p>
            </div>

            {[
              { icon: Mail, label: "Email", value: "moralesjohnanthony2020@gmail.com" },
              { icon: Phone, label: "Phone", value: "0956 687 5198" },
              { icon: MapPin, label: "Location", value: "Dumaguete City, Philippines" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="
                    h-12 w-12 rounded-xl bg-blue-100 text-blue-600
                    dark:bg-muted dark:text-foreground 
                    flex items-center justify-center 
                    transition-all duration-300 hover:-translate-y-1
                  hover:border-blue-300 dark:hover:border-blue-500/50
                    hover:shadow-lg dark:hover:shadow-black/20
                  "
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-foreground">
                    {label}
                  </div>
                  <div className="text-gray-600 dark:text-muted-foreground">
                    {value}
                  </div>
                </div>
              </div>
            ))}

            <div
              className="
                rounded-2xl p-6 border
                bg-linear-to-br from-blue-50 to-purple-50 border-transparent
                dark:bg-none dark:bg-card dark:border-border/60
              "
            >
              <h4 className="font-semibold text-gray-900 dark:text-foreground mb-2">
                About this project
              </h4>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                TeamHub is a personal project built from scratch and actively improved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

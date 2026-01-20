import { Target, Users, Zap, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission Driven",
    description: "We're on a mission to make collaboration effortless for teams everywhere.",
    color: "blue",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Our customers' success is our success. We listen, adapt, and deliver.",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We constantly push boundaries to create the best collaboration tools.",
    color: "blue",
  },
  {
    icon: Heart,
    title: "Team Culture",
    description: "We practice what we preach - collaboration is at the heart of everything we do.",
    color: "blue",
  },
];

const bgColorMap: Record<string, string> = {
  blue: "bg-blue-50",
  purple: "bg-purple-50",
  green: "bg-green-50",
  orange: "bg-orange-50",
};

const textColorMap: Record<string, string> = {
  blue: "text-blue-600",
  purple: "text-purple-600",
  green: "text-green-600",
  orange: "text-orange-600",
};

export default function About() {
  return (
    <section id="about" className="px-4 sm:px-6 py-20 bg-background">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center mb-16 lg:mb-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-6">
              About TeamHub
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-muted-foreground">
              <p>
                TeamHub is a team collaboration platform developed from scratch to explore how teams can manage work, communication, and organization in a single system.
              </p>
              <p>
                The project focuses on reducing friction caused by scattered tools by centralizing task management, discussions, and shared resources.
              </p>
              <p>
                Built using ASP.NET Core and React with TypeScript, TeamHub emphasizes clean architecture and scalability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ["100%", "Original Codebase", "blue"],
              ["CQRS", "Clean Architecture", "purple"],
              ["JWT", "Authentication", "green"],
              ["Ongoing", "Active Development", "orange"],
            ].map(([value, label, color]) => (
              <div
                key={label}
                className="rounded-2xl border border-border dark:border-white/5 bg-card p-6 hover:shadow-lg hover:scale-105 transition-transform"
              >
                <div className={`text-4xl font-bold text-${color}-500 dark:text-${color}-400 mb-2`}>
                  {value}
                </div>
                <div className="text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl text-gray-900 dark:text-foreground mb-4">Our Values</h3>
          <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do and how we build TeamHub.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description, color }, index) => (
            <div
              key={index}
              className="text-center rounded-2xl bg-white dark:bg-card border border-border dark:border-white/5 p-6 hover:shadow-lg hover:scale-105 transition-transform"
            >
              <div
                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-${color}-100 text-${color}-600 dark:bg-primary/10 dark:text-foreground mb-4`}
              >
                <Icon className="h-8 w-8" />
              </div>
              <h4 className="text-xl mb-2 text-gray-900 dark:text-foreground">{title}</h4>
              <p className="text-gray-600 dark:text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import { Target, Users, Zap, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Purpose Built",
    description:
      "TeamHub is built to solve real collaboration problems with thoughtful design.",
  },
  {
    icon: Users,
    title: "User Focused",
    description:
      "Every feature is designed with usability and real team workflows in mind.",
  },
  {
    icon: Zap,
    title: "Continuous Improvement",
    description:
      "TeamHub evolves through iteration, refactoring, and learning from real development challenges.",
  },
  {
    icon: Heart,
    title: "Built with Care",
    description:
      "This project is crafted from scratch with clean architecture and maintainable code.",
  },
];

export default function About() {
  return (
    <section id="about" className="px-6 py-20 bg-background">
      <div className="mx-auto max-w-7xl">

        {/* Intro */}
        <div className="grid gap-12 lg:grid-cols-2 items-center mb-20">
          <div>
            <h2 className="text-4xl font-semibold text-foreground mb-6">
              About TeamHub
            </h2>

            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                TeamHub is a team collaboration platform developed from scratch
                to explore how teams can manage work, communication, and
                organization in a single system.
              </p>
              <p>
                The project focuses on reducing friction caused by scattered
                tools by centralizing task management, discussions, and shared resources.
              </p>
              <p>
                Built using ASP.NET Core and React with TypeScript, TeamHub
                emphasizes clean architecture and scalability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-500 dark:text-blue-400 mb-2">100%</div>
              <div className="text-muted-foreground">Original Codebase</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-purple-500 dark:text-purple-400 mb-2">CQRS</div>
              <div className="text-muted-foreground">Clean Architecture</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-green-500 dark:text-green-400 mb-2">JWT</div>
              <div className="text-muted-foreground">Authentication</div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-orange-500 dark:text-orange-400 mb-2">Ongoing</div>
              <div className="text-muted-foreground">Active Development</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-semibold text-foreground mb-4">
            Core Principles
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These principles guide how TeamHub is designed, developed, and improved.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="text-center rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4">
                  <Icon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-medium text-foreground mb-2">
                  {value.title}
                </h4>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

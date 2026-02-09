import { Target, Users, Zap, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission Driven",
    description: "We're on a mission to make collaboration effortless for teams everywhere.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Our customers' success is our success. We listen, adapt, and deliver.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We constantly push boundaries to create the best collaboration tools.",
  },
  {
    icon: Heart,
    title: "Team Culture",
    description: "We practice what we preach - collaboration is at the heart of everything we do.",
  },
];

export default function About() {
  return (
    <section id="about" className="px-4 sm:px-6 py-20 bg-white dark:bg-background">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-12 lg:grid-cols-2 items-center mb-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-foreground mb-6">
              About TeamHub
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-gray-600 dark:text-muted-foreground">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
            <div className="
                  rounded-2xl p-6 bg-blue-50 dark:bg-card 
                  dark:border dark:border-border 
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-blue-300 dark:hover:border-blue-500/50
                  hover:shadow-lg dark:hover:shadow-black/20
                "
              >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 ">
                100%
              </div>
              <div className="text-gray-700 dark:text-muted-foreground">
                Original Codebase
              </div>
            </div>

            <div className="
                  rounded-2xl p-6 bg-purple-50 dark:bg-card 
                  dark:border dark:border-border 
                  transition-all duration-300 hover:-translate-y-1
                  hover:border-blue-300 dark:hover:border-blue-500/50
                  hover:shadow-lg dark:hover:shadow-black/20
                "
              >
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                CQRS
              </div>
              <div className="text-gray-700 dark:text-muted-foreground">
                Clean Architecture
              </div>
            </div>

            <div className="
                  rounded-2xl p-6 bg-green-50 
                  dark:bg-card dark:border dark:border-border 
                  transition-all duration-300 hover:-translate-y-1
                  hover:border-blue-300 dark:hover:border-blue-500/50
                  hover:shadow-lg dark:hover:shadow-black/20
                "
              >
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                JWT
              </div>
              <div className="text-gray-700 dark:text-muted-foreground">
                Authentication
              </div>
            </div>

            <div className="
                  rounded-2xl p-6 bg-orange-50 
                  dark:bg-card dark:border dark:border-border 
                  transition-all duration-300 hover:-translate-y-1
                  hover:border-blue-300 dark:hover:border-blue-500/50
                  hover:shadow-lg dark:hover:shadow-black/20
                "
              >
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                Ongoing
              </div>
              <div className="text-gray-700 dark:text-muted-foreground">
                Active Development
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-semibold text-gray-900 dark:text-foreground mb-4">
            Our Values
          </h3>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do and how we build TeamHub.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
          {values.map(({ icon: Icon, title, description }, index) => (
            <div key={index} className="text-center">
              <div className="
                  inline-flex h-16 w-16 items-center justify-center 
                  rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 mb-4 
                  transition-all duration-300 hover:-translate-y-1
                  hover:border-blue-300 dark:hover:border-blue-500/50
                  hover:shadow-lg dark:hover:shadow-black/20
                "
              >
                <Icon className="h-8 w-8" />
              </div>

              <h4 className="text-xl mb-2 text-gray-900 dark:text-foreground">
                {title}
              </h4>
              <p className="text-gray-600 dark:text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

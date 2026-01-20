import { Users, MessageSquare, Calendar, FileText, BarChart3, Lock } from "lucide-react";

const features = [
  { icon: Users, title: "Team Management", description: "Organize teams with roles and permissions." },
  { icon: MessageSquare, title: "Real-time Chat", description: "Instant messaging anywhere." },
  { icon: Calendar, title: "Shared Calendar", description: "Meetings and deadlines in one place." },
  { icon: FileText, title: "Document Sharing", description: "Collaborate with version control." },
  { icon: BarChart3, title: "Analytics", description: "Track productivity and progress." },
  { icon: Lock, title: "Security", description: "Enterprise-grade authentication." },
];

export default function Features() {
  return (
    <section id="features" className="px-4 sm:px-6 py-20 bg-background">
      <div className="mx-auto max-w-7xl">

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Everything your team needs
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Powerful features designed to help teams collaborate better.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="
                group p-6 sm:p-8 rounded-2xl bg-card
                border border-border/60 dark:border-white/5
                shadow-sm dark:shadow-md
                transition-all duration-300
                hover:-translate-y-1
                hover:border-blue-300 dark:hover:border-blue-500/50
                hover:shadow-lg dark:hover:shadow-black/20
              "
            >
              <div
                className="
                  mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl
                  bg-blue-100 text-blue-600
                  transition-colors duration-300
                  group-hover:bg-blue-600 group-hover:text-white
                  dark:bg-blue-900/40 dark:text-blue-400
                  dark:group-hover:bg-blue-500 dark:group-hover:text-white
                "
              >
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">
                {title}
              </h3>

              <p className="text-muted-foreground text-sm sm:text-base">
                {description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

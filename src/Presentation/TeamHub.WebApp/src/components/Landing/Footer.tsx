export default function Footer() {
  return (
    <footer className="
      bg-gray-900 text-gray-300
      dark:bg-card dark:text-muted-foreground
      border-t border-gray-800 dark:border-border
      px-4 sm:px-6 py-8 sm:py-12
    ">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="
                h-8 w-8 rounded-lg
                bg-blue-600 dark:bg-primary
                flex items-center justify-center
                text-white dark:text-primary-foreground
                font-bold
              ">
                T
              </div>
              <span className="text-xl font-semibold text-white dark:text-foreground">
                TeamHub
              </span>
            </div>
            <p className="text-sm">
              A collaboration platform built from scratch with clean architecture.
            </p>
          </div>

          <div>
            <h4 className="text-white dark:text-foreground font-medium mb-4">
              Project
            </h4>
            <ul className="space-y-2 text-sm">
              {["About", "Features", "Architecture", "Roadmap"].map((item) => (
                <li
                  key={item}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white dark:text-foreground font-medium mb-4">
              Tech Stack
            </h4>
            <ul className="space-y-2 text-sm">
              <li>ASP.NET Core</li>
              <li>React + TypeScript</li>
              <li>CQRS</li>
              <li>JWT</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white dark:text-foreground font-medium mb-4">
              Developer
            </h4>
            <ul className="space-y-2 text-sm">
              <li>John Anthony Morales</li>
              <li>Computer Engineer</li>
              <li>ASP.NET & React</li>
            </ul>
          </div>

        </div>

        <div className="
          border-t border-gray-800 dark:border-border
          pt-6 text-center text-sm
        ">
          © {new Date().getFullYear()} TeamHub — Built by{" "}
          <span className="text-white dark:text-foreground font-medium">
            John Anthony Morales
          </span>
        </div>

      </div>
    </footer>
  );
}

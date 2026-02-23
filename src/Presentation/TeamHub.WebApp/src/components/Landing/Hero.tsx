import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {};

export default function Hero({}: Props) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-animate", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="
        relative overflow-hidden
        bg-gradient-to-b from-blue-50 to-white
        dark:bg-background dark:bg-none
        py-20 sm:py-32
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          <div className="space-y-8">
            <div className="hero-animate inline-block rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium">
              Team Collaboration Platforms
            </div>

            <h1 className="hero-animate text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl xl:text-7xl">
              Welcome to <span className="text-blue-600 dark:text-blue-400">TeamHub</span>
            </h1>

            <p className="hero-animate text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              TeamHub is a platform developed from scratch to help teams collaborate, manage projects, 
              and communicate effectively in a single system.
            </p>

            <div className="hero-animate flex flex-wrap gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                View Demo
              </Button>
            </div>

            <div className="hero-animate flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-4">
              <div>
                <div className="text-2xl sm:text-3xl font-semibold">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Original Codebase
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <div className="text-2xl sm:text-3xl font-semibold">CQRS</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Clean Architecture
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <div className="text-2xl sm:text-3xl font-semibold">Ongoing</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Development
                </div>
              </div>
            </div>
          </div>

           <div className="relative lg:h-[600px] hidden lg:block group">
            <div className="
              absolute inset-0
              bg-gradient-to-tr from-blue-200 to-purple-200
              dark:from-gray-700 dark:to-gray-900
              rounded-3xl
              transform rotate-3
              transition-transform duration-500
              group-hover:rotate-6
            ">
            </div>
            <img 
              src="https://images.unsplash.com/photo-1735639013995-086e648eaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3Njg3Mzg2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Team collaboration"
              className="
                relative rounded-3xl object-cover w-full h-full
                shadow-2xl
                transition-all duration-500
                group-hover:scale-105
                group-hover:shadow-blue-300/50
              "
            />
          </div>

        </div>
      </div>
    </section>
  );
}
import { Card, CardContent } from "@/components/ui/card"; 

export default function DashboardHeroCard() {
  return (
    <Card className="bg-linear-to-r from-blue-400 to-blue-500 text-white dark:text-black shadow-md">
      <CardContent className="flex items-center space-x-4 p-6">
        <svg
          className="w-12 h-12 text-white " 
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6h13M9 6l-2 3M9 6L7 3m12 16h-6a2 2 0 01-2-2V7h8v10a2 2 0 002 2z"
          />
        </svg>

        <div>
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="mt-1 text-sm text-white/90 dark:text-black/90">
            Here’s what’s happening with your projects today.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

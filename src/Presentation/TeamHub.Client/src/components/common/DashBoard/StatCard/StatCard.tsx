interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

export default function StatCard({ label, value, icon, bgColor }: StatCardProps) {
  return (
    <div className="bg-base-100 p-4 sm:p-6 rounded-xl shadow-sm border border-base-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-muted">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-theme">{value}</p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

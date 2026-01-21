
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  childrenClassName?: string;
};

export default function AuthCard({
  title,
  description,
  children,
  footer,
  className,
  childrenClassName,
}: Props) {
  return (
    <div
      className={clsx(
        "p-6 rounded-xl bg-white dark:bg-card shadow-md flex flex-col gap-6 w-full max-w-md mx-auto",
        className
      )}
    >
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>

      <div className={clsx(childrenClassName, "flex flex-col gap-4")}>{children}</div>

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

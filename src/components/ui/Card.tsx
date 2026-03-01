import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "glass" | "solid";
  hover?: boolean;
}

export function Card({
  children,
  className,
  variant = "solid",
  hover = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variant === "glass"
          ? "glass-card"
          : "bg-white border border-slate-100 shadow-sm",
        hover &&
          "hover:translate-y-[-2px] hover:shadow-xl hover:shadow-slate-200/50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-xl font-bold text-white", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("text-sm text-navy-400", className)}>{children} </p>;
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

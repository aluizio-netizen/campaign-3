import Link from "next/link";
import { ShieldHalf } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
  invert = false,
}: {
  href?: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 font-display", className)}
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg shadow-soft",
          invert ? "bg-white/10 text-white" : "bg-primary text-primary-foreground"
        )}
      >
        <ShieldHalf className="h-5 w-5" />
      </span>
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          invert ? "text-white" : "text-foreground"
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}

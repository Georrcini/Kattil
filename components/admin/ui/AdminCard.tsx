import { CSSProperties, ReactNode } from "react";

// ── AdminCard ────────────────────────────────────────────────────────────────

interface AdminCardProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function AdminCard({ className = "", children, style }: AdminCardProps) {
  return (
    <div
      className={[
        "rounded-3xl border border-[hsl(var(--adm-border)/0.6)] bg-[hsl(var(--adm-card))] text-[hsl(var(--adm-card-foreground))]",
        className,
      ].join(" ")}
      style={{ boxShadow: "var(--adm-shadow-sm)", ...style }}
    >
      {children}
    </div>
  );
}

// ── AdminCardHeader ──────────────────────────────────────────────────────────

interface AdminCardHeaderProps {
  className?: string;
  children?: ReactNode;
}

export function AdminCardHeader({ className = "", children }: AdminCardHeaderProps) {
  return (
    <div className={["p-6 pb-0 space-y-4", className].join(" ")}>
      {children}
    </div>
  );
}

// ── AdminCardContent ─────────────────────────────────────────────────────────

interface AdminCardContentProps {
  className?: string;
  children?: ReactNode;
}

export function AdminCardContent({ className = "", children }: AdminCardContentProps) {
  return (
    <div className={["p-6 pt-0", className].join(" ")}>
      {children}
    </div>
  );
}

// ── AdminCardTitle ───────────────────────────────────────────────────────────

interface AdminCardTitleProps {
  className?: string;
  children?: ReactNode;
}

export function AdminCardTitle({ className = "", children }: AdminCardTitleProps) {
  return (
    <h3
      className={[
        "text-2xl font-bold text-[hsl(var(--adm-card-foreground))]",
        className,
      ].join(" ")}
    >
      {children}
    </h3>
  );
}

// ── AdminCardDescription ─────────────────────────────────────────────────────

interface AdminCardDescriptionProps {
  className?: string;
  children?: ReactNode;
}

export function AdminCardDescription({ className = "", children }: AdminCardDescriptionProps) {
  return (
    <p
      className={[
        "text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--adm-muted-foreground))]",
        className,
      ].join(" ")}
    >
      {children}
    </p>
  );
}

// ── StatRow ──────────────────────────────────────────────────────────────────

interface StatRowProps {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  className?: string;
}

export function StatRow({ label, value, helper, className = "" }: StatRowProps) {
  return (
    <div
      className={[
        "flex items-start justify-between rounded-lg border border-[hsl(var(--adm-border)/0.6)] bg-[hsl(var(--adm-accent)/0.12)] px-3 py-3",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wide text-[hsl(var(--adm-muted-foreground))]">
          {label}
        </span>
        {helper && (
          <span className="text-[11px] text-[hsl(var(--adm-muted-foreground)/0.7)]">
            {helper}
          </span>
        )}
      </div>
      <span className="text-sm font-bold text-[hsl(var(--adm-card-foreground))]">
        {value}
      </span>
    </div>
  );
}

// ── GradientCard ─────────────────────────────────────────────────────────────

interface GradientCardProps {
  className?: string;
  children?: ReactNode;
}

export function GradientCard({ className = "", children }: GradientCardProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border-none shadow-xl",
        className,
      ].join(" ")}
      style={{
        // Deep navy → mid navy → dark sage — matches project primary (#0d1b2e) → secondary-dark (#526442)
        background:
          "linear-gradient(135deg, #0d1b2e 0%, #162840 55%, #3a5535 100%)",
      }}
    >
      {/* Radial shimmer overlay with sage tint */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 15%, rgba(156,175,136,0.22) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(13,27,46,0.6) 0%, transparent 55%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

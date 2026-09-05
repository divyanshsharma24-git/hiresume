// Type declaration shims for packages that don't resolve types correctly
// with moduleResolution: "bundler" in this Next.js version.

declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react';
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
    color?: string;
    strokeWidth?: number | string;
  }
  export type LucideIcon = FC<LucideProps>;

  export const Upload: LucideIcon;
  export const FileText: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const X: LucideIcon;
  export const Download: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Sparkles: LucideIcon;
  export const FileSearch: LucideIcon;
  export const Wand2: LucideIcon;
  export const CheckCheck: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const XCircle: LucideIcon;
}

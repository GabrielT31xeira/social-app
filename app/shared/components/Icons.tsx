import type { SVGProps } from "react";

type IconName =
  | "user"
  | "lock"
  | "mail"
  | "sun"
  | "moon"
  | "languages"
  | "logOut"
  | "plusSquare"
  | "chevronDown"
  | "eye"
  | "messageCircle"
  | "trash"
  | "x"
  | "send"
  | "alertTriangle"
  | "chevronLeft"
  | "chevronRight"
  | "sparkles"
  | "rocket"
  | "shield"
  | "globe";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, className = "h-5 w-5", ...props }: IconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    className,
    "aria-hidden": true,
    ...props,
  };

  switch (name) {
    case "user":
      return <svg {...common}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "lock":
      return <svg {...common}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case "mail":
      return <svg {...common}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" /></svg>;
    case "sun":
      return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
    case "moon":
      return <svg {...common}><path d="M12 3a6 6 0 1 0 9 9 9 9 0 1 1-9-9" /></svg>;
    case "languages":
      return <svg {...common}><path d="M4 5h12" /><path d="M10 5a14 14 0 0 1-4 9" /><path d="M8 9c1.5 2.5 3.5 4.5 6 6" /><path d="M12 20l4-9 4 9" /><path d="M13.5 17h5" /></svg>;
    case "logOut":
      return <svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>;
    case "plusSquare":
      return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>;
    case "chevronDown":
      return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>;
    case "eye":
      return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "messageCircle":
      return <svg {...common}><path d="M7 10h10" /><path d="M7 14h6" /><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 4 4.5-2.5h5A8.5 8.5 0 1 0 4 13" /></svg>;
    case "trash":
      return <svg {...common}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>;
    case "x":
      return <svg {...common}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
    case "send":
      return <svg {...common}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>;
    case "alertTriangle":
      return <svg {...common}><path d="M12 3 2 21h20L12 3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
    case "chevronLeft":
      return <svg {...common}><path d="m15 18-6-6 6-6" /></svg>;
    case "chevronRight":
      return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
    case "sparkles":
      return <svg {...common}><path d="m12 3 1.9 4.8L19 9.7l-4.1 2.7L16.8 17 12 14.3 7.2 17l1.9-4.6L5 9.7l5.1-1.9L12 3Z" /></svg>;
    case "rocket":
      return <svg {...common}><path d="M4.5 16.5c-1.5 1.5-1.5 4.5-1.5 4.5s3 0 4.5-1.5 1.5-4.5 1.5-4.5-3 0-4.5 1.5Z" /><path d="M14 10 9 15" /><path d="M17 7c3-3 3-7 3-7s-4 0-7 3l-5 5 4 4 5-5Z" /><circle cx="15" cy="9" r="1" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>;
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10Z" /></svg>;
    default:
      return null;
  }
}

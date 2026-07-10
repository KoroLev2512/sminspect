import type { SVGProps } from "react";

export type IconName =
  | "overview"
  | "map"
  | "objects"
  | "defects"
  | "inspections"
  | "alerts"
  | "analytics"
  | "reports"
  | "leads"
  | "settings"
  | "logout"
  | "home"
  | "menu"
  | "close"
  | "search"
  | "bell"
  | "check"
  | "plus"
  | "download"
  | "arrowLeft"
  | "road"
  | "bridge"
  | "shield"
  | "clock";

const paths: Record<IconName, string> = {
  overview: "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  map: "M9 20 3 17V4l6 3 6-3 6 3v13l-6-3-6 3zM9 7v13M15 4v13",
  objects: "M3 7l9-4 9 4-9 4-9-4zM3 12l9 4 9-4M3 17l9 4 9-4",
  defects: "M12 3 2 20h20L12 3zM12 10v5M12 18h.01",
  inspections:
    "M4 7h3l2-2h6l2 2h3v12H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  alerts: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  analytics: "M3 3v18h18M8 14v4M13 9v9M18 5v13",
  reports:
    "M14 3H6v18h12V8zM14 3v5h5M9 13h6M9 17h6",
  leads: "M3 5h18v14H3zM3 8l9 6 9-6",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L5 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4L19 13a7 7 0 0 0 .1-1z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  home: "M4 10 12 3l8 7M6 9v11h12V9M10 20v-6h4v6",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6L6 18",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  check: "M20 6 9 17l-5-5",
  plus: "M12 5v14M5 12h14",
  download: "M12 3v12M7 10l5 5 5-5M4 21h16",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  road: "M4 21 8 3h8l4 18M12 6v3M12 12v3M12 18v1",
  bridge: "M3 8v10M21 8v10M3 12h18M6 12v6M18 12v6M3 8c4-3 14-3 18 0",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3zM9 12l2 2 4-4",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}

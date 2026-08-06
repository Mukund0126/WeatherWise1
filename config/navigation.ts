import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  href: string;
  disabled?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, disabled: true },
];

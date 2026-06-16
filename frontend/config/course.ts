import { NavItem } from "@/types";

type CourseConfig = {
  sidebarNavItems: NavItem[];
  mobileNavItems: NavItem[];
};

export const courseConfig: CourseConfig = {
  sidebarNavItems: [
    {
      icon: "home",
      label: "Learn",
      href: "/learn",
    },
    {
      icon: "profile",
      label: "Profile",
      href: "/profile",
    },
  ],
  mobileNavItems: [
    {
      icon: "home",
      label: "Learn",
      href: "/learn",
    },
    {
      icon: "leaderboard",
      label: "Leaderboard",
      href: "/leaderboard",
    },
    {
      icon: "profile",
      label: "Profile",
      href: "/profile",
    },
  ],
};

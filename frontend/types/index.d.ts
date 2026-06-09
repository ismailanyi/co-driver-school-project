import { Href } from "expo-router";

import { Icons } from "@/components/icons";
import { LucideIcon } from "lucide-react-native";

export type SupportedLessonCode =
  | "rs"
  | "th";
  //| "mtb";

export type Languages = {
  [key in SupportedLessonCode]: { name: string; flag: LucideIcon };
};

export type Translations = {
  [key in SupportedLessonCode]: string;
};

export type CommonTranslations = {
  [key: string]: Translations;
};

export type IconName = keyof typeof Icons;

export type NavItem = {
  icon: keyof typeof Icons;
  label: string;
  href: Href;
};

export type SiteConfig = {
  name: string;
  title: string;
  description: string | undefined;
  url: string;
  author: { name: string; username: string; url: string };
  ogImage: string;
  appleTouchIcon: string;
  icon32x32: string;
  icon16x16: string;
  manifest: string;
};

export type Colors = {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  sucess: string;
  sucessForeground: string;
  border: string;
};

export type ThemeColors = {
  light: Colors;
  dark: Colors;
};

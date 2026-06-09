import { SupportedLessonCode } from "@/types";

import { commonTranslations } from "./common";

export function getCommonTranslation(
  name: keyof typeof commonTranslations,
  language: SupportedLessonCode
): string {
  return commonTranslations[name][language];
}

import { Languages, SupportedLessonCode } from "@/types";
import { BookMarked, Road } from 'lucide-react-native';

export const languages = {
  th: {
    name: "Theory",
    flag: BookMarked,
  },
  rs: {
    name: "Road Signs",
    flag: Road,
  },
  /* mtb: {
    name: "Model Town Board",
    flag: "https://www.svgrepo.com/show/405610/flag-for-flag-spain.svg",
  }, */
} satisfies Languages;

export function getLanguage(code: SupportedLessonCode) {
  return languages[code];
}

export const validLanguages: SupportedLessonCode[] = Object.keys(
  languages
).map((key) => key as SupportedLessonCode);

import { Languages, SupportedLanguageCode } from "@/types";
import { BookMarked, Road} from 'lucide-react-native'

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

export function getLanguage(code: SupportedLanguageCode) {
  return languages[code];
}

export const validLanguages: SupportedLanguageCode[] = Object.keys(
  languages
).map((key) => key as SupportedLanguageCode);

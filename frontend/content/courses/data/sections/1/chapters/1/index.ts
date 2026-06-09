import { Chapter } from "@/types/course";

import { lessonOne } from "./lessons/1";

export const chapterOne: Chapter = {
  id: 1,
  title: {
    rs: "Road Signs",
    th: "Theory"
  },
  description: {
    rs: "Learn the road signs",
    th: "Learn the rules of the road"
  },
  lessons: [lessonOne, lessonOne, lessonOne, lessonOne, lessonOne],
};

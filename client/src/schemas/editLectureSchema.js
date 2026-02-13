
import { z } from "zod";

export const editLectureSchema = z.object({
  lectureTitle: z.string().min(3, "Title is too short"),
  lectureVideo: z.any().optional(),
  isFree: z.boolean().optional(),
  
});

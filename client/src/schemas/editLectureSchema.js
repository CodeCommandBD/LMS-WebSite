import { z } from "zod";

export const editLectureSchema = z.object({
  lectureTitle: z.string().min(3, "Title is too short"),
  lectureVideo: z.any().optional(),
  videoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isFree: z.boolean().optional(),
});

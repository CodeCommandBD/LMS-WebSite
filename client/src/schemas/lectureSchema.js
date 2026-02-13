import { z } from "zod";

export const lectureSchema = z.object({
  lectureTitle: z
    .string()
    .min(3, "Lecture title must be at least 3 characters"),
});

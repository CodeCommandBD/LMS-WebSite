import { z } from "zod";

export const courseSchema = z.object({
 
  courseTitle: z.string().min(3, "Title is too short"),
  category: z.string().min(3, "Please select a category"),
});
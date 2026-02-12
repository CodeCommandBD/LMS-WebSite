import { z } from "zod";

export const editCourseSchema = z.object({
  courseTitle: z.string().min(3, "Title is too short"),
  subTitle: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  courseLevel: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or more").optional(),
  courseThumbnail: z.any().optional(),
});

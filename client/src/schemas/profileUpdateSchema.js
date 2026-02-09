import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
  profilePicture: z.any().optional(),
});

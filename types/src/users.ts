import { z } from "zod";

export const UserFields = z.object({
  username: z.string().min(3).max(32),
  name: z.string().min(1).max(32),
  email: z.email(),
});

export const NewUserSchema = UserFields;
export type NewUser = z.infer<typeof NewUserSchema>;

export const UserSchema = UserFields.extend({
  id: z.number().int().positive(),
  restricted: z.boolean(),
});

export const UserUpdateSchema = UserFields.partial();
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

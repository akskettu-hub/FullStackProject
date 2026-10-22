import { z } from "zod";
// NOTE: This file is not allowed to import from anywhenre

export const IdSchema = z.coerce.number().int().positive();

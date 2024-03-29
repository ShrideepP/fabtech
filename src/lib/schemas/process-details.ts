import { z } from "zod";

export const marketingSchema = z.object({
  visiting_date: z.coerce.date().optional(),
  visiting_done_of_site: z.coerce.date().optional(),
  customer_office_visit: z.coerce.date().optional(),
  follow_up_after_quotation: z.coerce.date().optional(),
  advance_payment_date: z.coerce.date().optional(),
  installation: z.coerce.date().optional(),
  finishing_visit: z.coerce.date().optional(),
  quality_check_done_by: z.coerce.string().optional(),
});

export const finalisedMeasurementsSchema = z.object({
  advance_payment_date: z.coerce.date().optional(),
  advance_payment_amount: z.string(),
  installation: z.coerce.date().optional(),
  finishing_visit: z.coerce.date().optional(),
  quality_check_done_by: z.coerce.string().optional(),
});

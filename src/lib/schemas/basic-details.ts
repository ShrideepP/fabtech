import { z } from "zod";

export const basicDetailsSchema = z.object({
  party_name: z.string({ required_error: "Party name is required" }),
  mobile_number: z.coerce.number({
    required_error: "Mobile number is required",
  }),
  address1: z.string({
    required_error: "Address1 is required",
  }),
  address2: z.string({
    required_error: "Address2 is required",
  }),
  status_of_site: z.string({ required_error: "Status of site is required" }),
  legal_billing_name: z.string().optional(),
  party_gst_number: z.string().optional(),
  category: z.string().optional(),
  measurement_taken_by: z.string().optional(),
  gmap: z.string({ required_error: "Google maps location is required" }),
});

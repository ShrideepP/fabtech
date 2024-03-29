import { productMeasurementsSchema } from "../schemas/product-measurements";
import { createClient } from "../supabase/client";
import { TABLE_NAMES } from "../constants";
import { z } from "zod";

const supabase = createClient();

export async function getMeasurements(customerId: string) {
  const response = await supabase
    .from(TABLE_NAMES.productMeasurements)
    .select("*")
    .eq("customer_id", customerId);

  return response;
}

export async function addMeasurement(values: any) {
  const response = await supabase
    .from(TABLE_NAMES.productMeasurements)
    .insert(values)
    .select();

  return response;
}

export async function updateMeasurement(
  measurementId: string,
  values: z.infer<typeof productMeasurementsSchema>
) {
  const response = await supabase
    .from(TABLE_NAMES.productMeasurements)
    .update(values)
    .eq("id", measurementId)
    .select();

  return response;
}

export async function deleteMeasurement(measurementId: string) {
  const response = await supabase
    .from(TABLE_NAMES.productMeasurements)
    .delete()
    .eq("id", measurementId);

  return response;
}

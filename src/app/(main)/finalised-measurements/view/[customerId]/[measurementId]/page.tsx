import { createClient } from "@/lib/supabase/server";
import { TABLE_NAMES } from "@/lib/constants";

import ProductMeasurements from "@/components/forms/product-measurements";
import { Separator } from "@/components/ui/separator";

async function getMeasurementDetails(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_NAMES.productMeasurements)
    .select()
    .match({ id })
    .single();

  if (error) {
    throw new Error(error?.message);
  }

  return data;
}

interface MeasurementDetailsProps {
  params: {
    customerId: string;
    measurementId: string;
  };
}

export default async function MeasurementDetails({
  params,
}: MeasurementDetailsProps) {
  const measurementDetails = await getMeasurementDetails(params.measurementId);
  console.log(measurementDetails);
  return (
    <section className="w-full h-fit px-4 py-6 sm:px-8 md:px-12 lg:px-16 flex flex-col gap-6">
      <h2 className="text-lg sm:text-xl md:text-2xl text-foreground font-bold capitalize">
        Measurement Details
      </h2>
      <Separator />
      <ProductMeasurements
        id={params.customerId}
        mode="read"
        preDefinedValues={measurementDetails}
      />
    </section>
  );
}

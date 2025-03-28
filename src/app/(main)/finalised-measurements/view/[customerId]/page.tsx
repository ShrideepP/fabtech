import { createClient } from "@/lib/supabase/server";
import { TABLE_NAMES } from "@/lib/constants";

import ProcessDetails from "@/components/forms/process-details/finalised-measurements";
import MeasurementsContainer from "@/components/measurements-container";
import BasicDetails from "@/components/forms/basic-details";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import Link from "next/link";

async function getCustomerDetails(customerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_NAMES.finalisedMeasurements)
    .select()
    .eq("id", customerId);

  if (error) {
    throw new Error(error?.message);
  }

  return data[0];
}

interface ViewDetailsProps {
  params: {
    customerId?: string;
  };
}

export default async function ViewDetails({ params }: ViewDetailsProps) {
  const customerDetails = await getCustomerDetails(params.customerId as string);
  return (
    <section className="w-full h-fit px-4 py-6 sm:px-8 md:px-12 lg:px-16 flex flex-col gap-6">
      <h2 className="text-lg sm:text-xl md:text-2xl text-foreground font-bold capitalize">
        {customerDetails?.party_name} - Details
      </h2>
      <Separator />
      <h4 className="text-base sm:text-lg md:text-xl text-foreground font-medium capitalize underline underline-offset-4">
        Basic Details
      </h4>
      <BasicDetails
        id={params?.customerId}
        tableName={TABLE_NAMES.finalisedMeasurements}
        dashboardURL="/finalised-measurements"
        mode="read"
        defaultValues={customerDetails}
      />
      <Separator />
      <Link
        href={`/finalised-measurements/view/${params.customerId}/measurements`}
        className="flex items-center gap-2"
      >
        <h4 className="text-base sm:text-lg md:text-xl text-foreground font-medium capitalize underline underline-offset-4 hover:no-underline">
          Product Measurements
        </h4>
        <Icons.arrowUpRight className="w-4 h-4" />
      </Link>
      <Separator />
      <h4 className="text-base sm:text-lg md:text-xl text-foreground font-medium capitalize underline underline-offset-4">
        Process Details
      </h4>
      <ProcessDetails
        id={params?.customerId}
        mode="read"
        defaultValues={customerDetails}
      />
      <div />
    </section>
  );
}

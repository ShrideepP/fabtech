import { TABLE_NAMES, FLOW_SEARCH_PARAMS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { capitalize } from "@/lib/utils";

import ProcessDetails from "@/components/forms/process-details/finalised-measurements";
import ProductMeasurements from "@/components/forms/product-measurements";
import MeasurementsContainer from "@/components/measurements-container";
import BasicDetails from "@/components/forms/basic-details";
import { Separator } from "@/components/ui/separator";

const { step1, step2, step3 } = FLOW_SEARCH_PARAMS;

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

interface EditDetailsProps {
  params: {
    customerId?: string;
  };
  searchParams: {
    step?: string;
  };
}

export default async function EditDetails({
  params,
  searchParams,
}: EditDetailsProps) {
  const customerDetails = await getCustomerDetails(params.customerId as string);

  let currentStep = searchParams.step || step1;

  if (currentStep !== step2 && currentStep !== step3) {
    currentStep = step1;
  }

  return (
    <section className="w-full h-fit px-4 py-6 sm:px-8 md:px-12 lg:px-16 flex flex-col gap-6">
      <h2 className="text-lg sm:text-xl md:text-2xl text-foreground font-bold capitalize">
        {customerDetails?.party_name} - {capitalize(currentStep)}
      </h2>
      <Separator />
      {currentStep === step1 ? (
        <BasicDetails
          id={params?.customerId}
          tableName={TABLE_NAMES.finalisedMeasurements}
          dashboardURL="/finalised-measurements"
          mode="update"
          defaultValues={customerDetails}
        />
      ) : currentStep === step2 ? (
        <>
          <ProductMeasurements id={params?.customerId} mode="createOrUpdate" />
          <Separator />
          <MeasurementsContainer
            id={params?.customerId}
            mode="createOrUpdate"
          />
        </>
      ) : currentStep === step3 ? (
        <ProcessDetails
          id={params?.customerId}
          mode="update"
          defaultValues={customerDetails}
        />
      ) : (
        <></>
      )}
    </section>
  );
}

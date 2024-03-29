import { TABLE_NAMES, FLOW_SEARCH_PARAMS } from "@/lib/constants";
import { capitalize } from "@/lib/utils";

import ProcessDetails from "@/components/forms/process-details/marketing";
import ProductMeasurements from "@/components/forms/product-measurements";
import MeasurementsContainer from "@/components/measurements-container";
import BasicDetails from "@/components/forms/basic-details";
import { Separator } from "@/components/ui/separator";

const { step1, step2, step3 } = FLOW_SEARCH_PARAMS;

interface AddDetailsProps {
  searchParams: {
    id?: string;
    step?: string;
  };
}

export default function AddDetails({ searchParams }: AddDetailsProps) {
  let currentStep = searchParams.step || step1;

  if ((currentStep !== step2 && currentStep !== step3) || !searchParams.id) {
    currentStep = step1;
  }

  return (
    <section className="w-full h-fit px-4 py-6 sm:px-8 md:px-12 lg:px-16 flex flex-col gap-6">
      <h2 className="text-lg sm:text-xl md:text-2xl text-foreground font-bold capitalize">
        {capitalize(currentStep)}
      </h2>
      <Separator />
      {currentStep === step1 ? (
        <BasicDetails
          id={searchParams?.id}
          tableName={TABLE_NAMES.marketing}
          dashboardURL="/"
          mode="create"
        />
      ) : currentStep === step2 ? (
        <>
          <ProductMeasurements id={searchParams?.id} mode="createOrUpdate" />
          <Separator />
          <MeasurementsContainer id={searchParams?.id} mode="createOrUpdate" />
        </>
      ) : currentStep === step3 ? (
        <ProcessDetails id={searchParams?.id} mode="create" />
      ) : (
        <></>
      )}
    </section>
  );
}

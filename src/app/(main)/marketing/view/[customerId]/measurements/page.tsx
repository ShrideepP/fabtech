import MeasurementsContainer from "@/components/measurements-container";
import { Separator } from "@/components/ui/separator";

interface MeasurementsProps {
  params: {
    customerId?: string;
  };
}

export default function Measurements({ params }: MeasurementsProps) {
  return (
    <section className="w-full h-fit px-4 py-6 sm:px-8 md:px-12 lg:px-16 flex flex-col gap-6">
      <h2 className="text-lg sm:text-xl md:text-2xl text-foreground font-bold capitalize">
        All Measurements
      </h2>
      <Separator />
      <MeasurementsContainer id={params?.customerId} mode="read" />
    </section>
  );
}

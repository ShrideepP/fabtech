import { createClient } from "@/lib/supabase/server";
import { TABLE_NAMES } from "@/lib/constants";

import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";

async function getCustomers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAMES.finalisedMeasurements)
    .select("id, party_name, mobile_number, address1, status_of_site");

  if (error) throw new Error(error?.message);

  return data;
}

export default async function FinalisedMeasurements() {
  const customerDetails = await getCustomers();

  return (
    <section className="w-full h-fit px-4 py-6 sm:px-8 md:px-12 lg:px-16 flex flex-col gap-6">
      <h2 className="text-lg sm:text-xl md:text-2xl text-foreground font-bold capitalize">
        Finalised Measurements
      </h2>
      <Separator />
      <DataTable columns={columns} data={customerDetails} />
    </section>
  );
}

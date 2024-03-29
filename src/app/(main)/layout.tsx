import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { ProductMeasurementsContextProvider } from "@/components/context/product-measurement-context";
import NavigationMenu from "@/components/navigation-menu";
import Sidebar from "@/components/sidebar";

interface DashboardLayoutProps {
  children: JSX.Element;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) redirect("/auth/signin");

  return (
    <div className="w-full h-fit relative z-0 lg:flex">
      <NavigationMenu />
      <Sidebar />
      <div className="lg:flex-1">
        <ProductMeasurementsContextProvider>
          {children}
        </ProductMeasurementsContextProvider>
      </div>
    </div>
  );
}

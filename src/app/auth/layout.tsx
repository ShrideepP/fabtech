import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: JSX.Element;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!error || data?.user) redirect("/");

  return children;
}

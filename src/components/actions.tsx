"use client";

import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TABLE_NAMES } from "@/lib/constants";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import Link from "next/link";

interface ActionsProps {
  id: string;
}

export default function Actions({ id }: ActionsProps) {
  const router = useRouter();

  const pathname = usePathname();

  const TABLE_NAME =
    pathname === "/"
      ? TABLE_NAMES.marketing
      : TABLE_NAMES.finalisedMeasurements;

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
      if (error)
        return toast({ title: error?.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Icons.moreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href={`/${TABLE_NAME.split("_").join("-")}/view/${id}`}>
          <DropdownMenuItem>View Details</DropdownMenuItem>
        </Link>

        <Link href={`/${TABLE_NAME.split("_").join("-")}/edit/${id}`}>
          <DropdownMenuItem>Edit Details</DropdownMenuItem>
        </Link>

        <DropdownMenuItem disabled={isLoading} onClick={handleDelete}>
          {isLoading ? (
            <>
              <Icons.loader className="w-4 h-4 mr-2.5 animate-spin" />
              Loading...
            </>
          ) : (
            "Delete"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

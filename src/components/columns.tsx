"use client";

import { ColumnDef } from "@tanstack/react-table";
import { capitalize } from "@/lib/utils";
import { Badge } from "./ui/badge";
import Actions from "./actions";

export type Column = {
  id: string;
  party_name: string;
  mobile_number: string;
  address1: string;
  status_of_site: string;
};

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "party_name",
    header: "Party name",
    enableHiding: false,
  },
  {
    accessorKey: "mobile_number",
    header: "Mobile number",
    cell: ({ row }) => (
      <a href={`tel:${row.original.mobile_number}`}>
        {row.original.mobile_number}
      </a>
    ),
  },
  {
    accessorKey: "address1",
    header: "Address 1",
  },
  {
    accessorKey: "status_of_site",
    header: "Status of site",
    cell: ({ row }) => <Badge>{capitalize(row.original.status_of_site)}</Badge>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];

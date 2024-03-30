"use client";

import { ProductMeasurementsContext } from "./context/product-measurement-context";
import { ProductMeasurement } from "./context/product-measurement-context";
import { doIdsMatch, checkInputValue } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";

import DeleteMeasurementAlert from "./delete-measurement-alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Icons } from "./icons";

interface MeasurementCardProps {
  mode?: "read" | "createOrUpdate";
  measurement: ProductMeasurement;
}

export default function MeasurementCard({
  mode,
  measurement,
}: MeasurementCardProps) {
  const router = useRouter();

  const pathname = usePathname();

  const context = useContext(ProductMeasurementsContext);

  return (
    <div
      className={`w-full h-fit p-6 md:p-8 flex flex-col gap-6 rounded-md border ${
        doIdsMatch(context?.view?.id, context?.edit?.id, measurement.id)
          ? "bg-muted"
          : "bg-background"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <Label htmlFor="design_selection">Design selection</Label>
          <Input
            readOnly
            id="design_selection"
            value={checkInputValue(measurement?.design_selection)}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="glass">Glass</Label>
          <Input
            readOnly
            id="glass"
            value={checkInputValue(measurement?.glass)}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="lock">Lock</Label>
          <Input
            readOnly
            id="lock"
            value={checkInputValue(measurement?.lock)}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="mosquito_window">Mosquito window</Label>
          <Input
            readOnly
            id="mosquito_window"
            value={checkInputValue(measurement?.mosquito_window)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {mode === "read" ? (
          <Button
            type="button"
            onClick={() => router.push(`${pathname}/${measurement.id}`)}
          >
            View Details
          </Button>
        ) : (
          <>
            <Button
              type="button"
              onClick={() => context?.handleView(measurement)}
            >
              {context?.view ? "Cancel" : "View Details"}
            </Button>
            <div className="flex items-center gap-2.5">
              <Button
                size="icon"
                type="button"
                variant="outline"
                onClick={() => context?.handleEdit(measurement)}
              >
                {context?.edit ? (
                  <Icons.close className="w-4 h-4" />
                ) : (
                  <Icons.pencil className="w-4 h-4" />
                )}
              </Button>

              <DeleteMeasurementAlert measurementId={measurement.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

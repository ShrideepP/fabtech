"use client";

import { ProductMeasurementsContext } from "./context/product-measurement-context";
import { ProductMeasurement } from "./context/product-measurement-context";
import { doIdsMatch, checkInputValue } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";

import DeleteMeasurementAlert from "./delete-measurement-alert";
import DimensionBox from "./dimension-box";
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
      className={`w-full h-fit p-6 md:p-8 grid grid-cols-1 gap-6 md:grid-cols-2 gap-4 rounded-md border ${
        doIdsMatch(context?.view?.id, context?.edit?.id, measurement.id)
          ? "bg-muted"
          : "bg-background"
      }`}
    >
      <div className="flex flex-col gap-6">
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
            <Label htmlFor="design_ref">Design ref</Label>
            <Input
              readOnly
              id="design_ref"
              value={checkInputValue(measurement?.design_ref)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="granite">Granite</Label>
              <Input
                readOnly
                id="granite"
                value={checkInputValue(measurement?.granite)}
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

      <div className="grid place-items-center">
        <div className="flex flex-col items-start gap-8">
          <div className="flex items-center gap-8">
            <DimensionBox />

            <div className="w-fit h-fit flex flex-col gap-4">
              <Input
                readOnly={mode === "read" || context?.view ? true : false}
                placeholder="w1"
                className="w-20"
                value={measurement.w1}
              />

              <Input
                readOnly={mode === "read" || context?.view ? true : false}
                placeholder="w2"
                className="w-20"
                value={measurement.w2}
              />

              <Input
                readOnly={mode === "read" || context?.view ? true : false}
                placeholder="w3"
                className="w-20"
                value={measurement.w3}
              />
            </div>
          </div>

          <div className="w-60 h-fit flex items-center gap-4">
            <Input
              readOnly={mode === "read" || context?.view ? true : false}
              placeholder="h1"
              value={measurement.h1}
            />

            <Input
              readOnly={mode === "read" || context?.view ? true : false}
              placeholder="h2"
              value={measurement.h2}
            />

            <Input
              readOnly={mode === "read" || context?.view ? true : false}
              placeholder="h3"
              value={measurement.h3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

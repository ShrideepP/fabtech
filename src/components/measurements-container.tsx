"use client";

import { getMeasurements } from "@/lib/api/measurements";
import { createClient } from "@/lib/supabase/client";
import { TABLE_NAMES } from "@/lib/constants";
import { useState, useEffect } from "react";
import { toast } from "./ui/use-toast";

import MeasurementCard from "./measurement-card";

interface MeasurementsContainerProps {
  id?: string;
  mode: "read" | "createOrUpdate";
}

export default function MeasurementsContainer({
  id,
  mode,
}: MeasurementsContainerProps) {
  const supabase = createClient();

  const [measurements, setMeasurements] = useState<any[]>([]);

  supabase
    .channel("measurements")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE_NAMES.productMeasurements },
      (payload) => {
        if (payload.eventType === "INSERT") {
          setMeasurements((prevMeasurements) => [
            ...prevMeasurements,
            payload.new,
          ]);
        } else if (payload.eventType === "UPDATE") {
          setMeasurements((prevMeasurements) => {
            return prevMeasurements.map((measurement) => {
              if (measurement.id === payload.old?.id) {
                return { ...measurement, ...payload.new };
              } else return measurement;
            });
          });
        } else if (payload.eventType === "DELETE") {
          setMeasurements((prevMeasurements) =>
            prevMeasurements.filter(
              (measurement) => measurement.id !== payload.old?.id
            )
          );
        }
      }
    )
    .subscribe();

  async function fetchMeasurements() {
    const { data, error } = await getMeasurements(id as string);
    if (error) return toast({ title: error?.message, variant: "destructive" });
    setMeasurements(data);
  }

  useEffect(() => {
    fetchMeasurements();
  }, []);

  return measurements?.length > 0 ? (
    <div className="flex flex-col gap-6">
      {mode === "createOrUpdate" && (
        <h2 className="text-lg sm:text-xl md:text-2xl text-foreground font-bold capitalize">
          All Measurements
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {measurements?.map((measurement) => (
          <MeasurementCard
            mode={mode}
            key={measurement.id}
            measurement={measurement}
          />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}

"use client";

import { productMeasurementsSchema as formSchema } from "@/lib/schemas/product-measurements";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { z } from "zod";

interface MeasurementContextValues {
  measurementToView: z.infer<typeof formSchema> | null;
  setMeasurementToView: Dispatch<
    SetStateAction<z.infer<typeof formSchema> | null>
  >;
  measurementToEdit: z.infer<typeof formSchema> | null;
  setMeasurementToEdit: Dispatch<
    SetStateAction<z.infer<typeof formSchema> | null>
  >;
}

export const MeasurementContext =
  createContext<MeasurementContextValues | null>(null);

interface MeasurementContextProviderProps {
  children: JSX.Element;
}

export function MeasurementContextProvider({
  children,
}: MeasurementContextProviderProps) {
  const [measurementToView, setMeasurementToView] = useState<z.infer<
    typeof formSchema
  > | null>(null);

  const [measurementToEdit, setMeasurementToEdit] = useState<z.infer<
    typeof formSchema
  > | null>(null);

  return (
    <MeasurementContext.Provider
      value={{
        measurementToView,
        setMeasurementToView,
        measurementToEdit,
        setMeasurementToEdit,
      }}
    >
      {children}
    </MeasurementContext.Provider>
  );
}

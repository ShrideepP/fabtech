"use client";

import { productMeasurementsSchema as formSchema } from "@/lib/schemas/product-measurements";
import { createContext, useState } from "react";
import { z } from "zod";

export interface ProductMeasurement extends z.infer<typeof formSchema> {
  id: string;
}

interface ContextValues {
  view: ProductMeasurement | null;
  setView: React.Dispatch<React.SetStateAction<ProductMeasurement | null>>;
  handleView: (values: ProductMeasurement) => void;
  edit: ProductMeasurement | null;
  setEdit: React.Dispatch<React.SetStateAction<ProductMeasurement | null>>;
  handleEdit: (values: ProductMeasurement) => void;
}

export const ProductMeasurementsContext = createContext<ContextValues | null>(
  null
);

export function ProductMeasurementsContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [view, setView] = useState<ProductMeasurement | null>(null);

  const [edit, setEdit] = useState<ProductMeasurement | null>(null);

  function handleView(values: ProductMeasurement) {
    setEdit(null);
    if (view) {
      setView(null);
    } else {
      setView(values);
    }
  }

  function handleEdit(values: ProductMeasurement) {
    setView(null);
    if (edit) {
      setEdit(null);
    } else {
      setEdit(values);
    }
  }

  return (
    <ProductMeasurementsContext.Provider
      value={{ view, setView, handleView, edit, setEdit, handleEdit }}
    >
      {children}
    </ProductMeasurementsContext.Provider>
  );
}

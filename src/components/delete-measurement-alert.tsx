"use client";

import { deleteMeasurement } from "@/lib/api/measurements";
import { toast } from "./ui/use-toast";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Icons } from "./icons";

interface DeleteMeasurementAlertProps {
  measurementId: string;
}

export default function DeleteMeasurementAlert({
  measurementId,
}: DeleteMeasurementAlertProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteMeasurement() {
    setIsLoading(true);
    try {
      const { error } = await deleteMeasurement(measurementId);
      if (error) {
        return toast({ title: error?.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Icons.trash className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            measurement from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="button" onClick={handleDeleteMeasurement}>
            {isLoading ? (
              <>
                <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                Continue
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

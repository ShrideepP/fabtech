"use client";

import { useParams, useSearchParams } from "next/navigation";
import { deleteFile } from "@/lib/api/files";
import { useToast } from "./ui/use-toast";
import { getFileURL } from "@/lib/utils";
import { useState } from "react";

import { Button } from "./ui/button";
import { Icons } from "./icons";

interface FileProps {
  file: any;
  path: string;
  refetchFiles: () => void;
}

export default function File({ file, path, refetchFiles }: FileProps) {
  const params = useParams();
  const searchParams = useSearchParams();

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteFile(fileName: string) {
    setIsLoading(true);
    try {
      const { error } = await deleteFile(
        params?.customerId
          ? (params.customerId as string)
          : (searchParams.get("id") as string),
        path,
        fileName
      );

      if (error)
        return toast({ title: error?.message, variant: "destructive" });
    } finally {
      refetchFiles();
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-fit py-1.5 px-2.5 flex items-center justify-between gap-4 rounded-md border bg-muted">
      <p className="text-sm text-foreground font-medium truncate">
        {file.name}
      </p>
      <div className="flex items-center gap-2">
        <a
          target="_blank"
          href={getFileURL(
            params?.customerId
              ? (params.customerId as string)
              : (searchParams.get("id") as string),
            path,
            file.name
          )}
        >
          <Button
            size="icon"
            type="button"
            variant="outline"
            className="w-8 h-8"
          >
            <Icons.externalLink className="w-3.5 h-3.5" />
          </Button>
        </a>
        <Button
          size="icon"
          type="button"
          variant="destructive"
          className="w-8 h-8"
          onClick={() => handleDeleteFile(file.name)}
        >
          {isLoading ? (
            <Icons.loader className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Icons.trash className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

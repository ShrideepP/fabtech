import { capitalize } from "@/lib/utils";

import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import File from "./file";

interface FileUploadProps {
  path: string;
  files: any[];
  isLoading: boolean;
  refetchFiles: () => void;
  mode: "read" | "createOrUpdate";
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUpload({
  path,
  files,
  isLoading,
  refetchFiles,
  mode,
  onChange,
}: FileUploadProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <Label htmlFor={path}>{capitalize(path.slice(1))}</Label>
        <Input
          id={path}
          type="file"
          disabled={mode === "read"}
          onChange={onChange}
        />
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-10 rounded-md" />
      ) : files.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {files?.map((file) => (
            <File
              key={file.id}
              file={file}
              path={path}
              refetchFiles={refetchFiles}
            />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

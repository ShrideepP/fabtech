import { createClient } from "../supabase/client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export async function getFiles(customerId: string, path: string) {
  const response = await supabase.storage.from("files").list(customerId + path);

  return response;
}

export async function uploadFiles(
  customerId: string,
  path: string,
  file: File
) {
  const response = await supabase.storage
    .from("files")
    .upload(customerId + path + "/" + uuidv4(), file);

  return response;
}

export async function deleteFile(
  customerId: string,
  path: string,
  fileName: string
) {
  const response = await supabase.storage
    .from("files")
    .remove([customerId + path + "/" + fileName]);

  return response;
}

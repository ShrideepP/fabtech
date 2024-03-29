import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CDN_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isActive(currenPath: string, pathToMatch: string) {
  return currenPath === pathToMatch;
}

export function capitalize(sentence: string, splitChar: string = "-") {
  return (
    sentence.split(splitChar).join(" ")[0].toUpperCase() +
    sentence.split(splitChar).join(" ").slice(1)
  );
}

export function getFileURL(
  document_id: string,
  path: string,
  fileName: string
) {
  return CDN_URL + "/" + document_id + path + "/" + fileName;
}

export function doIdsMatch(
  viewId: string | undefined,
  editId: string | undefined,
  measurementId: string
) {
  return viewId === measurementId
    ? true
    : editId === measurementId
    ? true
    : false;
}

export function checkInputValue(value: string | undefined) {
  return value
    ? capitalize(value)
    : "This field does not have a defined value.";
}

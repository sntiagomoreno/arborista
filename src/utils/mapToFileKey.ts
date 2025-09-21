import { type GetProjectFilesResponse } from "@figma/rest-api-spec";

export async function mapFileToKey(
  files: GetProjectFilesResponse[],
  fileKey: string
) {
  const entries = files.map((file) => [fileKey, file] as const);
  return Object.fromEntries(entries);
}

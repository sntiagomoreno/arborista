import { FIGMA_API_URL } from "./apiUrl";
import type { GetFileResponse } from "@figma/rest-api-spec";

export async function fetchFile(
  accessToken: string,
  fileKey: string
): Promise<GetFileResponse> {
  const response = await fetch(
    `${FIGMA_API_URL}/files/${fileKey}?depth=1&branch_data=true`,
    {
      headers: {
        "X-Figma-Token": accessToken,
      },
    }
  );

  if (response.status === 429) {
    throw new Error("429");
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  console.log("Fetch file response:", response);
  const data = await response.json();

  // Check if the response is an error payload
  if ("err" in data) {
    throw new Error(
      data.status ? `${data.status}: ${data.err}` : data.err || "Unknown error"
    );
  }

  return data as GetFileResponse;
}

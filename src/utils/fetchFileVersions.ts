import { FIGMA_API_URL } from "./apiUrl";
import type { GetFileVersionsResponse } from "@figma/rest-api-spec";

function filterHumanVersions(
  response: GetFileVersionsResponse
): GetFileVersionsResponse {
  return {
    ...response,
    versions: response.versions.filter(
      (version) => version.user.handle !== "Figma"
    ),
  };
}

export async function fetchFileVersions(
  accessToken: string,
  fileKey: string
): Promise<GetFileVersionsResponse> {
  const response = await fetch(`${FIGMA_API_URL}/files/${fileKey}/versions`, {
    headers: {
      "X-Figma-Token": accessToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file versions: ${response.statusText}`);
  }

  console.log("Fetch file versions response:", response);
  const data = await response.json();

  // Check if the response is an error payload
  if ("err" in data) {
    throw new Error(
      data.status ? `${data.status}: ${data.err}` : data.err || "Unknown error"
    );
  }

  return filterHumanVersions(data as GetFileVersionsResponse);
}

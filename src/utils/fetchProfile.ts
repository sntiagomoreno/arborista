import { FIGMA_API_URL } from "./apiUrl";
import type { GetMeResponse } from "@figma/rest-api-spec";

export async function fetchProfile(
  accessToken: string
): Promise<GetMeResponse> {
  const response = await fetch(`${FIGMA_API_URL}/me`, {
    headers: {
      "X-Figma-Token": accessToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user information: ${response.statusText}`);
  }

  console.log("Fetch user response:", response);
  const data = await response.json();

  // Check if the response is an error payload
  if ("err" in data) {
    throw new Error(
      data.status ? `${data.status}: ${data.err}` : data.err || "Unknown error"
    );
  }

  return data as GetMeResponse;
}

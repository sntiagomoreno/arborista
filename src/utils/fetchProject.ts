import {
  type ErrorResponsePayloadWithErrMessage,
  type GetProjectFilesResponse,
} from "@figma/rest-api-spec";
import { FIGMA_API_URL, FIGMA_API_URL_V2 } from "./apiUrl";

export interface ProjectQueryData {
  name: string;
  files: GetProjectFilesResponse["files"];
}

export async function fetchProject(
  accessToken: string,
  projectId: string,
): Promise<ProjectQueryData> {
  const response = await fetch(
    `${FIGMA_API_URL_V2}/folders/${projectId}/files`,
    {
      headers: {
        "X-Figma-Token": accessToken,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.statusText}`);
  }

  const data = await response.json();

  // Check if the response is an error payload
  if ("err" in data) {
    // Type assertion for error payload
    const errorData = data as ErrorResponsePayloadWithErrMessage;
    throw new Error(
      errorData.status
        ? `${errorData.status}: ${errorData.err}`
        : errorData.err || "Unknown error",
    );
  }

  // Type assertion for successful response
  const projectData = data as GetProjectFilesResponse;

  return {
    name: projectData.name,
    files: projectData.files,
  };
}

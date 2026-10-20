import type { QueryClient } from "@tanstack/react-query";
import type { GetMeResponse } from "@figma/rest-api-spec";
import { figmaQueryKeys } from "@/hooks/useFigmaQueries";
import {
  mockProject,
  mockProjectBrand,
  mockProjectGrowth,
  mockFileData,
  mockVersionData,
} from "./marketingData";

export const DEMO_PROJECT_ID = "mock-project-id";
export const DEMO_PROJECT_BRAND_ID = "mock-project-brand";
export const DEMO_PROJECT_GROWTH_ID = "mock-project-growth";
export const DEMO_TOKEN = "demo-token";
export const DEMO_PROJECTS = [
  JSON.stringify({ id: DEMO_PROJECT_ID, name: "Product Design" }),
  JSON.stringify({ id: DEMO_PROJECT_BRAND_ID, name: "Brand & Identity" }),
  JSON.stringify({ id: DEMO_PROJECT_GROWTH_ID, name: "Growth" }),
];

const mockCurrentUser: GetMeResponse = {
  id: "u0",
  handle: "Jamie Lee",
  img_url: "https://api.dicebear.com/10.x/gaze/svg?seed=jamie-lee&backgroundType=gradientLinear&backgroundColor=ff5d8f,ffb703,43aa8b,4d96ff,b57bff&backgroundSecondaryColor=ffc2d4,fff0a0,a8e6cf,bdd7ff,e2ccff",
  email: "jamie@example.com",
};

export function seedQueryClient(queryClient: QueryClient) {
  queryClient.setQueryData(["profile"], mockCurrentUser);
  queryClient.setQueryData(figmaQueryKeys.project(DEMO_PROJECT_ID), mockProject);
  queryClient.setQueryData(figmaQueryKeys.project(DEMO_PROJECT_BRAND_ID), mockProjectBrand);
  queryClient.setQueryData(figmaQueryKeys.project(DEMO_PROJECT_GROWTH_ID), mockProjectGrowth);

  for (const [fileKey, fileData] of Object.entries(mockFileData)) {
    queryClient.setQueryData(figmaQueryKeys.file(fileKey), fileData);
  }

  for (const [branchKey, versionData] of Object.entries(mockVersionData)) {
    queryClient.setQueryData(
      [...figmaQueryKeys.file(branchKey), "versions"],
      versionData,
    );
  }
}

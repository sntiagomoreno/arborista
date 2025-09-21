import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchProject } from "@/utils/fetchProject";
import { fetchFile } from "@/utils/fetchFile";
import { fetchFileVersions } from "@/utils/fetchFileVersions";
import { fetchProfile } from "@/utils/fetchProfile";

// Simple query keys for cache management
export const figmaQueryKeys = {
  project: (projectId: string) => ["figma", "project", projectId] as const,
  file: (fileKey: string) => ["figma", "file", fileKey] as const,
};

// Hook for fetching project files
export function useProjectQuery(accessToken: string, projectId: string) {
  return useQuery({
    queryKey: figmaQueryKeys.project(projectId),
    queryFn: () => fetchProject(accessToken, projectId),
    enabled: !!(accessToken && projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Hook for fetching single file
export function useFileQuery(accessToken: string, fileKey: string) {
  return useQuery({
    queryKey: figmaQueryKeys.file(fileKey),
    queryFn: () => fetchFile(accessToken, fileKey),
    enabled: !!(accessToken && fileKey),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFileVersionQuery(accessToken: string, fileKey: string) {
  return useQuery({
    queryKey: [...figmaQueryKeys.file(fileKey), "versions"],
    queryFn: () => fetchFileVersions(accessToken, fileKey),
    enabled: !!(accessToken && fileKey),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCurrentUserQuery(accessToken: string) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(accessToken),
    enabled: !!accessToken,
    staleTime: Infinity, // never update unless refetched
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching multiple files in parallel
// export function useFilesQueries(accessToken: string, files: ProjectFile[]) {
//   return useQueries({
//     queries: files.map((file) => ({
//       queryKey: figmaQueryKeys.file(file.key),
//       queryFn: () => fetchFile(accessToken, file.key),
//       enabled: !!(accessToken && file.key),
//       staleTime: 5 * 60 * 1000,
//       gcTime: 10 * 60 * 1000,
//     })),
//   })
// }

// Combined hook that fetches project and then all its files
// export function useProjectWithFiles(accessToken: string, projectId: string) {
//   const projectQuery = useProjectQuery(accessToken, projectId)

//   const fileQueries = useFilesQueries(
//     accessToken,
//     projectQuery.data?.files || []
//   )

//   // Create file details mapping similar to your original pattern
//   const fileDetails = fileQueries.reduce((acc, query, index) => {
//     const file = projectQuery.data?.files?.[index]
//     if (file?.key && query.data) {
//       acc[file.key] = query.data
//     }
//     return acc
//   }, {} as Record<string, GetFileResponse>)

//   return {
//     project: projectQuery,
//     files: fileQueries,
//     fileDetails,
//     isLoading: projectQuery.isLoading || fileQueries.some(q => q.isLoading),
//     error: projectQuery.error || fileQueries.find(q => q.error)?.error,
//   }
// }

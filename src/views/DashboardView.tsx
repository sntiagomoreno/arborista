import { File } from "react-feather";
import { Header } from "../components/Header";
import { useRef, useState } from "react";
import {
  useCurrentUserQuery,
  useProjectQuery,
  useFilesQueries,
} from "@/hooks/useFigmaQueries";
import { FileCard } from "@/components/FileCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useStoredData } from "@/context/StoredDataContext";

// const FIGMA_ACCESS_TOKEN = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;
// const FIGMA_PROJECT_ID = import.meta.env.VITE_FIGMA_PROJECT_ID;

// const FIGMA_ACCESS_TOKEN = "figd_m77RMNyV8lgB7Mm4NohrkycImuNSNUOQswpORwfa";
// const FIGMA_PROJECT_ID = "269936946";

export default function DashboardView() {
  const { storedAccessToken, storedProjects } = useStoredData();
  const [selectedProjectId, setSelectedProjectId] = useState(
    () => JSON.parse(storedProjects[0]).id as string,
  );
  const currentUser = useCurrentUserQuery(storedAccessToken);
  const { data, isLoading, error } = useProjectQuery(
    storedAccessToken,
    selectedProjectId,
  );

  const fileQueries = useFilesQueries(storedAccessToken, data?.files ?? []);

  const allTypesKnown =
    !isLoading && fileQueries.every((q) => q.isSuccess || q.isError);

  type ProjectFile = NonNullable<typeof data>["files"][number];
  const classifiedRef = useRef(
    new Map<string, { figmaFiles: ProjectFile[]; otherFilesCount: number }>(),
  );

  if (allTypesKnown && data) {
    const newFigmaFiles = data.files.filter((_, i) => {
      const q = fileQueries[i];
      return !q.isError && q.data?.editorType === "figma";
    });
    const newOtherFilesCount = data.files.filter((_, i) => {
      const q = fileQueries[i];
      return (
        q.isError || (!!q.data?.editorType && q.data.editorType !== "figma")
      );
    }).length;
    classifiedRef.current.set(selectedProjectId, {
      figmaFiles: newFigmaFiles,
      otherFilesCount: newOtherFilesCount,
    });
  }

  const cached = classifiedRef.current.get(selectedProjectId);
  const isReady = allTypesKnown || !!cached;
  const figmaFiles = cached?.figmaFiles ?? [];
  const otherFilesCount = cached?.otherFilesCount ?? 0;

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Header
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
        loading={isLoading}
        currentUserData={currentUser}
      />
      <div
        style={{
          padding: "4.5rem 1.25rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <SectionHeading>
          <File size={12} />{" "}
          {!isReady ? (
            <span>Loading files...</span>
          ) : (
            <span>{figmaFiles.length} Files</span>
          )}
        </SectionHeading>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {isReady &&
            figmaFiles.map((file) => <FileCard file={file} key={file.key} />)}
          {isReady && otherFilesCount > 0 && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "#9d9d9d",
                textAlign: "center",
                padding: "0.25rem 0 0.5rem",
              }}
            >
              {otherFilesCount} more FigJam or Slides{" "}
              {otherFilesCount === 1 ? "file" : "files"} not shown
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

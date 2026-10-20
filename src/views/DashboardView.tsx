import { File } from "react-feather";
import { Header } from "../components/Header";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCurrentUserQuery,
  useProjectQuery,
  useFilesQueries,
  figmaQueryKeys,
} from "@/hooks/useFigmaQueries";
import { FileCard, FileCardSkeleton } from "@/components/FileCard";
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedProjectId]);

  const queryClient = useQueryClient();
  const currentUser = useCurrentUserQuery(storedAccessToken);
  const { data, isLoading, error, refetch, isFetching } = useProjectQuery(
    storedAccessToken,
    selectedProjectId,
  );

  const fileQueries = useFilesQueries(storedAccessToken, data?.files ?? []);

  const [isStartingRefresh, setIsStartingRefresh] = useState(false);
  const isRefreshing =
    isStartingRefresh || isFetching || fileQueries.some((q) => q.isFetching);

  async function handleRefresh() {
    if (isRefreshing) return;
    setIsStartingRefresh(true);
    try {
      await queryClient.invalidateQueries({ queryKey: figmaQueryKeys.project(selectedProjectId) });
      await queryClient.invalidateQueries({ queryKey: ["figma", "file"] });
      await refetch();
    } finally {
      setIsStartingRefresh(false);
    }
  }

  const allTypesKnown =
    !isLoading && fileQueries.every((q) => q.isSuccess || q.isError);

  type ProjectFile = NonNullable<typeof data>["files"][number];
  const classifiedRef = useRef(
    new Map<string, { figmaFiles: ProjectFile[]; otherFilesCount: number }>(),
  );

  if (allTypesKnown && data) {
    const isRateLimited = (q: (typeof fileQueries)[number]) =>
      q.isError && (q.error as Error)?.message === "429";
    const newFigmaFiles = data.files.filter((_, i) => {
      const q = fileQueries[i];
      return (!q.isError && q.data?.editorType === "figma") || isRateLimited(q);
    });
    const newOtherFilesCount = data.files.filter((_, i) => {
      const q = fileQueries[i];
      return (
        !q.isError && !!q.data?.editorType && q.data.editorType !== "figma"
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
    return (
      <div>
        <Header
          selectedProjectId={selectedProjectId}
          onProjectChange={setSelectedProjectId}
          loading={false}
          currentUserData={currentUser}
        />
        <div
          style={{
            padding: "6rem 1.25rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.875rem", color: "#9d9d9d" }}>
            Failed to load folder. Your token may have expired — open Settings to update or clear it.
          </span>
        </div>
      </div>
    );
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
          padding: "6rem 1.25rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <SectionHeading onRefresh={handleRefresh} isRefreshing={isRefreshing}>
          <File size={12} />{" "}
          <span>{isReady ? `${figmaFiles.length} Files` : "Files"}</span>
        </SectionHeading>
        <motion.div
          key={`${selectedProjectId}-${isReady}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {isReady
            ? figmaFiles.map((file) => (
                <motion.div
                  key={file.key}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.22, ease: "easeOut" },
                    },
                  }}
                >
                  <FileCard file={file} />
                </motion.div>
              ))
            : [0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.22, ease: "easeOut" },
                    },
                  }}
                >
                  <FileCardSkeleton />
                </motion.div>
              ))}
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
        </motion.div>
      </div>
    </div>
  );
}

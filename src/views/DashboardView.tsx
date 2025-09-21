import { File } from "react-feather";
import { Header } from "../components/Header";
import { Field as BaseField } from "@base-ui-components/react";
import { useEffect, useState } from "react";
import { fetchProject } from "../utils/fetchProject";
import { useCurrentUserQuery, useProjectQuery } from "@/hooks/useFigmaQueries";
import { FileCard } from "@/components/FileCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useStoredData } from "@/context/StoredDataContext";

// const FIGMA_ACCESS_TOKEN = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;
// const FIGMA_PROJECT_ID = import.meta.env.VITE_FIGMA_PROJECT_ID;

const FIGMA_ACCESS_TOKEN = "figd_m77RMNyV8lgB7Mm4NohrkycImuNSNUOQswpORwfa";
const FIGMA_PROJECT_ID = "269936946";

export default function DashboardView() {
  const { storedAccessToken, storedProjectIds } = useStoredData();
  const currentUser = useCurrentUserQuery(storedAccessToken);
  const { data, isLoading, error } = useProjectQuery(
    storedAccessToken,
    storedProjectIds[0]
  );

  console.log(FIGMA_ACCESS_TOKEN, FIGMA_PROJECT_ID);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Header
        name={data?.name ?? ""}
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
          {isLoading ? (
            <span>Loading files...</span>
          ) : (
            <span>{data?.files.length} Files </span>
          )}
        </SectionHeading>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {data?.files.map((file) => (
            <FileCard file={file} key={file.key} />
          ))}
        </div>
      </div>
    </div>
  );
}

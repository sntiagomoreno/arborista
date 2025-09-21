import { useCurrentUserQuery } from "@/hooks/useFigmaQueries";
import { GetMeResponse } from "@figma/rest-api-spec";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

interface FigmaDataContextType {
  currentUser: UseQueryResult<GetMeResponse, Error>;
  accessToken: string;
  setAccessToken: (token: string) => void;
}

const FigmaDataContext = createContext<FigmaDataContextType | undefined>(
  undefined
);

export function FigmaDataProvider({
  children,
}: {
  children: React.ReactNode;
  //   value: FigmaDataContextType;
}) {
  const [accessToken, setAccessToken] = useState<string>(
    "figd_m77RMNyV8lgB7Mm4NohrkycImuNSNUOQswpORwfa"
  );
  const currentUser = useCurrentUserQuery(accessToken);

  return (
    <FigmaDataContext.Provider
      value={{ currentUser, accessToken, setAccessToken }}
    >
      {children}
    </FigmaDataContext.Provider>
  );
}

export function useFigmaData() {
  const context = useContext(FigmaDataContext);
  if (context === undefined) {
    throw new Error("useFigmaData must be used within a FigmaDataProvider");
  }
  return context;
}

export default FigmaDataContext;

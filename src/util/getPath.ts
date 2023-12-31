import { getEnv } from "./getEnv";

export const getAssetPath = (s: string): string => {
  const basePath = getEnv("basePath") || "";
  return `${basePath}/${s}`;
};

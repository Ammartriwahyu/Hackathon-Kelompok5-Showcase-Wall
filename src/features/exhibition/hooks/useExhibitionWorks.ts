"use client";

import { useQuery } from "@tanstack/react-query";
import { getExhibitionWorks } from "../services/exhibition.service";

export function useExhibitionWorks() {
  return useQuery({
    queryKey: ["works", "exhibition"],
    queryFn: getExhibitionWorks,
  });
}

"use client";
import { usePreloader } from "@/app/contexts/preloader-context";
import Loading from "./loading";

export default function GlobalPreloader() {
  const { isLoading } = usePreloader();

  if (!isLoading) {
    return null;
  }

  return <Loading />;
}

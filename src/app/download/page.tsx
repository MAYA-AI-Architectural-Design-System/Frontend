"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import {
  ImageIcon,
  Video,
  FileText,
  Package,
  Copy,
  Loader2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import UserHeader from "@/components/UserHeader";

type OutputFormat = {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
};

function useProjectId(): string {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    let pid = "";
    pid = searchParams.get("projectId") || "";
    if (!pid) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts[0] === "download" && parts[1] && parts[1] !== "page") {
        pid = parts[1];
      }
      if (parts[0] === "download" && parts[1] === "project" && parts[2]) {
        pid = parts[2];
      }
    }
    if (
      !pid &&
      typeof window !== "undefined" &&
      (window as any).__PROJECT_ID__
    ) {
      pid = (window as any).__PROJECT_ID__;
    }
    setProjectId(pid);
  }, [searchParams, pathname]);

  return projectId;
}

export default function OutputFormatSelector() {
  const { t } = useTranslation("common");
  const [selectedFormat, setSelectedFormat] = useState<string>("image");
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const projectId = useProjectId();

  const outputFormats: OutputFormat[] = [
    {
      id: "image",
      icon: ImageIcon,
      title: t("image_output"),
      description: t("download_as_png_jpg"),
    },
    {
      id: "video",
      icon: Video,
      title: t("video_output"),
      description: t("download_as_mp4"),
    },
    {
      id: "documentation",
      icon: FileText,
      title: t("documentation"),
      description: t("download_as_pdf"),
    },
    {
      id: "complete-package",
      icon: Package,
      title: t("all_in_one"),
      description: t("all_formats_included_zip"),
    },
  ];

  const handleCopyLink = () => {
    if (downloadLink) {
      navigator.clipboard.writeText(downloadLink);
      alert(t("link_copied_to_clipboard"));
    }
  };

  // Image download (calls your Nest backend)
  const handleGenerateImage = async () => {
    setError(null);
    setShowDownloadLink(false);
    setDownloadLink("");
    if (!projectId) {
      setError(t("project_id_not_found"));
      return;
    }
    setLoading(true);
    try {
      const backendUrl = `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
      }/downloads/project/${projectId}?type=image`;
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || t("failed_to_generate_download_link"));
      }
      const data = await res.json();
      if (data.downloadUrl) {
        let downloadUrl = data.downloadUrl;
        if (downloadUrl.startsWith("/")) {
          downloadUrl = `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }${downloadUrl}`;
        }
        setDownloadLink(downloadUrl);
        setShowDownloadLink(true);
      } else {
        throw new Error(t("no_download_link_returned"));
      }
    } catch (err: any) {
      setError(err.message || t("failed_to_generate_download_link"));
      setShowDownloadLink(false);
      setDownloadLink("");
    }
    setLoading(false);
  };

  // Video download (calls Nest backend, which streams from FastAPI)
  const handleGenerateVideo = async () => {
    setError(null);
    setShowDownloadLink(false);
    setDownloadLink("");
    if (!projectId) {
      setError(t("project_id_not_found"));
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/projects/${projectId}/video`
      );
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || t("failed_to_generate_video"));
      }
      const blob = await resp.blob();
      const fileName =
        resp.headers
          .get("content-disposition")
          ?.match(/filename="?([^"]+)"?$/)?.[1] || "cinematic_output.mp4";
      const url = window.URL.createObjectURL(blob);
      setDownloadLink(url);
      setShowDownloadLink(true);
      // Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      setError(err.message || t("failed_to_generate_video"));
      setShowDownloadLink(false);
      setDownloadLink("");
    }
    setLoading(false);
  };

  // Documentation PDF download (calls Nest backend, which fetches from FastAPI)
  const handleGenerateDocumentation = async () => {
    setError(null);
    setShowDownloadLink(false);
    setDownloadLink("");
    if (!projectId) {
      setError(t("project_id_not_found"));
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/projects/${projectId}/documentation`
      );
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || t("failed_to_generate_documentation_pdf"));
      }
      const body = await resp.json();
      if (!body.pdf_url)
        throw new Error("PDF generation failed: no download URL returned.");
      // Compose absolute URL for download
      const backendPdfUrl = `http://127.0.0.1:8000${body.pdf_url}`;
      setDownloadLink(backendPdfUrl);
      setShowDownloadLink(true);
      // Auto-download
      const a = document.createElement("a");
      a.href = backendPdfUrl;
      a.download = body.pdf_url.split("/").pop() || "documentation.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      setError(err.message || t("failed_to_generate_documentation_pdf"));
      setShowDownloadLink(false);
      setDownloadLink("");
    }
    setLoading(false);
  };

  // All-in-one ZIP download (calls Nest backend)
  const handleGenerateAllInOne = async () => {
    setError(null);
    setShowDownloadLink(false);
    setDownloadLink("");
    if (!projectId) {
      setError(t("project_id_not_found"));
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/projects/${projectId}/all`
      );
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || t("failed_to_generate_zip"));
      }
      const data = await resp.json();
      if (!data.downloadUrl) throw new Error(t("zip_generation_failed"));
      let url = data.downloadUrl;
      if (url.startsWith("/")) {
        url = `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }${url}`;
      }
      setDownloadLink(url);
      setShowDownloadLink(true);
      // Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = url.split("/").pop() || "all_in_one.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      setError(err.message || t("failed_to_generate_zip"));
      setShowDownloadLink(false);
      setDownloadLink("");
    }
    setLoading(false);
  };

  // Main download handler
  const handleDownload = () => {
    if (selectedFormat === "image") {
      handleGenerateImage();
    } else if (selectedFormat === "video") {
      handleGenerateVideo();
    } else if (selectedFormat === "documentation") {
      handleGenerateDocumentation();
    } else if (selectedFormat === "complete-package") {
      handleGenerateAllInOne();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <UserHeader title="Download" subtitle="" />
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {t("choose_output_format")}
            </h1>
            <p className="text-lg text-gray-600">
              {t("select_preferred_format")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {outputFormats.map((format) => {
              const IconComponent = format.icon;
              const isSelected = selectedFormat === format.id;
              return (
                <Card
                  key={format.id}
                  className={cn(
                    "relative flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-lg border p-6 text-center transition-all duration-200",
                    isSelected
                      ? "border-black shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  )}
                  onClick={() => setSelectedFormat(format.id)}
                  aria-selected={isSelected}
                  role="radio"
                >
                  <div
                    className={cn(
                      "absolute right-4 top-4 h-4 w-4 rounded-full border",
                      isSelected
                        ? "border-black bg-black"
                        : "border-gray-300 bg-white"
                    )}
                    aria-hidden="true"
                  />
                  {React.createElement(IconComponent, {
                    className: "mb-2 h-10 w-10 text-gray-800",
                  })}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {format.title}
                  </h3>
                  <p className="text-sm text-gray-500">{format.description}</p>
                </Card>
              );
            })}
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Button
              className="w-full max-w-xs bg-black py-6 text-lg font-semibold text-white hover:bg-gray-800"
              onClick={handleDownload}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {t("generate_download_link")}
            </Button>
            <p className="text-sm text-gray-500">
              {t("processing_time_may_vary")}
            </p>
          </div>
          {error && (
            <div className="text-red-500 pt-3 whitespace-pre-wrap">{error}</div>
          )}
          {showDownloadLink && downloadLink && (
            <div className="space-y-4 pt-8">
              <p className="text-lg font-semibold text-gray-900">
                {t("your_file_is_ready")}
              </p>
              <div className="flex w-full items-center justify-center">
                <div className="flex w-full max-w-lg overflow-hidden rounded-lg border border-gray-300 bg-gray-50 pr-2">
                  <Input
                    type="text"
                    readOnly
                    value={downloadLink}
                    className="flex-1 border-none bg-transparent px-4 py-2 text-gray-800 focus-visible:ring-0"
                    aria-label="Download link"
                  />
                  <Button
                    className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800"
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4" />
                    <span>{t("copy_link")}</span>
                  </Button>
                  {downloadLink && (
                    <Button
                      asChild
                      className="ml-2 bg-green-700 text-white hover:bg-green-800"
                    >
                      <a
                        href={downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

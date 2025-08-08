"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Loader2,
  Plus,
  ArrowRight,
  Folder,
  Calendar,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { mayaLogoLight, mayaLogoDark } from "@/assets/images";
import { usePreloader } from "@/app/contexts/preloader-context";
import UserHeader from "@/components/UserHeader";
import { useTranslation } from "react-i18next";

// Auth utilities
function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("maya_token") || localStorage.getItem("token");
  }
  return null;
}

function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("maya_token");
    localStorage.removeItem("token");
  }
}

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MayaDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { startLoading } = usePreloader();
  const { t } = useTranslation();

  // Fetch recent projects
  const fetchRecentProjects = async () => {
    setLoadingProjects(true);
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/projects/recent`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401) {
        console.log(
          "Token expired while fetching recent projects, redirecting to login"
        );
        removeToken();
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        console.error(
          `Recent projects fetch failed with status: ${response.status}`
        );
        // Don't throw error, just set empty projects array
        setProjects([]);
        return;
      }

      const projectsData = await response.json();

      // Ensure projectsData is an array
      if (Array.isArray(projectsData)) {
        setProjects(projectsData);
      } else {
        console.warn("Recent projects data is not an array:", projectsData);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching recent projects:", error);
      // Don't set error state, just set empty projects array
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  // Create Project Handler
  const handleCreateProject = async () => {
    setError(null);
    setCreating(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/projects`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ name: newProjectName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject = await response.json();
      setProjects((prev: Project[]) => [newProject, ...prev]);
      setShowCreateModal(false);
      setNewProjectName("");
      startLoading();
      setTimeout(() => {
        router.push(`/project/${newProject.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  // Click on project to open
  const handleOpenProject = (projectId: string) => {
    startLoading();
    setTimeout(() => {
      router.push(`/project/${projectId}`);
    }, 2000);
  };

  // Navigate to renovation
  const handleRenovationClick = () => {
    router.push("/renovation");
  };

  // Filtered projects by search
  const filteredProjects = projects.filter((project: Project) => {
    return (
      !searchQuery ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <ProtectedRoute>
      <div
        className={`min-h-screen transition-all duration-500 ${
          isDark
            ? "bg-gradient-to-br from-black via-gray-950 to-black"
            : "bg-gradient-to-br from-white via-gray-50 to-white"
        }`}
      >
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${
              isDark ? "bg-white" : "bg-black"
            }`}
          ></div>
          <div
            className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse delay-1000 ${
              isDark ? "bg-white" : "bg-black"
            }`}
          ></div>
        </div>

        {/* Header */}
        <UserHeader
          title={t("maya_dashboard")}
          subtitle=""
          showSearch={true}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center gap-8">
          <h2
            className={`text-4xl md:text-5xl font-black ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {t("welcome_to_dashboard")}
          </h2>
          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto ${
              isDark ? "text-white/70" : "text-black/70"
            }`}
          >
            {t("dashboard_description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => setShowCreateModal(true)}
              className={`px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 border-2 flex items-center gap-3 mx-auto ${
                isDark
                  ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  : "bg-black/10 border-black/20 text-black hover:bg-black/20"
              }`}
            >
              <Plus className="w-6 h-6 mr-2" />
              {t("create_project")}
            </Button>
            <Button
              onClick={handleRenovationClick}
              className={`px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 border-2 flex items-center gap-3 mx-auto ${
                isDark
                  ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  : "bg-black/10 border-black/20 text-black hover:bg-black/20"
              }`}
            >
              <span className="text-xl">✨ {t("renovate")}</span>
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-50 p-4">
            <div
              className={`rounded-3xl p-6 shadow-2xl w-full max-w-2xl border-2 flex flex-col items-center gap-4 ${
                isDark ? "bg-black border-white/20" : "bg-white border-black/20"
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center gap-8 mb-10`}
              >
                <img
                  src={isDark ? mayaLogoDark.src : mayaLogoLight.src}
                  alt="Maya Logo"
                  className="w-48 h-48 object-contain drop-shadow-2xl"
                />
                <h2
                  className={`text-4xl font-black tracking-tight ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {t("create_new_project")}
                </h2>
                <p
                  className={`text-lg max-w-xl text-center ${
                    isDark ? "text-white/80" : "text-black/70"
                  }`}
                >
                  {t("project_description")}
                </p>
              </div>

              <input
                className={`border-2 rounded-2xl px-6 py-4 w-full text-lg font-semibold transition-all duration-300 text-center shadow-md ${
                  isDark
                    ? "bg-black text-white border-white/40 placeholder-white/40 focus:border-white/70 focus:bg-black/90"
                    : "bg-white text-black border-black/40 placeholder-black/40 focus:border-black/70 focus:bg-white"
                } focus:outline-none mb-4`}
                placeholder={t("enter_project_name")}
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                disabled={creating}
              />

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="flex w-full justify-end gap-4 mt-2">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className={`px-8 py-3 rounded-2xl font-bold text-base transition-all duration-300 shadow-md border-0 ${
                    isDark
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-black text-white hover:bg-black/90"
                  }`}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!newProjectName || creating}
                  className={`px-8 py-3 rounded-2xl font-bold text-base transition-all duration-300 shadow-md border-0 ${
                    isDark
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-black text-white hover:bg-black/90"
                  }`}
                >
                  {creating ? (
                    <Loader2 className="animate-spin w-5 h-5 mr-3" />
                  ) : null}
                  <span>{t("create_project")}</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Projects */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl border-2 shadow-xl bg-red-500/10 border-red-500/20">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-500 font-medium">{error}</span>
                <Button
                  onClick={() => setError(null)}
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-red-500 hover:text-red-600"
                >
                  {t("dismiss")}
                </Button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-16 sm:mb-20">
            <div className="mb-10 sm:mb-12 text-center">
              <h2
                className={`text-3xl sm:text-4xl font-black mb-4 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {t("recent_projects")}
              </h2>
              <p
                className={`text-lg sm:text-xl ${
                  isDark ? "text-white/60" : "text-black/60"
                }`}
              >
                {t("continue_working_latest")}
              </p>
            </div>

            {loadingProjects ? (
              <div
                className={`flex items-center justify-center h-80 sm:h-96 rounded-2xl sm:rounded-3xl border-2 shadow-2xl ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-black/5 border-black/10"
                } backdrop-blur-xl`}
              >
                <div className="text-center space-y-6">
                  <div className="relative">
                    <Loader2
                      className={`w-12 h-12 sm:w-16 sm:h-16 animate-spin mx-auto ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse ${
                        isDark ? "bg-white" : "bg-black"
                      }`}
                    ></div>
                  </div>
                  <p
                    className={`text-lg sm:text-xl font-medium ${
                      isDark ? "text-white/70" : "text-black/70"
                    }`}
                  >
                    {t("loading_your_projects")}
                  </p>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div
                className={`rounded-2xl sm:rounded-3xl border-2 p-12 sm:p-20 text-center shadow-2xl ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-black/5 border-black/10"
                } backdrop-blur-xl`}
              >
                <div className="space-y-6 sm:space-y-8">
                  <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32">
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center shadow-2xl ${
                        isDark
                          ? "bg-gradient-to-br from-white/20 to-white/10"
                          : "bg-gradient-to-br from-black/20 to-black/10"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${
                          isDark ? "bg-white text-black" : "bg-black text-white"
                        }`}
                      >
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <div
                      className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xl ${
                        isDark ? "bg-white" : "bg-black"
                      }`}
                    >
                      <Plus
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isDark ? "text-black" : "text-white"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3
                      className={`text-2xl sm:text-3xl font-black ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      No Projects Yet
                    </h3>
                    <p
                      className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed px-4 ${
                        isDark ? "text-white/70" : "text-black/70"
                      }`}
                    >
                      Create your first project to get started with MAYA and
                      bring your creative vision to life
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className={`px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-2xl transition-all duration-300 hover:scale-105 ${
                      isDark
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-black text-white hover:bg-black/90"
                    }`}
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                    Create Your First Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className={`cursor-pointer group overflow-hidden border-2 transition-all duration-500 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 hover:scale-105 ${
                      isDark
                        ? "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                        : "bg-black/5 border-black/10 hover:border-black/30 hover:bg-black/10"
                    } backdrop-blur-xl`}
                    onClick={() => handleOpenProject(project.id)}
                  >
                    <CardContent className="p-0">
                      {/* Project Header */}
                      <div
                        className={`h-40 sm:h-48 flex items-center justify-center relative overflow-hidden ${
                          isDark
                            ? "bg-gradient-to-br from-white/10 via-white/5 to-transparent"
                            : "bg-gradient-to-br from-black/10 via-black/5 to-transparent"
                        }`}
                      >
                        <div className="absolute inset-0 pointer-events-none">
                          <div
                            className={`absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-3xl opacity-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                              isDark ? "bg-white" : "bg-black"
                            }`}
                          ></div>
                        </div>

                        <div className="relative z-10 flex items-center justify-center">
                          <div
                            className={`h-44 sm:h-56 flex items-center justify-center relative overflow-hidden bg-transparent`}
                          >
                            <img
                              src={
                                isDark ? mayaLogoDark.src : mayaLogoLight.src
                              }
                              alt="Maya AI Logo"
                              className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div
                          className={`absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 ${
                            isDark ? "bg-white/20" : "bg-black/20"
                          } backdrop-blur-sm`}
                        >
                          <ArrowRight
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              isDark ? "text-white" : "text-black"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                        <div>
                          <h3
                            className={`font-black text-lg sm:text-xl mb-2 ${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {project.name}
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            <div
                              className={`flex items-center ${
                                isDark ? "text-white/60" : "text-black/60"
                              }`}
                            >
                              <Calendar className="w-4 h-4 mr-3" />
                              <span className="font-medium text-sm">
                                {new Date(
                                  project.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div
                              className={`flex items-center ${
                                isDark ? "text-white/60" : "text-black/60"
                              }`}
                            >
                              <Folder className="w-4 h-4 mr-3" />
                              <span className="text-sm font-medium">
                                Design Project
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

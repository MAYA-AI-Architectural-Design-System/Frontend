"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  Paperclip,
  X,
  User,
  LogOut,
  MessageCircle,
  Edit,
  Trash2,
  MoreVertical,
  Check,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { chatApi, Chat, Message } from "@/lib/chat-api";
import { isAuthenticated, logout, getUserProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { mayaLogoDark, mayaLogoLight } from "@/assets/images";

// Helper to get absolute image URL for backend images
function getImageSrc(url?: string) {
  if (!url) return undefined;

  console.log("getImageSrc called with URL:", url);

  // Handle data URLs and blob URLs
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;

  // Handle full URLs
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  // Handle backend image URLs with proper base URL
  const base = "http://localhost:3001";

  // If URL starts with /, it's already a proper path
  if (url.startsWith("/")) {
    const finalUrl = base + url;
    console.log("Generated URL (absolute path):", finalUrl);
    return finalUrl;
  }

  // If URL doesn't start with /, add it
  const finalUrl = base + "/" + url;
  console.log("Generated URL (relative path):", finalUrl);
  return finalUrl;
}

export default function ChatGPTClone() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(
    null
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showChatActions, setShowChatActions] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme, setTheme } = useTheme();
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const router = useRouter();

  // User profile state
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // Preloader state
  const [isPreloading, setIsPreloading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    // Temporary bypass for testing - remove this in production
    if (process.env.NODE_ENV === "development") {
      console.log("Development mode - bypassing authentication");
      if (isPreloading) {
        const timer = setTimeout(() => setIsPreloading(false), 1200);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (isPreloading) {
      const timer = setTimeout(() => setIsPreloading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isPreloading, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showChatActions && !target.closest(".chat-actions")) {
        setShowChatActions(null);
      }
    };

    if (showChatActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatActions]);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isAuthenticated()) {
      fetchChats();
      fetchUserProfile();
    }
  }, []);

  async function fetchUserProfile() {
    try {
      const profile = await getUserProfile();
      if (profile) {
        setUserProfile({
          name: profile.name || profile.username || "User",
          email: profile.email || "user@example.com",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to localStorage if API fails
      if (typeof window !== "undefined") {
        setUserProfile({
          name: localStorage.getItem("userName") || "User",
          email: localStorage.getItem("userEmail") || "user@example.com",
        });
      }
    }
  }

  useEffect(() => {
    if (currentChatId) fetchChatMessages(currentChatId);
  }, [currentChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  useEffect(() => {
    if (uploadedImage) {
      console.log(
        "Processing uploaded image:",
        uploadedImage.name,
        uploadedImage.size,
        uploadedImage.type
      );

      // Validate file size (max 50MB as per backend requirements)
      if (uploadedImage.size > 50 * 1024 * 1024) {
        alert("File size too large. Please select an image smaller than 50MB.");
        setUploadedImage(null);
        setUploadedPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Validate file type (PNG, JPG, JPEG, GIF, WebP as per API docs)
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(uploadedImage.type)) {
        alert(
          "Please select a valid image file (PNG, JPG, JPEG, GIF, WebP only)."
        );
        setUploadedImage(null);
        setUploadedPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("Image preview generated");
        setUploadedPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(uploadedImage);
    } else {
      setUploadedPreviewUrl(null);
    }
  }, [uploadedImage]);

  async function fetchChats() {
    try {
      const data = await chatApi.getChats();
      setChats(data);
      if (!currentChatId && data.length > 0) setCurrentChatId(data[0].id);
    } catch (e) {
      console.error("Error fetching chats:", e);
      setChats([]);
    }
  }

  async function fetchChatMessages(chatId: string) {
    try {
      const chatDetail = await chatApi.getChat(chatId);
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? chatDetail : chat))
      );
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, messages: [] } : chat
        )
      );
    }
  }

  async function createNewChat() {
    try {
      const newChat = await chatApi.createChat("New Chat");
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setUploadedImage(null);
      setSidebarOpen(false);
    } catch (e) {
      console.error("Error creating new chat:", e);
    }
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false);
    setShowChatActions(null);
  };

  const startEditChat = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
    setShowChatActions(null);
  };

  const saveEditChat = async (chatId: string) => {
    try {
      console.log("Saving edit for chat:", chatId, "with title:", editingTitle);
      await chatApi.updateChatTitle(chatId, editingTitle);

      // Update the chat in the UI
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: editingTitle } : chat
        )
      );

      setEditingChatId(null);
      setEditingTitle("");
      console.log("Chat title updated successfully in UI");
    } catch (error) {
      console.error("Failed to update chat title:", error);

      // Try to update the UI anyway for better UX
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: editingTitle } : chat
        )
      );
      setEditingChatId(null);
      setEditingTitle("");

      // Show user-friendly error message
      alert(
        "Failed to update chat title on server, but updated locally. Please try again later."
      );
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await chatApi.deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(
          chats.length > 1
            ? chats.find((c) => c.id !== chatId)?.id || null
            : null
        );
      }
      setShowChatActions(null);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if (!input.trim() && !uploadedImage) return;

    console.log("Sending message:", {
      input,
      hasImage: !!uploadedImage,
    });
    setIsLoading(true);

    let chatId = currentChatId;
    if (!chatId) {
      try {
        const newChat = await chatApi.createChat(
          input.slice(0, 30) || "New Chat"
        );
        chatId = newChat.id;
        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
      } catch (e) {
        console.error("Error creating chat:", e);
        setIsLoading(false);
        // Show user-friendly error message
        setChats((prev) => [
          {
            id: `temp-${Date.now()}`,
            title: "Error - New Chat",
            messages: [
              {
                id: `${Date.now()}-error`,
                type: "assistant",
                content:
                  "Sorry, there was an error creating a new chat. Please try again.",
                timestamp: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        return;
      }
    }

    // Add user message to UI immediately (will be updated with response data)
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: "user",
      content: input || (uploadedImage ? "Image uploaded" : ""),
      timestamp: new Date().toISOString(),
      uploadedImageUrl: uploadedPreviewUrl || undefined,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
            }
          : chat
      )
    );

    setInput("");
    setUploadedImage(null);
    setUploadedPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      console.log("Sending message with image:", !!uploadedImage);
      const response = await chatApi.sendMessage(
        chatId,
        input,
        uploadedImage || undefined
      );

      // Update user message with response data
      if (response.userMessage) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === userMessage.id
                      ? {
                          ...msg,
                          id: response.userMessage.id,
                          content: response.userMessage.content,
                          timestamp: response.userMessage.timestamp,
                          uploadedImageUrl:
                            response.userMessage.uploadedImageUrl,
                        }
                      : msg
                  ),
                }
              : chat
          )
        );
      }

      // Add AI response to UI immediately
      if (response.aiResponse) {
        const aiMessage: Message = {
          id: response.aiResponse.id,
          type: "assistant",
          content: response.aiResponse.content,
          timestamp: response.aiResponse.timestamp,
          aiImageUrl: response.aiResponse.aiImageUrl,
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, aiMessage],
                }
              : chat
          )
        );
      }

      console.log("Message sent and response received successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: `${Date.now()}-error`,
                    type: "assistant",
                    content: `Sorry, there was an error processing your request: ${errorMessage}. Please try again.`,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={`flex h-screen relative overflow-hidden font-sans transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-white via-gray-50 to-white text-black"
      }`}
    >
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 h-full flex flex-col shadow-xl transition-all duration-300 backdrop-blur-xl
          ${sidebarOpen ? "" : "hidden lg:flex"}
          ${sidebarMinimized ? "w-20" : "w-72"}
          border-r
          ${theme === "dark" ? "bg-black/20" : "bg-white/20"}
        `}
      >
        {/* Sidebar Header with Maya Logo and Minimize/Expand Icon */}
        <div
          className={`flex items-center justify-between px-4 py-2 ${
            sidebarMinimized ? "flex-col gap-4 px-2 py-4" : ""
          }`}
        >
          <div className="flex items-center">
            <img
              src={theme === "dark" ? mayaLogoDark.src : mayaLogoLight.src}
              alt="Maya Logo"
              className={`object-contain transition-all duration-200 ${
                sidebarMinimized ? "w-24 h-24" : "w-20 h-20"
              }`}
            />
          </div>
          <button
            onClick={() => setSidebarMinimized(!sidebarMinimized)}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "hover:bg-white/10 text-white"
                : "hover:bg-black/10 text-black"
            }`}
            aria-label={
              sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"
            }
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              data-rtl-flip=""
              className={`icon max-md:hidden transition-colors ${
                theme === "dark"
                  ? "text-white hover:text-white/80"
                  : "text-black hover:text-black/80"
              }`}
            >
              <path d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"></path>
            </svg>
          </button>
        </div>
        {/* Minimized Sidebar Content */}
        {sidebarMinimized ? (
          <div className="flex flex-col items-center justify-between h-full py-4">
            <div className="flex flex-col items-center gap-4">
              {/* Create Chat Button */}
              <button
                onClick={createNewChat}
                className={`p-3 rounded-xl transition-all duration-300 border ${
                  theme === "dark"
                    ? "text-white border-white/20 hover:bg-white/10"
                    : "text-black border-black/20 hover:bg-black/10"
                }`}
                aria-label="Create new chat"
              >
                <Plus
                  size={22}
                  className={theme === "dark" ? "text-white" : "text-black"}
                />
              </button>
              {/* Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className={`p-3 rounded-xl transition-all duration-300 border ${
                  theme === "dark"
                    ? "text-white border-white/20 hover:bg-white/10"
                    : "text-black border-black/20 hover:bg-black/10"
                }`}
                aria-label="Search chats"
              >
                <Search
                  size={22}
                  className={theme === "dark" ? "text-white" : "text-black"}
                />
              </button>
            </div>
            {/* Profile at bottom */}
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProfileOpen(!profileOpen)}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ width: 44, height: 44 }}
              >
                <User size={28} />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* New Chat Button */}
            <div className="p-4 flex flex-col gap-2">
              <button
                onClick={createNewChat}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-300 border ${
                  theme === "dark"
                    ? "text-white border-white/20"
                    : "text-black border-black/20"
                }`}
              >
                <Plus size={18} />
                New chat
              </button>
            </div>
            {/* Search Chats */}
            <div className="px-4 pb-4">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    theme === "dark" ? "text-white/70" : "text-black/70"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-300 border ${
                    theme === "dark"
                      ? "text-white placeholder-white/60 focus:ring-white/40 border-white/20"
                      : "text-black placeholder-black/60 focus:ring-black/40 border-black/20"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${
                      theme === "dark"
                        ? "hover:bg-white/10 hover:scale-110"
                        : "hover:bg-black/10 hover:scale-110"
                    }`}
                  >
                    <X
                      className={`w-4 h-4 ${
                        theme === "dark" ? "text-white/70" : "text-black/70"
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
            {/* Chat History */}
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto px-2 pb-2 custom-scrollbar">
              {filteredChats.length === 0 && searchQuery ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No chats found
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Try a different search term
                  </p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div key={chat.id} className="relative group">
                    {editingChatId === chat.id ? (
                      <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-md">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                          <MessageCircle className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") saveEditChat(chat.id);
                            if (e.key === "Escape") setEditingChatId(null);
                          }}
                          className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 dark:text-gray-100"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditChat(chat.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => setEditingChatId(null)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-2 px-3 py-2 mb-1 rounded-md font-medium text-sm transition-all duration-200 ${
                          currentChatId === chat.id
                            ? `${
                                theme === "dark"
                                  ? "border border-white/20"
                                  : "border border-black/20"
                              } ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`
                            : `${
                                theme === "dark"
                                  ? "hover:bg-white/10"
                                  : "hover:bg-black/10"
                              } ${
                                theme === "dark"
                                  ? "text-white/70"
                                  : "text-black/70"
                              }`
                        }`}
                      >
                        <button
                          onClick={() => selectChat(chat.id)}
                          className={`flex items-center gap-2 flex-1 text-left ${
                            currentChatId === chat.id
                              ? theme === "dark"
                                ? "text-white"
                                : "text-black"
                              : theme === "dark"
                              ? "text-white/70"
                              : "text-black/70"
                          }`}
                        >
                          <span
                            className={`flex items-center justify-center w-6 h-6 rounded-full ${
                              currentChatId === chat.id
                                ? theme === "dark"
                                  ? "text-white border border-white/20"
                                  : "text-black border border-black/20"
                                : theme === "dark"
                                ? "text-white/70"
                                : "text-black/70"
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </span>
                          <span className="truncate flex-1">{chat.title}</span>
                        </button>
                        <button
                          onClick={() =>
                            setShowChatActions(
                              showChatActions === chat.id ? null : chat.id
                            )
                          }
                          className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity ${
                            theme === "dark"
                              ? "hover:bg-white/10"
                              : "hover:bg-black/10"
                          }`}
                        >
                          <MoreVertical
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-white/60"
                                : "text-black/60"
                            }`}
                          />
                        </button>
                        {showChatActions === chat.id && (
                          <div
                            className={`absolute right-0 top-full mt-1 rounded-lg shadow-lg z-10 min-w-[120px] chat-actions backdrop-blur-xl ${
                              theme === "dark"
                                ? "bg-black/90 border-white/20"
                                : "bg-white/90 border-black/20"
                            } border`}
                          >
                            <button
                              onClick={() => startEditChat(chat)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                                theme === "dark"
                                  ? "hover:bg-white/10 text-white"
                                  : "hover:bg-black/10 text-black"
                              }`}
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteChat(chat.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                                theme === "dark"
                                  ? "hover:bg-white/10 text-red-400"
                                  : "hover:bg-black/10 text-red-600"
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {/* Profile at bottom */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProfileOpen(!profileOpen)}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ width: 44, height: 44 }}
              >
                <User size={28} />
              </Button>
            </div>
          </>
        )}
      </aside>
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto">
        {/* Header with Theme Toggle */}
        <header className="sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`rounded-full transition-colors ${
                theme === "dark"
                  ? "hover:bg-white/10 text-white"
                  : "hover:bg-black/10 text-black"
              }`}
              style={{ width: 40, height: 40 }}
            >
              {theme === "dark" ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </Button>
          </div>
        </header>
        {/* Preloader or Chat */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 z-10">
          {isPreloading ? (
            <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in">
              <img
                src={theme === "dark" ? mayaLogoDark.src : mayaLogoLight.src}
                alt="Maya AI"
                className="w-40 h-40 object-contain mb-8 animate-glow"
                style={{
                  filter:
                    theme === "dark"
                      ? "drop-shadow(0 0 48px rgba(255,255,255,0.3))"
                      : "drop-shadow(0 0 48px rgba(0,0,0,0.1))",
                }}
              />
              <div className="w-16 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
            </div>
          ) : !currentChat || currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in">
              <img
                src={theme === "dark" ? mayaLogoDark.src : mayaLogoLight.src}
                alt="Maya AI"
                className="w-40 h-40 object-contain mb-2 animate-glow"
                style={{
                  filter:
                    theme === "dark"
                      ? "drop-shadow(0 0 48px rgba(255,255,255,0.3))"
                      : "drop-shadow(0 0 48px rgba(0,0,0,0.1))",
                }}
              />
              <p
                className={`text-lg font-medium ${
                  theme === "dark" ? "text-white/60" : "text-black/60"
                }`}
              >
                How can I help you today?
              </p>
            </div>
          ) : (
            <div className="flex-1 w-full max-w-3xl mx-auto relative">
              <div className="w-full space-y-4 pb-4 pt-2">
                {currentChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.type === "assistant" ? "items-start" : "items-end"
                    }`}
                  >
                    {/* Message content row */}
                    <div
                      className={`flex ${
                        message.type === "assistant"
                          ? "justify-start"
                          : "justify-end"
                      } w-full`}
                    >
                      {message.type === "assistant" && (
                        <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-3">
                          <img
                            src={
                              theme === "dark"
                                ? mayaLogoDark.src
                                : mayaLogoLight.src
                            }
                            alt="AI"
                            className="w-14 h-14 object-contain"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] ${
                          message.type === "assistant"
                            ? "text-gray-900 dark:text-gray-100"
                            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl px-4 py-2.5"
                        } font-sans text-base break-words leading-relaxed`}
                      >
                        {message.content}
                        <span className="block mt-1.5 text-xs text-gray-500 dark:text-gray-400 text-right select-none font-sans">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {message.type === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center ml-3">
                          <User className="w-5 h-5 text-white dark:text-gray-900" />
                        </div>
                      )}
                    </div>

                    {/* AI generated image row */}
                    {message.aiImageUrl && (
                      <div
                        className={`mt-3 relative group ${
                          message.type === "assistant" ? "ml-20" : "mr-8"
                        }`}
                      >
                        <img
                          src={message.aiImageUrl}
                          alt="Generated image"
                          className="w-full max-w-md rounded-lg shadow-lg"
                        />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={() =>
                              window.open(
                                getImageSrc(message.aiImageUrl),
                                "_blank"
                              )
                            }
                            className="p-2 bg-black/50 hover:bg-black/70 rounded-full"
                            title="Open in new tab"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Uploaded image row for user messages */}
                    {message.type === "user" && message.uploadedImageUrl && (
                      <div className={`mt-3 relative group mr-8`}>
                        <img
                          src={message.uploadedImageUrl}
                          alt="Uploaded image"
                          className="w-full max-w-md rounded-lg shadow-lg"
                        />
                        <button
                          onClick={() =>
                            window.open(
                              getImageSrc(message.uploadedImageUrl),
                              "_blank"
                            )
                          }
                          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <img
                        src={
                          theme === "dark"
                            ? mayaLogoDark.src
                            : mayaLogoLight.src
                        }
                        alt="AI"
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-gray-900 dark:text-gray-100 flex items-center gap-2 animate-bubble-fade-in">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Processing image... (this may take 30-60 seconds)
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </section>
        {/* Input Area */}
        <footer className="p-4 sticky bottom-0 z-20 backdrop-blur-xl border-t border-white/20 dark:border-black/20 bg-gradient-to-t from-white/80 to-transparent dark:from-black/80">
          <div className="max-w-3xl mx-auto">
            <div
              className={`relative flex items-center gap-3 rounded-2xl p-4 shadow-sm backdrop-blur-xl ${
                theme === "dark" ? "border-white/20" : "border-black/20"
              } border`}
            >
              {/* Uploaded Image Preview */}
              {uploadedPreviewUrl && (
                <div className="relative flex-shrink-0">
                  <img
                    src={uploadedPreviewUrl}
                    alt="Uploaded preview"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeUploadedImage}
                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200"
                  >
                    <X size={8} />
                  </button>
                </div>
              )}

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className={`flex-1 resize-none border-none outline-none bg-transparent max-h-32 min-h-[24px] text-base font-sans ${
                  theme === "dark"
                    ? "text-white placeholder:text-white/60"
                    : "text-black placeholder:text-black/60"
                }`}
                rows={1}
              />

              {/* File Upload */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setUploadedImage(file);
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                  theme === "dark"
                    ? "text-white hover:bg-white/10"
                    : "text-black hover:bg-black/10"
                }`}
                disabled={isLoading}
              >
                <Paperclip size={16} />
              </button>

              {/* Send Button */}
              <Button
                onClick={sendMessage}
                disabled={(!input.trim() && !uploadedImage) || isLoading}
                className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                  (!input.trim() && !uploadedImage) || isLoading
                    ? "opacity-50 cursor-not-allowed bg-gray-400 text-gray-600"
                    : theme === "dark"
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/90"
                }`}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </footer>
      </main>
      {/* Search Modal */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 rounded-2xl shadow-2xl backdrop-blur-2xl ${
              theme === "dark"
                ? "bg-black/90 border-white/20"
                : "bg-white/90 border-black/20"
            } border`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    theme === "dark" ? "text-white/70" : "text-black/70"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all duration-300 border ${
                    theme === "dark"
                      ? "text-white placeholder-white/60 focus:ring-white/40 border-white/20 bg-black/20"
                      : "text-black placeholder-black/60 focus:ring-black/40 border-black/20 bg-white/20"
                  }`}
                  autoFocus
                />
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className={`ml-3 p-2 rounded-xl transition-all duration-300 ${
                  theme === "dark"
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/10 text-black"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* New Chat Option */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  createNewChat();
                  setSearchModalOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  theme === "dark"
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/10 text-black"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="font-medium">New chat</span>
              </button>
            </div>

            {/* Chat History */}
            <div className="max-h-96 overflow-y-auto">
              {/* Today */}
              {filteredChats.filter((chat) => {
                const today = new Date().toDateString();
                return new Date(chat.createdAt).toDateString() === today;
              }).length > 0 && (
                <div className="p-4">
                  <h3
                    className={`text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-white/70" : "text-black/70"
                    }`}
                  >
                    Today
                  </h3>
                  <div className="space-y-2">
                    {filteredChats
                      .filter((chat) => {
                        const today = new Date().toDateString();
                        return (
                          new Date(chat.createdAt).toDateString() === today
                        );
                      })
                      .map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => {
                            selectChat(chat.id);
                            setSearchModalOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                            theme === "dark"
                              ? "hover:bg-white/10 text-white"
                              : "hover:bg-black/10 text-black"
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-left">{chat.title}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Yesterday */}
              {filteredChats.filter((chat) => {
                const yesterday = new Date(
                  Date.now() - 24 * 60 * 60 * 1000
                ).toDateString();
                return new Date(chat.createdAt).toDateString() === yesterday;
              }).length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <h3
                    className={`text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-white/70" : "text-black/70"
                    }`}
                  >
                    Yesterday
                  </h3>
                  <div className="space-y-2">
                    {filteredChats
                      .filter((chat) => {
                        const yesterday = new Date(
                          Date.now() - 24 * 60 * 60 * 1000
                        ).toDateString();
                        return (
                          new Date(chat.createdAt).toDateString() === yesterday
                        );
                      })
                      .map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => {
                            selectChat(chat.id);
                            setSearchModalOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                            theme === "dark"
                              ? "hover:bg-white/10 text-white"
                              : "hover:bg-black/10 text-black"
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-left">{chat.title}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Previous 7 Days */}
              {filteredChats.filter((chat) => {
                const sevenDaysAgo = new Date(
                  Date.now() - 7 * 24 * 60 * 60 * 1000
                );
                return (
                  new Date(chat.createdAt) > sevenDaysAgo &&
                  new Date(chat.createdAt).toDateString() !==
                    new Date().toDateString() &&
                  new Date(chat.createdAt).toDateString() !==
                    new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
                );
              }).length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <h3
                    className={`text-sm font-semibold mb-3 ${
                      theme === "dark" ? "text-white/70" : "text-black/70"
                    }`}
                  >
                    Previous 7 Days
                  </h3>
                  <div className="space-y-2">
                    {filteredChats
                      .filter((chat) => {
                        const sevenDaysAgo = new Date(
                          Date.now() - 7 * 24 * 60 * 60 * 1000
                        );
                        return (
                          new Date(chat.createdAt) > sevenDaysAgo &&
                          new Date(chat.createdAt).toDateString() !==
                            new Date().toDateString() &&
                          new Date(chat.createdAt).toDateString() !==
                            new Date(
                              Date.now() - 24 * 60 * 60 * 1000
                            ).toDateString()
                        );
                      })
                      .map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => {
                            selectChat(chat.id);
                            setSearchModalOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                            theme === "dark"
                              ? "hover:bg-white/10 text-white"
                              : "hover:bg-black/10 text-black"
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-left">{chat.title}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Sidebar */}
      {profileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => setProfileOpen(false)}
        >
          <div
            className={`absolute right-0 top-0 h-full w-80 backdrop-blur-2xl shadow-2xl p-6 border-l ${
              theme === "dark"
                ? "bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40 border-white/20"
                : "bg-gradient-to-br from-white/40 via-gray-50/30 to-white/40 border-black/20"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h3
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Profile
              </h3>
              <button
                onClick={() => setProfileOpen(false)}
                className={`p-2 rounded-xl transition-all duration-300 border backdrop-blur-xl ${
                  theme === "dark"
                    ? "hover:bg-white/10 text-white border-white/20 bg-black/20"
                    : "hover:bg-black/10 text-black border-black/20 bg-white/20"
                }`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center border backdrop-blur-xl ${
                    theme === "dark"
                      ? "border-white/20 bg-black/20"
                      : "border-black/20 bg-white/20"
                  }`}
                >
                  <User
                    className={`w-10 h-10 ${
                      theme === "dark" ? "text-white/60" : "text-black/60"
                    }`}
                  />
                </div>
                <h4
                  className={`text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {userProfile?.name || "User"}
                </h4>
                <p
                  className={
                    theme === "dark" ? "text-white/60" : "text-black/60"
                  }
                >
                  {userProfile?.email || "user@example.com"}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 border backdrop-blur-xl ${
                    theme === "dark"
                      ? "text-white border-white/20 hover:bg-white/10 bg-black/20"
                      : "text-black border-black/20 hover:bg-black/10 bg-white/20"
                  }`}
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes bubble-fade-in {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bubble-fade-in {
          animation: bubble-fade-in 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes avatar-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.08),
              0 0 0 0 rgba(255, 255, 255, 0.08);
          }
          50% {
            box-shadow: 0 0 16px 4px rgba(0, 0, 0, 0.12),
              0 0 16px 4px rgba(255, 255, 255, 0.12);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.08),
              0 0 0 0 rgba(255, 255, 255, 0.08);
          }
        }
        .animate-avatar-glow {
          animation: avatar-glow 2.5s infinite alternate;
        }
        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0.3));
          }
          100% {
            filter: drop-shadow(0 0 48px rgba(255, 255, 255, 0.3));
          }
        }
        .animate-glow {
          animation: glow 2.5s infinite alternate;
        }
        @keyframes send-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(255, 255, 255, 0);
          }
          50% {
            box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.1),
              0 0 12px 2px rgba(255, 255, 255, 0.1);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        .animate-send-glow {
          animation: send-glow 2.5s infinite alternate;
        }
        @keyframes dropdown-fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown-fade-in {
          animation: dropdown-fade-in 0.2s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        /* Custom scrollbars for sidebar and message area */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: transparent;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
        }
        .dark .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: transparent;
        }
      `}</style>
      <style jsx global>{`
        .sidebar-gradient {
          background: linear-gradient(
            135deg,
            ${theme === "dark"
              ? "#23272f 0%, #18181b 60%, #23272f 100%"
              : "#f8fafc 0%, #e0e7ef 60%, #f8fafc 100%"}
          );
          background-blend-mode: overlay;
          opacity: 0.98;
        }
      `}</style>
    </div>
  );
}

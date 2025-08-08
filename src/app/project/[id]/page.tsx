"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import {
  Home,
  LayoutGrid,
  Mountain,
  Minus,
  Plus,
  Upload,
  Loader2,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Palette,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  mayaLogoDark,
  mayaLogoLight,
  Diningroom,
  Bathroom,
  Bedroom,
  Living,
  Kitchen,
  Study,
  Garage,
  Laundry,
} from "@/assets/images";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, Settings, LogOut, ChevronDown } from "lucide-react";
import UserHeader from "@/components/UserHeader";

// Custom Image component with fallback
const SafeImage = ({ src, alt, width, height, className, ...props }: any) => {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={(e) => {
          console.error("Fallback image also failed to load:", src);
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
          target.onerror = null;
        }}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        console.log("Next.js Image failed, using fallback img tag");
        setUseFallback(true);
      }}
      unoptimized={true}
      {...props}
    />
  );
};

// Room images from assets
const roomImages = {
  dining: Diningroom,
  bathroom: Bathroom,
  bedroom: Bedroom,
  living: Living,
  kitchen: Kitchen,
  study: Study,
  garage: Garage,
  laundry: Laundry,
};

type FloorPlanRoom = {
  id: string;
  name: string;
  imageSrc: string | StaticImageData;
  quantity: number;
};

type RoomEntity = {
  id: string;
  name: string;
  quantity?: number;
  color?: string;
  style?: string;
};

type InteriorRoomEntity = {
  id: string;
  name: string;
  color?: string;
  style?: string;
  image?: string;
};

const availableColors = [
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Warm Gray", hex: "#F8F9FA" },
  { name: "Charcoal", hex: "#343A40" },
  { name: "Cream", hex: "#FFF8E7" },
  { name: "Sky Blue", hex: "#E3F2FD" },
  { name: "Deep Navy", hex: "#1A237E" },
  { name: "Sage Green", hex: "#E8F5E8" },
  { name: "Forest", hex: "#2E7D32" },
  { name: "Blush", hex: "#FCE4EC" },
  { name: "Terracotta", hex: "#D84315" },
  { name: "Jet Black", hex: "#000000" },
];

// JWT Auth utilities (copied from dashboard)
function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

// Helper function to get headers with authentication
function getAuthHeaders() {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export default function ProjectComponent() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params as any)?.id as string;
  const { t } = useTranslation();

  // Floor Plan & Interior state
  const [project, setProject] = useState<any>(null);
  const [floorId, setFloorId] = useState<string | null>(null);
  const [floorPlanRooms, setFloorPlanRooms] = useState<FloorPlanRoom[]>([
    {
      id: "dining",
      name: t("dining_room"),
      imageSrc: roomImages.dining,
      quantity: 0,
    },
    {
      id: "bathroom",
      name: t("bathroom"),
      imageSrc: roomImages.bathroom,
      quantity: 0,
    },
    {
      id: "bedroom",
      name: t("bedroom"),
      imageSrc: roomImages.bedroom,
      quantity: 0,
    },
    {
      id: "living",
      name: t("living_room"),
      imageSrc: roomImages.living,
      quantity: 0,
    },
    {
      id: "kitchen",
      name: t("kitchen"),
      imageSrc: roomImages.kitchen,
      quantity: 0,
    },
    { id: "study", name: t("study"), imageSrc: roomImages.study, quantity: 0 },
    {
      id: "garage",
      name: t("garage"),
      imageSrc: roomImages.garage,
      quantity: 0,
    },
    {
      id: "laundry",
      name: t("laundry"),
      imageSrc: roomImages.laundry,
      quantity: 0,
    },
  ]);
  const [savedRoomEntities, setSavedRoomEntities] = useState<RoomEntity[]>([]);
  const [activeTab, setActiveTab] = useState<
    "floor-plan" | "interior" | "exterior"
  >("floor-plan");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interiorId, setInteriorId] = useState<string | null>(null);
  const [roomSpecificInteriorColors, setRoomSpecificInteriorColors] = useState<
    Map<string, string>
  >(new Map());
  const [roomSpecificInteriorStyles, setRoomSpecificInteriorStyles] = useState<
    Map<string, string>
  >(new Map());
  const [selectedRoomSidebarKey, setSelectedRoomSidebarKey] = useState<
    string | null
  >(null);
  const [roomLoading, setRoomLoading] = useState<Record<string, boolean>>({});
  const [interiorRoomsMap, setInteriorRoomsMap] = useState<
    Record<string, InteriorRoomEntity>
  >({});
  const [roomsWithNewImage, setRoomsWithNewImage] = useState<
    Record<string, boolean>
  >({});
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  // EXTERIOR STATE
  const [facadeStyle, setFacadeStyle] = useState("Modern");
  const [exteriorMaterial, setExteriorMaterial] = useState("Brick");
  const [landSize, setLandSize] = useState("Gable");
  const [exteriorImage, setExteriorImage] = useState<string | null>(null);
  const [exteriorPrompt, setExteriorPrompt] = useState<string>("");
  const [exteriorLoading, setExteriorLoading] = useState(false);
  const [exteriorError, setExteriorError] = useState<string | null>(null);

  // Helpers
  const updateInteriorRoomsMap = (roomArr: InteriorRoomEntity[]) => {
    const newMap = new Map();
    roomArr.forEach((room) => {
      // Process image URL to ensure it's valid
      let processedImage = room.image;
      if (processedImage) {
        console.log(`Processing image for room ${room.name}:`, processedImage);
        // If it's already a full URL, use as is
        if (processedImage.startsWith("http")) {
          console.log(`Room ${room.name}: Using full URL as is`);
        } else if (processedImage.startsWith("/images/")) {
          // Handle AI service URLs
          processedImage = `https://my.mayaai.online${processedImage}`;
          console.log(
            `Room ${room.name}: Processed AI service URL:`,
            processedImage
          );
        } else {
          // Assume it's a relative path, add backend URL
          processedImage = `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }${processedImage}`;
          console.log(
            `Room ${room.name}: Processed to full URL:`,
            processedImage
          );
        }
      } else {
        console.log(`Room ${room.name}: No image URL provided`);
      }

      newMap.set(room.name, {
        ...room,
        image: processedImage,
      });
    });
    setInteriorRoomsMap(Object.fromEntries(newMap));
  };

  const fetchAndSetInteriorRooms = async (intId: string) => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/interiors/${intId}/rooms`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (res.ok) {
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const intRoomsData = await res.json();
            console.log("Interior rooms data:", intRoomsData);

            // Process image URLs to ensure they're properly formatted
            const processedRooms = intRoomsData.map((room: any) => {
              if (room.image) {
                // Handle the image URL properly
                let imageUrl = room.image;

                // If it's already a full URL, use as is
                if (imageUrl && imageUrl.startsWith("http")) {
                  // URL is already complete
                } else if (imageUrl && imageUrl.startsWith("/images/")) {
                  // Handle AI service URLs
                  imageUrl = `https://my.mayaai.online${imageUrl}`;
                } else if (imageUrl) {
                  // Assume it's a relative path
                  imageUrl = `${
                    process.env.NEXT_PUBLIC_BACKEND_URL ||
                    "http://localhost:3000"
                  }${imageUrl}`;
                }

                return { ...room, image: imageUrl };
              }
              return room;
            });

            updateInteriorRoomsMap(processedRooms);
          } else {
            console.warn(
              "Interior rooms response is not JSON:",
              await res.text()
            );
          }
        } catch (parseError) {
          console.error(
            "Failed to parse interior rooms response as JSON:",
            parseError
          );
        }
      }
    } catch (error) {
      console.error("Error fetching interior rooms:", error);
    }
  };

  // Load project, floor, interior, and latest exterior on mount
  useEffect(() => {
    async function loadAll() {
      try {
        // Check if user has valid token first
        const mayaToken = localStorage.getItem("maya_token");
        const token = localStorage.getItem("token");
        if (!mayaToken && !token) {
          // Only redirect if both tokens are missing
          return;
        }
        // Get project details
        let projectData = null;
        try {
          const projectRes = await fetch(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
            }/projects/${projectId}`,
            { headers: getAuthHeaders() }
          );
          if (projectRes.ok) {
            projectData = await projectRes.json();
          } else if (projectRes.status === 401) {
            // Only redirect on actual auth error
            localStorage.removeItem("maya_token");
            localStorage.removeItem("token");
            router.replace("/login");
            return;
          }
        } catch (e) {
          // Network error, treat as no data for new project
          projectData = null;
        }
        setProject(projectData);
        // Get or create floor
        let floorData = null;
        try {
          const floorRes = await fetch(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
            }/floors/by-project/${projectId}`,
            { headers: getAuthHeaders() }
          );
          if (floorRes.ok) {
            const contentType = floorRes.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              floorData = await floorRes.json();
            }
          }
        } catch (e) {
          floorData = null;
        }
        // Create floor if it doesn't exist
        if (!floorData || !floorData.id) {
          try {
            const createFloorRes = await fetch(
              `${
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
              }/floors`,
              {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ name: "Main Floor", projectId }),
              }
            );
            if (createFloorRes.ok) {
              const contentType = createFloorRes.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                floorData = await createFloorRes.json();
              }
            }
          } catch (e) {
            floorData = null;
          }
        }
        if (floorData && floorData.id) {
          setFloorId(floorData.id);
          // Get rooms for this floor
          try {
            const roomsRes = await fetch(
              `${
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
              }/floors/${floorData.id}/rooms`,
              { headers: getAuthHeaders() }
            );
            if (roomsRes.ok) {
              const contentType = roomsRes.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const roomsData: RoomEntity[] = await roomsRes.json();
                setSavedRoomEntities(roomsData);
                setFloorPlanRooms((prev) =>
                  prev.map((room) => {
                    const found = roomsData.find(
                      (r) => r.name.toLowerCase() === room.name.toLowerCase()
                    );
                    return found
                      ? { ...room, quantity: found.quantity || 1 }
                      : { ...room, quantity: 0 };
                  })
                );
              }
            }
          } catch (e) {
            // No rooms, treat as empty
            setSavedRoomEntities([]);
          }
        }
        // Get or create interior
        let interiorData = null;
        try {
          const interiorRes = await fetch(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
            }/interiors/by-project/${projectId}`,
            { headers: getAuthHeaders() }
          );
          if (interiorRes.ok) {
            const contentType = interiorRes.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              interiorData = await interiorRes.json();
            }
          }
        } catch (e) {
          interiorData = null;
        }
        // Create interior if it doesn't exist
        if (!interiorData || !interiorData.id) {
          try {
            const intName =
              "Interior for " + (projectData?.name ?? projectId).slice(0, 12);
            const createInteriorRes = await fetch(
              `${
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
              }/interiors`,
              {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ name: intName, projectId }),
              }
            );
            if (createInteriorRes.ok) {
              const contentType = createInteriorRes.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                interiorData = await createInteriorRes.json();
              }
            }
          } catch (e) {
            interiorData = null;
          }
        }
        if (interiorData && interiorData.id) {
          setInteriorId(interiorData.id);
          await fetchAndSetInteriorRooms(interiorData.id);
        }
        // Get latest exterior for project (optional, don't throw on error)
        try {
          fetch(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
            }/exteriors/latest-by-project/${projectId}`,
            { headers: getAuthHeaders() }
          )
            .then(async (res) => {
              if (res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                  const data = await res.json();
                  if (data && data.generatedImageUrl) {
                    let imageUrl = data.generatedImageUrl;
                    if (imageUrl) {
                      if (imageUrl.startsWith("http")) {
                        // URL is already complete
                      } else if (imageUrl.startsWith("/images/")) {
                        imageUrl = `https://my.mayaai.online${imageUrl}`;
                      } else {
                        imageUrl = `${
                          process.env.NEXT_PUBLIC_BACKEND_URL ||
                          "http://localhost:3000"
                        }${imageUrl}`;
                      }
                    }
                    setExteriorImage(imageUrl);
                    setExteriorPrompt(data.prompt || "");
                    setFacadeStyle(data.facadeStyle || "Modern");
                    setExteriorMaterial(data.exteriorMaterial || "Brick");
                    setLandSize(data.landSize || "Gable");
                  }
                }
              }
            })
            .catch(() => {});
        } catch (e) {}
      } catch (error) {
        // Only set error for actual network error, not for missing data
        console.error("Error loading project data:", error);
      }
    }
    loadAll();
  }, [projectId]);

  // Auth: Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          try {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await res.json();
              setUser({ name: data.name, email: data.email });
            } else {
              console.warn("Profile response is not JSON:", await res.text());
              removeToken();
              router.replace("/login");
            }
          } catch (parseError) {
            console.error(
              "Failed to parse profile response as JSON:",
              parseError
            );
            removeToken();
            router.replace("/login");
          }
        } else {
          removeToken();
          router.replace("/login");
        }
      } catch {
        removeToken();
        router.replace("/login");
      }
    }
    fetchProfile();
  }, [router]);

  // Floor Plan
  const handleQuantityChange = (id: string, delta: number) => {
    setFloorPlanRooms((prev) =>
      prev.map((room) =>
        room.id === id
          ? { ...room, quantity: Math.max(0, (room.quantity || 0) + delta) }
          : room
      )
    );
  };

  const handleSaveRooms = async () => {
    setIsSaving(true);
    setError(null);
    try {
      let currentFloorId = floorId;
      if (!currentFloorId) {
        const createFloorRes = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/floors`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ name: "Main Floor", projectId }),
          }
        );
        let floorData = null;
        if (createFloorRes.ok) {
          try {
            const contentType = createFloorRes.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              floorData = await createFloorRes.json();
            } else {
              console.warn(
                "Create floor response is not JSON:",
                await createFloorRes.text()
              );
            }
          } catch (parseError) {
            console.error(
              "Failed to parse create floor response as JSON:",
              parseError
            );
          }
        }
        if (!floorData || !floorData.id) {
          throw new Error("Could not create floor");
        }
        setFloorId(floorData.id);
        currentFloorId = floorData.id;
      }
      const updatedRooms = floorPlanRooms.filter((room) => room.quantity > 0);
      const payload = {
        floorId: currentFloorId,
        rooms: updatedRooms.map((room) => ({
          name: room.name,
          quantity: room.quantity,
        })),
      };
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/floors/save-rooms`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to save rooms: ${res.status} ${res.statusText} - ${errorText}`
        );
      }

      let data;
      try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const responseText = await res.text();
          console.warn("Response is not JSON:", responseText);
          data = { rooms: [] };
        }
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        data = { rooms: [] };
      }
      setSavedRoomEntities(data.rooms || []);
      setFloorPlanRooms((prev) =>
        prev.map((room) => {
          const found = (data.rooms || []).find(
            (r: any) => r.name.toLowerCase() === room.name.toLowerCase()
          );
          return found
            ? { ...room, quantity: found.quantity || 1 }
            : { ...room, quantity: 0 };
        })
      );
      let newInteriorId = interiorId;
      if (!interiorId) {
        const interiorRes = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/interiors/by-project/${projectId}`,
          {
            headers: getAuthHeaders(),
          }
        );
        let interiorData = null;
        if (interiorRes.ok) {
          try {
            const contentType = interiorRes.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              interiorData = await interiorRes.json();
            } else {
              console.warn(
                "Interior response is not JSON:",
                await interiorRes.text()
              );
            }
          } catch (parseError) {
            console.error(
              "Failed to parse interior response as JSON:",
              parseError
            );
          }
        }
        if (!interiorData || !interiorData.id) {
          const intName =
            "Interior for " + (project?.name ?? projectId).slice(0, 12);
          const createInteriorRes = await fetch(
            `http://localhost:3000/interiors`,
            {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify({ name: intName, projectId }),
            }
          );
          if (createInteriorRes.ok) {
            try {
              const contentType = createInteriorRes.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                interiorData = await createInteriorRes.json();
              } else {
                console.warn(
                  "Create interior response is not JSON:",
                  await createInteriorRes.text()
                );
                setError(
                  "Could not create interior for project - invalid response format"
                );
                setIsSaving(false);
                return;
              }
            } catch (parseError) {
              console.error(
                "Failed to parse create interior response as JSON:",
                parseError
              );
              setError(
                "Could not create interior for project - invalid response"
              );
              setIsSaving(false);
              return;
            }
          } else {
            const errorText = await createInteriorRes.text();
            setError(
              `Could not create interior for project: ${createInteriorRes.status} ${createInteriorRes.statusText}`
            );
            console.error("Create Interior error:", errorText);
            setIsSaving(false);
            return;
          }
        }
        newInteriorId = interiorData.id;
        setInteriorId(newInteriorId);
      }
      if (newInteriorId) {
        const instanceRooms = updatedRooms.flatMap((room) =>
          Array.from({ length: room.quantity }, (_, i) => ({
            name: `${room.name}${room.quantity > 1 ? " " + (i + 1) : ""}`,
          }))
        );
        const saveRoomsRes = await fetch(
          `http://localhost:3000/interiors/${newInteriorId}/save-rooms?generate=false`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ rooms: instanceRooms }),
          }
        );
        if (!saveRoomsRes.ok) {
          const errorText = await saveRoomsRes.text();
          console.error("Failed to save interior rooms:", errorText);
          // Don't throw here as the main rooms were saved successfully
        }
        await fetchAndSetInteriorRooms(newInteriorId);
      }
      setActiveTab("interior");
    } catch (err: any) {
      setError(err.message || "Unknown error");
      console.error("Save Rooms Error:", err);
    }
    setIsSaving(false);
  };

  // Interior
  const expandedRoomsForSidebar = useMemo(() => {
    const rooms: { name: string; count: number }[] = [];
    savedRoomEntities.forEach((room) => {
      for (let i = 1; i <= (room.quantity || 1); i++) {
        rooms.push({
          name:
            room.quantity && room.quantity > 1
              ? `${room.name} ${i}`
              : room.name,
          count: i,
        });
      }
    });
    return rooms;
  }, [savedRoomEntities]);

  const sidebarUniqueRooms = useMemo(() => {
    const interiorNames = Object.keys(interiorRoomsMap);
    const allRoomNames = [
      ...new Set([
        ...expandedRoomsForSidebar.map((r) => r.name),
        ...interiorNames,
      ]),
    ];
    return allRoomNames;
  }, [expandedRoomsForSidebar, interiorRoomsMap]);

  const handleRoomColorChange = (roomName: string, colorHex: string) => {
    setRoomSpecificInteriorColors((prev) => {
      const newMap = new Map(prev);
      newMap.set(roomName, colorHex);
      return newMap;
    });
  };

  const handleRoomStyleChange = (roomName: string, style: string) => {
    setRoomSpecificInteriorStyles((prev) => {
      const newMap = new Map(prev);
      newMap.set(roomName, style);
      return newMap;
    });
  };

  // Generate image for a single room, update only that room in the map
  const generateImageForRoom = async (roomName: string) => {
    if (!interiorId) return;
    setRoomLoading((prev) => ({ ...prev, [roomName]: true }));
    try {
      const color = roomSpecificInteriorColors.get(roomName) || "";
      const style = roomSpecificInteriorStyles.get(roomName) || "";
      const payload = [{ name: roomName, color, style }];
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/interiors/${interiorId}/save-rooms?generate=true`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ rooms: payload }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      console.log("Image generation response:", data);
      // Update only the room that was just generated
      if (data.rooms) {
        const updated = data.rooms.find((room: any) => room.name === roomName);
        console.log("Updated room data:", updated);
        if (updated && updated.image) {
          // Handle the image URL properly
          let imageUrl = updated.image;

          // If it's already a full URL, use as is
          if (imageUrl && imageUrl.startsWith("http")) {
            // URL is already complete
          } else if (imageUrl && imageUrl.startsWith("/images/")) {
            // Handle AI service URLs
            imageUrl = `https://my.mayaai.online${imageUrl}`;
          } else if (imageUrl) {
            // Assume it's a relative path
            imageUrl = `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
            }${imageUrl}`;
          }

          console.log(`Setting image URL for ${roomName}:`, imageUrl);
          setInteriorRoomsMap((prev) => ({
            ...prev,
            [roomName]: { ...updated, image: imageUrl },
          }));
        } else {
          console.warn(
            `No image URL found for room ${roomName} in response:`,
            updated
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setRoomLoading((prev) => ({ ...prev, [roomName]: false }));
  };

  // Save & proceed: Only send changed/updated rooms
  const handleSaveAndProceedToExterior = async () => {
    if (!interiorId) return;
    setIsSaving(true);
    setError(null);
    try {
      // Only changed rooms (color/style different from DB)
      const roomsToUpdate = sidebarUniqueRooms
        .filter(
          (roomName) =>
            (roomSpecificInteriorColors.get(roomName) !== undefined &&
              roomSpecificInteriorColors.get(roomName) !==
                interiorRoomsMap[roomName]?.color) ||
            (roomSpecificInteriorStyles.get(roomName) !== undefined &&
              roomSpecificInteriorStyles.get(roomName) !==
                interiorRoomsMap[roomName]?.style)
        )
        .map((roomName) => ({
          name: roomName,
          color:
            roomSpecificInteriorColors.get(roomName) ||
            interiorRoomsMap[roomName]?.color ||
            null,
          style:
            roomSpecificInteriorStyles.get(roomName) ||
            interiorRoomsMap[roomName]?.style ||
            null,
        }));
      if (roomsToUpdate.length > 0) {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/interiors/${interiorId}/save-rooms?generate=false`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ rooms: roomsToUpdate }),
          }
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // Update only the changed rooms in the map
        if (data.rooms) {
          setInteriorRoomsMap((prev) => {
            const newMap = { ...prev };
            data.rooms.forEach((room: any) => {
              newMap[room.name] = room;
            });
            return newMap;
          });
        }
      }
      setActiveTab("exterior");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setIsSaving(false);
  };

  // EXTERIOR GENERATION HANDLER
  const handleGenerateExterior = async () => {
    setExteriorLoading(true);
    setExteriorError(null);
    setExteriorImage(null);
    try {
      const payload = {
        projectId: projectId,
        facadeStyle,
        exteriorMaterial,
        landSize,
        prompt: exteriorPrompt, // Add the prompt to the payload
      };
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/exteriors`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      console.log("Exterior generation response:", data);

      // Handle the image URL properly
      if (data.generatedImageUrl) {
        let imageUrl = data.generatedImageUrl;

        // Validate and process the image URL
        if (imageUrl && typeof imageUrl === 'string') {
          // If it's already a full URL, use as is
          if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            // URL is already complete
            console.log("Using full URL as is:", imageUrl);
          } else if (imageUrl.startsWith("/images/")) {
            // Handle AI service URLs
            imageUrl = `https://my.mayaai.online${imageUrl}`;
            console.log("Processed AI service URL:", imageUrl);
          } else if (imageUrl.startsWith("/")) {
            // Assume it's a relative path
            imageUrl = `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
            }${imageUrl}`;
            console.log("Processed relative URL:", imageUrl);
          } else {
            // If it's just a filename or path, add the backend URL
            imageUrl = `${
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
            }/images/${imageUrl}`;
            console.log("Processed filename URL:", imageUrl);
          }

          console.log("Final exterior image URL:", imageUrl);
          setExteriorImage(imageUrl);
        } else {
          console.warn("Invalid image URL received:", data.generatedImageUrl);
          setExteriorError("Invalid image URL received from server");
        }
      }
      setExteriorPrompt(data.prompt || "");
    } catch (err: any) {
      setExteriorError(err.message || "Failed to generate exterior");
    }
    setExteriorLoading(false);
  };

  // Export handler: navigate to /download?projectId=<id>
  const handleExport = () => {
    if (projectId) {
      router.push(`/download?projectId=${encodeURIComponent(projectId)}`);
    } else {
      router.push("/download");
    }
  };

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-black via-gray-900 to-black"
          : "bg-gradient-to-br from-white via-gray-50 to-white"
      }`}
    >
      {/* Header */}
      <UserHeader title={t("maya_project")} subtitle="" />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full mt-20 sm:mt-24">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none w-full">
          <div
            className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-5 ${
              isDark ? "bg-white" : "bg-black"
            }`}
          />
          <div
            className={`absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-3 ${
              isDark ? "bg-white" : "bg-black"
            }`}
          />
        </div>
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8 w-full">
          <div
            className={`inline-flex items-center p-1 rounded-full shadow-lg backdrop-blur-xl border transition-all duration-300 max-w-full overflow-x-auto ${
              isDark
                ? "bg-black/60 border-white/20"
                : "bg-white/80 border-black/20"
            }`}
          >
            <button
              onClick={() => setActiveTab("floor-plan")}
              className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === "floor-plan"
                  ? isDark
                    ? "bg-white text-black shadow-lg"
                    : "bg-black text-white shadow-lg"
                  : isDark
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-black/70 hover:text-black hover:bg-black/10"
              }`}
            >
              <LayoutGrid className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("floor_plan")}</span>
              <span className="sm:hidden">{t("plan")}</span>
            </button>
            <button
              onClick={() => setActiveTab("interior")}
              className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === "interior"
                  ? isDark
                    ? "bg-white text-black shadow-lg"
                    : "bg-black text-white shadow-lg"
                  : isDark
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-black/70 hover:text-black hover:bg-black/10"
              }`}
            >
              <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("interior")}</span>
              <span className="sm:hidden">{t("inside")}</span>
            </button>
            <button
              onClick={() => setActiveTab("exterior")}
              className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === "exterior"
                  ? isDark
                    ? "bg-white text-black shadow-lg"
                    : "bg-black text-white shadow-lg"
                  : isDark
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-black/70 hover:text-black hover:bg-black/10"
              }`}
            >
              <Mountain className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t("exterior")}</span>
              <span className="sm:hidden">{t("outside")}</span>
            </button>
          </div>
        </div>
        <Tabs
          value={activeTab}
          className="w-full max-w-full"
          onValueChange={(v) => setActiveTab(v as any)}
        >
          {/* Floor Plan Tab */}
          <TabsContent value="floor-plan" className="space-y-8">
            {error && error !== "Failed to load project data" && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-8 py-4 rounded-3xl font-semibold backdrop-blur-xl shadow-2xl">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
              {floorPlanRooms.map((room) => (
                <Card
                  key={room.id}
                  className={`group overflow-hidden rounded-2xl shadow-xl border-0 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
                    isDark
                      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
                      : "bg-gradient-to-br from-white via-gray-50 to-gray-100"
                  }`}
                  style={{
                    minHeight: 340,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="relative w-full h-40 overflow-hidden rounded-t-2xl">
                    <Image
                      src={room.imageSrc}
                      alt={room.name}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                        target.onerror = null; // Prevent infinite loop
                      }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        isDark
                          ? "from-black/60 to-transparent"
                          : "from-white/60 to-transparent"
                      }`}
                    />
                    <div className="absolute top-3 right-3">
                      <div
                        className={`px-3 py-1 rounded-xl font-semibold text-xs shadow backdrop-blur-xl ${
                          isDark
                            ? "bg-white/10 text-white"
                            : "bg-black/10 text-black"
                        }`}
                      >
                        {room.quantity} {t("selected")}
                      </div>
                    </div>
                  </div>
                  <CardContent className="flex flex-col flex-1 justify-between p-6">
                    <h3
                      className={`text-lg font-extrabold mb-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {room.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-8 h-8 rounded-xl text-base transition-all duration-200 ${
                          isDark
                            ? "text-white border-white/20 hover:bg-white/10"
                            : "text-black border-black/10 hover:bg-black/10"
                        }`}
                        onClick={() => handleQuantityChange(room.id, -1)}
                        disabled={isSaving || room.quantity <= 0}
                        aria-label="Decrease"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span
                        className={`text-xl font-bold tabular-nums w-10 text-center ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        {room.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`w-8 h-8 rounded-xl text-base transition-all duration-200 ${
                          isDark
                            ? "text-white border-white/20 hover:bg-white/10"
                            : "text-black border-black/10 hover:bg-black/10"
                        }`}
                        onClick={() => handleQuantityChange(room.id, 1)}
                        disabled={isSaving}
                        aria-label="Increase"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Continue button */}
            <div className="flex justify-end mt-8">
              <Button
                className={`relative px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 border-2 focus:outline-none focus:ring-4 active:scale-95 overflow-hidden min-h-[48px]
                  ${
                    isDark
                      ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-white/10 hover:border-white/30 shadow-lg"
                      : "bg-gradient-to-r from-white via-gray-50 to-gray-100 text-black border-black/10 hover:border-black/30 shadow-lg"
                  }
                `}
                onClick={handleSaveRooms}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    <span className="font-bold tracking-wider">
                      {t("saving_rooms")}
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    <span className="font-bold tracking-wider">
                      {t("continue_to_interior")}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          {/* Interior Tab */}
          <TabsContent value="interior" className="space-y-8">
            {sidebarUniqueRooms.length === 0 ? (
              <Card
                className={`p-16 rounded-3xl text-center backdrop-blur-2xl border shadow-2xl ${
                  isDark
                    ? "bg-black/40 border-white/10"
                    : "bg-white/40 border-black/10"
                }`}
              >
                <div
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  No Rooms Selected
                </div>
                <p
                  className={`text-lg ${
                    isDark ? "text-white/60" : "text-black/60"
                  }`}
                >
                  Please add rooms in the Floor Plan tab to continue with
                  interior design.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
                {/* Room Customization Panel */}
                <div className="xl:col-span-1">
                  <Card
                    className={`p-5 rounded-3xl backdrop-blur-2xl border shadow-2xl sticky top-36 max-h-[calc(100vh-200px)] overflow-y-auto transition-all duration-300 ${
                      isDark
                        ? "bg-black/60 border-white/20"
                        : "bg-white/80 border-black/20"
                    }`}
                  >
                    <h2
                      className={`text-2xl font-black mb-6 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Room Customization
                    </h2>
                    <div className="space-y-6">
                      {sidebarUniqueRooms.map((roomName) => {
                        const colorHex =
                          roomSpecificInteriorColors.get(roomName) || "";
                        const styleValue =
                          roomSpecificInteriorStyles.get(roomName) || "";
                        const dbRoom = interiorRoomsMap[roomName];
                        console.log(`Room ${roomName} data:`, dbRoom);
                        const displayColor = colorHex || dbRoom?.color || "";
                        const displayStyle = styleValue || dbRoom?.style || "";
                        return (
                          <div
                            key={roomName}
                            className={`p-4 rounded-2xl border transition-all duration-300 ${
                              isDark
                                ? "bg-white/10 border-white/20"
                                : "bg-black/10 border-black/20"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3
                                className={`text-lg font-bold ${
                                  isDark ? "text-white" : "text-black"
                                }`}
                              >
                                {roomName}
                              </h3>
                              <button
                                disabled={roomLoading[roomName] || isSaving}
                                onClick={() => generateImageForRoom(roomName)}
                                className={`w-12 h-12 rounded-2xl transition-all duration-300 border-2 focus:outline-none focus:ring-4 active:scale-95
                                  ${
                                    isDark
                                      ? "bg-black text-white border-white/20 hover:border-white/40"
                                      : "bg-white text-black border-black/20 hover:border-black/40"
                                  } 
                                `}
                              >
                                <div className="relative flex items-center justify-center">
                                  {roomLoading[roomName] ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                  ) : (
                                    <RefreshCw className="h-5 w-5" />
                                  )}
                                </div>
                              </button>
                            </div>
                            {dbRoom?.image && (
                              <div className="mb-4">
                                <Image
                                  src={dbRoom.image || "/placeholder.svg"}
                                  alt={roomName}
                                  width={300}
                                  height={200}
                                  className="w-full h-40 object-cover rounded-2xl shadow-xl"
                                  onError={(e) => {
                                    console.error(
                                      `Failed to load image for ${roomName}:`,
                                      dbRoom.image
                                    );
                                    // Fallback to placeholder
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder.svg";
                                  }}
                                  unoptimized={true}
                                />
                              </div>
                            )}
                            <div className="space-y-3">
                              <div>
                                <Label
                                  className={`text-xs font-bold mb-2 block ${
                                    isDark ? "text-white" : "text-black"
                                  }`}
                                >
                                  {t("color_palette")}
                                </Label>
                                <Select>
                                  <SelectTrigger
                                    className={`w-full py-3 rounded-2xl border-0 text-sm shadow-xl backdrop-blur-2xl focus:ring-2 focus:ring-gray-400 transition-all duration-300 ${
                                      isDark
                                        ? "bg-white/20 text-white placeholder-white/70"
                                        : "bg-black/10 text-black placeholder-black/60"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {displayColor && (
                                        <div
                                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                                          style={{
                                            backgroundColor: displayColor,
                                          }}
                                        />
                                      )}
                                      <span
                                        className={`${
                                          isDark ? "text-white" : "text-black"
                                        }`}
                                      >
                                        <SelectValue
                                          placeholder={t("choose_color")}
                                        />
                                      </span>
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent
                                    className={`rounded-2xl shadow-2xl backdrop-blur-2xl border-0 mt-2 p-2 max-h-60 overflow-y-auto ${
                                      isDark
                                        ? "bg-black/90 text-white"
                                        : "bg-white/95 text-black"
                                    }`}
                                  >
                                    {availableColors.map((color) => (
                                      <SelectItem
                                        key={color.hex}
                                        value={color.hex}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={`w-6 h-6 rounded-full ${
                                              isDark &&
                                              [
                                                "#FFFFFF",
                                                "#F8F9FA",
                                                "#FFF8E7",
                                                "#E3F2FD",
                                              ].includes(color.hex)
                                                ? "border-2 border-white/80"
                                                : ""
                                            }`}
                                            style={{
                                              backgroundColor: color.hex,
                                            }}
                                          />
                                          <span
                                            className={`${
                                              isDark
                                                ? "text-white"
                                                : "text-black"
                                            }`}
                                          >
                                            {color.name}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label
                                  className={`text-xs font-bold mb-2 block ${
                                    isDark ? "text-white" : "text-black"
                                  }`}
                                >
                                  {t("design_style")}
                                </Label>
                                <Select>
                                  <SelectTrigger
                                    className={`w-full py-3 rounded-2xl border-0 text-sm shadow-xl backdrop-blur-2xl focus:ring-2 focus:ring-gray-400 transition-all duration-300 ${
                                      isDark
                                        ? "bg-white/20 text-white placeholder-white/70"
                                        : "bg-black/10 text-black placeholder-black/60"
                                    }`}
                                  >
                                    <span
                                      className={`${
                                        isDark ? "text-white" : "text-black"
                                      }`}
                                    >
                                      <SelectValue
                                        placeholder={t("choose_style")}
                                      />
                                    </span>
                                  </SelectTrigger>
                                  <SelectContent
                                    className={`rounded-2xl shadow-2xl backdrop-blur-2xl border-0 mt-2 p-2 max-h-60 overflow-y-auto ${
                                      isDark
                                        ? "bg-black/90 text-white"
                                        : "bg-white/95 text-black"
                                    }`}
                                  >
                                    {[
                                      t("modern"),
                                      t("traditional"),
                                      t("industrial"),
                                      t("bohemian"),
                                      t("luxury"),
                                      t("minimalist"),
                                      t("contemporary"),
                                    ].map((style) => (
                                      <SelectItem key={style} value={style}>
                                        <span
                                          className={`${
                                            isDark ? "text-white" : "text-black"
                                          }`}
                                        >
                                          {style}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Button
                      className={`relative w-full px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 border-2 focus:outline-none focus:ring-4 active:scale-95 overflow-hidden min-h-[48px] flex items-center justify-center
                        ${
                          isDark
                            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-white/10 hover:border-white/30 shadow-lg"
                            : "bg-gradient-to-r from-white via-gray-50 to-gray-100 text-black border-black/10 hover:border-black/30 shadow-lg"
                        } 
                      `}
                      onClick={handleSaveAndProceedToExterior}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin w-5 h-5 mr-2" />
                          <span className="font-bold tracking-wider">
                            {t("saving_changes")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          <span className="font-bold tracking-wider">
                            {t("continue_to_exterior")}
                          </span>
                        </>
                      )}
                    </Button>
                  </Card>
                </div>
                {/* Interior Gallery */}
                <div className="xl:col-span-2">
                  <Card
                    className={`p-6 rounded-3xl backdrop-blur-2xl shadow-2xl ${
                      isDark ? "bg-black/60" : "bg-white/90"
                    }`}
                  >
                    <h2
                      className={`text-2xl font-black mb-6 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {t("interior")} {t("gallery")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sidebarUniqueRooms.map((roomName) => {
                        const dbRoom = interiorRoomsMap[roomName];
                        if (!dbRoom?.image) return null;
                        const colorName = dbRoom.color
                          ? availableColors.find((c) => c.hex === dbRoom.color)
                              ?.name || dbRoom.color
                          : null;
                        return (
                          <Card
                            key={roomName}
                            className={`group overflow-hidden rounded-3xl shadow-2xl border-4 border-transparent hover:border-blue-400 transition-all duration-500 hover:scale-[1.025] backdrop-blur-2xl ${
                              isDark ? "bg-black/80" : "bg-white/95"
                            }`}
                            style={{ maxWidth: "100%", width: "100%" }}
                          >
                            <div className="relative overflow-hidden rounded-t-3xl">
                              <Image
                                src={dbRoom.image || "/placeholder.svg"}
                                alt={roomName}
                                width={900}
                                height={650}
                                className="w-full h-[34rem] object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110 group-hover:contrast-125"
                                onError={(e) => {
                                  console.error(
                                    `Image failed to load for room ${roomName}:`,
                                    dbRoom.image
                                  );
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.svg";
                                  target.onerror = null;
                                }}
                                onLoad={(e) => {
                                  console.log(
                                    `Image loaded successfully for room ${roomName}:`,
                                    dbRoom.image
                                  );
                                }}
                                unoptimized={true}
                              />
                              {/* Overlay gradient and room name */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                              <div className="absolute bottom-0 left-0 w-full px-8 pb-8 flex flex-col items-start">
                                <h3 className="text-3xl font-extrabold text-white drop-shadow-lg mb-2">
                                  {dbRoom.name}
                                </h3>
                                <p className="text-lg font-semibold text-white/80 drop-shadow-md">
                                  {dbRoom.style}
                                  {colorName && ` • ${colorName}`}
                                </p>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          {/* Exterior Tab */}
          <TabsContent value="exterior" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {/* Exterior Controls */}
              <Card
                className={`p-6 rounded-3xl backdrop-blur-2xl border shadow-2xl ${
                  isDark
                    ? "bg-black/40 border-white/10"
                    : "bg-white/40 border-black/10"
                }`}
              >
                <h2
                  className={`text-2xl font-black mb-6 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {t("exterior_design")}
                </h2>
                <div className="space-y-6">
                  <div>
                    <Label
                      className={`text-sm font-bold mb-3 block ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {t("facade_style")}
                    </Label>
                    <Select>
                      <SelectTrigger
                        className={`w-full py-4 rounded-2xl border-0 text-lg shadow-xl backdrop-blur-2xl focus:ring-2 focus:ring-gray-400 transition-all duration-300 ${
                          isDark
                            ? "bg-white/10 text-white placeholder-white/70"
                            : "bg-black/5 text-black placeholder-black/60"
                        }`}
                      >
                        <span
                          className={`${isDark ? "text-white" : "text-black"}`}
                        >
                          <SelectValue placeholder={t("choose_option")} />
                        </span>
                      </SelectTrigger>
                      <SelectContent
                        className={`rounded-2xl shadow-2xl backdrop-blur-2xl border-0 mt-2 p-2 max-h-60 overflow-y-auto ${
                          isDark
                            ? "bg-black/90 text-white"
                            : "bg-white/95 text-black"
                        }`}
                      >
                        <SelectItem value="Modern">
                          <span
                            className={`${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {t("modern")}
                          </span>
                        </SelectItem>
                        <SelectItem value="Traditional">
                          <span
                            className={`${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {t("traditional")}
                          </span>
                        </SelectItem>
                        <SelectItem value="Contemporary">
                          <span
                            className={`${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {t("contemporary")}
                          </span>
                        </SelectItem>
                        <SelectItem value="Farmhouse">
                          <span
                            className={`${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {t("farmhouse")}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      className={`text-sm font-bold mb-3 block ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {t("exterior_material")}
                    </Label>
                    <Select>
                      <SelectTrigger
                        className={`w-full py-4 rounded-2xl border-0 text-lg shadow-xl backdrop-blur-2xl focus:ring-2 focus:ring-gray-400 transition-all duration-300 ${
                          isDark
                            ? "bg-white/10 text-white placeholder-white/70"
                            : "bg-black/5 text-black placeholder-black/60"
                        }`}
                      >
                        <span
                          className={`${isDark ? "text-white" : "text-black"}`}
                        >
                          <SelectValue placeholder={t("choose_option")} />
                        </span>
                      </SelectTrigger>
                      <SelectContent
                        className={`rounded-2xl shadow-2xl backdrop-blur-2xl border-0 mt-2 p-2 max-h-60 overflow-y-auto ${
                          isDark
                            ? "bg-black/90 text-white"
                            : "bg-white/95 text-black"
                        }`}
                      >
                        <SelectItem value="Brick">
                          <span
                            className={`${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {t("brick")}
                          </span>
                        </SelectItem>
                        <SelectItem value="Siding">
                          <span
                            className={`${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {t("siding")}
                          </span>
                        </SelectItem>
                        <SelectItem value="Stone">
                          <span
                            className={`${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {t("stone")}
                          </span>
                        </SelectItem>
                        <SelectItem value="Wood">
                          <span
                            className={`${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {t("wood")}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      className={`text-sm font-bold mb-3 block ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {t("land_size")}
                    </Label>
                    <Input
                      type="number"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      className={`py-4 rounded-2xl border-0 text-lg shadow-xl backdrop-blur-2xl focus:ring-2 focus:ring-gray-400 transition-all duration-300 ${
                        isDark
                          ? "bg-white/10 text-white placeholder-white/80"
                          : "bg-black/5 text-black placeholder-black/60"
                      }`}
                      placeholder={t("enter_land_size")}
                    />
                  </div>
                  <div>
                    <Label
                      className={`text-sm font-bold mb-3 block ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {t("exterior_prompt")}
                    </Label>
                    <Input
                      type="text"
                      value={exteriorPrompt}
                      onChange={(e) => setExteriorPrompt(e.target.value)}
                      className={`py-4 rounded-2xl border-0 text-lg shadow-xl backdrop-blur-2xl focus:ring-2 focus:ring-gray-400 transition-all duration-300 ${
                        isDark
                          ? "bg-white/10 text-white placeholder-white/80"
                          : "bg-black/5 text-black placeholder-black/60"
                      }`}
                      placeholder={t("enter_exterior_prompt")}
                    />
                  </div>
                </div>
                <Button
                  className={`relative w-full mt-6 px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 border-2 focus:outline-none focus:ring-4 active:scale-95 overflow-hidden min-h-[48px]
                    ${
                      isDark
                        ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-white/10 hover:border-white/30 shadow-lg"
                        : "bg-gradient-to-r from-white via-gray-50 to-gray-100 text-black border-black/10 hover:border-black/30 shadow-lg"
                    }
                  `}
                  onClick={handleGenerateExterior}
                  disabled={exteriorLoading}
                >
                  {exteriorLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      <span className="font-bold tracking-wider">
                        {t("generating_design")}
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      <span className="font-bold tracking-wider">
                        Generate Exterior
                      </span>
                    </>
                  )}
                </Button>
                {exteriorError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-6 py-4 rounded-2xl font-semibold mt-6">
                    {exteriorError}
                  </div>
                )}
              </Card>
              {/* Exterior Preview */}
              <Card
                className={`p-6 rounded-3xl backdrop-blur-2xl border shadow-2xl relative ${
                  isDark
                    ? "bg-black/40 border-white/10"
                    : "bg-white/40 border-black/10"
                }`}
              >
                <h2
                  className={`text-2xl font-black mb-6 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Exterior Preview
                </h2>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  {exteriorLoading ? (
                    <div className="text-center">
                      <Loader2 className="animate-spin w-16 h-16 mb-6 mx-auto" />
                      <p
                        className={`text-xl font-semibold ${
                          isDark ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Creating your exterior design...
                      </p>
                    </div>
                  ) : exteriorImage ? (
                    <div className="w-full">
                      <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-6">
                        <SafeImage
                          src={exteriorImage || "/placeholder.svg"}
                          alt="Generated exterior"
                          width={600}
                          height={400}
                          className="w-full h-80 object-cover"
                          onLoad={(e) => {
                            console.log(
                              "Exterior image loaded successfully:",
                              exteriorImage
                            );
                          }}
                        />
                      </div>
                      {exteriorPrompt && (
                        <div
                          className={`p-6 rounded-2xl border ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white/80"
                              : "bg-black/5 border-black/10 text-black/80"
                          }`}
                        >
                          <p className="font-semibold mb-2">
                            Generation Prompt:
                          </p>
                          <p className="text-sm leading-relaxed">
                            {exteriorPrompt}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div
                        className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 mx-auto ${
                          isDark ? "bg-white/10" : "bg-black/10"
                        }`}
                      >
                        <Mountain
                          className={`w-12 h-12 ${
                            isDark ? "text-white/40" : "text-black/40"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-xl font-semibold ${
                          isDark ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Your exterior design will appear here
                      </p>
                    </div>
                  )}
                </div>
                {exteriorImage && (
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: isDark
                        ? "0 0 30px 12px rgba(255,255,255,0.2)"
                        : "0 0 30px 12px rgba(0,0,0,0.2)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`absolute bottom-8 right-8 px-8 py-4 rounded-3xl font-black text-base transition-all duration-500 border-2 focus:outline-none focus:ring-4 active:scale-95 overflow-hidden min-h-[50px]
                      ${
                        isDark
                          ? "bg-white text-black border-black/20 hover:border-black/40 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                          : "bg-black text-white border-white/20 hover:border-white/40 shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(0,0,0,0.25)]"
                      } 
                    `}
                    onClick={handleExport}
                  >
                    {/* Animated background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        isDark
                          ? "from-black/5 via-black/10 to-black/5"
                          : "from-white/5 via-white/10 to-white/5"
                      } animate-pulse`}
                    />

                    {/* Glowing border effect */}
                    <div
                      className={`absolute inset-0 rounded-3xl ${
                        isDark
                          ? "bg-gradient-to-r from-black/20 via-black/10 to-black/20"
                          : "bg-gradient-to-r from-white/20 via-white/10 to-white/20"
                      } opacity-0 hover:opacity-100 transition-opacity duration-500`}
                    />

                    {/* Content */}
                    <div className="relative flex items-center justify-center w-full">
                      <Upload className="w-5 h-5 mr-2 animate-pulse" />
                      <span className="font-black tracking-wider">
                        Export Project
                      </span>
                    </div>
                  </motion.button>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

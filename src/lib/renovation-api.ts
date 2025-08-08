// Renovation API service for Maya AI backend integration

import { apiRequest } from "./auth";
import { BACKEND_CONFIG, AI_CONFIG } from "./config";

export interface InteriorRoom {
  id: string;
  name: string;
  color?: string;
  style?: string;
  image?: string;
}

export interface Interior {
  id: string;
  name: string;
  projectId: string;
  rooms: InteriorRoom[];
}

export interface Exterior {
  id: string;
  projectId: string;
  facadeStyle: string;
  exteriorMaterial: string;
  landSize: string;
  generatedImageUrl?: string;
  prompt?: string;
}

export interface GenerateInteriorRequest {
  roomName: string;
  color?: string;
  style?: string;
  model: "diffusion" | "image-to-image";
  inputImage?: File;
  prompt: string;
}

export interface GenerateExteriorRequest {
  projectId: string;
  facadeStyle: string;
  exteriorMaterial: string;
  landSize: string;
  model: "diffusion" | "image-to-image";
  inputImage?: File;
  prompt: string;
}

// Renovation API functions
export const renovationApi = {
  // Interior Generation
  async createInterior(projectId: string, name: string): Promise<Interior> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.INTERIOR.CREATE, {
        method: "POST",
        body: JSON.stringify({ name, projectId }),
      });
      if (!response.ok) throw new Error("Failed to create interior");
      return await response.json();
    } catch (error) {
      console.error("Error creating interior:", error);
      throw error;
    }
  },

  async getInteriorsByProject(projectId: string): Promise<Interior[]> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.INTERIOR.GET_BY_PROJECT(projectId));
      if (!response.ok) throw new Error("Failed to fetch interiors");
      return await response.json();
    } catch (error) {
      console.error("Error fetching interiors:", error);
      return [];
    }
  },

  async getInteriorRooms(interiorId: string): Promise<InteriorRoom[]> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.INTERIOR.GET_BY_PROJECT(interiorId));
      if (!response.ok) throw new Error("Failed to fetch interior rooms");
      return await response.json();
    } catch (error) {
      console.error("Error fetching interior rooms:", error);
      return [];
    }
  },

  async saveInteriorRooms(
    interiorId: string,
    rooms: InteriorRoom[],
    generateImages: boolean = true
  ): Promise<InteriorRoom[]> {
    try {
      const response = await apiRequest(
        `${BACKEND_CONFIG.INTERIOR.GET_BY_PROJECT(interiorId)}?generate=${generateImages}`,
        {
          method: "POST",
          body: JSON.stringify({ rooms }),
        }
      );
      if (!response.ok) throw new Error("Failed to save interior rooms");
      return await response.json();
    } catch (error) {
      console.error("Error saving interior rooms:", error);
      throw error;
    }
  },

  async generateInteriorImage(
    interiorId: string,
    roomName: string,
    color: string,
    style: string,
    model: "diffusion" | "image-to-image" = "diffusion",
    inputImage?: File
  ): Promise<InteriorRoom> {
    try {
      const formData = new FormData();
      formData.append("roomName", roomName);
      formData.append("color", color);
      formData.append("style", style);
      formData.append("model", model);
      
      if (inputImage) {
        formData.append("inputImage", inputImage);
      }

      const response = await apiRequest(BACKEND_CONFIG.INTERIOR.GET_BY_PROJECT(interiorId), {
        method: "POST",
        headers: {}, // Let browser set Content-Type for FormData
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to generate interior image");
      return await response.json();
    } catch (error) {
      console.error("Error generating interior image:", error);
      throw error;
    }
  },

  // Exterior Generation
  async createExterior(
    projectId: string,
    facadeStyle: string,
    exteriorMaterial: string,
    landSize: string,
    model: "diffusion" | "image-to-image" = "diffusion",
    inputImage?: File,
    prompt?: string
  ): Promise<Exterior> {
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("facadeStyle", facadeStyle);
      formData.append("exteriorMaterial", exteriorMaterial);
      formData.append("landSize", landSize);
      formData.append("model", model);
      
      if (inputImage) {
        formData.append("inputImage", inputImage);
      }
      
      if (prompt) {
        formData.append("prompt", prompt);
      }

      const response = await apiRequest(BACKEND_CONFIG.EXTERIOR.CREATE, {
        method: "POST",
        headers: {}, // Let browser set Content-Type for FormData
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to create exterior");
      return await response.json();
    } catch (error) {
      console.error("Error creating exterior:", error);
      throw error;
    }
  },

  async getLatestExterior(projectId: string): Promise<Exterior | null> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.EXTERIOR.GET_BY_PROJECT(projectId));
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error fetching latest exterior:", error);
      return null;
    }
  },

  async getAllExteriors(projectId: string): Promise<Exterior[]> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.EXTERIOR.GET_BY_PROJECT(projectId));
      if (!response.ok) throw new Error("Failed to fetch exteriors");
      return await response.json();
    } catch (error) {
      console.error("Error fetching exteriors:", error);
      return [];
    }
  },

  async regenerateExterior(
    exteriorId: string,
    model: "diffusion" | "image-to-image" = "diffusion",
    inputImage?: File,
    prompt?: string
  ): Promise<Exterior> {
    try {
      const formData = new FormData();
      formData.append("model", model);
      
      if (inputImage) {
        formData.append("inputImage", inputImage);
      }
      
      if (prompt) {
        formData.append("prompt", prompt);
      }

      const response = await apiRequest(BACKEND_CONFIG.EXTERIOR.GET_BY_PROJECT(exteriorId), {
        method: "POST",
        headers: {}, // Let browser set Content-Type for FormData
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to regenerate exterior");
      return await response.json();
    } catch (error) {
      console.error("Error regenerating exterior:", error);
      throw error;
    }
  },

  // Diffusion Model Generation (no input image needed)
  async generateWithDiffusion(
    type: "interior" | "exterior",
    prompt: string,
    style: string,
    color?: string
  ): Promise<{ imageUrl: string; prompt: string }> {
    try {
      const response = await fetch(`${AI_CONFIG.BASE_URL}${AI_CONFIG.GENERATE.DIFFUSION}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          prompt,
          style,
          color,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to generate with diffusion model");
      const data = await response.json();
      
      // Handle new Maya AI response format
      return {
        imageUrl: data.output_image_url || data.imageUrl,
        prompt: prompt,
      };
    } catch (error) {
      console.error("Error generating with diffusion model:", error);
      throw error;
    }
  },

  // Image-to-Image Generation (requires input image)
  async generateWithImageToImage(
    type: "interior" | "exterior",
    inputImage: File,
    prompt: string,
    style: string,
    color?: string
  ): Promise<{ imageUrl: string; prompt: string }> {
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("input_image", inputImage);
      formData.append("prompt", prompt);
      formData.append("style", style);
      
      if (color) {
        formData.append("color", color);
      }

      const response = await fetch(`${AI_CONFIG.BASE_URL}${AI_CONFIG.GENERATE.IMAGE_TO_IMAGE}`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to generate with image-to-image model");
      const data = await response.json();
      
      // Handle new Maya AI response format
      return {
        imageUrl: data.output_image_url || data.imageUrl,
        prompt: prompt,
      };
    } catch (error) {
      console.error("Error generating with image-to-image model:", error);
      throw error;
    }
  },
}; 
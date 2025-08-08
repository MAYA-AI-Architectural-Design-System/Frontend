// Chat API service for Maya AI backend integration

import { apiRequest } from "./auth";
import { BACKEND_CONFIG } from "./config";

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  aiImageUrl?: string;
  uploadedImageUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface CreateChatRequest {
  title: string;
}

export interface SendMessageRequest {
  content: string;
  image?: File;
  model?: "standard" | "pro" | "vision";
}

export interface UpdateChatRequest {
  title: string;
}

// Chat API functions
export const chatApi = {
  // Get all chats for the current user
  async getChats(): Promise<Chat[]> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.CHAT.LIST);
      if (!response.ok) throw new Error("Failed to fetch chats");
      const data = await response.json();
      return data.map((item: any) => ({
        id: item.id,
        title: item.title || "New Chat",
        messages: [],
        createdAt: item.createdAt,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error fetching chats:", errorMessage);
      return [];
    }
  },

  // Create a new chat
  async createChat(title: string): Promise<Chat> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.CHAT.CREATE, {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error("Failed to create chat");
      const data = await response.json();
      return {
        id: data.id,
        title: data.title,
        messages: [],
        createdAt: data.createdAt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error creating chat:", errorMessage);
      throw error instanceof Error ? error : new Error(`Failed to create chat: ${errorMessage}`);
    }
  },

  // Get a specific chat with its messages
  async getChat(chatId: string): Promise<Chat> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.CHAT.GET(chatId));
      if (!response.ok) throw new Error("Failed to fetch chat");
      const data = await response.json();
      return {
        id: data.id,
        title: data.title,
        messages: Array.isArray(data.messages)
          ? data.messages.map((msg: any) => ({
              id: msg.id,
              type: msg.type,
              content: msg.content,
              aiImageUrl: msg.aiImageUrl,
              uploadedImageUrl: msg.uploadedImageUrl,
              timestamp: msg.timestamp,
            }))
          : [],
        createdAt: data.createdAt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error fetching chat:", errorMessage);
      throw error instanceof Error ? error : new Error(`Failed to fetch chat: ${errorMessage}`);
    }
  },

  // Send a message in a chat
  async sendMessage(
    chatId: string,
    content: string,
    image?: File,
    model: "standard" | "pro" | "vision" = "standard"
  ): Promise<{ userMessage: Message; aiResponse: Message }> {
    try {
      // Validate parameters
      if (!chatId || typeof chatId !== 'string') {
        throw new Error("Invalid chat ID provided");
      }
      
      if (!content || typeof content !== 'string') {
        throw new Error("Invalid content provided");
      }

      const formData = new FormData();
      formData.append("content", content);
      formData.append("model", model);
      
      if (image) {
        // Validate image file
        if (!(image instanceof File)) {
          throw new Error("Invalid image file provided");
        }
        
        // Validate file size (50MB limit)
        if (image.size > 50 * 1024 * 1024) {
          throw new Error("Image file size exceeds 50MB limit");
        }
        
        // Validate file type
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(image.type)) {
          throw new Error("Invalid image file type. Only PNG, JPG, JPEG are allowed");
        }
        
        // Backend expects "input_image" field name
        formData.append("input_image", image);
        console.log("Uploading image:", image.name, "Size:", image.size, "Type:", image.type);
      }

      console.log("Sending message to chat:", chatId);
      console.log("Content:", content);
      console.log("Model:", model);

      let response;
      try {
        response = await apiRequest(BACKEND_CONFIG.CHAT.MESSAGE(chatId), {
          method: "POST",
          body: formData,
        });
      } catch (requestError) {
        const errorMessage = requestError instanceof Error ? requestError.message : String(requestError);
        console.error("API request failed:", errorMessage);
        throw new Error(`Network error: ${errorMessage}`);
      }
      
      if (!response.ok) {
        let errorText = "";
        try {
          errorText = await response.text();
        } catch {
          errorText = "Unable to read error response";
        }
        console.error("Backend error:", errorText);
        throw new Error(`Failed to send message: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // Parse the response data
      const data = await response.json();
      console.log("Message sent successfully");
      
      // Return the response data in the expected format
      return {
        userMessage: data.userMessage || {
          id: `${Date.now()}-user`,
          type: "user" as const,
          content: content,
          timestamp: new Date().toISOString(),
          uploadedImageUrl: data.uploadedImageUrl,
        },
        aiResponse: data.aiResponse || {
          id: `${Date.now()}-ai`,
          type: "assistant" as const,
          content: data.content || "Message processed successfully",
          timestamp: new Date().toISOString(),
          aiImageUrl: data.aiImageUrl,
        },
      };
    } catch (error) {
      // Safely handle error logging
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error sending message:", errorMessage);
      
      // Re-throw with a clean error message
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to send message: ${errorMessage}`);
      }
    }
  },

  // Update chat title
  async updateChatTitle(chatId: string, title: string): Promise<void> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.CHAT.UPDATE(chatId), {
        method: "PATCH",
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error("Failed to update chat title");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error updating chat title:", errorMessage);
      throw error instanceof Error ? error : new Error(`Failed to update chat title: ${errorMessage}`);
    }
  },

  // Delete a chat
  async deleteChat(chatId: string): Promise<void> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.CHAT.DELETE(chatId), {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete chat");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error deleting chat:", errorMessage);
      throw error instanceof Error ? error : new Error(`Failed to delete chat: ${errorMessage}`);
    }
  },
}; 
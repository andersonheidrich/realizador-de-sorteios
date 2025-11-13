import { createContext } from "react";

export type FlashType = "success" | "error" | "warning" | "info";

export interface FlashMessage {
  id: string;
  message: string;
  type: FlashType;
}

export interface FlashContextType {
  showFlash: (message: string, type?: FlashType) => void;
}

export const FlashContext = createContext<FlashContextType | undefined>(
  undefined
);

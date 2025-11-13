import React, { useCallback, useState } from "react";
import {
  FlashContext,
  type FlashMessage,
  type FlashType,
} from "./FlashContext";

export const FlashProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [flashes, setFlashes] = useState<FlashMessage[]>([]);

  const showFlash = useCallback((message: string, type: FlashType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setFlashes((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setFlashes((prev) => prev.filter((flash) => flash.id !== id));
    }, 5000);
  }, []);

  const removeFlash = useCallback((id: string) => {
    setFlashes((prev) => prev.filter((flash) => flash.id !== id));
  }, []);

  const getStyles = (type: FlashType) => {
    switch (type) {
      case "success":
        return "bg-green-500 border-green-600";
      case "error":
        return "bg-red-500 border-red-600";
      case "warning":
        return "bg-yellow-500 border-yellow-600";
      case "info":
      default:
        return "bg-blue-500 border-blue-600";
    }
  };

  return (
    <FlashContext.Provider value={{ showFlash }}>
      {children}
      {flashes.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="space-y-2 pointer-events-auto">
            {flashes.map((flash) => (
              <div
                key={flash.id}
                className={`${getStyles(
                  flash.type
                )} text-white px-6 py-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between min-w-80 max-w-md transition-all duration-300 animate-fade-in`}
              >
                <span className="font-medium">{flash.message}</span>
                <button
                  onClick={() => removeFlash(flash.id)}
                  className="ml-4 text-white hover:text-gray-200 font-bold text-xl cursor-pointer transition-colors duration-300"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </FlashContext.Provider>
  );
};

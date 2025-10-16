"use client";

import React, { useEffect, useState } from "react";
import { useToast, ToasterToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ToastItemProps = {
  toast: ToasterToast;
  dismiss: (id: string) => void;
};

export function ToastRenderer() {
  const { toasts, dismiss } = useToast();
  console.log("Rendering ToastRenderer with toasts:", toasts);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-[9999]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} dismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, dismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (toast.open === false) {
      const timeout = setTimeout(() => dismiss(toast.id), 300); // match CSS transition
      return () => clearTimeout(timeout);
    }
  }, [toast.open]);

  return (
    <div
      className={cn(
        "bg-gray-800 text-white px-4 py-3 rounded shadow-md max-w-sm transition-all duration-300",
        toast.variant === "default" && "bg-gray-800",
        toast.variant === "destructive" && "bg-red-600",
        toast.variant === "success" && "bg-green-600",
        toast.variant === "info" && "bg-blue-600",
        toast.open === false && "opacity-0 scale-95" // smooth exit
      )}
    >
      <div className="flex justify-between items-center">
        <div>
          {toast.title && <p className="font-semibold">{toast.title}</p>}
          {toast.description && (
            <p className="text-sm text-gray-200">{toast.description}</p>
          )}
        </div>
        <button onClick={() => dismiss(toast.id)} className="ml-4 text-sm">
          ✕
        </button>
      </div>
    </div>
  );
}

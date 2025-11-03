// utils.tsx
import { FileSearch } from "lucide-react";

export const LoadingState = ({
  message = "Loading...",
}: {
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-10 text-gray-300">
    <div className="relative">
      <div className="h-10 w-10 border-4 border-gray-600 border-t-epiclinx-teal rounded-full animate-spin" />
    </div>
    <p className="mt-3 text-sm text-gray-400">{message}</p>
  </div>
);

export const EmptyState = ({
  message = "No data found",
}: {
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <FileSearch className="h-12 w-12 mb-3 text-gray-500" />
    <p className="text-lg">{message}</p>
  </div>
);

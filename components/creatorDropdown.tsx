"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiFetch } from "@/lib/api";

interface Creator {
  _id: string;
  name: string;
  email: string;
}

interface CreatorDropdownProps {
  value?: string;
  onChange: (creatorId: string) => void;
}

export default function CreatorDropdown({ value, onChange }: CreatorDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [creators, setCreators] = React.useState<Creator[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res:any = await apiFetch("/brand/fetch-all-creator"); 
        setCreators(res.data || []);
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  const selectedCreator = creators.find((c) => c._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent border-gray-400 text-white"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="animate-spin w-4 h-4" /> Loading...
            </div>
          ) : selectedCreator ? (
            <span>{selectedCreator.name} ({selectedCreator.email})</span>
          ) : (
            "Select creator..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="[width:var(--radix-popover-trigger-width)] p-0 bg-black border-gray-700">
        <Command>
          <CommandInput placeholder="Search creator..." />
          <CommandEmpty>No creators found.</CommandEmpty>
          <CommandGroup>
            {creators.map((creator) => (
              <CommandItem
                key={creator._id}
                value={`${creator.name} ${creator.email}`}
                onSelect={() => {
                  onChange(creator._id);
                  setOpen(false);
                }}
                className="flex flex-col items-start py-2"
              >
                <div className="flex w-full justify-between">
                  <span className="text-gray-500">{creator.name}</span>
                  {creator._id === value && (
                    <Check className="h-4 w-4 text-[#0ABAB5]" />
                  )}
                </div>
                <span className="text-xs text-gray-400">{creator.email}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

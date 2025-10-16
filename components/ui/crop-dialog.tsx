"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/lib/crop-image";

interface CropDialogProps {
  image: File | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export default function CropDialog({
  image,
  open,
  onClose,
  onCropComplete,
}: CropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteHandler = useCallback(
    (_: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleDone = async () => {
    if (!image || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(
      URL.createObjectURL(image),
      croppedAreaPixels
    );
    const croppedFile = new File([croppedBlob], image.name, {
      type: image.type,
    });
    onCropComplete(croppedFile);
    onClose();
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-full">
        <DialogTitle>Crop Your Image</DialogTitle>
        <div className="relative w-full h-[400px] bg-black">
          <Cropper
            image={URL.createObjectURL(image)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className="mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleDone} className="rounded-full px-4 py-2">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

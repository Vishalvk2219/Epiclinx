
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: any
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");

      ctx?.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        200,
        200
      );

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], "cropped.jpeg", { type: "image/jpeg" }));
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, "image/jpeg");
    };

    image.onerror = () => reject(new Error("Failed to load image"));
  });
}

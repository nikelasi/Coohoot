import { PixelCrop } from "react-image-crop";

const cropImage = async (imageElm: HTMLImageElement, file: File, crop: PixelCrop) => {

  const canvas = document.createElement("canvas");
  const scaleX = imageElm.naturalWidth / imageElm.width;
  const scaleY = imageElm.naturalHeight / imageElm.height;
  const pixelRatio = window.devicePixelRatio;
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx!.imageSmoothingQuality = "high";

  ctx!.drawImage(
    imageElm,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  // Get blob of cropped image
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob: any) => {
      if (blob) {
        blob.name = file.name;
        blob.lastModified = file.lastModified;
        resolve(blob);
      }
    }, file.type);
  });

  // Get cropped image file
  const croppedFile = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
  
  // Get base64 string of cropped image
  const croppedImageUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(croppedFile);
  });

  return croppedImageUrl;
};

export default cropImage;

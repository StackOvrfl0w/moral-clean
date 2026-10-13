export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type ImageType = {
  mime: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  extension: "jpg" | "png" | "gif" | "webp";
};

const imageTypes: ImageType[] = [
  { mime: "image/jpeg", extension: "jpg" },
  { mime: "image/png", extension: "png" },
  { mime: "image/gif", extension: "gif" },
  { mime: "image/webp", extension: "webp" },
];

export function validateImageMetadata(size: number, extension: string, contentType: string) {
  if (!Number.isSafeInteger(size) || size <= 0 || size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be between 1 byte and 5 MB.");
  }
  if (!imageTypes.some((type) => type.extension === extension && type.mime === contentType)) {
    throw new Error("Only valid JPEG, PNG, GIF, or WebP images are supported.");
  }
}

function matchesSignature(bytes: Uint8Array, type: ImageType) {
  if (type.mime === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (type.mime === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (value, index) => bytes[index] === value,
    );
  }

  if (type.mime === "image/gif") {
    return (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38 &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) &&
      bytes[5] === 0x61
    );
  }

  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

export async function validateImageUpload(file: File) {
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be between 1 byte and 5 MB.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detectedType = imageTypes.find((type) => matchesSignature(bytes, type));

  if (!detectedType) {
    throw new Error("Only valid JPEG, PNG, GIF, or WebP images are supported.");
  }

  return {
    file,
    contentType: detectedType.mime,
    extension: detectedType.extension,
  };
}

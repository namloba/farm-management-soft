import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CameraUpload } from './CameraUpload';

interface ImageUploaderProps {
  onImagesUploaded: (images: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

const ImageUploader = ({ onImagesUploaded, existingImages = [], maxImages = 5 }: ImageUploaderProps) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Dùng useCallback để tránh tạo hàm mới mỗi lần render
  const updateImages = useCallback((newImages: string[]) => {
    setImages(newImages);
    onImagesUploaded(newImages);
  }, [onImagesUploaded]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files;
    const files: File[] = inputFiles ? Array.from(inputFiles) : [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          const newImages = [...images, result];
          updateImages(newImages);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images, maxImages, updateImages]);

  const handleCameraCapture = useCallback((imageData: string) => {
    const newImages = [...images, imageData];
    updateImages(newImages);
    setShowCamera(false);
  }, [images, updateImages]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    updateImages(newImages);
  }, [images, updateImages]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const openCamera = useCallback(() => {
    setShowCamera(true);
  }, []);

  const closeCamera = useCallback(() => {
    setShowCamera(false);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img}
              alt={`Upload ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div className="flex gap-3">
            <button
              onClick={openFilePicker}
              className="w-20 h-20 border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">photo_library</span>
              <span className="text-[10px] text-on-surface-variant">Chọn ảnh</span>
            </button>
            
            <button
              onClick={openCamera}
              className="w-20 h-20 border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">camera_alt</span>
              <span className="text-[10px] text-on-surface-variant">Chụp ảnh</span>
            </button>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <AnimatePresence>
        {showCamera && (
          <CameraUpload
            onImageCapture={handleCameraCapture}
            onClose={closeCamera}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
export default ImageUploader;
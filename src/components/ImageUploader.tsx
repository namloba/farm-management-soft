import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CameraUpload } from './CameraUpload';

interface ImageUploaderProps {
  onImagesUploaded: (images: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export function ImageUploader({ onImagesUploaded, existingImages = [], maxImages = 5 }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = maxImages - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          const newImages = [...prev, reader.result as string];
          onImagesUploaded(newImages);
          return newImages;
        });
      };
        reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = (imageData: string) => {
    setImages(prev => {
      const newImages = [...prev, imageData];
      onImagesUploaded(newImages);
      return newImages;
    });
    setShowCamera(false);
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      onImagesUploaded(newImages);
      return newImages;
    });
  };

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
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">photo_library</span>
              <span className="text-[10px] text-on-surface-variant">Chọn ảnh</span>
            </button>
            
            <button
              onClick={() => setShowCamera(true)}
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
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
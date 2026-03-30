import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'motion/react';

interface CameraUploadProps {
  onImageCapture: (imageData: string) => void;
  onClose: () => void;
}

export function CameraUpload({ onImageCapture, onClose }: CameraUploadProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onImageCapture(imageSrc);
      onClose();
    }
  }, [webcamRef, onImageCapture, onClose]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
    >
      <div className="relative w-full max-w-md mx-auto">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: facingMode,
          }}
          className="w-full rounded-2xl shadow-2xl"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-6 bg-gradient-to-t from-black/50 to-transparent">
          <button
            onClick={toggleCamera}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white">cameraswitch</span>
          </button>
          
          <button
            onClick={capture}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-full border-4 border-primary"></div>
          </button>
          
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
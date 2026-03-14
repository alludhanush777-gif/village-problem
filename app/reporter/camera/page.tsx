'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RotateCcw, Check, X, Image as ImageIcon } from 'lucide-react';

export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions or use the gallery option.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const usePhoto = () => {
    if (capturedImage) {
      sessionStorage.setItem('capturedImage', capturedImage);
      router.push('/reporter/report');
    }
  };

  const discardPhoto = () => {
    setCapturedImage(null);
    stopCamera();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Capture Fault Image</h2>
      <p className="text-sm text-muted-foreground">
        Take a clear photo of the faulty equipment for quick identification
      </p>

      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          {capturedImage ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Captured fault"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <Button onClick={retakePhoto} variant="secondary" size="lg" className="rounded-full">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Retake
                </Button>
                <Button onClick={usePhoto} size="lg" className="rounded-full">
                  <Check className="mr-2 h-5 w-5" />
                  Use Photo
                </Button>
              </div>
            </div>
          ) : isCameraActive ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-[4/3] object-cover bg-muted"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <Button
                  onClick={stopCamera}
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <X className="h-6 w-6" />
                </Button>
                <Button
                  onClick={capturePhoto}
                  size="icon"
                  className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90"
                >
                  <Camera className="h-8 w-8" />
                </Button>
                <div className="w-12" /> {/* Spacer for symmetry */}
              </div>
            </div>
          ) : (
            <div className="aspect-[4/3] bg-muted flex flex-col items-center justify-center p-6">
              {error ? (
                <div className="text-center">
                  <p className="text-sm text-destructive mb-4">{error}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Camera preview will appear here
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={startCamera} size="lg">
                  <Camera className="mr-2 h-5 w-5" />
                  Open Camera
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Gallery
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {capturedImage && (
        <Button variant="ghost" onClick={discardPhoto} className="w-full text-destructive">
          Discard Photo
        </Button>
      )}

      {/* Tips */}
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-medium mb-2">Photo Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>- Ensure good lighting</li>
            <li>- Capture the entire device</li>
            <li>- Show any visible damage clearly</li>
            <li>- Include the device ID if visible</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

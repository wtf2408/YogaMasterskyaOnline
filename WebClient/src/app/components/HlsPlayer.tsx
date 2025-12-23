import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsPlayerProps {
  src: string;
}

export function HlsPlayer({ src }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari / iOS — нативный HLS
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    // Остальные браузеры
    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full object-contain bg-black"
    />
  );
}

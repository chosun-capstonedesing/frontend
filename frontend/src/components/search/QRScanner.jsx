import React, { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

function QRScanner({ onScanSuccess }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    scannerRef.current = new QrScanner(
      videoEl,
      result => {
        onScanSuccess(result?.data);
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        preferredCamera: 'environment'
      }
    );

    QrScanner.hasCamera().then(hasCamera => {
      if (hasCamera) {
        scannerRef.current.start().catch(err => {
          console.error("Failed to start QR scanner:", err);
        });
      } else {
        console.error("No camera found.");
      }
    });

    return () => {
      scannerRef.current?.stop();
    };
  }, [onScanSuccess]);

  return (
    <div className="w-full max-w-sm mx-auto border rounded">
      <video ref={videoRef} className="w-full aspect-video" />
    </div>
  );
}

export default QRScanner;
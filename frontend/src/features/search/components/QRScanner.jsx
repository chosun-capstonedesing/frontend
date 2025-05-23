import React, { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

function QRScanner({ onScanSuccess }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    scannerRef.current = new QrScanner(
      videoEl,
      result => {
        if (!scannedRef.current && result?.data) {
          scannedRef.current = true;
          onScanSuccess(result.data);
          scannerRef.current?.stop();
        }
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
    <div className="w-[320px] h-[240px] rounded-xl shadow-xl overflow-hidden mr-auto">
      <video ref={videoRef} className="w-full h-full object-cover" />
    </div>
  );
}

export default QRScanner;
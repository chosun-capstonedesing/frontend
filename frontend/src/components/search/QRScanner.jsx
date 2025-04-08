import React, { useEffect } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

function QRScanner({ onScanSuccess }) {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          console.error("📷 No cameras found.");
          return;
        }

        const cameraId = cameras[0].id;
        await html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            console.log("QR scan error:", errorMessage);
          }
        );
      } catch (err) {
        console.error("Camera start failed:", err);
      }
    };

    startScanner();

    return () => {
      html5QrCode.getState().then((state) => {
        if (
          state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.PAUSED
        ) {
          html5QrCode.stop().catch((err) =>
            console.warn("Stop error (ignored):", err)
          );
        }
      });
    };
  }, [onScanSuccess]);

  return (
    <div>
      <div id="qr-reader" className="w-full max-w-sm h-64 border" />
    </div>
  );
}

export default QRScanner;
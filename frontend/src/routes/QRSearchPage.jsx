import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess }) => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    useEffect(() => {
        const startScanner = async () => {
            try {
                const cameraId = await Html5Qrcode.getCameras().then(cameras => cameras[0].id);
                await html5QrCode.start(
                    cameraId,
                    { fps: 10, qrbox: 250 },
                    onScanSuccess,
                    (errorMessage) => { /* handle scan failure */ }
                );
            } catch (err) {
                console.error("Camera start failed:", err);
            }
        };

        startScanner();

        return () => {
            html5QrCode.getState().then(state => {
                if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
                    html5QrCode.stop().catch(err => console.warn("Stop error:", err));
                }
            });
        };
    }, [onScanSuccess, html5QrCode]);

    return (
        <div id="qr-reader" style={{ width: "500px" }}></div>
    );
};

export default QRScanner;
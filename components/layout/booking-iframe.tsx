"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function BookingIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!iframeRef.current) return;

      const height = Number(e.data);

      if (!isNaN(height)) {
        iframeRef.current.style.height = `${Math.max(height, 350)}px`;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <Script
        src="https://live.ipms247.com/booking/templates/resui/js/vendor/jquery-a.k.c.min.js"
        strategy="afterInteractive"
      />

      <div className="w-full rounded-2xl overflow-hidden bg-white shadow-xl">
        <iframe
          ref={iframeRef}
          src="https://live.ipms247.com/booking/availability_calender.php?HotelId=kattil"
          width="100%"
          height="350"
          frameBorder="0"
          name="re_califrame"
          className="re_califrame w-full"
          id="re_califrame"
          scrolling="no"
        />
      </div>
    </>
  );
}

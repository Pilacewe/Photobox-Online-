import React from 'react';

/**
 * FrameOverlay component
 * 
 * @param {string} frameUrl - URL or path to the frame image (e.g. from Canva, PNG with transparency)
 * @param {React.ReactNode} children - The content (camera feed or captured photos) to place UNDER the frame
 */
export default function FrameOverlay({ frameUrl, children, className = '' }) {
  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center ${className}`}>
      {/* 
        This is where the camera or captured photos go.
        It sits behind the frame due to z-index.
      */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {children}
      </div>

      {/* 
        The actual frame image. Must be a PNG or SVG with a transparent center.
        We use pointer-events-none so users can still click the camera if needed.
      */}
      {frameUrl && (
        <img 
          src={frameUrl} 
          alt="Photobooth Frame" 
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        />
      )}
    </div>
  );
}

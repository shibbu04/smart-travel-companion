import React, { useRef, useEffect } from 'react';

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface PathCanvasProps {
  locations: Location[];
}

const PathCanvas: React.FC<PathCanvasProps> = ({ locations }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (locations.length < 2) {
      // Draw placeholder message
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Path will appear here', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Find bounds
    const lats = locations.map(loc => loc.latitude);
    const lngs = locations.map(loc => loc.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add padding
    const padding = 20;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    // Convert coordinates to canvas coordinates
    const toCanvasCoords = (lat: number, lng: number) => {
      const x = padding + ((lng - minLng) / (maxLng - minLng)) * width;
      const y = padding + ((maxLat - lat) / (maxLat - minLat)) * height;
      return { x, y };
    };

    // Draw path
    ctx.beginPath();
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    locations.forEach((location, index) => {
      const coords = toCanvasCoords(location.latitude, location.longitude);
      if (index === 0) {
        ctx.moveTo(coords.x, coords.y);
      } else {
        ctx.lineTo(coords.x, coords.y);
      }
    });

    ctx.stroke();

    // Draw points
    locations.forEach((location, index) => {
      const coords = toCanvasCoords(location.latitude, location.longitude);
      
      // Draw point
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = index === 0 ? '#10B981' : index === locations.length - 1 ? '#EF4444' : '#3B82F6';
      ctx.fill();
      
      // Draw border
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 4, 0, 2 * Math.PI);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw legend
    const legendY = canvas.height - 15;
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    
    // Start point
    ctx.beginPath();
    ctx.arc(15, legendY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#10B981';
    ctx.fill();
    ctx.fillStyle = '#4B5563';
    ctx.fillText('Start', 25, legendY + 4);
    
    // End point
    ctx.beginPath();
    ctx.arc(80, legendY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.fillStyle = '#4B5563';
    ctx.fillText('Current', 90, legendY + 4);

  }, [locations]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="w-full h-48 bg-gray-50 rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default PathCanvas;
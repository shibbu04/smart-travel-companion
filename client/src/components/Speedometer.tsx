import React, { useRef, useEffect } from 'react';
import { Navigation, Gauge } from 'lucide-react';

interface SpeedometerProps {
  speed: number; // in km/h
  heading: number; // in degrees
  accuracy: number; // in meters
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed, heading, accuracy }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawSpeedometer();
  }, [speed, heading]);

  const drawSpeedometer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw speed arc
    const maxSpeed = 120; // km/h
    const speedAngle = (speed / maxSpeed) * 2 * Math.PI;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + speedAngle);
    ctx.strokeStyle = speed > 60 ? '#EF4444' : speed > 30 ? '#F59E0B' : '#10B981';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw speed text
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${speed.toFixed(1)}`, centerX, centerY - 5);
    
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('km/h', centerX, centerY + 15);

    // Draw compass needle for heading
    const needleLength = 30;
    const needleX = centerX + needleLength * Math.sin((heading * Math.PI) / 180);
    const needleY = centerY - needleLength * Math.cos((heading * Math.PI) / 180);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleX, needleY);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
  };

  const getSpeedColor = () => {
    if (speed > 60) return 'text-red-500';
    if (speed > 30) return 'text-warning-500';
    return 'text-green-500';
  };

  const getAccuracyColor = () => {
    if (accuracy > 100) return 'text-red-500';
    if (accuracy > 50) return 'text-warning-500';
    return 'text-green-500';
  };

  const getCardinalDirection = (heading: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Gauge className="w-5 h-5 mr-2 text-blue-500" />
        Speed & Direction
      </h2>

      <div className="space-y-4">
        {/* Speedometer Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className="max-w-full"
          />
        </div>

        {/* Speed and Direction Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Speed</span>
            </div>
            <div className={`text-lg font-bold ${getSpeedColor()}`}>
              {speed.toFixed(1)} km/h
            </div>
          </div>

          <div className="bg-white/70 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Navigation className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Direction</span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              {getCardinalDirection(heading)} ({heading.toFixed(0)}°)
            </div>
          </div>
        </div>

        {/* Accuracy Info */}
        <div className="bg-white/70 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">GPS Accuracy</span>
            <span className={`text-sm font-semibold ${getAccuracyColor()}`}>
              ±{accuracy.toFixed(0)}m
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                accuracy > 100 ? 'bg-red-500' : accuracy > 50 ? 'bg-warning-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.max(10, Math.min(100, 100 - (accuracy / 200) * 100))}%` }}
            ></div>
          </div>
        </div>

        {/* Speed Categories */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Walking/Slow (0-30 km/h)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span>Moderate (30-60 km/h)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Fast (60+ km/h)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
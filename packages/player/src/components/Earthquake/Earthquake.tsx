import { useEarthquakeStore } from "@/stores/earthquakeStore";
import { useEffect, useState } from "react";

export const Earthquake = () => {
  // Use Zustand store instead of local state
  const { magnitude } = useEarthquakeStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const amplitude = magnitude * 8; // Slightly reduced base amplitude
  const verticalAmplitude = magnitude * 0.2; // Vertical movement is usually less
  const shouldCollapse = magnitude > 9.5;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;
    if (shouldCollapse && !isCollapsed) {
      // Trigger collapse after a short delay
      timer = setTimeout(() => {
        setShowExplosion(true);
        timer2 = setTimeout(() => {
          setIsCollapsed(true);
          setShowExplosion(false);
        }, 1000); // Show explosion for 1 second
      }, 2000); // Let it shake for 2 seconds before collapsing
    } else if (!shouldCollapse) {
      setIsCollapsed(false);
      setShowExplosion(false);
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [magnitude, shouldCollapse, isCollapsed]);

  return (
    <div>
      <style>
        {`
          @keyframes shake {
            0% { transform: translate(0px, 0px); }
            10% { transform: translate(${amplitude * 0.8}px, ${verticalAmplitude * 0.3}px); }
            20% { transform: translate(-${amplitude * 0.6}px, -${verticalAmplitude * 0.7}px); }
            30% { transform: translate(${amplitude * 1}px, ${verticalAmplitude * 0.5}px); }
            40% { transform: translate(-${amplitude * 0.9}px, -${verticalAmplitude * 0.2}px); }
            50% { transform: translate(${amplitude * 0.7}px, ${verticalAmplitude * 0.8}px); }
            60% { transform: translate(-${amplitude * 1}px, -${verticalAmplitude * 0.4}px); }
            70% { transform: translate(${amplitude * 0.5}px, ${verticalAmplitude * 0.6}px); }
            80% { transform: translate(-${amplitude * 0.8}px, -${verticalAmplitude * 0.9}px); }
            90% { transform: translate(${amplitude * 0.4}px, ${verticalAmplitude * 0.3}px); }
            100% { transform: translate(0px, 0px); }
          }
          
          @keyframes collapse {
            0% { transform: scale(1) rotate(0deg); opacity: 1; }
            25% { transform: scale(0.95) rotate(-2deg); }
            50% { transform: scale(0.8) rotate(5deg); }
            75% { transform: scale(0.6) rotate(-10deg); opacity: 0.7; }
            100% { transform: scale(0.3) rotate(90deg) translateY(50px); opacity: 0; }
          }
          
          @keyframes explosion {
            0% { transform: scale(0); opacity: 1; background: #ff6b00; }
            50% { transform: scale(2); opacity: 0.8; background: #ffff00; }
            100% { transform: scale(4); opacity: 0; background: #ff0000; }
          }
          
          @keyframes flyBrick1 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(-120px, -80px) rotate(180deg); opacity: 0; }
          }
          
          @keyframes flyBrick2 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(100px, -60px) rotate(-150deg); opacity: 0; }
          }
          
          @keyframes flyBrick3 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(-80px, 40px) rotate(120deg); opacity: 0; }
          }
          
          @keyframes flyBrick4 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(90px, 30px) rotate(-90deg); opacity: 0; }
          }
          
          @keyframes flyBrick5 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(0px, -100px) rotate(360deg); opacity: 0; }
          }
          
          @keyframes flyBrick6 {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(130px, -20px) rotate(200deg); opacity: 0; }
          }
          
          .shake {
            animation: shake 1s infinite;
            transform-origin: center center;
          }
          
          .collapsing {
            animation: collapse 1.5s ease-in forwards;
            transform-origin: center bottom;
          }
          
          .explosion {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            animation: explosion 1s ease-out forwards;
          }
          
          .brick1 { animation: flyBrick1 1s ease-out forwards; }
          .brick2 { animation: flyBrick2 1s ease-out forwards; animation-delay: 0.1s; }
          .brick3 { animation: flyBrick3 1s ease-out forwards; animation-delay: 0.2s; }
          .brick4 { animation: flyBrick4 1s ease-out forwards; animation-delay: 0.05s; }
          .brick5 { animation: flyBrick5 1s ease-out forwards; animation-delay: 0.15s; }
          .brick6 { animation: flyBrick6 1s ease-out forwards; animation-delay: 0.08s; }
        `}
      </style>
      <div className="flex justify-center items-center h-40 relative">
        {!isCollapsed && !showExplosion ? (
          <p className="text-[8rem] shake">🏢</p>
        ) : showExplosion ? (
          <div className="relative">
            <div className="explosion absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-3xl brick1 absolute">🧱</span>
              <span className="text-3xl brick2 absolute">🧱</span>
              <span className="text-3xl brick3 absolute">🧱</span>
              <span className="text-3xl brick4 absolute">🧱</span>
              <span className="text-3xl brick5 absolute">🧱</span>
              <span className="text-3xl brick6 absolute">🧱</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl">🏚️</div>
          </div>
        )}
      </div>
      {shouldCollapse && (
        <div className="text-center mt-4">
          <p className="text-red-600 font-bold text-lg">CATASTROPHIC EARTHQUAKE! BUILDING COLLAPSED!</p>
          <p className="text-sm text-gray-600">Magnitude {magnitude} - Structural failure</p>
        </div>
      )}
    </div>
  );
};

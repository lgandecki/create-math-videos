import React from "react";

interface BeakerProps {
  level: number; // 0 to 1
  liquidColor: string;
  className?: string;
}

const Beaker = ({ level, liquidColor, className }: BeakerProps) => {
  const fullGlassPath =
    "M23.421,2.516c-1.423,1.601-2.095,3.733-1.844,5.86L37.815,146.48v0.009l3.763,32c0.443,3.777,3.644,6.624,7.448,6.624 h87.061c3.804,0,7.005-2.847,7.448-6.624l3.763-32v-0.009L163.535,8.376c0.251-2.127-0.421-4.26-1.844-5.86 C160.268,0.916,158.228,0,156.087,0H29.026C26.884,0,24.844,0.916,23.421,2.516z M129.417,170.112H55.696l-1.986-16.896h77.693 L129.417,170.112z M147.653,15l-14.486,123.216H51.946L37.459,15H147.653z";
  const innerGlassPath = "M147.653,15l-14.486,123.216H51.946L37.459,15H147.653z";
  const innerGlassHeight = 123.216;
  const innerGlassTopY = 15;

  return (
    <svg className={className} version="1.1" viewBox="0 0 185.112 185.112" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="inner-glass-clip">
          <path d={innerGlassPath} />
        </clipPath>
      </defs>
      <g>
        {/* Liquid */}
        <rect
          clipPath="url(#inner-glass-clip)"
          x="0"
          y={innerGlassTopY + innerGlassHeight * (1 - level)}
          width="185.112"
          height={innerGlassHeight * level}
          className={liquidColor}
          fill="currentColor"
        />
        {/* Glass outline */}
        <path d={fullGlassPath} fill="currentColor" className="text-gray-200" />
      </g>
    </svg>
  );
};

export default Beaker;

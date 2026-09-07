import React from "react";

export default function SkylineSilhouette({
  className = "w-full h-auto text-white/20",
  cutoutFill = "#FAF8F2",
}: {
  className?: string;
  cutoutFill?: string;
}) {
  return (
    <svg
      viewBox="0 0 920 360"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Baseline ground connection */}
      <rect x="0" y="240" width="920" height="120" />

      {/* ================= 1. MINARET / TOWER (Qutub Minar style) ================= */}
      <g>
        {/* Spire tip */}
        <polygon points="45,45 42,75 48,75" />
        {/* Top cupola */}
        <path d="M38,75 Q45,65 52,75 L50,88 L40,88 Z" />
        {/* Balcony 1 */}
        <rect x="34" y="88" width="22" height="7" rx="1.5" />
        {/* Shaft 1 */}
        <polygon points="36,95 38,138 52,138 54,95" />
        {/* Balcony 2 */}
        <rect x="32" y="138" width="26" height="8" rx="2" />
        {/* Shaft 2 */}
        <polygon points="34,146 36,196 54,196 56,146" />
        {/* Balcony 3 */}
        <rect x="30" y="196" width="30" height="9" rx="2" />
        {/* Shaft 3 */}
        <polygon points="32,205 35,260 55,260 58,205" />
        {/* Balcony 4 */}
        <rect x="28" y="260" width="34" height="10" rx="2" />
        {/* Base Shaft */}
        <polygon points="30,270 33,360 57,360 60,270" />
      </g>

      {/* Connecting low wall between Minaret and Taj */}
      <rect x="58" y="235" width="40" height="125" />

      {/* ================= 2. TAJ MAHAL COMPLEX ================= */}
      <g>
        {/* Left Minaret */}
        <polygon points="108,82 106,105 110,105" />
        <path d="M103,105 Q108,95 113,105 L112,118 L104,118 Z" />
        <rect x="100" y="118" width="16" height="5" rx="1" />
        <polygon points="102,123 103,165 113,165 114,123" />
        <rect x="99" y="165" width="18" height="6" rx="1" />
        <polygon points="101,171 102,225 114,225 115,171" />
        <rect x="98" y="225" width="20" height="6" rx="1" />
        <polygon points="100,231 101,360 115,360 116,231" />

        {/* Left Small Chhatri Dome */}
        <polygon points="152,110 150,126 154,126" />
        <path d="M145,126 Q152,115 159,126 L158,135 L146,135 Z" />
        <rect x="144" y="135" width="16" height="4" />
        <rect x="146" y="139" width="3" height="26" />
        <rect x="155" y="139" width="3" height="26" />
        <rect x="142" y="165" width="20" height="75" />

        {/* Taj Main Onion Dome & Facade */}
        {/* Central Finial Spire */}
        <polygon points="230,40 228,78 232,78" />
        <circle cx="230" cy="62" r="3" />
        {/* Bulbous Onion Dome */}
        <path d="M230,75 C212,85 198,110 206,136 C208,142 214,152 216,160 L244,160 C246,152 252,142 254,136 C262,110 248,85 230,75 Z" />
        {/* Dome base drum */}
        <rect x="214" y="160" width="32" height="12" />

        {/* Taj Main Facade Box */}
        <path d="M180,172 L280,172 L280,360 L180,360 Z" />

        {/* Central Iwan Arch (cutout using negative shape / background color fill or path) */}
        <path
          d="M205,360 L205,240 Q205,210 230,200 Q255,210 255,240 L255,360 Z"
          fill={cutoutFill}
          opacity="0.9"
        />

        {/* Right Small Chhatri Dome */}
        <polygon points="308,110 306,126 310,126" />
        <path d="M301,126 Q308,115 315,126 L314,135 L302,135 Z" />
        <rect x="300" y="135" width="16" height="4" />
        <rect x="302" y="139" width="3" height="26" />
        <rect x="311" y="139" width="3" height="26" />
        <rect x="298" y="165" width="20" height="75" />

        {/* Right Minaret */}
        <polygon points="352,82 350,105 354,105" />
        <path d="M347,105 Q352,95 357,105 L356,118 L348,118 Z" />
        <rect x="344" y="118" width="16" height="5" rx="1" />
        <polygon points="346,123 347,165 357,165 358,123" />
        <rect x="343" y="165" width="18" height="6" rx="1" />
        <polygon points="345,171 346,225 358,225 359,171" />
        <rect x="342" y="225" width="20" height="6" rx="1" />
        <polygon points="344,231 345,360 359,360 360,231" />
      </g>

      {/* Connecting wall between Taj and India Gate */}
      <rect x="360" y="235" width="45" height="125" />

      {/* ================= 3. INDIA GATE ARCH ================= */}
      <g>
        {/* Top Dome Bowl / Urn */}
        <path d="M472,112 Q485,100 498,112 L494,120 L476,120 Z" />
        {/* Stepped Top Attic */}
        <rect x="456" y="120" width="58" height="12" rx="1" />
        <rect x="444" y="132" width="82" height="14" rx="1.5" />
        <rect x="432" y="146" width="106" height="18" rx="2" />
        {/* Cornice */}
        <rect x="424" y="164" width="122" height="14" rx="2" />

        {/* Main Arch Structure */}
        <path d="M428,178 L542,178 L542,360 L428,360 Z" />

        {/* Center Arch Portal Opening */}
        <path
          d="M460,360 L460,240 Q460,205 485,205 Q510,205 510,240 L510,360 Z"
          fill={cutoutFill}
          opacity="0.9"
        />
      </g>

      {/* Connecting wall between India Gate and Temple */}
      <rect x="542" y="235" width="50" height="125" />

      {/* ================= 4. SOUTH INDIAN TEMPLE GOPURAM ================= */}
      <g>
        {/* Kalasams (Sacred Pots on Top Crest) */}
        <path d="M660,70 L660,82 M675,64 L675,82 M690,60 L690,82 M705,58 L705,82 M720,60 L720,82 M735,64 L735,82 M750,70 L750,82" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* Top Barrel Shikhara Roof */}
        <path d="M642,92 Q705,74 768,92 L762,108 L648,108 Z" />
        <rect x="640" y="108" width="130" height="8" rx="2" />

        {/* Tier 1 */}
        <polygon points="646,116 638,142 772,142 764,116" />
        <rect x="632" y="142" width="146" height="8" rx="2" />

        {/* Tier 2 */}
        <polygon points="638,150 628,180 782,180 772,150" />
        <rect x="622" y="180" width="166" height="8" rx="2" />

        {/* Tier 3 */}
        <polygon points="628,188 616,224 794,224 782,188" />
        <rect x="610" y="224" width="190" height="9" rx="2" />

        {/* Tier 4 */}
        <polygon points="616,233 604,272 806,272 794,233" />
        <rect x="598" y="272" width="214" height="10" rx="2" />

        {/* Base Entrance Gateway (Dwaram) */}
        <path d="M600,282 L810,282 L810,360 L600,360 Z" />

        {/* Base Arch Gateway */}
        <path
          d="M682,360 L682,305 Q682,282 705,282 Q728,282 728,305 L728,360 Z"
          fill={cutoutFill}
          opacity="0.9"
        />
      </g>

      {/* Extra right wall extension */}
      <rect x="810" y="235" width="110" height="125" />
    </svg>
  );
}

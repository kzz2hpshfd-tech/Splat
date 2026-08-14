type DripEdgeProps = {
  className?: string;
  flip?: boolean;
};

/**
 * A drippy gradient edge, like paint dripping off the bottom of a banner.
 * Pure SVG so it stays crisp and themeable via the gradient stops.
 */
export default function DripEdge({ className = "", flip = false }: DripEdgeProps) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`w-full h-full ${flip ? "-scale-y-100" : ""} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dripGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff2ea6" />
          <stop offset="35%" stopColor="#c026d3" />
          <stop offset="70%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        fill="url(#dripGradient)"
        d="M0,0 L1200,0 L1200,35
           C1170,35 1160,80 1130,80
           C1100,80 1095,40 1065,40
           C1035,40 1030,95 1000,95
           C970,95 965,50 935,50
           C905,50 898,110 868,110
           C838,110 832,45 802,45
           C772,45 768,88 738,88
           C708,88 702,32 672,32
           C642,32 638,70 608,70
           C578,70 574,100 544,100
           C514,100 510,38 480,38
           C450,38 446,82 416,82
           C386,82 382,55 352,55
           C322,55 318,105 288,105
           C258,105 254,42 224,42
           C194,42 190,75 160,75
           C130,75 126,30 96,30
           C66,30 62,60 32,60
           C16,60 8,45 0,40 Z"
      />
    </svg>
  );
}

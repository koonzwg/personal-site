import type { SVGProps } from "react";

// Source files: public/icons/*.svg (exported from Figma). Stroke uses currentColor.
const base: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  "aria-hidden": true,
};

export function ResumeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5.33398 11.3335H10.6673" />
      <path d="M5.33398 8.6665H8.00065" />
      <path d="M8.66602 1.66683V2.00016C8.66602 3.88578 8.66602 4.82859 9.25182 5.41438C9.83762 6.00016 10.7804 6.00016 12.666 6.00016H12.9993M13.3327 7.10476V9.3335C13.3327 11.8476 13.3327 13.1048 12.5516 13.8858C11.7706 14.6668 10.5135 14.6668 7.99935 14.6668C5.48519 14.6668 4.22812 14.6668 3.44706 13.8858C2.66602 13.1048 2.66602 11.8476 2.66602 9.3335V6.30406C2.66602 4.14071 2.66602 3.05904 3.25673 2.32638C3.37607 2.17837 3.51089 2.04355 3.6589 1.92421C4.39156 1.3335 5.47323 1.3335 7.63655 1.3335C8.10695 1.3335 8.34208 1.3335 8.55748 1.4095C8.60228 1.42531 8.64615 1.4435 8.68902 1.464C8.89508 1.56253 9.06135 1.72883 9.39395 2.06142L12.5516 5.21912C12.937 5.60449 13.1297 5.79718 13.2312 6.0422C13.3327 6.28723 13.3327 6.55973 13.3327 7.10476Z" />
    </svg>
  );
}

export function EmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M14.0311 2.03512C12.5791 0.471411 1.657 4.30197 1.66602 5.7005C1.67625 7.28644 5.93141 7.7743 7.11081 8.10524C7.82008 8.30417 8.01001 8.50817 8.17355 9.2519C8.91421 12.6202 9.28608 14.2955 10.1336 14.3329C11.4845 14.3926 15.4482 3.56117 14.0311 2.03512Z" />
      <path
        d="M7.66602 8.33333L9.99935 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 12L10 8L6 4" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 11L11 5M6 5H11V10" />
    </svg>
  );
}

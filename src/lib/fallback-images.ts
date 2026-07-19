const backgroundStopStart = "rgb(248 250 252)";
const backgroundStopEnd = "rgb(224 242 254)";
const brandAccent = "rgb(14 165 233)";
const brandNavy = "rgb(10 37 64)";
const white = "rgb(255 255 255)";

function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const blogFallbackImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${backgroundStopStart}"/>
      <stop offset="1" stop-color="${backgroundStopEnd}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="1320" cy="170" r="190" fill="${brandAccent}" opacity="0.16"/>
  <circle cx="260" cy="760" r="250" fill="${brandNavy}" opacity="0.08"/>
  <rect x="340" y="240" width="920" height="400" rx="30" fill="${white}" opacity="0.9"/>
</svg>
`);

export const blogCardFallbackImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${backgroundStopStart}"/>
      <stop offset="1" stop-color="${backgroundStopEnd}"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <circle cx="1080" cy="140" r="170" fill="${brandAccent}" opacity="0.16"/>
  <circle cx="240" cy="620" r="210" fill="${brandNavy}" opacity="0.08"/>
  <rect x="260" y="210" width="760" height="280" rx="24" fill="${white}" opacity="0.92"/>
</svg>
`);

export const productCardFallbackImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${backgroundStopStart}"/>
      <stop offset="1" stop-color="${backgroundStopEnd}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="600" cy="180" r="180" fill="${brandAccent}" opacity="0.14"/>
  <circle cx="220" cy="620" r="220" fill="${brandNavy}" opacity="0.08"/>
  <rect x="245" y="330" width="310" height="160" rx="28" fill="${white}" opacity="0.88"/>
  <path d="M300 490h220l34 86H268l32-86Z" fill="${brandNavy}" opacity="0.18"/>
  <circle cx="330" cy="590" r="34" fill="${brandNavy}" opacity="0.22"/>
  <circle cx="490" cy="590" r="34" fill="${brandNavy}" opacity="0.22"/>
</svg>
`);

export const productGalleryFallbackImage = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${backgroundStopStart}"/>
      <stop offset="1" stop-color="${backgroundStopEnd}"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="1000" fill="url(#bg)"/>
  <circle cx="760" cy="230" r="210" fill="${brandAccent}" opacity="0.16"/>
  <circle cx="240" cy="760" r="260" fill="${brandNavy}" opacity="0.08"/>
  <rect x="270" y="390" width="460" height="200" rx="34" fill="${white}" opacity="0.9"/>
  <path d="M350 590h300l48 132H302l48-132Z" fill="${brandNavy}" opacity="0.16"/>
  <circle cx="410" cy="746" r="44" fill="${brandNavy}" opacity="0.24"/>
  <circle cx="610" cy="746" r="44" fill="${brandNavy}" opacity="0.24"/>
</svg>
`);

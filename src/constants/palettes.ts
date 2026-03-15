export type Palette = {
  top: string;
  bottom: string;
  mBack: string;
  mFront: string;
  ground: string;
  sunGlow: string;
};

export const palettes: Record<string, Palette> = {
  night:     { top: "#080b18", bottom: "#12162d", mBack: "#121422", mFront: "#0a0c16", ground: "#05060a", sunGlow: "#ffea00" },
  preDawn:   { top: "#1a1835", bottom: "#3a2845", mBack: "#201c2e", mFront: "#14111f", ground: "#0c0a12", sunGlow: "#ffea00" },
  sunrise:   { top: "#384568", bottom: "#e07b53", mBack: "#42384a", mFront: "#2a2230", ground: "#1a1215", sunGlow: "#ff7b00" },
  morning:   { top: "#4f83c4", bottom: "#98c4df", mBack: "#5b84ad", mFront: "#385d82", ground: "#1e3b3a", sunGlow: "#ffe699" }, 
  noon:      { top: "#2074d4", bottom: "#80c4f5", mBack: "#6499c4", mFront: "#3b6c94", ground: "#22473a", sunGlow: "#ffffff" }, 
  afternoon: { top: "#3876be", bottom: "#8ab4d4", mBack: "#5c87ab", mFront: "#345e80", ground: "#203b32", sunGlow: "#ffdb70" },
  sunset:    { top: "#2a3b5c", bottom: "#ff4d00", mBack: "#3a1a1c", mFront: "#1a0b0d", ground: "#140705", sunGlow: "#ff2a00" },
  dusk:      { top: "#1c1d36", bottom: "#6e2030", mBack: "#201524", mFront: "#120a14", ground: "#0a050a", sunGlow: "#ff0000" }
};

export const Colors = {
  // --- Original Palette ---
  primary: {
    DEFAULT: "#577D54",
    100: "#C5F3C2",
    200: "#92CE8D",
    300: "#74A470",
    400: "#577D54",
    500: "#3C583A",
    600: "#233521",
    700: "#0C150B",
  },
  secondary: {
    DEFAULT: "#D4E09B",
    100: "#D4E09B",
    200: "#ADB77E",
    300: "#889062",
    400: "#656B48",
    500: "#44482F",
    600: "#252818",
    700: "#101209",
  },
  tertiary: {
    DEFAULT: "#F6F4D2",
    100: "#F6F4D2",
    200: "#CDCBAD",
    300: "#A6A48B",
    400: "#807F6B",
    500: "#5C5B4C",
    600: "#3A3A30",
    700: "#1C1B16",
  },
  quaternary: {
    DEFAULT: "#CBDFBD",
    100: "#CBDFBD",
    200: "#A6B69A",
    300: "#829079",
    400: "#606B59",
    500: "#40483B",
    600: "#232720",
    700: "#0F120D",
  },
  quinary: {
    DEFAULT: "#F19C79",
    100: "#F7D0C4",
    200: "#F19C79",
    300: "#CF7341",
    400: "#9B542F",
    500: "#6A381D",
    600: "#3D1D0D",
    700: "#1F0C04",
  },
  senary: {
    DEFAULT: "#A44A3F",
    100: "#F0CFCD",
    200: "#E49D98",
    300: "#DB6557",
    400: "#A44A3F",
    500: "#703028",
    600: "#401814",
    700: "#220907",
  },
  septenary: {
    DEFAULT: "#3C1518",
    100: "#F8EFEF",
    200: "#EACBCD",
    300: "#DB9B9E",
    400: "#D0656C",
    500: "#A0454C",
    600: "#6C2C31",
    700: "#3C1518",
  },
  octonary: {
    DEFAULT: "#24161C",
    100: "#F4EFF1",
    200: "#D7C3CB",
    300: "#BD97A7",
    400: "#9F6E83",
    500: "#734F5E",
    600: "#4A313C",
    700: "#24161C",
  },
  grey: {
    DEFAULT: "#717570",
    100: "#E3E9E2",
    200: "#BBC1B9",
    300: "#959A94",
    400: "#717570",
    500: "#4F524E",
    600: "#2F312F",
    700: "#121312",
  },

  // --- New Palettes ---
  shade: {
    100: "#060606",
    200: "#FFFFFF",
  },
  neutral: {
    50: "#F5F5FF",
    100: "#F3F4F6",
    200: "#E6E7EB",
    300: "#D1D4DB",
    400: "#9EA2AD",
    500: "#6B7380",
    600: "#4C5563",
    700: "#384053",
    800: "#202938",
    900: "#111828",
  },
  turquoise: {
    100: "#C5FFF3",
    200: "#0CEBCC",
    300: "#05A798",
    400: "#006E6F",
    500: "#004441",
  },
  blue: {
    50: "#F1FBFF",
    100: "#99E0FF",
    200: "#64B1F7",
    300: "#3678FF",
    400: "#0B46E8",
    500: "#0010A4",
    600: "#000D76",
  },
  pink: {
    100: "#FFB4D3",
    200: "#FF8CD9",
    300: "#FB43BD",
    400: "#EE1192",
    500: "#CC007D",
  },
  orange: {
    100: "#FFD897",
    200: "#FFBF51",
    300: "#FD9417",
    400: "#F06B02",
    500: "#E84300",
  },
  additional: {
    lightYellow: "#FEFDA3",
    yellow: "#FFE429",
    greenishYellow: "#D4F951",
    purple: "#470BBB",
  },
  warning: {
    50: "#FEFBEA",
    100: "#FEF3C5",
    200: "#FDE687",
    300: "#FDD34B",
    400: "#FDBD26",
    500: "#F49E0A",
    600: "#D8760A",
    700: "#B5530A",
    800: "#933E0F",
    900: "#793510",
  },
  error: {
    50: "#FFF2F2",
    100: "#FEE2E1",
    200: "#FECBCA",
    300: "#F9A7A3",
    400: "#F77171",
    500: "#EE4444",
    600: "#DC2522",
    700: "#BA1B1A",
    800: "#991B1C",
    900: "#7F1D1C",
  },
  success: {
    50: "#F3FCF6",
    100: "#DCFCE7",
    200: "#BBF7D1",
    300: "#88EDAD",
    400: "#4ADE80",
    500: "#28C35D",
    600: "#18A348",
    700: "#14803E",
    800: "#166535",
    900: "#13542D",
  },
} as const;

export type ColorFamily = keyof typeof Colors;

export const toRgb = (hex: string) => {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
};

export const toRgbString = (hex: string) => {
  const { r, g, b } = toRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
};
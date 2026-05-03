export const Colors = {
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
  nonary: {
    DEFAULT: "#717570",
    100: "#E3E9E2",
    200: "#BBC1B9",
    300: "#959A94",
    400: "#717570",
    500: "#4F524E",
    600: "#2F312F",
    700: "#121312",
  }
} as const;

export type ColorFamily = keyof typeof Colors;
export type ColorShade = keyof typeof Colors['primary'];

// Updated to handle the nested structure. 
// If you pass a specific shade like Colors.primary[100], it works exactly as before.
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
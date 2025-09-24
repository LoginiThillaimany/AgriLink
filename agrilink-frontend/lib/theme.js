import { Platform } from "react-native";

export const colors = {
  primary: "#1B5E20",
  primaryDark: "#0D3B12",
  primaryLight: "#2E7D32",
  accent: "#66BB6A",
  surface: "#F7FBF7",
  card: "#FFFFFF",
  text: "#1A1A1A",
  muted: "#6B7280",
  border: "#E5E7EB",
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 20 };
export const spacing = { xs: 6, sm: 10, md: 16, lg: 20, xl: 28 };

export const shadows = Platform.select({
  web: {
    card: { boxShadow: "0 6px 18px rgba(0,0,0,0.08)" },
    soft: { boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  },
  default: {
    card: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 4,
    },
    soft: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
  },
});



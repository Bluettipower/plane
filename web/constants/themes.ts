export const THEMES = ["light", "dark", "light-contrast", "dark-contrast", "custom"];

export interface I_THEME_OPTION {
  value: string;
  label: string;
  type: string;
  icon: {
    border: string;
    color1: string;
    color2: string;
  };
}

export const THEME_OPTIONS: I_THEME_OPTION[] = [
  {
    value: "system",
    label: "profile.preferences.theme.system",
    type: "light",
    icon: {
      border: "#DEE2E6",
      color1: "#FAFAFA",
      color2: "#3F76FF",
    },
  },
  {
    value: "light",
    label: "profile.preferences.theme.light",
    type: "light",
    icon: {
      border: "#DEE2E6",
      color1: "#FAFAFA",
      color2: "#3F76FF",
    },
  },
  {
    value: "dark",
    label: "profile.preferences.theme.dark",
    type: "dark",
    icon: {
      border: "#2E3234",
      color1: "#191B1B",
      color2: "#3C85D9",
    },
  },
  {
    value: "light-contrast",
    label: "profile.preferences.theme.light_high_contrast",
    type: "light",
    icon: {
      border: "#000000",
      color1: "#FFFFFF",
      color2: "#3F76FF",
    },
  },
  {
    value: "dark-contrast",
    label: "profile.preferences.theme.dark_high_contrast",
    type: "dark",
    icon: {
      border: "#FFFFFF",
      color1: "#030303",
      color2: "#3A8BE9",
    },
  },
  {
    value: "custom",
    label: "profile.preferences.theme.custom",
    type: "light",
    icon: {
      border: "#FFC9C9",
      color1: "#FFF7F7",
      color2: "#FF5151",
    },
  },
];

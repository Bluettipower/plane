import { FC } from "react";
import { useTranslation } from "next-i18next";
// constants
import { CustomSelect } from "@plane/ui";
import { THEME_OPTIONS, I_THEME_OPTION } from "@/constants/themes";
// ui

type Props = {
  value: I_THEME_OPTION | null;
  onChange: (value: I_THEME_OPTION) => void;
};

export const ThemeSwitch: FC<Props> = (props) => {
  const { value, onChange } = props;

  const {t} = useTranslation();

  return (
    <CustomSelect
      value={value}
      label={
        value ? (
          <div className="flex items-center gap-2">
            <div
              className="relative flex items-center justify-center w-4 h-4 transform rotate-45 border rounded-full border-1"
              style={{
                borderColor: value.icon.border,
              }}
            >
              <div
                className="w-1/2 h-full rounded-l-full"
                style={{
                  background: value.icon.color1,
                }}
              />
              <div
                className="w-1/2 h-full border-l rounded-r-full"
                style={{
                  borderLeftColor: value.icon.border,
                  background: value.icon.color2,
                }}
              />
            </div>
            {t(value.label)}
          </div>
        ) : (
          "Select your theme"
        )
      }
      onChange={onChange}
      input
    >
      {THEME_OPTIONS.map((themeOption) => (
        <CustomSelect.Option key={themeOption.value} value={themeOption}>
          <div className="flex items-center gap-2">
            <div
              className="relative flex items-center justify-center w-4 h-4 transform rotate-45 border rounded-full border-1"
              style={{
                borderColor: themeOption.icon.border,
              }}
            >
              <div
                className="w-1/2 h-full rounded-l-full"
                style={{
                  background: themeOption.icon.color1,
                }}
              />
              <div
                className="w-1/2 h-full border-l rounded-r-full"
                style={{
                  borderLeftColor: themeOption.icon.border,
                  background: themeOption.icon.color2,
                }}
              />
            </div>
            {t(themeOption.label)}
          </div>
        </CustomSelect.Option>
      ))}
    </CustomSelect>
  );
};

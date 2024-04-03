import { FC } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
// constants
import { CustomSelect } from "@plane/ui";
import { LANGUAGE_OPTIONS } from "@/constants/languages";
// ui

type Props = {
  value: string | null;
  onChange: (value: string) => void;
};

export const LanguageSwitch: FC<Props> = () => {
  const {i18n} = useTranslation();
  const {language} = i18n;
  const router = useRouter();
  const { pathname, asPath, query,  } = router;

  const onChange = async (value: string) => {
    router.push({ pathname, query }, asPath, { locale: value });
  };

  return (
    <CustomSelect
      value={language}
      label={
        language ? (
          <div className="flex items-center gap-2">
            {LANGUAGE_OPTIONS.find((option) => option.value === language)?.label}
          </div>
        ) : (
          "Select your language"
        )
      }
      onChange={onChange}
      input
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <CustomSelect.Option key={option.value} value={option.value}>
          <div className="flex items-center gap-2">
            {option.label}
          </div>
        </CustomSelect.Option>
      ))}
    </CustomSelect>
  );
};

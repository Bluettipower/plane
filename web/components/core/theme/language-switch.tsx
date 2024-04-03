import { FC, useState } from "react";
// constants
import { CustomSelect } from "@plane/ui";
import { useTranslation } from "next-i18next";
import { LANGUAGE_OPTIONS } from "@/constants/languages";
import { useRouter } from "next/router";
// ui

type Props = {
  value: string | null;
  onChange: (value: string) => void;
};

export const LanguageSwitch: FC<Props> = (props) => {
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

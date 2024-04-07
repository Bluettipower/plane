import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export const ProfilePreferenceSettingsSidebar = () => {
  const router = useRouter();
  const {t} = useTranslation()

  const profilePreferenceLinks: Array<{
    label: string;
    href: string;
  }> = [
    {
      label: "profile.preferences.theme",
      href: `/profile/preferences/theme`,
    },
    {
      label: "email",
      href: `/profile/preferences/email`,
    },
  ];
  return (
    <div className="flex-col hidden gap-6 px-8 py-12 md:flex w-96">
      <div className="flex flex-col gap-4">
        <span className="text-xs font-semibold text-custom-text-400">{t("profile.preferences")}</span>
        <div className="flex flex-col w-full gap-2">
          {profilePreferenceLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  (link.label === "Import" ? router.asPath.includes(link.href) : router.asPath === link.href)
                    ? "bg-custom-primary-100/10 text-custom-primary-100"
                    : "text-custom-sidebar-text-200 hover:bg-custom-sidebar-background-80 focus:bg-custom-sidebar-background-80"
                }`}
              >
                {t(link.label)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

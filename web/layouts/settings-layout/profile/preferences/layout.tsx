import { FC, ReactNode } from "react";
// layout
import { SidebarHamburgerToggle } from "@/components/core/sidebar/sidebar-menu-hamburger-toggle";
import { PreferencesMobileHeader } from "@/components/profile/preferences/preferences-mobile-header";
import { useApplication } from "@/hooks/store";
import { ProfileSettingsLayout } from "@/layouts/settings-layout";
import { ProfilePreferenceSettingsSidebar } from "./sidebar";
import { useTranslation } from "next-i18next";

interface IProfilePreferenceSettingsLayout {
  children: ReactNode;
  header?: ReactNode;
}

export const ProfilePreferenceSettingsLayout: FC<IProfilePreferenceSettingsLayout> = (props) => {
  const { children, header } = props;
  const { theme: themeStore } = useApplication();
  const { t } = useTranslation();

  return (
    <ProfileSettingsLayout
      header={
        <div className="flex items-center justify-start flex-shrink-0 gap-4 p-4 border-b md:hidden border-custom-border-200">
          <SidebarHamburgerToggle onClick={() => themeStore.toggleSidebar()} />
        </div>
      }
    >
      <div className="h-full">
        <PreferencesMobileHeader />
        <div className="relative flex w-full h-full overflow-hidden">
          <ProfilePreferenceSettingsSidebar />
          <main className="relative flex flex-col w-full h-full overflow-hidden bg-custom-background-100">
            {header}
            <div className="w-full h-full">{children}</div>
          </main>
        </div>
      </div>
    </ProfileSettingsLayout>
  );
};

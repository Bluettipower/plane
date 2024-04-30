import { ReactElement } from "react";
import useSWR from "swr";
// layouts
import { PageHead } from "@/components/core";
import { EmailNotificationForm } from "@/components/profile/preferences";
import { EmailSettingsLoader } from "@/components/ui";
import { ProfilePreferenceSettingsLayout } from "@/layouts/settings-layout/profile/preferences";
// ui
// components
// services
import { NextPageWithLayout } from "@/lib/types";
import { UserService } from "@/services/user.service";
// type
export { getStaticProps } from "@/lib/i18next";

// services
const userService = new UserService();

const ProfilePreferencesThemePage: NextPageWithLayout = () => {
  // fetching user email notification settings
  const { data, isLoading } = useSWR("CURRENT_USER_EMAIL_NOTIFICATION_SETTINGS", () =>
    userService.currentUserEmailNotificationSettings()
  );

  if (!data || isLoading) {
    return <EmailSettingsLoader />;
  }

  return (
    <>
      <PageHead title="Profile - Email Preference" />
      <div className="w-full h-full px-4 pb-8 mx-auto mt-8 md:px-6 lg:px-20 vertical-scrollbar scrollbar-md">
        <EmailNotificationForm data={data} />
      </div>
    </>
  );
};

ProfilePreferencesThemePage.getLayout = function getLayout(page: ReactElement) {
  return <ProfilePreferenceSettingsLayout>{page}</ProfilePreferenceSettingsLayout>;
};

export default ProfilePreferencesThemePage;

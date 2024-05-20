import React, { ReactElement } from "react";
import { observer } from "mobx-react";
import Image from "next/image";
import Link from "next/link";
// ui
import { useTheme } from "next-themes";
// components
import { AuthRoot } from "@/components/account";
import { PageHead } from "@/components/core";
// constants
import { NAVIGATE_TO_SIGNIN } from "@/constants/event-tracker";
// helpers
import { EAuthModes, EPageTypes } from "@/helpers/authentication.helper";
// hooks
import { useEventTracker } from "@/hooks/store";
// layouts
import DefaultLayout from "@/layouts/default-layout";
// types
import { NextPageWithLayout } from "@/lib/types";
export { getStaticProps } from "@/lib/i18next";
// wrappers
import { AuthenticationWrapper } from "@/lib/wrappers";
// assets
import PlaneBackgroundPatternDark from "public/auth/background-pattern-dark.svg";
import PlaneBackgroundPattern from "public/auth/background-pattern.svg";
import BluePlaneLogoWithoutText from "public/plane-logos/blue-without-text.png";

const HomePage: NextPageWithLayout = observer(() => {
  const { resolvedTheme } = useTheme();
  // hooks
  const { captureEvent } = useEventTracker();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <PageHead title="Sign Up" />
      <div className="absolute inset-0 z-0">
        <Image
          src={resolvedTheme === "dark" ? PlaneBackgroundPatternDark : PlaneBackgroundPattern}
          className="object-cover w-full h-full"
          alt="Plane background pattern"
        />
      </div>
      <div className="relative z-10 flex flex-col w-screen h-screen overflow-hidden overflow-y-auto">
        <div className="container relative flex items-center justify-between flex-shrink-0 px-10 pb-4 mx-auto transition-all lg:px-0">
          <div className="flex items-center py-10 gap-x-2">
            <Image src={BluePlaneLogoWithoutText} height={30} width={30} alt="Plane Logo" />
            <span className="text-2xl font-semibold sm:text-3xl">Plane</span>
          </div>
          <div className="flex flex-col items-end text-sm font-medium text-center sm:items-center sm:gap-2 sm:flex-row text-onboarding-text-300">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              onClick={() => captureEvent(NAVIGATE_TO_SIGNIN, {})}
              className="font-semibold text-custom-primary-100 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="container flex-grow max-w-lg px-10 py-10 mx-auto transition-all lg:max-w-md lg:px-5 lg:pt-28">
          <AuthRoot authMode={EAuthModes.SIGN_UP} />
        </div>
      </div>
    </div>
  );
});

HomePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DefaultLayout>
      <AuthenticationWrapper pageType={EPageTypes.NON_AUTHENTICATED}>{page}</AuthenticationWrapper>
    </DefaultLayout>
  );
};

export default HomePage;

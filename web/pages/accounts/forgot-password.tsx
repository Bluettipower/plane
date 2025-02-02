import { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Controller, useForm } from "react-hook-form";
// icons
import { CircleCheck } from "lucide-react";
// ui
import { Button, Input, TOAST_TYPE, getButtonStyling, setToast } from "@plane/ui";
// components
import { PageHead } from "@/components/core";
// constants
import { FORGOT_PASS_LINK, NAVIGATE_TO_SIGNUP } from "@/constants/event-tracker";
// helpers
import { EPageTypes } from "@/helpers/authentication.helper";
import { cn } from "@/helpers/common.helper";
import { checkEmailValidity } from "@/helpers/string.helper";
// hooks
import { useEventTracker } from "@/hooks/store";
import useTimer from "@/hooks/use-timer";
// layouts
import DefaultLayout from "@/layouts/default-layout";
// lib
import { NextPageWithLayout } from "@/lib/types";
// wrappers
import { AuthenticationWrapper } from "@/lib/wrappers";
// services
import { AuthService } from "@/services/auth.service";
// images
import PlaneBackgroundPatternDark from "public/auth/background-pattern-dark.svg";
import PlaneBackgroundPattern from "public/auth/background-pattern.svg";
import BlackHorizontalLogo from "public/plane-logos/black-horizontal-with-blue-logo.png";
import WhiteHorizontalLogo from "public/plane-logos/white-horizontal-with-blue-logo.png";

type TForgotPasswordFormValues = {
  email: string;
};

const defaultValues: TForgotPasswordFormValues = {
  email: "",
};

// services
const authService = new AuthService();

const ForgotPasswordPage: NextPageWithLayout = () => {
  // router
  const router = useRouter();
  const { email } = router.query;
  // store hooks
  const { captureEvent } = useEventTracker();
  // hooks
  const { resolvedTheme } = useTheme();
  // timer
  const { timer: resendTimerCode, setTimer: setResendCodeTimer } = useTimer(0);

  // form info
  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm<TForgotPasswordFormValues>({
    defaultValues: {
      ...defaultValues,
      email: email?.toString() ?? "",
    },
  });

  const handleForgotPassword = async (formData: TForgotPasswordFormValues) => {
    await authService
      .sendResetPasswordLink({
        email: formData.email,
      })
      .then(() => {
        captureEvent(FORGOT_PASS_LINK, {
          state: "SUCCESS",
        });
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Email sent",
          message:
            "Check your inbox for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.",
        });
        setResendCodeTimer(30);
      })
      .catch((err) => {
        captureEvent(FORGOT_PASS_LINK, {
          state: "FAILED",
        });
        setToast({
          type: TOAST_TYPE.ERROR,
          title: "Error!",
          message: err?.error ?? "Something went wrong. Please try again.",
        });
      });
  };

  const logo = resolvedTheme === "light" ? BlackHorizontalLogo : WhiteHorizontalLogo;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <PageHead title="Forgot Password - Plane" />
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
            <Link href={`/`} className="h-[30px] w-[133px]">
              <Image src={logo} alt="Plane logo" />
            </Link>
          </div>
          <div className="flex flex-col items-end text-sm font-medium text-center sm:items-center sm:gap-2 sm:flex-row text-onboarding-text-300">
            New to Plane?{" "}
            <Link
              href="/"
              onClick={() => captureEvent(NAVIGATE_TO_SIGNUP, {})}
              className="font-semibold text-custom-primary-100 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
        <div className="container flex-grow max-w-lg px-10 py-10 mx-auto transition-all lg:max-w-md lg:px-5 lg:pt-28">
          <div className="relative flex flex-col space-y-6">
            <div className="py-4 space-y-1 text-center">
              <h3 className="flex justify-center gap-4 text-3xl font-bold text-onboarding-text-100">
                Reset your password
              </h3>
              <p className="font-medium text-onboarding-text-400">
                Enter your user account{"'"}s verified email address and we will send you a password reset link.
              </p>
            </div>
            <form onSubmit={handleSubmit(handleForgotPassword)} className="mt-5 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-onboarding-text-300" htmlFor="email">
                  Email
                </label>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    validate: (value) => checkEmailValidity(value) || "Email is invalid",
                  }}
                  render={({ field: { value, onChange, ref } }) => (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      hasError={Boolean(errors.email)}
                      placeholder="name@company.com"
                      className="h-[46px] w-full border border-onboarding-border-100 !bg-onboarding-background-200 pr-12 placeholder:text-onboarding-text-400"
                      disabled={resendTimerCode > 0}
                    />
                  )}
                />
                {resendTimerCode > 0 && (
                  <p className="flex items-start w-full gap-1 px-1 text-xs font-medium text-green-700">
                    <CircleCheck height={12} width={12} className="mt-0.5" />
                    We sent the reset link to your email address
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                size="lg"
                disabled={!isValid}
                loading={isSubmitting || resendTimerCode > 0}
              >
                {resendTimerCode > 0 ? `Resend in ${resendTimerCode} seconds` : "Send reset link"}
              </Button>
              <Link href="/" className={cn("w-full", getButtonStyling("link-neutral", "lg"))}>
                Back to sign in
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DefaultLayout>
      <AuthenticationWrapper pageType={EPageTypes.NON_AUTHENTICATED}>{page}</AuthenticationWrapper>
    </DefaultLayout>
  );
};

export default ForgotPasswordPage;

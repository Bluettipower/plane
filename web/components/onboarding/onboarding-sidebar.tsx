import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import {
  BarChart2,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ContrastIcon,
  FileText,
  LayersIcon,
  PenSquare,
  Search,
  Settings,
  Bell,
  Home,
} from "lucide-react";
import { IWorkspace } from "@plane/types";
import { Avatar, DiceIcon, PhotoFilterIcon } from "@plane/ui";
// hooks
import { useUser, useWorkspace } from "@/hooks/store";
// types
import projectEmoji from "public/emoji/project-emoji.svg";
// assets

const workspaceLinks = [
  {
    Icon: Home,
    name: "home",
  },
  {
    Icon: BarChart2,
    name: "analytics",
  },
  {
    Icon: Briefcase,
    name: "projects",
  },
  {
    Icon: CheckCircle,
    name: "all-issues",
  },
  {
    Icon: Bell,
    name: "notifications",
  },
];

const projectLinks = [
  {
    name: "issues",
    Icon: LayersIcon,
  },
  {
    name: "cycles",

    Icon: ContrastIcon,
  },
  {
    name: "modules",
    Icon: DiceIcon,
  },
  {
    name: "views",

    Icon: PhotoFilterIcon,
  },
  {
    name: "pages",

    Icon: FileText,
  },
  {
    name: "settings",

    Icon: Settings,
  },
];

type Props = {
  workspaceName: string;
  showProject: boolean;
  control?: Control<IWorkspace, any>;
  setValue?: UseFormSetValue<IWorkspace>;
  watch?: UseFormWatch<IWorkspace>;
  userFullName?: string;
};

let timer: number = 0;
let lastWorkspaceName: string = "";

export const OnboardingSidebar: React.FC<Props> = (props) => {
  const { workspaceName, showProject, control, setValue, watch, userFullName } = props;
  // store hooks
  const { currentUser } = useUser();
  const { workspaces } = useWorkspace();
  const workspaceDetails = Object.values(workspaces ?? {})?.[0];

  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  const handleZoomWorkspace = (value: string) => {
    if (lastWorkspaceName === value) return;
    lastWorkspaceName = value;
    if (timer > 0) {
      timer += 2;
      timer = Math.min(timer, 2);
    } else {
      timer = 2;
      timer = Math.min(timer, 2);
      const interval = setInterval(() => {
        if (timer < 0) {
          setValue!("name", lastWorkspaceName);
          clearInterval(interval);
        }
        timer--;
      }, 1000);
    }
  };

  useEffect(() => {
    if (watch) {
      watch("name");
    }
  });

  return (
    <div className="relative h-full border-r border-onboarding-border-100 ">
      <div>
        {control && setValue ? (
          <Controller
            control={control}
            name="name"
            render={({ field: { value } }) => {
              if (value.length > 0) {
                handleZoomWorkspace(value);
              } else {
                lastWorkspaceName = "";
              }
              return timer > 0 ? (
                <div
                  className={`top-3 ml-6 mt-4 flex w-full max-w-screen-sm items-center border-[6px] bg-onboarding-background-200 transition-all ${
                    resolvedTheme == "dark" ? "border-onboarding-background-100" : "border-custom-primary-20"
                  } rounded-xl`}
                >
                  <div className="w-full py-6 pl-4 border rounded-lg border-onboarding-background-400">
                    <div
                      className={`${
                        resolvedTheme == "light" ? "bg-[#F5F5F5]" : "bg-[#363A40]"
                      }  flex w-full items-center p-1`}
                    >
                      <div className="flex flex-shrink-0">
                        <Avatar
                          name={value.length > 0 ? value : "New Workspace"}
                          src={""}
                          size={30}
                          shape="square"
                          fallbackBackgroundColor="black"
                          className="!text-base capitalize"
                        />
                      </div>

                      <span className="ml-2 text-xl font-medium truncate text-onboarding-text-100">{value}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center w-full px-4 pt-6 truncate transition-all border border-transparent gap-y-2">
                  <div className="flex flex-shrink-0">
                    <Avatar
                      name={value.length > 0 ? value : workspaceDetails ? workspaceDetails.name : "New Workspace"}
                      src={""}
                      size={24}
                      shape="square"
                      fallbackBackgroundColor="black"
                      className="!text-base capitalize"
                    />
                  </div>
                  <div className="flex items-center justify-between flex-shrink w-full mx-2 truncate">
                    <h4 className="text-base font-medium truncate text-custom-text-100">{workspaceName}</h4>
                    <ChevronDown className={`mx-1 h-4 w-4 flex-shrink-0 text-custom-sidebar-text-400 duration-300`} />
                  </div>
                  <div className="flex flex-shrink-0">
                    <Avatar
                      name={currentUser?.email}
                      src={currentUser?.avatar}
                      size={24}
                      shape="square"
                      fallbackBackgroundColor="#FCBE1D"
                      className="!text-base capitalize"
                    />
                  </div>
                </div>
              );
            }}
          />
        ) : (
          <div className="flex items-center w-full px-4 pt-6 truncate transition-all gap-y-2">
            <div className="flex flex-shrink-0">
              <Avatar
                name={workspaceDetails ? workspaceDetails.name : "New Workspace"}
                src={""}
                size={24}
                shape="square"
                fallbackBackgroundColor="black"
                className="!text-base capitalize"
              />
            </div>
            <div className="flex items-center justify-between flex-shrink w-full mx-2 truncate">
              <h4 className="text-base font-medium truncate text-custom-text-100">{workspaceName}</h4>
              <ChevronDown className={`mx-1 h-4 w-4 flex-shrink-0 text-custom-sidebar-text-400 duration-300`} />
            </div>
            <div className="flex flex-shrink-0">
              <Avatar
                name={userFullName ?? currentUser?.email}
                src={currentUser?.avatar}
                size={24}
                shape="square"
                fallbackBackgroundColor="#FCBE1D"
                className="!text-base capitalize"
              />
            </div>
          </div>
        )}
      </div>

      <div className={`space-y-1 p-4`}>
        <div className={`mb-3 mt-4 flex w-full items-center justify-between gap-2 px-1 `}>
          <div
            className={`group relative flex w-full items-center justify-between gap-1 rounded border border-onboarding-border-100 px-3 shadow-custom-shadow-2xs`}
          >
            <div className={`relative flex flex-shrink-0 flex-grow items-center gap-2 rounded py-1.5 outline-none`}>
              <PenSquare className="w-4 h-4 text-custom-sidebar-text-300" />
              {<span className="text-sm font-medium">New Issue</span>}
            </div>
          </div>

          <div
            className={`flex flex-shrink-0 items-center justify-center rounded border border-onboarding-border-100
            p-2 shadow-custom-shadow-2xs outline-none
            `}
          >
            <Search className="w-4 h-4 text-onboarding-text-200" />
          </div>
        </div>
        {workspaceLinks.map((link) => (
          <a className="block w-full" key={link.name}>
            <div
              className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-base font-medium text-onboarding-text-200 
                outline-none  focus:bg-custom-sidebar-background-80
                `}
            >
              {<link.Icon className="w-4 h-4" />}
              {t(link.name)}
            </div>
          </a>
        ))}
      </div>

      {showProject && (
        <div className="px-4 pt-4">
          <p className="pb-4 text-base font-semibold text-custom-text-300">Projects</p>

          <div className="px-3">
            {" "}
            <div className="flex items-center justify-between w-4/5 mb-3 text-base font-medium text-custom-text-200">
              <div className="flex items-center gap-x-2">
                <Image src={projectEmoji} alt="Plane Logo" className="w-4 h-4" />
                <span> Plane</span>
              </div>

              <ChevronDown className="w-4 h-4" />
            </div>
            {projectLinks.map((link) => (
              <a className="block w-full ml-6" key={link.name}>
                <div
                  className={`group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-base font-medium text-custom-sidebar-text-200 
                    outline-none  focus:bg-custom-sidebar-background-80
                `}
                >
                  {<link.Icon className="w-4 h-4" />}
                  {t(link.name)}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

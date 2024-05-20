import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Tab } from "@headlessui/react";
import { ICycle, IModule, IProject } from "@plane/types";
// components
import { CustomAnalytics, ScopeAndDemand } from "@/components/analytics";
// types
import { ANALYTICS_TABS } from "@/constants/analytics";
// constants

type Props = {
  fullScreen: boolean;
  cycleDetails: ICycle | undefined;
  moduleDetails: IModule | undefined;
  projectDetails: IProject | undefined;
};

export const ProjectAnalyticsModalMainContent: React.FC<Props> = observer((props) => {
  const { t } = useTranslation(undefined, { keyPrefix: "analytics.project-modal.main_content" });
  const { fullScreen, cycleDetails, moduleDetails } = props;

  return (
    <Tab.Group as={React.Fragment}>
      <Tab.List as="div" className="flex px-0 py-0 space-x-2 border-b border-custom-border-200 md:px-5 md:py-3">
        {ANALYTICS_TABS.map((tab) => (
          <Tab
            key={tab.key}
            className={({ selected }) =>
              `rounded-0 w-full md:w-max md:rounded-3xl border-b md:border border-custom-border-200 focus:outline-none px-0 md:px-4 py-2 text-xs hover:bg-custom-background-80 ${
                selected
                  ? "border-custom-primary-100 text-custom-primary-100 md:bg-custom-background-80 md:text-custom-text-200 md:border-custom-border-200"
                  : "border-transparent"
              }`
            }
            onClick={() => {}}
          >
            {t(tab.key)}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels as={React.Fragment}>
        <Tab.Panel as={React.Fragment}>
          <ScopeAndDemand fullScreen={fullScreen} />
        </Tab.Panel>
        <Tab.Panel as={React.Fragment}>
          <CustomAnalytics
            additionalParams={{
              cycle: cycleDetails?.id,
              module: moduleDetails?.id,
            }}
            fullScreen={fullScreen}
          />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
});

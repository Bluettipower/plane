import React, { Fragment, ReactElement } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Tab } from "@headlessui/react";
// hooks
// layouts
// components
import { CustomAnalytics, ScopeAndDemand } from "@/components/analytics";
import { PageHead } from "@/components/core";
import { EmptyState } from "@/components/empty-state";
import { WorkspaceAnalyticsHeader } from "@/components/headers";
// type
// constants
import { ANALYTICS_TABS } from "@/constants/analytics";
import { EmptyStateType } from "@/constants/empty-state";
import { useApplication, useEventTracker, useProject, useWorkspace } from "@/hooks/store";
import { AppLayout } from "@/layouts/app-layout";
import { NextPageWithLayout } from "@/lib/types";
export {getStaticProps,getStaticPaths} from "@/lib/i18next"

const AnalyticsPage: NextPageWithLayout = observer(() => {
  const { t } = useTranslation(undefined,{keyPrefix:"analytics.project-modal.main_content"});
  const router = useRouter();
  const { analytics_tab } = router.query;
  // store hooks
  const {
    commandPalette: { toggleCreateProjectModal },
  } = useApplication();
  const { setTrackElement } = useEventTracker();
  const { workspaceProjectIds } = useProject();
  const { currentWorkspace } = useWorkspace();
  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Analytics` : undefined;

  return (
    <>
      <PageHead title={pageTitle} />
      {workspaceProjectIds && workspaceProjectIds.length > 0 ? (
        <div className="flex flex-col h-full overflow-hidden bg-custom-background-100">
          <Tab.Group as={Fragment} defaultIndex={analytics_tab === "custom" ? 1 : 0}>
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
                  onClick={() => {
                    router.query.analytics_tab = tab.key;
                    router.push(router);
                  }}
                >
                  {t(tab.key)}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels as={Fragment}>
              <Tab.Panel as={Fragment}>
                <ScopeAndDemand fullScreen />
              </Tab.Panel>
              <Tab.Panel as={Fragment}>
                <CustomAnalytics fullScreen />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      ) : (
        <EmptyState
          type={EmptyStateType.WORKSPACE_ANALYTICS}
          primaryButtonOnClick={() => {
            setTrackElement("Analytics empty state");
            toggleCreateProjectModal(true);
          }}
        />
      )}
    </>
  );
});

AnalyticsPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout header={<WorkspaceAnalyticsHeader />}>{page}</AppLayout>;
};

export default AnalyticsPage;

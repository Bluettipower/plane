import React, { Fragment, ReactElement } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Tab } from "@headlessui/react";
// components
import { CustomAnalytics, ScopeAndDemand } from "@/components/analytics";
import { PageHead } from "@/components/core";
import { EmptyState } from "@/components/empty-state";
import { WorkspaceAnalyticsHeader } from "@/components/headers";
// constants
import { ANALYTICS_TABS } from "@/constants/analytics";
import { EmptyStateType } from "@/constants/empty-state";
// hooks
import { useCommandPalette, useEventTracker, useProject, useWorkspace } from "@/hooks/store";
// layouts
import { AppLayout } from "@/layouts/app-layout";
// types
import { NextPageWithLayout } from "@/lib/types";
export { getStaticProps, getStaticPaths } from "@/lib/i18next";

const AnalyticsPage: NextPageWithLayout = observer(() => {
  const { t } = useTranslation(undefined, { keyPrefix: "analytics.project-modal.main_content" });
  const router = useRouter();
  const { analytics_tab } = router.query;
  // store hooks
  const { toggleCreateProjectModal } = useCommandPalette();
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
            <Tab.List as="div" className="flex space-x-2 border-b h-[50px] border-custom-border-200 px-0 md:px-5">
              {ANALYTICS_TABS.map((tab) => (
                <Tab key={tab.key} as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`text-sm group relative flex items-center gap-1 h-[50px] px-3 cursor-pointer transition-all font-medium outline-none  ${
                        selected ? "text-custom-primary-100 " : "hover:text-custom-text-200"
                      }`}
                    >
                      {t(tab.key)}
                      <div
                        className={`border absolute bottom-0 right-0 left-0 rounded-t-md ${selected ? "border-custom-primary-100" : "border-transparent group-hover:border-custom-border-200"}`}
                      />
                    </button>
                  )}
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

import { ReactElement } from "react";
import { observer } from "mobx-react";
// components
import { PageHead } from "@/components/core";
import { WorkspaceActiveCycleHeader } from "@/components/headers";
import { WorkspaceActiveCyclesUpgrade } from "@/components/workspace";
// layouts
import { useWorkspace } from "@/hooks/store";
import { AppLayout } from "@/layouts/app-layout";
// types
import { NextPageWithLayout } from "@/lib/types";
// hooks
export {getStaticProps,getStaticPaths} from "@/lib/i18next"

const WorkspaceActiveCyclesPage: NextPageWithLayout = observer(() => {
  const { currentWorkspace } = useWorkspace();
  // derived values
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Active Cycles` : undefined;

  return (
    <>
      <PageHead title={pageTitle} />
      <WorkspaceActiveCyclesUpgrade />
    </>
  );
});

WorkspaceActiveCyclesPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout header={<WorkspaceActiveCycleHeader />}>{page}</AppLayout>;
};

export default WorkspaceActiveCyclesPage;

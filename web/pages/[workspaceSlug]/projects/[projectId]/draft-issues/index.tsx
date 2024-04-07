import { ReactElement } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { X, PenSquare } from "lucide-react";
// layouts
// components
import { PageHead } from "@/components/core";
import { ProjectDraftIssueHeader } from "@/components/headers";
import { DraftIssueLayoutRoot } from "@/components/issues/issue-layouts/roots/draft-issue-layout-root";
// types
// hooks
import { useProject } from "@/hooks/store";
import { AppLayout } from "@/layouts/app-layout";
import { NextPageWithLayout } from "@/lib/types";
export {getStaticProps,getStaticPaths} from "@/lib/i18next";

const ProjectDraftIssuesPage: NextPageWithLayout = observer(() => {
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;
  // store
  const { getProjectById } = useProject();
  // derived values
  const project = projectId ? getProjectById(projectId.toString()) : undefined;
  const pageTitle = project?.name ? `${project?.name} - Draft Issues` : undefined;

  return (
    <>
      <PageHead title={pageTitle} />
      <div className="flex flex-col w-full h-full">
        <div className="gap-1 flex items-center border-b border-custom-border-200 px-4 py-2.5 shadow-sm">
          <button
            type="button"
            onClick={() => router.push(`/${workspaceSlug}/projects/${projectId}/issues/`)}
            className="flex items-center gap-1.5 rounded-full border border-custom-border-200 px-3 py-1.5 text-xs"
          >
            <PenSquare className="w-4 h-4" />
            <span>Draft Issues</span>
            <X className="w-3 h-3" />
          </button>
        </div>
        <DraftIssueLayoutRoot />
      </div>
    </>
  );
});

ProjectDraftIssuesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout header={<ProjectDraftIssueHeader />} withProjectWrapper>
      {page}
    </AppLayout>
  );
};

export default ProjectDraftIssuesPage;

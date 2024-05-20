import { FC } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
// ui
import { ArchiveIcon, Breadcrumbs, Tooltip } from "@plane/ui";
// components
import { BreadcrumbLink } from "@/components/common";
import { ProjectLogo } from "@/components/project";
// constants
import { PROJECT_ARCHIVES_BREADCRUMB_LIST } from "@/constants/archives";
import { EIssuesStoreType } from "@/constants/issue";
// hooks
import { useIssues, useProject } from "@/hooks/store";
import { usePlatformOS } from "@/hooks/use-platform-os";

export const ProjectArchivesHeader: FC = observer(() => {
  const { t } = useTranslation();
  // router
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;
  const activeTab = router.pathname.split("/").pop();
  // store hooks
  const {
    issuesFilter: { issueFilters },
  } = useIssues(EIssuesStoreType.ARCHIVED);
  const { currentProjectDetails } = useProject();
  // hooks
  const { isMobile } = usePlatformOS();

  const issueCount = currentProjectDetails
    ? !issueFilters?.displayFilters?.sub_issue && currentProjectDetails.archived_sub_issues
      ? currentProjectDetails.archived_issues - currentProjectDetails.archived_sub_issues
      : currentProjectDetails.archived_issues
    : undefined;

  const activeTabBreadcrumbDetail =
    PROJECT_ARCHIVES_BREADCRUMB_LIST[activeTab as keyof typeof PROJECT_ARCHIVES_BREADCRUMB_LIST];

  return (
    <div className="relative z-10 flex flex-row items-center justify-between flex-shrink-0 w-full p-4 h-14 gap-x-2 gap-y-4 bg-custom-sidebar-background-100">
      <div className="flex items-center flex-grow w-full gap-2 overflow-ellipsis whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <Breadcrumbs onBack={router.back}>
            <Breadcrumbs.BreadcrumbItem
              type="text"
              link={
                <BreadcrumbLink
                  href={`/${workspaceSlug}/projects`}
                  label={currentProjectDetails?.name ?? "Project"}
                  icon={
                    currentProjectDetails && (
                      <span className="grid flex-shrink-0 w-4 h-4 place-items-center">
                        <ProjectLogo logo={currentProjectDetails?.logo_props} className="text-sm" />
                      </span>
                    )
                  }
                />
              }
            />
            <Breadcrumbs.BreadcrumbItem
              type="text"
              link={
                <BreadcrumbLink
                  href={`/${workspaceSlug}/projects/${projectId}/archives/issues`}
                  label="Archives"
                  icon={<ArchiveIcon className="w-4 h-4 text-custom-text-300" />}
                />
              }
            />
            {activeTabBreadcrumbDetail && (
              <Breadcrumbs.BreadcrumbItem
                type="text"
                link={
                  <BreadcrumbLink
                    label={t(activeTabBreadcrumbDetail.label.toLocaleLowerCase())}
                    icon={<activeTabBreadcrumbDetail.icon className="w-4 h-4 text-custom-text-300" />}
                  />
                }
              />
            )}
          </Breadcrumbs>
          {activeTab === "issues" && issueCount && issueCount > 0 ? (
            <Tooltip
              isMobile={isMobile}
              tooltipContent={`There are ${issueCount} ${issueCount > 1 ? "issues" : "issue"} in project's archived`}
              position="bottom"
            >
              <span className="cursor-default flex items-center text-center justify-center px-2.5 py-0.5 flex-shrink-0 bg-custom-primary-100/20 text-custom-primary-100 text-xs font-semibold rounded-xl">
                {issueCount}
              </span>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </div>
  );
});

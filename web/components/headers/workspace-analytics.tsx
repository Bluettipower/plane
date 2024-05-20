import { useEffect } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { BarChart2, PanelRight } from "lucide-react";
// ui
import { Breadcrumbs } from "@plane/ui";
// components
import { BreadcrumbLink } from "@/components/common";
import { cn } from "@/helpers/common.helper";
import { useAppTheme } from "@/hooks/store";

export const WorkspaceAnalyticsHeader = observer(() => {
  const router = useRouter();
  const { analytics_tab } = router.query;

  const { t } = useTranslation("common");
  // store hooks
  const { workspaceAnalyticsSidebarCollapsed, toggleWorkspaceAnalyticsSidebar } = useAppTheme();

  useEffect(() => {
    const handleToggleWorkspaceAnalyticsSidebar = () => {
      if (window && window.innerWidth < 768) {
        toggleWorkspaceAnalyticsSidebar(true);
      }
      if (window && workspaceAnalyticsSidebarCollapsed && window.innerWidth >= 768) {
        toggleWorkspaceAnalyticsSidebar(false);
      }
    };

    window.addEventListener("resize", handleToggleWorkspaceAnalyticsSidebar);
    handleToggleWorkspaceAnalyticsSidebar();
    return () => window.removeEventListener("resize", handleToggleWorkspaceAnalyticsSidebar);
  }, [toggleWorkspaceAnalyticsSidebar, workspaceAnalyticsSidebarCollapsed]);

  return (
    <>
      <div
        className={`relative z-10 flex h-[3.75rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 bg-custom-sidebar-background-100 p-4`}
      >
        <div className="flex items-center flex-grow w-full gap-2 overflow-ellipsis whitespace-nowrap">
          <div className="flex items-center justify-between w-full">
            <Breadcrumbs>
              <Breadcrumbs.BreadcrumbItem
                type="text"
                link={
                  <BreadcrumbLink
                    label={t("analytics")}
                    icon={<BarChart2 className="w-4 h-4 text-custom-text-300" />}
                  />
                }
              />
            </Breadcrumbs>
            {analytics_tab === "custom" && (
              <button
                className="block md:hidden"
                onClick={() => {
                  toggleWorkspaceAnalyticsSidebar();
                }}
              >
                <PanelRight
                  className={cn(
                    "block h-4 w-4 md:hidden",
                    !workspaceAnalyticsSidebarCollapsed ? "text-custom-primary-100" : "text-custom-text-200"
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

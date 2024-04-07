import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
// icons
import { Plus } from "lucide-react";
// components
import { CreateUpdateWorkspaceViewModal } from "@/components/workspace";
// constants
import { GLOBAL_VIEW_OPENED } from "@/constants/event-tracker";
import { DEFAULT_GLOBAL_VIEWS_LIST, EUserWorkspaceRoles } from "@/constants/workspace";
// store hooks
import { useEventTracker, useGlobalView, useUser } from "@/hooks/store";
import { LableToKey } from "@/lib/i18next";

const ViewTab = observer((props: { viewId: string }) => {
  const { viewId } = props;
  // router
  const router = useRouter();
  const { workspaceSlug, globalViewId } = router.query;
  // store hooks
  const { getViewDetailsById } = useGlobalView();

  const view = getViewDetailsById(viewId);

  if (!view) return null;

  return (
    <Link key={viewId} id={`global-view-${viewId}`} href={`/${workspaceSlug}/workspace-views/${viewId}`}>
      <span
        className={`flex min-w-min flex-shrink-0 whitespace-nowrap border-b-2 p-3 text-sm font-medium outline-none ${
          viewId === globalViewId
            ? "border-custom-primary-100 text-custom-primary-100"
            : "border-transparent hover:border-custom-border-200 hover:text-custom-text-400"
        }`}
      >
        {view.name}
      </span>
    </Link>
  );
});

export const GlobalViewsHeader: React.FC = observer(() => {
  const { t } = useTranslation();
  // states
  const [createViewModal, setCreateViewModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // router
  const router = useRouter();
  const { workspaceSlug, globalViewId } = router.query;
  // store hooks
  const { currentWorkspaceViews } = useGlobalView();
  const {
    membership: { currentWorkspaceRole },
  } = useUser();
  const { captureEvent } = useEventTracker();

  // bring the active view to the centre of the header
  useEffect(() => {
    if (globalViewId && currentWorkspaceViews) {
      captureEvent(GLOBAL_VIEW_OPENED, {
        view_id: globalViewId,
        view_type: ["all-issues", "assigned", "created", "subscribed"].includes(globalViewId.toString())
          ? "Default"
          : "Custom",
      });
      const activeTabElement = document.querySelector(`#global-view-${globalViewId.toString()}`);
      if (activeTabElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        const diff = containerRect.right - activeTabRect.right;
        activeTabElement.scrollIntoView({ behavior: "smooth", inline: diff > 500 ? "center" : "nearest" });
      }
    }
  }, [globalViewId, currentWorkspaceViews, containerRef, captureEvent]);

  const isAuthorizedUser = !!currentWorkspaceRole && currentWorkspaceRole >= EUserWorkspaceRoles.MEMBER;

  return (
    <>
      <CreateUpdateWorkspaceViewModal isOpen={createViewModal} onClose={() => setCreateViewModal(false)} />
      <div className="relative flex border-b group border-custom-border-200">
        <div
          ref={containerRef}
          className="flex items-center w-full px-4 overflow-x-auto horizontal-scrollbar scrollbar-sm"
        >
          {DEFAULT_GLOBAL_VIEWS_LIST.map((tab) => (
            <Link key={tab.key} id={`global-view-${tab.key}`} href={`/${workspaceSlug}/workspace-views/${tab.key}`}>
              <span
                className={`flex min-w-min flex-shrink-0 whitespace-nowrap border-b-2 p-3 text-sm font-medium outline-none ${
                  tab.key === globalViewId
                    ? "border-custom-primary-100 text-custom-primary-100"
                    : "border-transparent hover:border-custom-border-200 hover:text-custom-text-400"
                }`}
              >
                {t(tab.key)}
              </span>
            </Link>
          ))}

          {currentWorkspaceViews?.map((viewId) => (
            <ViewTab key={viewId} viewId={viewId} />
          ))}
        </div>

        {isAuthorizedUser && (
          <button
            type="button"
            className="sticky flex items-center justify-center flex-shrink-0 w-12 py-3 border-transparent -right-4 bg-custom-background-100 hover:border-custom-border-200 hover:text-custom-text-400"
            onClick={() => setCreateViewModal(true)}
          >
            <Plus className="w-4 h-4 text-custom-primary-200" />
          </button>
        )}
      </div>
    </>
  );
});

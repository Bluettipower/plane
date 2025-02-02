import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
// icons
import { Plus } from "lucide-react";
// types
import { TStaticViewTypes } from "@plane/types";
// components
import {
  CreateUpdateWorkspaceViewModal,
  DefaultWorkspaceViewQuickActions,
  WorkspaceViewQuickActions,
} from "@/components/workspace";
// constants
import { GLOBAL_VIEW_OPENED } from "@/constants/event-tracker";
import { DEFAULT_GLOBAL_VIEWS_LIST, EUserWorkspaceRoles } from "@/constants/workspace";
// store hooks
import { useEventTracker, useGlobalView, useUser } from "@/hooks/store";

const ViewTab = observer((props: { viewId: string }) => {
  const { viewId } = props;
  // refs
  const parentRef = useRef<HTMLDivElement>(null);
  // router
  const router = useRouter();
  const { workspaceSlug, globalViewId } = router.query;
  // store hooks
  const { getViewDetailsById } = useGlobalView();

  const view = getViewDetailsById(viewId);

  if (!view || !workspaceSlug || !globalViewId) return null;

  return (
    <div ref={parentRef} className="relative">
      <WorkspaceViewQuickActions
        parentRef={parentRef}
        view={view}
        viewId={viewId}
        globalViewId={globalViewId?.toString()}
        workspaceSlug={workspaceSlug?.toString()}
      />
    </div>
  );
});

const DefaultViewTab = (props: {
  tab: {
    key: TStaticViewTypes;
    label: string;
  };
}) => {
  const { tab } = props;
  // refs
  const parentRef = useRef<HTMLDivElement>(null);
  // router
  const router = useRouter();
  const { workspaceSlug, globalViewId } = router.query;

  if (!workspaceSlug || !globalViewId) return null;
  return (
    <div key={tab.key} ref={parentRef} className="relative">
      <DefaultWorkspaceViewQuickActions
        parentRef={parentRef}
        globalViewId={globalViewId?.toString()}
        workspaceSlug={workspaceSlug?.toString()}
        view={tab}
      />
    </div>
  );
};

export const GlobalViewsHeader: React.FC = observer(() => {
  // states
  const [createViewModal, setCreateViewModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // router
  const router = useRouter();
  const { globalViewId } = router.query;
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
          {DEFAULT_GLOBAL_VIEWS_LIST.map((tab, index) => (
            <DefaultViewTab key={`${tab.key}-${index}`} tab={tab} />
          ))}

          {currentWorkspaceViews?.map((viewId) => <ViewTab key={viewId} viewId={viewId} />)}
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

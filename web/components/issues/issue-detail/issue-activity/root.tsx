import { FC, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "next-i18next";
import { History, LucideIcon, MessageCircle, ListRestart } from "lucide-react";
import { TIssueComment } from "@plane/types";
// hooks
import { TOAST_TYPE, setToast } from "@plane/ui";
import { useIssueDetail, useProject } from "@/hooks/store";
// ui
// components
import { IssueActivityCommentRoot, IssueActivityRoot, IssueCommentRoot, IssueCommentCreate } from "./";
// types

type TIssueActivity = {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
  disabled?: boolean;
};

type TActivityTabs = "all" | "activity" | "comments";

const activityTabs: { key: TActivityTabs; title: string; icon: LucideIcon }[] = [
  {
    key: "all",
    title: "All activity",
    icon: History,
  },
  {
    key: "activity",
    title: "Updates",
    icon: ListRestart,
  },
  {
    key: "comments",
    title: "Comments",
    icon: MessageCircle,
  },
];

export type TActivityOperations = {
  createComment: (data: Partial<TIssueComment>) => Promise<void>;
  updateComment: (commentId: string, data: Partial<TIssueComment>) => Promise<void>;
  removeComment: (commentId: string) => Promise<void>;
};

export const IssueActivity: FC<TIssueActivity> = observer((props) => {
  const { t } = useTranslation(undefined, { keyPrefix: "issue.properties" });
  const { workspaceSlug, projectId, issueId, disabled = false } = props;
  // hooks
  const { createComment, updateComment, removeComment } = useIssueDetail();
  const { getProjectById } = useProject();
  // state
  const [activityTab, setActivityTab] = useState<TActivityTabs>("all");

  const activityOperations: TActivityOperations = useMemo(
    () => ({
      createComment: async (data: Partial<TIssueComment>) => {
        try {
          if (!workspaceSlug || !projectId || !issueId) throw new Error("Missing fields");
          await createComment(workspaceSlug, projectId, issueId, data);
          setToast({
            title: t("comment.created"),
            type: TOAST_TYPE.SUCCESS,
            message: t("comment.created"),
          });
        } catch (error) {
          setToast({
            title: t("comment.failed"),
            type: TOAST_TYPE.ERROR,
            message: t("comment.failed.description"),
          });
        }
      },
      updateComment: async (commentId: string, data: Partial<TIssueComment>) => {
        try {
          if (!workspaceSlug || !projectId || !issueId) throw new Error("Missing fields");
          await updateComment(workspaceSlug, projectId, issueId, commentId, data);
          setToast({
            title: t("comment.updated"),
            type: TOAST_TYPE.SUCCESS,
            message: t("comment.updated"),
          });
        } catch (error) {
          setToast({
            title: t("comment.failed"),
            type: TOAST_TYPE.ERROR,
            message: t("comment.failed.description"),
          });
        }
      },
      removeComment: async (commentId: string) => {
        try {
          if (!workspaceSlug || !projectId || !issueId) throw new Error("Missing fields");
          await removeComment(workspaceSlug, projectId, issueId, commentId);
          setToast({
            title: t("comment.removed"),
            type: TOAST_TYPE.SUCCESS,
            message: t("comment.removed"),
          });
        } catch (error) {
          setToast({
            title: t("comment.failed"),
            type: TOAST_TYPE.ERROR,
            message: t("comment.failed.description"),
          });
        }
      },
    }),
    [workspaceSlug, projectId, issueId, createComment, updateComment, removeComment]
  );

  const project = getProjectById(projectId);
  if (!project) return <></>;

  return (
    <div className="pt-3 space-y-3">
      {/* header */}
      <div className="text-lg text-custom-text-100">{t("activity")}</div>

      {/* rendering activity */}
      <div className="space-y-3">
        <div className="relative flex items-center gap-1">
          {activityTabs.map((tab) => (
            <div
              key={tab.key}
              className={`relative flex items-center px-2 py-1.5 gap-1 cursor-pointer transition-all rounded 
            ${
              tab.key === activityTab
                ? `text-custom-text-100 bg-custom-background-80`
                : `text-custom-text-200 hover:bg-custom-background-80`
            }`}
              onClick={() => setActivityTab(tab.key)}
            >
              <div className="flex items-center justify-center flex-shrink-0 w-4 h-4">
                <tab.icon className="w-3 h-3" />
              </div>
              <div className="text-sm">{tab.title}</div>
            </div>
          ))}
        </div>

        <div className="min-h-[200px]">
          {activityTab === "all" ? (
            <div className="space-y-3">
              <IssueActivityCommentRoot
                workspaceSlug={workspaceSlug}
                issueId={issueId}
                activityOperations={activityOperations}
                showAccessSpecifier={project.is_deployed}
                disabled={disabled}
              />
              {!disabled && (
                <IssueCommentCreate
                  workspaceSlug={workspaceSlug}
                  activityOperations={activityOperations}
                  showAccessSpecifier={project.is_deployed}
                />
              )}
            </div>
          ) : activityTab === "activity" ? (
            <IssueActivityRoot issueId={issueId} />
          ) : (
            <div className="space-y-3">
              <IssueCommentRoot
                workspaceSlug={workspaceSlug}
                issueId={issueId}
                activityOperations={activityOperations}
                showAccessSpecifier={project.is_deployed}
                disabled={disabled}
              />
              {!disabled && (
                <IssueCommentCreate
                  workspaceSlug={workspaceSlug}
                  activityOperations={activityOperations}
                  showAccessSpecifier={project.is_deployed}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

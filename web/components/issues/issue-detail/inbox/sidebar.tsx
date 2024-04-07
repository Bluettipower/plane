import React from "react";

import { observer } from "mobx-react-lite";
import { useTranslation } from "next-i18next";

import { CalendarCheck2, Signal, Tag } from "lucide-react";

// hooks
// components
import { DoubleCircleIcon, StateGroupIcon, UserGroupIcon } from "@plane/ui";
import { DateDropdown, PriorityDropdown, MemberDropdown, StateDropdown } from "@/components/dropdowns";
import { IssueLabel, TIssueOperations } from "@/components/issues";
// icons
// helper
import { getDate, renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { useIssueDetail, useProject, useProjectState } from "@/hooks/store";

type Props = {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
  issueOperations: TIssueOperations;
  is_editable: boolean;
};

export const InboxIssueDetailsSidebar: React.FC<Props> = observer((props) => {
  const { t } = useTranslation();
  const { workspaceSlug, projectId, issueId, issueOperations, is_editable } = props;
  // store hooks
  const { getProjectById } = useProject();
  const { projectStates } = useProjectState();
  const {
    issue: { getIssueById },
  } = useIssueDetail();

  const issue = getIssueById(issueId);
  if (!issue) return <></>;

  const projectDetails = issue ? getProjectById(issue.project_id) : null;

  const minDate = issue.start_date ? getDate(issue.start_date) : null;
  minDate?.setDate(minDate.getDate());

  const currentIssueState = projectStates?.find((s) => s.id === issue.state_id);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden divide-y-2 divide-custom-border-200">
      <div className="flex items-center justify-between px-5 pb-3">
        <div className="flex items-center gap-x-2">
          {currentIssueState && (
            <StateGroupIcon className="w-4 h-4" stateGroup={currentIssueState.group} color={currentIssueState.color} />
          )}
          <h4 className="text-lg font-medium text-custom-text-300">
            {projectDetails?.identifier}-{issue?.sequence_id}
          </h4>
        </div>
      </div>

      <div className="w-full h-full px-5 overflow-y-auto">
        <h5 className="my-4 text-sm font-medium">{t("properties")}</h5>
        <div className={`divide-y-2 divide-custom-border-200 ${!is_editable ? "opacity-60" : ""}`}>
          <div className="flex flex-col gap-3">
            {/* State */}
            <div className="flex items-center h-8 gap-2">
              <div className="flex items-center flex-shrink-0 w-2/5 gap-1 text-sm text-custom-text-300">
                <DoubleCircleIcon className="flex-shrink-0 w-4 h-4" />
                <span>State</span>
              </div>
              <StateDropdown
                value={issue?.state_id ?? undefined}
                onChange={(val) => issueOperations.update(workspaceSlug, projectId, issueId, { state_id: val })}
                projectId={projectId?.toString() ?? ""}
                disabled={!is_editable}
                buttonVariant="transparent-with-text"
                className="flex-grow w-3/5 group"
                buttonContainerClassName="w-full text-left"
                buttonClassName="text-sm"
                dropdownArrow
                dropdownArrowClassName="h-3.5 w-3.5 hidden group-hover:inline"
              />
            </div>
            {/* Assignee */}
            <div className="flex items-center h-8 gap-2">
              <div className="flex items-center flex-shrink-0 w-2/5 gap-1 text-sm text-custom-text-300">
                <UserGroupIcon className="flex-shrink-0 w-4 h-4" />
                <span>Assignees</span>
              </div>
              <MemberDropdown
                value={issue?.assignee_ids ?? undefined}
                onChange={(val) => issueOperations.update(workspaceSlug, projectId, issueId, { assignee_ids: val })}
                disabled={!is_editable}
                projectId={projectId?.toString() ?? ""}
                placeholder="Add assignees"
                multiple
                buttonVariant={issue?.assignee_ids?.length > 0 ? "transparent-without-text" : "transparent-with-text"}
                className="flex-grow w-3/5 group"
                buttonContainerClassName="w-full text-left"
                buttonClassName={`text-sm justify-between ${
                  issue?.assignee_ids.length > 0 ? "" : "text-custom-text-400"
                }`}
                hideIcon={issue.assignee_ids?.length === 0}
                dropdownArrow
                dropdownArrowClassName="h-3.5 w-3.5 hidden group-hover:inline"
              />
            </div>
            {/* Priority */}
            <div className="flex items-center h-8 gap-2">
              <div className="flex items-center flex-shrink-0 w-2/5 gap-1 text-sm text-custom-text-300">
                <Signal className="flex-shrink-0 w-4 h-4" />
                <span>Priority</span>
              </div>
              <PriorityDropdown
                value={issue?.priority || undefined}
                onChange={(val) => issueOperations.update(workspaceSlug, projectId, issueId, { priority: val })}
                disabled={!is_editable}
                buttonVariant="border-with-text"
                className="flex-grow w-3/5 px-2 rounded hover:bg-custom-background-80"
                buttonContainerClassName="w-full text-left"
                buttonClassName="w-min h-auto whitespace-nowrap"
              />
            </div>
          </div>
        </div>
        <div className={`divide-y-2 divide-custom-border-200 mt-3 ${!is_editable ? "opacity-60" : ""}`}>
          <div className="flex flex-col gap-3">
            {/* Due Date */}
            <div className="flex items-center h-8 gap-2">
              <div className="flex items-center flex-shrink-0 w-2/5 gap-1 text-sm text-custom-text-300">
                <CalendarCheck2 className="flex-shrink-0 w-4 h-4" />
                <span>Due date</span>
              </div>
              <DateDropdown
                placeholder="Add due date"
                value={issue.target_date}
                onChange={(val) =>
                  issueOperations.update(workspaceSlug, projectId, issueId, {
                    target_date: val ? renderFormattedPayloadDate(val) : null,
                  })
                }
                minDate={minDate ?? undefined}
                disabled={!is_editable}
                buttonVariant="transparent-with-text"
                className="flex-grow w-3/5 group"
                buttonContainerClassName="w-full text-left"
                buttonClassName={`text-sm ${issue?.target_date ? "" : "text-custom-text-400"}`}
                hideIcon
                clearIconClassName="h-3 w-3 hidden group-hover:inline"
              />
            </div>
            {/* Labels */}
            <div className="flex items-center gap-2 min-h-8">
              <div className="flex items-center flex-shrink-0 w-2/5 gap-1 text-sm text-custom-text-300">
                <Tag className="flex-shrink-0 w-4 h-4" />
                <span>Labels</span>
              </div>
              <div className="flex-grow w-3/5 h-full pt-1 min-h-8">
                <IssueLabel
                  workspaceSlug={workspaceSlug}
                  projectId={projectId}
                  issueId={issueId}
                  disabled={!is_editable}
                  isInboxIssue
                  onLabelUpdate={(val: string[]) =>
                    issueOperations.update(workspaceSlug, projectId, issueId, { label_ids: val })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

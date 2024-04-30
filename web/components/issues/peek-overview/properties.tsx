import { FC } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "next-i18next";
import {
  Signal,
  Tag,
  Triangle,
  LayoutPanelTop,
  CircleDot,
  CopyPlus,
  XCircle,
  CalendarClock,
  CalendarCheck2,
  UserCircle2,
} from "lucide-react";
// hooks
// ui icons
import { DiceIcon, DoubleCircleIcon, UserGroupIcon, ContrastIcon, RelatedIcon, Tooltip } from "@plane/ui";
// components
import {
  DateDropdown,
  EstimateDropdown,
  PriorityDropdown,
  MemberDropdown,
  StateDropdown,
} from "@/components/dropdowns";
import { ButtonAvatars } from "@/components/dropdowns/member/avatar";
import {
  IssueLinkRoot,
  IssueCycleSelect,
  IssueModuleSelect,
  IssueParentSelect,
  IssueLabel,
  TIssueOperations,
  IssueRelationSelect,
} from "@/components/issues";
// helpers
import { cn } from "@/helpers/common.helper";
import { getDate, renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { shouldHighlightIssueDueDate } from "@/helpers/issue.helper";
import { useIssueDetail, useMember, useProject, useProjectState } from "@/hooks/store";
import { usePlatformOS } from "@/hooks/use-platform-os";

interface IPeekOverviewProperties {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
  disabled: boolean;
  issueOperations: TIssueOperations;
}

export const PeekOverviewProperties: FC<IPeekOverviewProperties> = observer((props) => {
  const { t } = useTranslation(undefined, { keyPrefix: "issue.properties" });
  const { workspaceSlug, projectId, issueId, issueOperations, disabled } = props;
  // store hooks
  const { getProjectById } = useProject();
  const {
    issue: { getIssueById },
  } = useIssueDetail();
  const { getStateById } = useProjectState();
  const { getUserDetails } = useMember();
  const { isMobile } = usePlatformOS();
  // derived values
  const issue = getIssueById(issueId);
  if (!issue) return <></>;
  const createdByDetails = getUserDetails(issue?.created_by);
  const projectDetails = getProjectById(issue.project_id);
  const isEstimateEnabled = projectDetails?.estimate;
  const stateDetails = getStateById(issue.state_id);

  const minDate = getDate(issue.start_date);
  minDate?.setDate(minDate.getDate());

  const maxDate = getDate(issue.target_date);
  maxDate?.setDate(maxDate.getDate());

  return (
    <div>
      <h6 className="text-sm font-medium">{t("properties")}</h6>
      {/* TODO: render properties using a common component */}
      <div className={`w-full space-y-2 mt-3 ${disabled ? "opacity-60" : ""}`}>
        {/* state */}
        <div className="flex items-center w-full h-8 gap-3">
          <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
            <DoubleCircleIcon className="flex-shrink-0 w-4 h-4" />
            <span>{t("state")}</span>
          </div>
          <StateDropdown
            value={issue?.state_id ?? undefined}
            onChange={(val) => issueOperations.update(workspaceSlug, projectId, issueId, { state_id: val })}
            projectId={projectId}
            disabled={disabled}
            buttonVariant="transparent-with-text"
            className="flex-grow w-3/4 group"
            buttonContainerClassName="w-full text-left"
            buttonClassName="text-sm"
            dropdownArrow
            dropdownArrowClassName="h-3.5 w-3.5 hidden group-hover:inline"
          />
        </div>

        {/* assignee */}
        <div className="flex items-center w-full h-8 gap-3">
          <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
            <UserGroupIcon className="flex-shrink-0 w-4 h-4" />
            <span>{t("assignees")}</span>
          </div>
          <MemberDropdown
            value={issue?.assignee_ids ?? undefined}
            onChange={(val) => issueOperations.update(workspaceSlug, projectId, issueId, { assignee_ids: val })}
            disabled={disabled}
            projectId={projectId}
            placeholder="Add assignees"
            multiple
            buttonVariant={issue?.assignee_ids?.length > 1 ? "transparent-without-text" : "transparent-with-text"}
            className="flex-grow w-3/4 group"
            buttonContainerClassName="w-full text-left"
            buttonClassName={`text-sm justify-between ${issue?.assignee_ids?.length > 0 ? "" : "text-custom-text-400"}`}
            hideIcon={issue.assignee_ids?.length === 0}
            dropdownArrow
            dropdownArrowClassName="h-3.5 w-3.5 hidden group-hover:inline"
          />
        </div>

        {/* priority */}
        <div className="flex items-center w-full h-8 gap-3">
          <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
            <Signal className="flex-shrink-0 w-4 h-4" />
            <span>{t("priority")}</span>
          </div>
          <PriorityDropdown
            value={issue?.priority}
            onChange={(val) => issueOperations.update(workspaceSlug, projectId, issueId, { priority: val })}
            disabled={disabled}
            buttonVariant="border-with-text"
            className="flex-grow w-3/4 px-2 rounded hover:bg-custom-background-80 group"
            buttonContainerClassName="w-full text-left"
            buttonClassName="w-min h-auto whitespace-nowrap"
          />
        </div>

        {/* created by */}
        {createdByDetails && (
          <div className="flex w-full items-center gap-3 h-8">
            <div className="flex items-center gap-1 w-1/4 flex-shrink-0 text-sm text-custom-text-300">
              <UserCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Created by</span>
            </div>
            <Tooltip tooltipContent={createdByDetails?.display_name} isMobile={isMobile}>
              <div className="h-full flex items-center gap-1.5 rounded px-2 py-0.5 text-sm justify-between cursor-default">
                <ButtonAvatars showTooltip={false} userIds={createdByDetails?.id} />
                <span className="flex-grow truncate text-xs leading-5">{createdByDetails?.display_name}</span>
              </div>
            </Tooltip>
          </div>
        )}

        {/* start date */}
        <div className="flex items-center w-full h-8 gap-3">
          <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
            <CalendarClock className="flex-shrink-0 w-4 h-4" />
            <span>{t("start_date")}</span>
          </div>
          <DateDropdown
            value={issue.start_date}
            onChange={(val) =>
              issueOperations.update(workspaceSlug, projectId, issueId, {
                start_date: val ? renderFormattedPayloadDate(val) : null,
              })
            }
            placeholder="Add start date"
            buttonVariant="transparent-with-text"
            maxDate={maxDate ?? undefined}
            disabled={disabled}
            className="flex-grow w-3/4 group"
            buttonContainerClassName="w-full text-left"
            buttonClassName={`text-sm ${issue?.start_date ? "" : "text-custom-text-400"}`}
            hideIcon
            clearIconClassName="h-3 w-3 hidden group-hover:inline"
            // TODO: add this logic
            // showPlaceholderIcon
          />
        </div>

        {/* due date */}
        <div className="flex items-center w-full h-8 gap-3">
          <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
            <CalendarCheck2 className="flex-shrink-0 w-4 h-4" />
            <span>{t("due_date")}</span>
          </div>
          <DateDropdown
            value={issue.target_date}
            onChange={(val) =>
              issueOperations.update(workspaceSlug, projectId, issueId, {
                target_date: val ? renderFormattedPayloadDate(val) : null,
              })
            }
            placeholder="Add due date"
            buttonVariant="transparent-with-text"
            minDate={minDate ?? undefined}
            disabled={disabled}
            className="flex-grow w-3/4 group"
            buttonContainerClassName="w-full text-left"
            buttonClassName={cn("text-sm", {
              "text-custom-text-400": !issue.target_date,
              "text-red-500": shouldHighlightIssueDueDate(issue.target_date, stateDetails?.group),
            })}
            hideIcon
            clearIconClassName="h-3 w-3 hidden group-hover:inline !text-custom-text-100"
            // TODO: add this logic
            // showPlaceholderIcon
          />
        </div>

        {/* estimate */}
        {isEstimateEnabled && (
          <div className="flex items-center w-full h-8 gap-3">
            <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
              <Triangle className="flex-shrink-0 w-4 h-4" />
              <span>{t("estimate")}</span>
            </div>
            <EstimateDropdown
              value={issue?.estimate_point !== null ? issue.estimate_point : null}
              onChange={(val) => issueOperations.update(workspaceSlug, projectId, issueId, { estimate_point: val })}
              projectId={projectId}
              disabled={disabled}
              buttonVariant="transparent-with-text"
              className="flex-grow w-3/4 group"
              buttonContainerClassName="w-full text-left"
              buttonClassName={`text-sm ${issue?.estimate_point !== null ? "" : "text-custom-text-400"}`}
              placeholder="None"
              hideIcon
              dropdownArrow
              dropdownArrowClassName="h-3.5 w-3.5 hidden group-hover:inline"
            />
          </div>
        )}

        {projectDetails?.module_view && (
          <div className="flex items-center w-full h-full gap-3 min-h-8">
            <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
              <DiceIcon className="flex-shrink-0 w-4 h-4" />
              <span>{t("module")}</span>
            </div>
            <IssueModuleSelect
              className="flex-grow w-3/4"
              workspaceSlug={workspaceSlug}
              projectId={projectId}
              issueId={issueId}
              issueOperations={issueOperations}
              disabled={disabled}
            />
          </div>
        )}

        {projectDetails?.cycle_view && (
          <div className="flex items-center w-full h-8 gap-3">
            <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
              <ContrastIcon className="flex-shrink-0 w-4 h-4" />
              <span>{t("cycle")}</span>
            </div>
            <IssueCycleSelect
              className="flex-grow w-3/4"
              workspaceSlug={workspaceSlug}
              projectId={projectId}
              issueId={issueId}
              issueOperations={issueOperations}
              disabled={disabled}
            />
          </div>
        )}

        {/* parent */}
        <div className="flex items-center w-full h-8 gap-3">
          <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
            <LayoutPanelTop className="flex-shrink-0 w-4 h-4" />
            <p>{t("parent")}</p>
          </div>
          <IssueParentSelect
            className="flex-grow w-3/4 h-full"
            disabled={disabled}
            issueId={issueId}
            issueOperations={issueOperations}
            projectId={projectId}
            workspaceSlug={workspaceSlug}
          />
        </div>

        {/* relates to */}
        <div className="flex gap-3 min-h-8">
          <div className="flex flex-shrink-0 w-1/4 gap-1 pt-2 text-sm text-custom-text-300">
            <RelatedIcon className="flex-shrink-0 w-4 h-4" />
            <span>{t("relates_to")}</span>
          </div>
          <IssueRelationSelect
            className="flex-grow w-3/4 h-full min-h-8"
            workspaceSlug={workspaceSlug}
            projectId={projectId}
            issueId={issueId}
            relationKey="relates_to"
            disabled={disabled}
          />
        </div>

        {/* blocking */}
        <div className="flex gap-3 min-h-8">
          <div className="flex flex-shrink-0 w-1/4 gap-1 pt-2 text-sm text-custom-text-300">
            <XCircle className="flex-shrink-0 w-4 h-4" />
            <span>{t("blocking")}</span>
          </div>
          <IssueRelationSelect
            className="flex-grow w-3/4 h-full min-h-8"
            workspaceSlug={workspaceSlug}
            projectId={projectId}
            issueId={issueId}
            relationKey="blocking"
            disabled={disabled}
          />
        </div>

        {/* blocked by */}
        <div className="flex gap-3 min-h-8">
          <div className="flex flex-shrink-0 w-1/4 gap-1 pt-2 text-sm text-custom-text-300">
            <CircleDot className="flex-shrink-0 w-4 h-4" />
            <span>{t("blocked_by")}</span>
          </div>
          <IssueRelationSelect
            className="flex-grow w-3/4 h-full min-h-8"
            workspaceSlug={workspaceSlug}
            projectId={projectId}
            issueId={issueId}
            relationKey="blocked_by"
            disabled={disabled}
          />
        </div>

        {/* duplicate of */}
        <div className="flex gap-3 min-h-8">
          <div className="flex flex-shrink-0 w-1/4 gap-1 pt-2 text-sm text-custom-text-300">
            <CopyPlus className="flex-shrink-0 w-4 h-4" />
            <span>{t("duplicate_of")}</span>
          </div>
          <IssueRelationSelect
            className="flex-grow w-3/4 h-full min-h-8"
            workspaceSlug={workspaceSlug}
            projectId={projectId}
            issueId={issueId}
            relationKey="duplicate"
            disabled={disabled}
          />
        </div>

        {/* label */}
        <div className="flex items-center w-full gap-3 min-h-8">
          <div className="flex items-center flex-shrink-0 w-1/4 gap-1 text-sm text-custom-text-300">
            <Tag className="flex-shrink-0 w-4 h-4" />
            <span>{t("labels")}</span>
          </div>
          <div className="flex flex-col w-full gap-3">
            <IssueLabel workspaceSlug={workspaceSlug} projectId={projectId} issueId={issueId} disabled={disabled} />
          </div>
        </div>
      </div>
      <div className="w-full pt-3">
        <IssueLinkRoot workspaceSlug={workspaceSlug} projectId={projectId} issueId={issueId} disabled={disabled} />
      </div>
    </div>
  );
});

import { FC } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "next-i18next";
// hooks
import { DoubleCircleIcon } from "@plane/ui";
import { useIssueDetail } from "@/hooks/store";
// components
import { IssueActivityBlockComponent, IssueLink } from "./";
// icons

type TIssueStateActivity = { activityId: string; showIssue?: boolean; ends: "top" | "bottom" | undefined };

export const IssueStateActivity: FC<TIssueStateActivity> = observer((props) => {
  const { t } = useTranslation(undefined, { keyPrefix: "issue.activity" });
  const { activityId, showIssue = true, ends } = props;
  // hooks
  const {
    activity: { getActivityById },
  } = useIssueDetail();

  const activity = getActivityById(activityId);

  if (!activity) return <></>;
  return (
    <IssueActivityBlockComponent
      icon={<DoubleCircleIcon className="flex-shrink-0 w-4 h-4" />}
      activityId={activityId}
      ends={ends}
    >
      <>
        {t("set_state_to")} <span className="font-medium text-custom-text-100">{activity.new_value}</span>
        {showIssue ? ` for ` : ``}
        {showIssue && <IssueLink activityId={activityId} />}.
      </>
    </IssueActivityBlockComponent>
  );
});

// types
import { IDefaultAnalyticsResponse, TStateGroups } from "@plane/types";
// constants
import { STATE_GROUPS } from "@/constants/state";

type Props = {
  defaultAnalytics: IDefaultAnalyticsResponse;
};

export const AnalyticsDemand: React.FC<Props> = ({ defaultAnalytics }) => (
  <div className="space-y-3 rounded-[10px] border border-custom-border-200 p-3">
    <div>
      <h4 className="text-base font-medium text-custom-text-100">Total open tasks</h4>
      <h3 className="mt-1 text-xl font-semibold">{defaultAnalytics.open_issues}</h3>
    </div>
    <div className="pb-2 space-y-6">
      {defaultAnalytics?.open_issues_classified.map((group) => {
        const percentage = ((group.state_count / defaultAnalytics.total_issues) * 100).toFixed(0);

        return (
          <div key={group.state_group} className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: STATE_GROUPS[group.state_group as TStateGroups].color,
                  }}
                />
                <h6 className="capitalize">{group.state_group}</h6>
                <span className="ml-1 rounded-3xl bg-custom-background-80 px-2 py-0.5 text-[0.65rem] text-custom-text-200">
                  {group.state_count}
                </span>
              </div>
              <p className="text-custom-text-200">{percentage}%</p>
            </div>
            <div className="relative w-full h-1 rounded bar bg-custom-background-80">
              <div
                className="absolute top-0 left-0 h-1 duration-300 rounded"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: STATE_GROUPS[group.state_group as TStateGroups].color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

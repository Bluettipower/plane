import { FC } from "react";
// hooks
import { IUser } from "@plane/types";
import { useCurrentTime } from "@/hooks/use-current-time";
// types

export interface IUserGreetingsView {
  user: IUser;
}

export const UserGreetingsView: FC<IUserGreetingsView> = (props) => {
  const { user } = props;
  // current time hook
  const { currentTime } = useCurrentTime();

  const hour = new Intl.DateTimeFormat("en-US", {
    hour12: false,
    hour: "numeric",
  }).format(currentTime);

  const date = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(currentTime);

  const weekDay = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
  }).format(currentTime);

  const timeString = new Intl.DateTimeFormat(undefined, {
    timeZone: user?.user_timezone,
    hour12: false, // Use 24-hour format
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentTime);

  const greeting = parseInt(hour, 10) < 12 ? "morning" : parseInt(hour, 10) < 18 ? "afternoon" : "evening";

  return (
    <div>
      <h3 className="text-xl font-semibold">
        Good {greeting}, {user?.first_name} {user?.last_name}
      </h3>
      <h6 className="flex items-center gap-2 font-medium text-custom-text-400">
        <div>{greeting === "morning" ? "🌤️" : greeting === "afternoon" ? "🌥️" : "🌙️"}</div>
        <div>
          {weekDay}, {date} {timeString}
        </div>
      </h6>
    </div>
  );
};

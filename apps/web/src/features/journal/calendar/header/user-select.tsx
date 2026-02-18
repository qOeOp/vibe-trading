"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendar } from "../contexts/calendar-context";

export function UserSelect() {
  const { users, selectedUserId, filterEventsBySelectedUser } = useCalendar();

  return (
    <Select value={selectedUserId!} onValueChange={filterEventsBySelectedUser}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="all">
          <div className="mx-2 flex items-center -space-x-2">
            {users.slice(0, 3).map((user) => (
              <Avatar key={user.id} className="size-6 text-xxs border-2 border-white">
                <AvatarImage
                  src={user.picturePath ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback className="text-xxs">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {users.length > 3 && (
              <Avatar className="size-6 text-xxs border-2 border-white">
                <AvatarFallback className="text-xxs bg-mine-bg text-mine-muted">
                  +{users.length - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          All
        </SelectItem>

        {users.map((user) => (
          <SelectItem
            key={user.id}
            value={user.id}
            className="flex-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Avatar key={user.id} className="size-6">
                <AvatarImage
                  src={user.picturePath ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback className="text-xxs">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>

              <p className="truncate">{user.name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

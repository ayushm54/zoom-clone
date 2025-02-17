import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const client = useStreamVideoClient();
  const { user } = useUser();

  useEffect(() => {
    const loadCallss = async () => {
      if (!client || !user) return;
      setIsLoading(true);
      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              {
                created_by_user_id: user.id,
              },
              {
                members: { $in: [user.id] },
              },
            ],
          },
        });
        setCalls(calls);
      } catch (err) {
        console.log("failed to load calls", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCallss();
  }, [client, user?.id]);

  const now = new Date();

  const endedCalls = calls.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });
  const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};

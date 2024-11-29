//@ts-nocheck

"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import MeetingCard from "./MeetingCard";
import {
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  PlayIcon,
  VideoIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { upcomingCalls, endedCalls, callRecordings, isLoading } =
    useGetCalls();

  const router = useRouter();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No previous calls";
      case "upcoming":
        return "No upcoming calls";
      case "recordings":
        return "No recordings";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (err) {
        toast({
          title: "Failed to fetch recordings, please try again later.",
        });
      }
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording, index) => (
          <MeetingCard
            key={(meeting as Call)?.id}
            icon={
              type === "ended" ? (
                <CalendarArrowUpIcon size={28} />
              ) : type === "upcoming" ? (
                <CalendarArrowDownIcon size={28} />
              ) : (
                <VideoIcon size={28} />
              )
            }
            title={
              meeting.state?.custom?.description?.substring(0, 25) ||
              meeting.filename?.substring(0, 25) ||
              "Personal Meeting"
            }
            date={
              meeting.state?.startedAt?.toLocaleString() ||
              meeting.start_time?.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={
              type === "recordings" ? <PlayIcon size={20} /> : undefined
            }
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              type === "recordings"
                ? () => {
                    router.push(`${meeting.url}`);
                  }
                : () => {
                    router.push(`/meeting/${meeting.id}`);
                  }
            }
            link={
              type === "recordings"
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;

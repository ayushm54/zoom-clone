import {
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  HouseIcon,
  PlusIcon,
  VideoIcon,
} from "lucide-react";

export const sidebarLinks = [
  {
    route: "/",
    label: "Home",
    icon: HouseIcon,
  },
  {
    route: "/upcoming",
    label: "Upcoming",
    icon: CalendarArrowDownIcon,
  },
  {
    route: "/previous",
    label: "Previous",
    icon: CalendarArrowUpIcon,
  },
  {
    route: "/recordings",
    label: "Recordings",
    icon: VideoIcon,
  },
  {
    route: "/personal-room",
    label: "Personal Room",
    icon: PlusIcon,
  },
];

export const avatarImages = [
  '/images/avatar-1.jpeg',
  '/images/avatar-2.jpeg',
  '/images/avatar-3.png',
  '/images/avatar-4.png',
  '/images/avatar-5.png',
];
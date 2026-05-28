import {
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquare,
  Activity,
  Stethoscope,
  CalendarDays,
  UserCircle,
} from "lucide-react";

export const adminLinks = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/add",
    label: "Add Patient",
    icon: UserPlus,
  },
  {
    to: "/admin/patients",
    label: "Patients",
    icon: Users,
  },
  {
    to: "/admin/feedback",
    label: "Feedback",
    icon: MessageSquare,
  },
  {
    to: "/admin/activity-logs",
    label: "Logs",
    icon: Activity,
  },
  {
    to: "/admin/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    to: "/admin/appointments",
    label: "Appointments",
    icon: CalendarDays,
  },
];

export const userLinks = [
  {
    to: "/feedback",
    label: "Feedback",
    icon: MessageSquare,
  },
  {
    to: "/user",
    label: "Profile",
    icon: UserCircle,
  },
];
import { ReliefMapMarker } from '@/components/ReliefMap';
import { VolunteerRequest } from '../types';

export const VOLUNTEER_MAP_MARKERS: ReliefMapMarker[] = [
  {
    id: "v-1",
    name: "Aisha Patel",
    lat: 19.1021,
    lng: 72.8861,
    subtitle: "Skill: First Aid",
    detail: "Distance: 2.4 km"
  },
  {
    id: "v-2",
    name: "Rohan Mehta",
    lat: 19.0638,
    lng: 72.9005,
    subtitle: "Skill: Food Distribution",
    detail: "Distance: 3.1 km"
  },
  {
    id: "v-3",
    name: "Nisha Iyer",
    lat: 19.0813,
    lng: 72.8354,
    subtitle: "Skill: Child Support",
    detail: "Distance: 4.8 km"
  },
  {
    id: "v-4",
    name: "Arjun Das",
    lat: 19.1189,
    lng: 72.9138,
    subtitle: "Skill: Emergency Logistics",
    detail: "Distance: 5.3 km"
  }
];

export const NGO_MAP_MARKERS: ReliefMapMarker[] = [
  {
    id: "n-1",
    name: "Seva Relief Trust",
    lat: 19.0567,
    lng: 72.8448,
    subtitle: "Need: Medical",
    detail: "Urgency: High",
    urgency: "High"
  },
  {
    id: "n-2",
    name: "CareBridge Network",
    lat: 19.0941,
    lng: 72.8722,
    subtitle: "Need: Food",
    detail: "Urgency: Medium",
    urgency: "Medium"
  },
  {
    id: "n-3",
    name: "Hope Education NGO",
    lat: 19.1202,
    lng: 72.8595,
    subtitle: "Need: Education",
    detail: "Urgency: Low",
    urgency: "Low"
  }
];

export const urgencyTheme: Record<string, string> = {
  High: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  Medium: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Low: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
};

export const statusTheme: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Accepted: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  "In Progress": "bg-purple-100 text-purple-700 ring-1 ring-purple-200",
  Completed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
};

export const TIMELINE_STAGES = ["Created", "Matched", "Accepted", "In Progress", "Completed"] as const;

export const STATUS_TO_STAGE: Record<string, number> = {
  "Created": 0,
  "Matched": 1,
  "Accepted": 2,
  "In Progress": 3,
  "Completed": 4
};

export const DEFAULT_NGO_PROFILE = {
  organizationName: "ReliefLink Org",
  location: "Mumbai",
  type: "Disaster Relief",
  bio: "We are a disaster relief organization focused on rapid emergency response and community resilience."
};

export const DEFAULT_VOLUNTEER_PROFILE = {
  name: "Aisha Patel",
  skills: "First Aid, Community Outreach",
  availability: "Weekdays, 9 AM - 2 PM",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha"
};

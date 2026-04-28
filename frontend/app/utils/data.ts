import { VolunteerRequest } from '../types';

export const PRELOADED_VOLUNTEERS = [
  {
    name: "Aisha Patel",
    skills: ["First Aid", "Community Outreach"],
    distance: "2.4 km",
    availability: "Weekdays, 9 AM - 2 PM",
    match_score: 92,
    reason: "Strong medical response background near the requested zone."
  },
  {
    name: "Rohan Mehta",
    skills: ["Food Distribution", "Logistics"],
    distance: "3.1 km",
    availability: "Daily, 11 AM - 6 PM",
    match_score: 88,
    reason: "Experienced in high-volume food relief operations."
  },
  {
    name: "Nisha Iyer",
    skills: ["Teaching", "Child Support"],
    distance: "4.8 km",
    availability: "Weekends, Full Day",
    match_score: 84,
    reason: "Education-focused volunteer with strong local references."
  }
];

export const MATCHED_REQUESTS: VolunteerRequest[] = [
  { id: "req-1", userId: "demo-ngo", location: "Kurla East", needType: "Medical", urgency: "High", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 2.4 },
  { id: "req-2", userId: "demo-ngo", location: "Dharavi", needType: "Food", urgency: "Medium", status: "In Progress", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 3.1 },
  { id: "req-3", userId: "demo-ngo", location: "Chembur", needType: "Education", urgency: "Low", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 4.8 },
  { id: "req-4", userId: "demo-ngo", location: "Borivali West", needType: "Medical", urgency: "High", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 1.7 },
  { id: "req-5", userId: "demo-ngo", location: "Kandivali East", needType: "Food", urgency: "Low", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 6.2 },
  { id: "req-6", userId: "citizen-4", location: "Versova Beach", needType: "Medical", urgency: "High", status: "Pending", source: "public", assignedVolunteerId: "demo-volunteer", distance: 3.4 },
  { id: "req-7", userId: "citizen-5", location: "Goregaon East", needType: "Education", urgency: "Medium", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 5.6 },
  { id: "req-8", userId: "citizen-6", location: "Matunga", needType: "Food", urgency: "High", status: "Pending", source: "public", assignedVolunteerId: "demo-volunteer", distance: 2.9 }
];

export const AVAILABLE_REQUESTS: VolunteerRequest[] = [
  { id: "avail-1", userId: "citizen-10", location: "Vile Parle East", needType: "Medical", urgency: "High", status: "Pending", source: "public", distance: 2.1 },
  { id: "avail-2", userId: "citizen-11", location: "Santacruz West", needType: "Food", urgency: "Medium", status: "Pending", source: "public", distance: 4.3 },
  { id: "avail-3", userId: "citizen-12", location: "Mulund East", needType: "Education", urgency: "Low", status: "Pending", source: "public", distance: 7.8 },
  { id: "avail-4", userId: "demo-ngo", location: "Lower Parel", needType: "Medical", urgency: "High", status: "Pending", source: "ngo", distance: 1.5 },
  { id: "avail-5", userId: "citizen-13", location: "Vikhroli West", needType: "Food", urgency: "Medium", status: "Pending", source: "public", distance: 5.0 },
  { id: "avail-6", userId: "citizen-14", location: "Thane West", needType: "Education", urgency: "Low", status: "Pending", source: "ngo", distance: 8.4 }
];

export const ACTIVE_REQUESTS: VolunteerRequest[] = [
  { id: "active-1", userId: "demo-ngo", location: "Andheri", needType: "Medical", urgency: "High", status: "Pending", source: "ngo", distance: 5.2 },
  { id: "active-2", userId: "demo-ngo", location: "Dadar", needType: "Food", urgency: "Medium", status: "In Progress", source: "ngo", distance: 3.8 },
  { id: "active-3", userId: "demo-ngo", location: "Byculla", needType: "Education", urgency: "Low", status: "Accepted", source: "ngo", distance: 2.1 },
  { id: "active-4", userId: "demo-ngo", location: "Colaba", needType: "Medical", urgency: "High", status: "Completed", source: "ngo", distance: 6.4 },
  { id: "active-5", userId: "demo-ngo", location: "Juhu", needType: "Food", urgency: "Medium", status: "Completed", source: "ngo", distance: 4.5 }
];

export const PUBLIC_REQUESTS: VolunteerRequest[] = [
  { id: "pub-1", userId: "citizen-1", location: "Worli Sea Face", needType: "Medical", urgency: "High", status: "Pending", source: "public", distance: 1.8 },
  { id: "pub-2", userId: "citizen-2", location: "Sion East", needType: "Food", urgency: "Medium", status: "Pending", source: "public", distance: 3.5 },
  { id: "pub-3", userId: "citizen-3", location: "Malad West", needType: "Education", urgency: "Low", status: "Pending", source: "public", distance: 7.2 }
];

export const COMPLETED_DUMMY_TASKS: VolunteerRequest[] = [
  { id: "done-1", userId: "demo-ngo", location: "Goregaon West", needType: "Medical", urgency: "High", status: "Completed", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 5.3 },
  { id: "done-2", userId: "demo-ngo", location: "Powai", needType: "Food", urgency: "Medium", status: "Completed", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 3.9 }
];

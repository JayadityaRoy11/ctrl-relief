"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Activity,
  Award,
  Bot,
  Brain,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  Globe,
  Heart,
  LogOut,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Play,
  Send,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
  UserCircle2,
  UserPlus,
  Users,
  Wrench,
  Zap
} from "lucide-react";
import type { ReliefMapMarker } from "../components/ReliefMap";

type NeedType = "Food" | "Medical" | "Education";
type Urgency = "High" | "Medium" | "Low";
type Role = "ngo" | "volunteer";
type RequestSource = "ngo" | "public";
type RequestStatus = "Pending" | "Accepted" | "In Progress" | "Completed";
type VolunteerRequest = {
  id: string;
  userId: string;
  location: string;
  needType: NeedType;
  urgency: Urgency;
  status: RequestStatus;
  source: RequestSource;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  distance?: number;
};
type NGOProfile = {
  organizationName: string;
  location: string;
  type: string;
  bio: string;
};
type VolunteerProfile = {
  name: string;
  skills: string;
  availability: string;
  profileImage: string;
};

type MatchPayload = {
  location: string;
  need_type: Lowercase<NeedType>;
  urgency: Lowercase<Urgency>;
};

type Volunteer = {
  name: string;
  skills: string[];
  distance: string;
  availability: string;
  match_score: number;
  reason: string;
};

type MatchApiResponse =
  | Volunteer[]
  | { matches?: Volunteer[] | Record<string, unknown>[] }
  | { volunteers?: Volunteer[] | Record<string, unknown>[] };

const ReliefMap = dynamic(() => import("../components/ReliefMap"), { ssr: false });

const PRELOADED_VOLUNTEERS: Volunteer[] = [
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

const MATCHED_REQUESTS: VolunteerRequest[] = [
  { id: "req-1", userId: "demo-ngo", location: "Kurla East", needType: "Medical", urgency: "High", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 2.4 },
  { id: "req-2", userId: "demo-ngo", location: "Dharavi", needType: "Food", urgency: "Medium", status: "In Progress", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 3.1 },
  { id: "req-3", userId: "demo-ngo", location: "Chembur", needType: "Education", urgency: "Low", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 4.8 },
  { id: "req-4", userId: "demo-ngo", location: "Borivali West", needType: "Medical", urgency: "High", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 1.7 },
  { id: "req-5", userId: "demo-ngo", location: "Kandivali East", needType: "Food", urgency: "Low", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 6.2 },
  { id: "req-6", userId: "citizen-4", location: "Versova Beach", needType: "Medical", urgency: "High", status: "Pending", source: "public", assignedVolunteerId: "demo-volunteer", distance: 3.4 },
  { id: "req-7", userId: "citizen-5", location: "Goregaon East", needType: "Education", urgency: "Medium", status: "Pending", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 5.6 },
  { id: "req-8", userId: "citizen-6", location: "Matunga", needType: "Food", urgency: "High", status: "Pending", source: "public", assignedVolunteerId: "demo-volunteer", distance: 2.9 }
];
const AVAILABLE_REQUESTS: VolunteerRequest[] = [
  { id: "avail-1", userId: "citizen-10", location: "Vile Parle East", needType: "Medical", urgency: "High", status: "Pending", source: "public", distance: 2.1 },
  { id: "avail-2", userId: "citizen-11", location: "Santacruz West", needType: "Food", urgency: "Medium", status: "Pending", source: "public", distance: 4.3 },
  { id: "avail-3", userId: "citizen-12", location: "Mulund East", needType: "Education", urgency: "Low", status: "Pending", source: "public", distance: 7.8 },
  { id: "avail-4", userId: "demo-ngo", location: "Lower Parel", needType: "Medical", urgency: "High", status: "Pending", source: "ngo", distance: 1.5 },
  { id: "avail-5", userId: "citizen-13", location: "Vikhroli West", needType: "Food", urgency: "Medium", status: "Pending", source: "public", distance: 5.0 },
  { id: "avail-6", userId: "citizen-14", location: "Thane West", needType: "Education", urgency: "Low", status: "Pending", source: "ngo", distance: 8.4 }
];
const ACTIVE_REQUESTS: VolunteerRequest[] = [
  { id: "active-1", userId: "demo-ngo", location: "Andheri", needType: "Medical", urgency: "High", status: "Pending", source: "ngo", distance: 5.2 },
  { id: "active-2", userId: "demo-ngo", location: "Dadar", needType: "Food", urgency: "Medium", status: "In Progress", source: "ngo", distance: 3.8 },
  { id: "active-3", userId: "demo-ngo", location: "Byculla", needType: "Education", urgency: "Low", status: "Accepted", source: "ngo", distance: 2.1 },
  { id: "active-4", userId: "demo-ngo", location: "Colaba", needType: "Medical", urgency: "High", status: "Completed", source: "ngo", distance: 6.4 },
  { id: "active-5", userId: "demo-ngo", location: "Juhu", needType: "Food", urgency: "Medium", status: "Completed", source: "ngo", distance: 4.5 }
];
const PUBLIC_REQUESTS: VolunteerRequest[] = [
  { id: "pub-1", userId: "citizen-1", location: "Worli Sea Face", needType: "Medical", urgency: "High", status: "Pending", source: "public", distance: 1.8 },
  { id: "pub-2", userId: "citizen-2", location: "Sion East", needType: "Food", urgency: "Medium", status: "Pending", source: "public", distance: 3.5 },
  { id: "pub-3", userId: "citizen-3", location: "Malad West", needType: "Education", urgency: "Low", status: "Pending", source: "public", distance: 7.2 }
];
const COMPLETED_DUMMY_TASKS: VolunteerRequest[] = [
  { id: "done-1", userId: "demo-ngo", location: "Goregaon West", needType: "Medical", urgency: "High", status: "Completed", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 5.3 },
  { id: "done-2", userId: "demo-ngo", location: "Powai", needType: "Food", urgency: "Medium", status: "Completed", source: "ngo", assignedVolunteerId: "demo-volunteer", distance: 3.9 }
];

const VOLUNTEER_MAP_MARKERS: ReliefMapMarker[] = [
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

const NGO_MAP_MARKERS: ReliefMapMarker[] = [
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

const urgencyTheme: Record<Urgency, string> = {
  High: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  Medium: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Low: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
};
const statusTheme: Record<RequestStatus, string> = {
  Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Accepted: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  "In Progress": "bg-purple-100 text-purple-700 ring-1 ring-purple-200",
  Completed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
};

function getEta(distance?: number): string {
  if (!distance) return "~10 mins";
  return `~${Math.round(distance * 3)} mins`;
}

function formatDist(d: number | string | undefined): string {
  if (d === undefined || d === null) return "N/A";
  const n = typeof d === "string" ? parseFloat(d) : d;
  if (isNaN(n)) return String(d);
  return `${n.toFixed(1)} km`;
}

function getPriority(urgency: Urgency, distance?: number): { label: string; className: string } {
  if (urgency === "High" && (distance ?? 10) < 5) {
    return { label: "Critical", className: "bg-rose-600 text-white ring-1 ring-rose-700" };
  }
  return { label: "Standard", className: "bg-amber-100 text-amber-700 ring-1 ring-amber-200" };
}

const TIMELINE_STAGES = ["Created", "Matched", "Accepted", "In Progress", "Completed"] as const;
const STATUS_TO_STAGE: Record<RequestStatus, number> = {
  Pending: 1,
  Accepted: 2,
  "In Progress": 3,
  Completed: 4
};

function RequestTimeline({ status }: { status: RequestStatus }) {
  const currentIdx = STATUS_TO_STAGE[status] ?? 0;
  return (
    <div className="mt-3 flex items-center gap-0">
      {TIMELINE_STAGES.map((stage, idx) => {
        const isReached = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={stage} className="flex items-center" style={{ flex: idx < TIMELINE_STAGES.length - 1 ? 1 : "none" }}>
            <div className="flex flex-col items-center" style={{ minWidth: 10 }}>
              <div
                className={`relative flex h-3 w-3 items-center justify-center rounded-full transition-all ${
                  isReached
                    ? isCurrent
                      ? "bg-blue-500 ring-[3px] ring-blue-200"
                      : "bg-emerald-500"
                    : "bg-slate-200"
                }`}
              >
                {isReached && !isCurrent && (
                  <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                )}
              </div>
              <span className={`mt-1 text-center text-[8px] leading-tight font-semibold ${isCurrent ? "text-blue-600" : isReached ? "text-emerald-600" : "text-slate-300"}`} style={{ width: 42 }}>
                {stage}
              </span>
            </div>
            {idx < TIMELINE_STAGES.length - 1 && (
              <div className={`mx-0.5 h-[2px] flex-1 rounded-full ${idx < currentIdx ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

type ActivityEntry = {
  id: string;
  type: 'assigned' | 'accepted' | 'en_route' | 'completed' | 'started';
  message: string;
  timestamp: string;
  icon: React.ReactNode;
};

type ChatMessage = {
  id: string;
  sender: 'ngo' | 'volunteer';
  message: string;
  timestamp: string;
};

const generateMockActivities = (status: RequestStatus): ActivityEntry[] => {
  const baseActivities: ActivityEntry[] = [
    {
      id: '1',
      type: 'assigned',
      message: 'Volunteer assigned to task',
      timestamp: '2 mins ago',
      icon: <UserPlus className="h-3 w-3 text-blue-500" />
    }
  ];

  if (status === 'Accepted' || status === 'In Progress' || status === 'Completed') {
    baseActivities.push({
      id: '2',
      type: 'accepted',
      message: 'Volunteer accepted the task',
      timestamp: '1 min ago',
      icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" />
    });
  }

  if (status === 'In Progress' || status === 'Completed') {
    baseActivities.push({
      id: '3',
      type: 'started',
      message: 'Volunteer started the task',
      timestamp: '30 secs ago',
      icon: <Play className="h-3 w-3 text-purple-500" />
    });
  }

  if (status === 'In Progress') {
    baseActivities.push({
      id: '4',
      type: 'en_route',
      message: 'Volunteer is en route',
      timestamp: 'Just now',
      icon: <Navigation className="h-3 w-3 text-amber-500" />
    });
  }

  if (status === 'Completed') {
    baseActivities.push({
      id: '4',
      type: 'en_route',
      message: 'Volunteer completed task successfully',
      timestamp: 'Just now',
      icon: <CheckCircle2 className="h-3 w-3 text-green-500" />
    });
  }

  return baseActivities;
};

const generateMockMessages = (role: Role): ChatMessage[] => {
  if (role === 'ngo') {
    return [
      {
        id: '1',
        sender: 'volunteer',
        message: 'On my way, will reach in 10 mins',
        timestamp: '2 mins ago'
      },
      {
        id: '2',
        sender: 'ngo',
        message: 'Please prioritize medical kits',
        timestamp: '1 min ago'
      },
      {
        id: '3',
        sender: 'volunteer',
        message: 'Copy that. Medical kits ready.',
        timestamp: '30 secs ago'
      }
    ];
  } else {
    return [
      {
        id: '1',
        sender: 'ngo',
        message: 'Please prioritize medical kits',
        timestamp: '1 min ago'
      },
      {
        id: '2',
        sender: 'volunteer',
        message: 'Copy that. Medical kits ready.',
        timestamp: '30 secs ago'
      }
    ];
  }
};

function TaskDetailModal({
  request,
  role,
  onClose,
  onAccept,
  onStart,
  onComplete,
  onReject,
  onAutoAssign,
  onRate,
  rating,
  liveStatus,
  volunteerRatings,
}: {
  request: VolunteerRequest;
  role: Role;
  onClose: () => void;
  onAccept?: (id: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onReject?: (id: string) => void;
  onAutoAssign?: (id: string) => void;
  onRate?: (id: string, stars: number) => void;
  rating?: number;
  liveStatus?: string;
  volunteerRatings: Record<string, number>;
}) {
  const priority = getPriority(request.urgency, request.distance);
  const ratingValues = Object.values(volunteerRatings);
  const avgRating = ratingValues.length > 0 ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length : null;
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(generateMockMessages(role));
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSendingMessage(true);
    
    // Create new message object
    const newChatMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: role,
      message: newMessage.trim(),
      timestamp: 'Just now'
    };
    
    // Update UI instantly
    setMessages(prev => [...prev, newChatMessage]);
    
    // Clear input
    const messageToSend = newMessage.trim();
    setNewMessage('');
    
    try {
      // Send to backend (using production API URL)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ctrl-relief-backend-1091620591190.asia-south1.run.app';
      
      // Try to send to chat endpoint, fall back to mock if it fails
      try {
        const response = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageToSend,
            sender: role,
            requestId: request.id,
            timestamp: new Date().toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Message sent successfully
        console.log('Message sent to backend successfully');
        
      } catch (apiError) {
        // Chat endpoint not available, simulate mock response
        setTimeout(() => {
          const mockResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: role === 'ngo' ? 'volunteer' : 'ngo',
            message: role === 'ngo' 
              ? 'Received! I\'m on my way to help.' 
              : 'Message received. Will update you on progress.',
            timestamp: 'Just now'
          };
          setMessages(prev => [...prev, mockResponse]);
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Still keep the message in UI even if API fails
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Simulate activity feed updates
  useEffect(() => {
    const mockActivities = generateMockActivities(request.status);
    setActivities(mockActivities);

    if (request.status === 'In Progress') {
      // Simulate real-time updates
      const interval = setInterval(() => {
        setActivities(prev => {
          const newActivity: ActivityEntry = {
            id: Date.now().toString(),
            type: 'en_route',
            message: `Volunteer progress update - ${Math.floor(Math.random() * 5 + 1)}km remaining`,
            timestamp: 'Just now',
            icon: <Navigation className="h-3 w-3 text-amber-500" />
          };
          return [newActivity, ...prev].slice(0, 5); // Keep only last 5 activities
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [request.status]);

  // Generate map markers for task location
  const taskMapMarkers: ReliefMapMarker[] = [
    {
      id: 'task-location',
      name: 'Emergency Location',
      lat: 19.076 + (Math.random() - 0.5) * 0.1,
      lng: 72.877 + (Math.random() - 0.5) * 0.1,
      subtitle: request.needType,
      detail: `Urgency: ${request.urgency}`,
      urgency: request.urgency
    }
  ];

  if (request.assignedVolunteerName) {
    taskMapMarkers.push({
      id: 'volunteer-location',
      name: 'Volunteer Position',
      lat: 19.076 + (Math.random() - 0.5) * 0.08,
      lng: 72.877 + (Math.random() - 0.5) * 0.08,
      subtitle: request.assignedVolunteerName,
      detail: 'En route',
      urgency: undefined
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 sm:p-8 animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-7 py-5">
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
            ← Back to Dashboard
          </button>
          <div className="flex-1" />
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTheme[request.status]}`}>{request.status}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${priority.className}`}>{priority.label}</span>
        </div>

        <div className="px-7 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1 — Basic Info */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">{request.location}</h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-50/80 px-3.5 py-2.5 ring-1 ring-slate-100/80">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Type</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <Wrench className="h-3 w-3 text-slate-400" /> {request.needType}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50/80 px-3.5 py-2.5 ring-1 ring-slate-100/80">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Urgency</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{request.urgency}</p>
              </div>
              <div className="rounded-xl bg-slate-50/80 px-3.5 py-2.5 ring-1 ring-slate-100/80">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Distance</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <MapPin className="h-3 w-3 text-blue-400" /> {formatDist(request.distance)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50/80 px-3.5 py-2.5 ring-1 ring-slate-100/80">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">ETA</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <Clock className="h-3 w-3 text-amber-400" /> {getEta(request.distance)}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Section 2 — Timeline */}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              <span className="h-px flex-1 bg-slate-100" /> Lifecycle <span className="h-px flex-1 bg-slate-100" />
            </p>
            <RequestTimeline status={request.status} />
          </div>

          {/* Live Status */}
          {liveStatus && (
            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs font-medium text-blue-700 animate-fade-in">
              <Activity className="h-3.5 w-3.5 shrink-0" />
              {liveStatus}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Section 3 — Volunteer Info (NGO) / Task Info (Volunteer) */}
          {role === "ngo" ? (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                <span className="h-px flex-1 bg-slate-100" /> Assigned Volunteer <span className="h-px flex-1 bg-slate-100" />
              </p>
              {request.assignedVolunteerName ? (
                <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                      <UserCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{request.assignedVolunteerName}</p>
                      <p className="text-xs text-slate-500">Assigned Volunteer</p>
                    </div>
                    {avgRating && (
                      <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 ring-1 ring-yellow-100">
                        <Star className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" />
                        <span className="text-xs font-bold text-yellow-600">{avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50/80 py-6 text-center">
                  <Users className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">No volunteer assigned yet</p>
                  {onAutoAssign && (
                    <button
                      type="button"
                      onClick={() => onAutoAssign(request.id)}
                      className="interactive-btn inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:shadow-md"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Auto Assign Best Volunteer
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                <span className="h-px flex-1 bg-slate-100" /> Task Details <span className="h-px flex-1 bg-slate-100" />
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50/80 px-3.5 py-2.5 ring-1 ring-slate-100/80">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Source</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">{request.source === "public" ? "Citizen Report" : "Organization"}</p>
                </div>
                <div className="rounded-xl bg-slate-50/80 px-3.5 py-2.5 ring-1 ring-slate-100/80">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Request ID</p>
                  <p className="mt-0.5 text-xs font-mono font-semibold text-slate-800">{request.id.slice(0, 12)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Section 4 — Live Activity Feed */}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              <span className="h-px flex-1 bg-slate-100" /> Live Activity <span className="h-px flex-1 bg-slate-100" />
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-sm">
                  No activity yet
                </div>
              ) : (
                activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 animate-fade-in ${index === 0 ? 'border border-blue-200 bg-blue-50/30' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Section 5 — Communication Panel */}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              <span className="h-px flex-1 bg-slate-100" /> Communication <span className="h-px flex-1 bg-slate-100" />
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/30 p-4">
              <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === role ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                        message.sender === role 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <p className="font-medium">{message.message}</p>
                      <p className={`text-xs mt-1 ${message.sender === role ? 'text-blue-100' : 'text-slate-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  disabled={isSendingMessage}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isSendingMessage || !newMessage.trim()}
                  className={`interactive-btn rounded-lg px-3 py-2 text-white transition ${
                    isSendingMessage || !newMessage.trim()
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  {isSendingMessage ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Section 6 — Map */}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              <span className="h-px flex-1 bg-slate-100" /> Task Location <span className="h-px flex-1 bg-slate-100" />
            </p>
            <div className="rounded-2xl overflow-hidden border border-slate-200" style={{ height: '250px' }}>
              <ReliefMap 
                title="" 
                markers={taskMapMarkers} 
                showLegend={false}
              />
            </div>
          </div>

          {/* Section 7 — Rating (completed) */}
          {request.status === "Completed" && onRate && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <span className="h-px flex-1 bg-slate-100" /> Rating <span className="h-px flex-1 bg-slate-100" />
                </p>
                <div className="rounded-xl bg-yellow-50/70 px-4 py-3.5 ring-1 ring-yellow-100/60">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => onRate(request.id, star)}
                        className="transition hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 transition ${(rating ?? 0) >= star ? "text-yellow-400" : "text-slate-200"}`}
                          fill={(rating ?? 0) >= star ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                    {rating && (
                      <span className="ml-3 text-sm font-bold text-yellow-600">Rated: {rating} ⭐</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Section 8 — Actions */}
          {request.status !== "Completed" && (
            <>
              <div className="border-t border-slate-100" />
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <span className="h-px flex-1 bg-slate-100" /> Actions <span className="h-px flex-1 bg-slate-100" />
                </p>
                <div className="flex flex-wrap gap-3">
                  {role === "volunteer" && request.status === "Pending" && onAccept && (
                    <button type="button" onClick={() => { onAccept(request.id); onClose(); }} className="interactive-btn flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">
                      Accept Task
                    </button>
                  )}
                  {role === "volunteer" && request.status === "Accepted" && onStart && (
                    <button type="button" onClick={() => { onStart(request.id); onClose(); }} className="interactive-btn flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">
                      <Play className="mr-1.5 inline h-4 w-4" /> Start Task
                    </button>
                  )}
                  {role === "volunteer" && request.status === "In Progress" && onComplete && (
                    <button type="button" onClick={() => { onComplete(request.id); onClose(); }} className="interactive-btn flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-md">
                      <CheckCircle2 className="mr-1.5 inline h-4 w-4" /> Mark Complete
                    </button>
                  )}
                  {role === "ngo" && request.status === "In Progress" && onComplete && (
                    <button type="button" onClick={() => { onComplete(request.id); onClose(); }} className="interactive-btn flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-md">
                      <CheckCircle2 className="mr-1.5 inline h-4 w-4" /> Mark Completed
                    </button>
                  )}
                  {role === "volunteer" && request.status === "Pending" && onReject && (
                    <button type="button" onClick={() => { onReject(request.id); onClose(); }} className="interactive-btn rounded-xl bg-rose-100 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-200">
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_NGO_PROFILE: NGOProfile = {
  organizationName: "ReliefLink Org",
  location: "Mumbai",
  type: "Disaster Relief",
  bio: "We are a disaster relief organization focused on rapid emergency response and community resilience."
};

const DEFAULT_VOLUNTEER_PROFILE: VolunteerProfile = {
  name: "Aisha Patel",
  skills: "First Aid, Community Outreach",
  availability: "Weekdays, 9 AM - 2 PM",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha"
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<Role | null>(() => {
    if (typeof window === "undefined") return null;
    const savedRole = localStorage.getItem("role");
    return savedRole === "ngo" || savedRole === "volunteer" ? savedRole : null;
  });
  const [userId, setUserId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("relieflink_user_id") ?? "";
  });
  const [location, setLocation] = useState("");
  const [need_type, setNeedType] = useState<NeedType>("Food");
  const [urgency, setUrgency] = useState<Urgency>("Medium");
  const [results, setResults] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [requests, setRequests] = useState<VolunteerRequest[]>(() => {
    if (typeof window === "undefined") return [...MATCHED_REQUESTS, ...ACTIVE_REQUESTS, ...PUBLIC_REQUESTS];
    const stored = localStorage.getItem("relieflink_requests");
    return stored ? (JSON.parse(stored) as VolunteerRequest[]) : [...MATCHED_REQUESTS, ...ACTIVE_REQUESTS, ...PUBLIC_REQUESTS];
  });
  const [ngoProfile, setNgoProfile] = useState<NGOProfile>(() => {
    if (typeof window === "undefined") return DEFAULT_NGO_PROFILE;
    const stored = localStorage.getItem("relieflink_ngo_profile");
    return stored ? (JSON.parse(stored) as NGOProfile) : DEFAULT_NGO_PROFILE;
  });
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile>(() => {
    if (typeof window === "undefined") return DEFAULT_VOLUNTEER_PROFILE;
    const stored = localStorage.getItem("relieflink_volunteer_profile");
    return stored ? (JSON.parse(stored) as VolunteerProfile) : DEFAULT_VOLUNTEER_PROFILE;
  });
  const [isEditingNgoProfile, setIsEditingNgoProfile] = useState(false);
  const [isEditingVolunteerProfile, setIsEditingVolunteerProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [volunteerCredits, setVolunteerCredits] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem("relieflink_volunteer_credits");
    return stored ? Number(stored) : 0;
  });
  const [showPublicForm, setShowPublicForm] = useState(false);
  const [publicLocation, setPublicLocation] = useState("");
  const [publicNeedType, setPublicNeedType] = useState<NeedType>("Food");
  const [publicUrgency, setPublicUrgency] = useState<Urgency>("High");
  const [publicSubmitted, setPublicSubmitted] = useState(false);
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);
  const [liveStatus, setLiveStatus] = useState<Record<string, string>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [volunteerRatings, setVolunteerRatings] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    const stored = localStorage.getItem("relieflink_volunteer_ratings");
    return stored ? (JSON.parse(stored) as Record<string, number>) : {};
  });
  const [filterSkill, setFilterSkill] = useState("");
  const [filterMaxDist, setFilterMaxDist] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

  const canSubmit = location.trim().length > 1 && !loading;

  const urgencyBadgeClass = useMemo(() => urgencyTheme[urgency], [urgency]);
  const sortedResults = useMemo(
    () => [...results].sort((a, b) => b.match_score - a.match_score),
    [results]
  );

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    sortedResults.forEach((v) => v.skills.forEach((s) => skillSet.add(s)));
    return Array.from(skillSet).sort();
  }, [sortedResults]);

  const filteredResults = useMemo(() => {
    let filtered = sortedResults;
    if (filterSkill) {
      filtered = filtered.filter((v) => v.skills.some((s) => s.toLowerCase().includes(filterSkill.toLowerCase())));
    }
    if (filterMaxDist) {
      const maxKm = Number(filterMaxDist);
      filtered = filtered.filter((v) => parseFloat(v.distance) <= maxKm);
    }
    if (filterAvailability) {
      filtered = filtered.filter((v) => v.availability.toLowerCase().includes(filterAvailability.toLowerCase()));
    }
    return filtered;
  }, [sortedResults, filterSkill, filterMaxDist, filterAvailability]);
  const ngoRequests = useMemo(
    () => requests.filter((request) => request.userId === userId),
    [requests, userId]
  );
  const incomingRequests = useMemo(
    () => requests.filter((request) => request.source === "public"),
    [requests]
  );
  const createdRequests = useMemo(
    () => ngoRequests.filter((request) => request.source === "ngo"),
    [ngoRequests]
  );
  const volunteerPendingTasks = useMemo(
    () =>
      requests.filter(
        (r) => r.assignedVolunteerId === userId && r.status === "Pending"
      ),
    [requests, userId]
  );
  const volunteerActiveTasks = useMemo(
    () =>
      requests.filter(
        (r) =>
          r.assignedVolunteerId === userId &&
          (r.status === "Accepted" || r.status === "In Progress")
      ),
    [requests, userId]
  );
  const volunteerAvailableRequests = useMemo(
    () =>
      requests.filter(
        (r) => !r.assignedVolunteerId && r.status === "Pending"
      ),
    [requests]
  );
  const completedTasks = useMemo(
    () =>
      requests.filter(
        (r) => r.assignedVolunteerId === userId && r.status === "Completed"
      ),
    [requests, userId]
  );
  const dynamicConfidence = sortedResults[0]?.match_score ?? 0;
  const dynamicInsight =
    urgency === "High"
      ? "High urgency detected. Recommended immediate deployment."
      : urgency === "Medium"
        ? "Medium urgency detected. Prioritize dispatch within the next 4 hours."
        : "Low urgency detected. Schedule volunteer support within 24 hours.";

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || !userId) return;
    localStorage.setItem("relieflink_user_id", userId);
  }, [mounted, userId]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("relieflink_requests", JSON.stringify(requests));
  }, [mounted, requests]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("relieflink_ngo_profile", JSON.stringify(ngoProfile));
  }, [mounted, ngoProfile]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("relieflink_volunteer_profile", JSON.stringify(volunteerProfile));
  }, [mounted, volunteerProfile]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("relieflink_volunteer_credits", String(volunteerCredits));
  }, [mounted, volunteerCredits]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("relieflink_volunteer_ratings", JSON.stringify(volunteerRatings));
  }, [mounted, volunteerRatings]);

  const normalizeVolunteer = (raw: Record<string, unknown>): Volunteer => {
    const rawSkills = raw.skills;
    const skills = Array.isArray(rawSkills)
      ? rawSkills.map((skill) => String(skill))
      : typeof rawSkills === "string"
        ? rawSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];

    return {
      name: String(raw.name ?? "Unknown Volunteer"),
      skills,
      distance: String(raw.distance ?? raw.distance_km ?? "N/A"),
      availability: String(raw.availability ?? "Not specified"),
      match_score: Number(raw.match_score ?? raw.matchScore ?? 0),
      reason: String(raw.reason ?? raw.why_selected ?? "No reason provided.")
    };
  };

  const handleMatch = async () => {
    console.log("Button clicked");
    if (role !== "ngo") { setToastMessage("🚫 Access restricted — NGO only"); setTimeout(() => setToastMessage(""), 2400); return; }
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    setHasSubmitted(true);
    setNotifyMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const res = await fetch("https://ctrl-relief-backend-1091620591190.asia-south1.run.app/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location: location,
          need_type: need_type.toLowerCase() as Lowercase<NeedType>,
          urgency: urgency.toLowerCase() as Lowercase<Urgency>
        } satisfies MatchPayload)
      });

      console.log("Response status:", res.status);

      const data = (await res.json()) as MatchApiResponse;
      console.log("Response data:", data);

      const mappedResults = Array.isArray(data)
        ? data
        : (data as any).matches && Array.isArray((data as any).matches)
          ? (data as any).matches
          : (data as any).volunteers && Array.isArray((data as any).volunteers)
            ? (data as any).volunteers
            : [];

      const normalized = mappedResults.map((item: any) =>
        normalizeVolunteer(item as Record<string, unknown>)
      );

      setResults(normalized);
      const newRequest: VolunteerRequest = {
        id: `request-${Date.now()}`,
        userId: userId || "demo-ngo",
        location: location || "Unknown location",
        needType: need_type,
        urgency,
        status: "Pending",
        source: "ngo",
        assignedVolunteerId: "demo-volunteer",
        distance: Math.round((Math.random() * 6 + 1.5) * 10) / 10
      };
      setRequests((prev) => [newRequest, ...prev]);
      setToastMessage("Request submitted");
      setTimeout(() => setToastMessage(""), 2600);

      // Escalation: if still pending after 5s, escalate
      const reqId = newRequest.id;
      setTimeout(() => {
        setRequests((prev) => {
          const req = prev.find((r) => r.id === reqId);
          if (req && req.status === "Pending" && !req.assignedVolunteerName) {
            setLiveStatus((ls) => ({ ...ls, [reqId]: "⚠️ Escalating to nearby NGOs..." }));
            setTimeout(() => {
              setLiveStatus((ls) => ({ ...ls, [reqId]: "2 nearby NGOs notified for backup support ✅" }));
            }, 2500);
          }
          return prev;
        });
      }, 5000);
    } catch (err) {
      console.error("Error:", err);
      setError(
        "Could not fetch matches from backend. Please try again later."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyVolunteers = async () => {
    setIsNotifying(true);
    setNotifyMessage("");
    setShowWhatsAppPreview(false);

    await new Promise((resolve) => {
      setTimeout(resolve, 1400);
    });

    setIsNotifying(false);
    const count = Math.min(filteredResults.length, 3);
    setNotifyMessage(`${count} volunteers notified via WhatsApp ✅`);
    setShowWhatsAppPreview(true);
    setToastMessage(`${count} volunteers notified via WhatsApp`);
    setTimeout(() => setToastMessage(""), 2600);
  };

  const handleAcceptRequest = (requestId: string) => {
    if (role !== "volunteer") { setToastMessage("🚫 Access restricted — Volunteer only"); setTimeout(() => setToastMessage(""), 2400); return; }
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: "Accepted", assignedVolunteerId: userId }
          : request
      )
    );
    setToastMessage("Task accepted");
    setTimeout(() => setToastMessage(""), 2400);
    setLiveStatus((prev) => ({ ...prev, [requestId]: "Volunteer accepted ✅" }));
  };

  const handleStartTask = (requestId: string) => {
    if (role !== "volunteer") { setToastMessage("🚫 Access restricted — Volunteer only"); setTimeout(() => setToastMessage(""), 2400); return; }
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: "In Progress" as RequestStatus }
          : request
      )
    );
    setToastMessage("Task started");
    setTimeout(() => setToastMessage(""), 2400);
    setLiveStatus((prev) => ({ ...prev, [requestId]: "Volunteer en route 🚗" }));
  };

  const handleCompleteTask = (requestId: string) => {
    if (role !== "volunteer") { setToastMessage("🚫 Access restricted — Volunteer only"); setTimeout(() => setToastMessage(""), 2400); return; }
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: "Completed" as RequestStatus }
          : request
      )
    );
    setVolunteerCredits((prev) => prev + 10);
    setToastMessage("Task completed! +10 credits earned");
    setTimeout(() => setToastMessage(""), 2600);
    setLiveStatus((prev) => ({ ...prev, [requestId]: "Task completed successfully ✅" }));
  };

  const handleRejectTask = (requestId: string) => {
    if (role !== "volunteer") { setToastMessage("🚫 Access restricted — Volunteer only"); setTimeout(() => setToastMessage(""), 2400); return; }
    setRequests((prev) => prev.filter((item) => item.id !== requestId));
  };

  const handleClaimRequest = (requestId: string) => {
    if (role !== "volunteer") { setToastMessage("🚫 Access restricted — Volunteer only"); setTimeout(() => setToastMessage(""), 2400); return; }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "Accepted" as RequestStatus, assignedVolunteerId: userId }
          : r
      )
    );
    setToastMessage("Request claimed — assigned to you!");
    setTimeout(() => setToastMessage(""), 2400);
    setLiveStatus((prev) => ({ ...prev, [requestId]: "Volunteer accepted ✅" }));
  };

  const handleDismissRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((item) => item.id !== requestId));
  };

  const handleLogin = (selectedRole: Role) => {
    const generatedId = `${selectedRole}-${Date.now()}`;
    setRole(selectedRole);
    setUserId(generatedId);
    setRequests((prev) => {
      const alreadyHasData = prev.some((request) => request.userId === generatedId);
      if (alreadyHasData) return prev;

      if (selectedRole === "ngo") {
        const seededNgoRequests = ACTIVE_REQUESTS.map((request) => ({
          ...request,
          id: `${request.id}-${generatedId}`,
          userId: generatedId,
          source: "ngo" as RequestSource,
          assignedVolunteerId: "demo-volunteer"
        }));
        const seededPublicRequests = PUBLIC_REQUESTS.map((request) => ({
          ...request,
          id: `${request.id}-${generatedId}`
        }));
        return [...seededNgoRequests, ...seededPublicRequests, ...prev];
      }

      const seededVolunteerTasks = MATCHED_REQUESTS.map((request) => ({
        ...request,
        id: `${request.id}-${generatedId}`,
        userId: "demo-ngo",
        source: "ngo" as RequestSource,
        assignedVolunteerId: generatedId
      }));
      const seededCompletedTasks = COMPLETED_DUMMY_TASKS.map((task) => ({
        ...task,
        id: `${task.id}-${generatedId}`,
        assignedVolunteerId: generatedId
      }));
      const seededAvailableRequests = AVAILABLE_REQUESTS.map((request) => ({
        ...request,
        id: `${request.id}-${generatedId}`
      }));
      return [...seededVolunteerTasks, ...seededCompletedTasks, ...seededAvailableRequests, ...prev];
    });
    localStorage.setItem("role", selectedRole);
    localStorage.setItem("relieflink_user_id", generatedId);
  };

  const handleLogout = () => {
    setRole(null);
    setUserId("");
    localStorage.removeItem("role");
    localStorage.removeItem("relieflink_user_id");
    setToastMessage("");
  };

  const handleAutoAssign = (requestId: string) => {
    if (role !== "ngo") { setToastMessage("🚫 Access restricted — NGO only"); setTimeout(() => setToastMessage(""), 2400); return; }
    const topVolunteer = sortedResults.length > 0
      ? sortedResults[0]
      : PRELOADED_VOLUNTEERS.sort((a, b) => b.match_score - a.match_score)[0];

    if (!topVolunteer) return;

    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              assignedVolunteerName: topVolunteer.name,
              status: "Accepted" as RequestStatus
            }
          : request
      )
    );
    setToastMessage(`Assigned ${topVolunteer.name} to request`);
    setTimeout(() => setToastMessage(""), 2600);

    // Live status simulation
    setLiveStatus((prev) => ({ ...prev, [requestId]: "Waiting for volunteer response..." }));
    setTimeout(() => {
      setLiveStatus((prev) => ({ ...prev, [requestId]: "Volunteer accepted ✅" }));
    }, 2000);
    setTimeout(() => {
      setLiveStatus((prev) => ({ ...prev, [requestId]: "Volunteer en route 🚗" }));
    }, 3500);
  };

  const handlePublicRequest = () => {
    if (!publicLocation.trim()) return;
    const newRequest: VolunteerRequest = {
      id: `pub-${Date.now()}`,
      userId: `citizen-${Date.now()}`,
      location: publicLocation.trim(),
      needType: publicNeedType,
      urgency: publicUrgency,
      status: "Pending",
      source: "public",
      distance: Math.round((Math.random() * 6 + 1.5) * 10) / 10
    };
    setRequests((prev) => [newRequest, ...prev]);
    setPublicSubmitted(true);
    setPublicLocation("");
    setPublicNeedType("Food");
    setPublicUrgency("High");
    setTimeout(() => setPublicSubmitted(false), 4000);

    // Escalation: if still pending after 5s, escalate
    const reqId = newRequest.id;
    setTimeout(() => {
      setRequests((prev) => {
        const req = prev.find((r) => r.id === reqId);
        if (req && req.status === "Pending" && !req.assignedVolunteerName) {
          setLiveStatus((ls) => ({ ...ls, [reqId]: "⚠️ Escalating to nearby NGOs..." }));
          setTimeout(() => {
            setLiveStatus((ls) => ({ ...ls, [reqId]: "2 nearby NGOs notified for backup support ✅" }));
          }, 2500);
        }
        return prev;
      });
    }, 5000);
  };

  if (!mounted) return null;

  if (!role) {
    return (
      <main className="flex min-h-screen">
        {/* Left Hero Panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(circle at 70% 80%, rgba(249,115,22,0.2), transparent 40%)'}} />
          <div className="relative z-10 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Ctrl+Relief</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
              AI-Powered Disaster<br />Response Platform
            </h1>
            <p className="mt-5 text-lg text-blue-100 max-w-md leading-relaxed">
              Coordinate volunteers, allocate resources, and respond faster with intelligent matching.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: Zap, text: "Real-time volunteer matching" },
                { icon: Navigation, text: "Location-based coordination" },
                { icon: Activity, text: "Intelligent resource allocation" }
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <item.icon className="h-4 w-4 text-blue-200" />
                  </div>
                  <span className="text-blue-100 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 sm:px-12 bg-gradient-to-b from-slate-50 to-blue-50/30">
          <div className="w-full max-w-md animate-scale-in">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Ctrl+Relief</span>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900">Welcome to Ctrl+Relief</h2>
              <p className="mt-2 text-slate-500">Choose your role to continue</p>

              <div className="mt-8 grid gap-3">
                <button
                  type="button"
                  onClick={() => handleLogin("ngo")}
                  className="interactive-btn flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3.5 font-semibold text-white shadow-md shadow-blue-200 transition hover:shadow-lg hover:shadow-blue-200"
                >
                  <Building2 className="h-5 w-5" />
                  Continue as Organization
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin("volunteer")}
                  className="interactive-btn flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-slate-800"
                >
                  <Users className="h-5 w-5" />
                  Continue as Volunteer
                </button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">or</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPublicForm((prev) => !prev)}
                  className="interactive-btn flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3.5 font-semibold text-white shadow-md shadow-orange-200 transition hover:shadow-lg hover:shadow-orange-200"
                >
                  <ShieldAlert className="h-5 w-5" />
                  Public Emergency Request
                </button>
              </div>

              {showPublicForm && (
                <div className="mt-5 rounded-2xl border border-orange-200/80 bg-orange-50/40 p-5 animate-fade-in-up">
                  <h3 className="text-sm font-semibold text-slate-900">Report an Emergency</h3>
                  <p className="mt-1 text-xs text-slate-500">No login required. Your request will be sent to nearby organizations.</p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Location</label>
                      <input
                        type="text"
                        value={publicLocation}
                        onChange={(e) => setPublicLocation(e.target.value)}
                        placeholder="e.g., Worli Sea Face"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">Type of Need</label>
                        <select
                          value={publicNeedType}
                          onChange={(e) => setPublicNeedType(e.target.value as NeedType)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                        >
                          <option value="Food">Food</option>
                          <option value="Medical">Medical</option>
                          <option value="Education">Education</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">Urgency</label>
                        <select
                          value={publicUrgency}
                          onChange={(e) => setPublicUrgency(e.target.value as Urgency)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handlePublicRequest}
                      disabled={!publicLocation.trim()}
                      className="interactive-btn w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit Emergency Request
                    </button>
                    {publicSubmitted && (
                      <p className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Request submitted! An NGO will review it shortly.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <p className="mt-6 text-center text-xs text-slate-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">
              Trusted by 50+ relief organizations worldwide
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Toast Notification ─── */}
      {toastMessage ? (
        <div className="toast-pop fixed right-5 top-5 z-50 flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          {toastMessage}
        </div>
      ) : null}

      {/* ── Task Detail Modal ─── */}
      {selectedTaskId && (() => {
        const selectedRequest = requests.find((r) => r.id === selectedTaskId);
        if (!selectedRequest) return null;
        return (
          <TaskDetailModal
            request={selectedRequest}
            role={role!}
            onClose={() => setSelectedTaskId(null)}
            onAccept={role === "volunteer" ? handleAcceptRequest : undefined}
            onStart={role === "volunteer" ? handleStartTask : undefined}
            onComplete={role === "volunteer" ? handleCompleteTask : (role === "ngo" ? handleCompleteTask : undefined)}
            onReject={role === "volunteer" ? handleRejectTask : undefined}
            onAutoAssign={role === "ngo" ? handleAutoAssign : undefined}
            onRate={(id, stars) => setVolunteerRatings((prev) => ({ ...prev, [id]: stars }))}
            rating={volunteerRatings[selectedTaskId]}
            liveStatus={liveStatus[selectedTaskId]}
            volunteerRatings={volunteerRatings}
          />
        );
      })()}

      {/* ── Navbar ─── */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 sm:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
              <Heart className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Ctrl+Relief</span>
          </div>

          {/* Center: Tabs */}
          <div className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100/80 p-1">
            {["Dashboard", "Requests", "Map", "Profile"].map((tab) => (
              <span key={tab} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition cursor-pointer ${
                tab === "Dashboard" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}>{tab}</span>
            ))}
          </div>

          {/* Right: Role + Status + Logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {role === "ngo" ? <Building2 className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
              {role === "ngo" ? "NGO" : "Volunteer"}
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="interactive-btn inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 lg:py-10">
      {/* ── Dashboard Header ─── */}
      <header className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Dashboard Overview
        </h1>
        <p className="mt-2 max-w-2xl text-base text-slate-500 sm:text-lg">
          Real-time disaster response coordination
        </p>
      </header>

      {role === "ngo" ? (
        <>
      {/* ── Role Permissions ─── */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50/80 px-5 py-2.5 ring-1 ring-slate-100 animate-fade-in-up">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span className="text-xs font-bold text-slate-700">NGO Permissions:</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">✓ Create Requests</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">✓ Assign Volunteers</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">✓ View Analytics</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">✗ Accept Tasks</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">✗ Earn Credits</span>
      </div>
      <section className="grid gap-4 sm:grid-cols-3 animate-fade-in-up">
        <article className="card-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Active Requests</p>
              <p className="text-2xl font-bold text-slate-900">
                {ngoRequests.filter((request) => request.status !== "Completed").length}
              </p>
            </div>
          </div>
        </article>
        <article className="card-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Volunteers Assigned</p>
              <p className="text-2xl font-bold text-slate-900">
                {
                  ngoRequests.filter(
                    (request) =>
                      request.status === "Accepted" || request.status === "In Progress"
                  ).length
                }
              </p>
            </div>
          </div>
        </article>
        <article className="card-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Completed Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
                {ngoRequests.filter((request) => request.status === "Completed").length}
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* ── Analytics Dashboard ─── */}
      <section className="mt-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-900">System Analytics</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Avg Response Time */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white shadow-lg shadow-indigo-200/40">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/10" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200">Avg Response Time</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">
              {(() => {
                const assigned = ngoRequests.filter((r) => r.assignedVolunteerName);
                if (assigned.length === 0) return "—";
                const avgMin = Math.round(assigned.reduce((sum, r) => sum + (r.distance ?? 4) * 3, 0) / assigned.length);
                return `${avgMin} min`;
              })()}
            </p>
            <p className="mt-1 text-xs text-indigo-200">Based on distance-weighted ETA</p>
          </div>

          {/* Success Rate */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg shadow-emerald-200/40">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/10" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200">Success Rate</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">
              {(() => {
                const total = ngoRequests.length;
                if (total === 0) return "—";
                const completed = ngoRequests.filter((r) => r.status === "Completed").length;
                return `${Math.round((completed / total) * 100)}%`;
              })()}
            </p>
            <p className="mt-1 text-xs text-emerald-200">Completed / Total requests</p>
          </div>

          {/* Active Volunteers */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white shadow-lg shadow-orange-200/40">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/10" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-200">Active Volunteers</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">
              {new Set(
                ngoRequests
                  .filter((r) => r.status === "Accepted" || r.status === "In Progress")
                  .map((r) => r.assignedVolunteerName)
                  .filter(Boolean)
              ).size || PRELOADED_VOLUNTEERS.length}
            </p>
            <p className="mt-1 text-xs text-amber-200">Currently assigned & available</p>
          </div>
        </div>
      </section>

      <section className="mt-6 flex flex-col lg:flex-row gap-6 lg:items-start">
        <article className="w-full lg:w-[320px] lg:shrink-0 lg:sticky lg:top-[84px] rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 pb-5 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner ring-2 ring-white/30">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <button
                type="button"
                onClick={() => setIsEditingNgoProfile((prev) => !prev)}
                className="rounded-lg bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
              >
                {isEditingNgoProfile ? "Cancel" : "Edit Profile"}
              </button>
            </div>
            <h3 className="mt-3 text-lg font-bold text-white">{ngoProfile.organizationName || "Your Organization"}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                <MapPin className="h-2.5 w-2.5" />
                {ngoProfile.location || "Location"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                <ShieldCheck className="h-2.5 w-2.5" />
                {ngoProfile.type || "Type"}
              </span>
            </div>
          </div>

          {/* Profile Body */}
          <div className="px-7 py-6">
          {!isEditingNgoProfile ? (
            <div className="space-y-5">
              {/* About */}
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <span className="h-px flex-1 bg-slate-100" />
                  About
                  <span className="h-px flex-1 bg-slate-100" />
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                  {ngoProfile.bio || <span className="italic text-slate-400">Add a short description about your organization</span>}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Details Grid */}
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <span className="h-px flex-1 bg-slate-100" />
                  Details
                  <span className="h-px flex-1 bg-slate-100" />
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50/80 px-4 py-3 ring-1 ring-slate-100/80">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Location</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      <MapPin className="h-3 w-3 text-blue-500" />
                      {ngoProfile.location || "\u2014"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50/80 px-4 py-3 ring-1 ring-slate-100/80">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Type</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{ngoProfile.type || "\u2014"}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Statistics */}
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  <span className="h-px flex-1 bg-slate-100" />
                  Statistics
                  <span className="h-px flex-1 bg-slate-100" />
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-blue-50/70 px-2 py-3.5 ring-1 ring-blue-100/60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                      <ClipboardList className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-blue-700">{ngoRequests.filter((r) => r.status !== "Completed").length}</p>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-blue-400 text-center leading-tight">Active<br />Requests</p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-amber-50/70 px-2 py-3.5 ring-1 ring-amber-100/60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                      <Users className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-amber-700">{ngoRequests.filter((r) => r.assignedVolunteerName).length}</p>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-amber-400 text-center leading-tight">Volunteers<br />Assigned</p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-emerald-50/70 px-2 py-3.5 ring-1 ring-emerald-100/60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-emerald-700">{ngoRequests.filter((r) => r.status === "Completed").length}</p>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 text-center leading-tight">Completed<br />Missions</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-500">Organization Name</label>
                <input
                  value={ngoProfile.organizationName}
                  onChange={(event) => setNgoProfile((prev) => ({ ...prev, organizationName: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="e.g., ReliefLink Org"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-500">Location</label>
                <input
                  value={ngoProfile.location}
                  onChange={(event) => setNgoProfile((prev) => ({ ...prev, location: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-500">Organization Type</label>
                <input
                  value={ngoProfile.type}
                  onChange={(event) => setNgoProfile((prev) => ({ ...prev, type: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="e.g., Disaster Relief"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-500">About / Bio</label>
                <textarea
                  value={ngoProfile.bio}
                  onChange={(event) => setNgoProfile((prev) => ({ ...prev, bio: event.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
                  placeholder="Add a short description about your organization"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditingNgoProfile(false);
                  setToastMessage("NGO profile saved");
                  setTimeout(() => setToastMessage(""), 2200);
                }}
                className="interactive-btn w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200/40 transition hover:shadow-lg"
              >
                Save Profile
              </button>
            </div>
          )}
          </div>
        </article>

        <div className="flex-1 min-w-0 space-y-6">
        <article className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md overflow-hidden">
          {/* Sticky Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-7 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <Globe className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900">Incoming Requests</h3>
              <p className="text-xs text-slate-400">Public reports from citizens needing assistance</p>
            </div>
            <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 ring-1 ring-orange-100">
              {incomingRequests.filter((r) => r.status !== "Completed").length} new
            </span>
          </div>

          {/* Scrollable List */}
          <div className="max-h-[520px] overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
            <div className="space-y-4">
            {incomingRequests
              .filter((request) => request.status !== "Completed")
              .map((request) => (
              <div 
                key={request.id} 
                className="rounded-2xl border border-orange-200/60 bg-gradient-to-r from-orange-50/40 to-white p-4 cursor-pointer transition hover:shadow-md hover:-translate-y-0.5"
                onClick={() => setSelectedTaskId(request.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{request.location}</p>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">Type:</span> {request.needType}
                      </p>
                      {request.distance && (
                        <>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                            <span className="font-semibold text-slate-700">Distance:</span> {formatDist(request.distance)}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                            <span className="font-semibold text-slate-700">ETA:</span> {getEta(request.distance)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">Public</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyTheme[request.urgency]}`}>
                    {request.urgency}
                  </span>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTheme[request.status]}`}>
                    {request.status}
                  </span>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getPriority(request.urgency, request.distance).className}`}>
                    {getPriority(request.urgency, request.distance).label}
                  </span>
                </div>
                {request.assignedVolunteerName ? (
                  <div className="mt-3 space-y-1.5">
                    <p className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Assigned to: {request.assignedVolunteerName}
                    </p>
                    {liveStatus[request.id] && (
                      <p className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 animate-fade-in">
                        <Activity className="h-3 w-3 shrink-0" />
                        {liveStatus[request.id]}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAutoAssign(request.id)}
                    className="interactive-btn mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md hover:from-indigo-500 hover:to-blue-500"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Auto Assign Best Volunteer
                  </button>
                )}
                <RequestTimeline status={request.status} />
              </div>
            ))}
            {incomingRequests.filter((r) => r.status !== "Completed").length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50/80 py-8 text-center">
                <Globe className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No incoming public requests</p>
                <p className="text-xs text-slate-400">Public emergency reports will appear here</p>
              </div>
            ) : null}
            </div>
          </div>
        </article>

        <article className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-7 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900">Your Created Requests</h3>
              <p className="text-xs text-slate-400">Requests created by your organization</p>
            </div>
            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 ring-1 ring-blue-100">
              {createdRequests.filter((r) => r.status !== "Completed").length} active
            </span>
          </div>
          {/* Scrollable List */}
          <div className="max-h-[520px] overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
            <div className="space-y-4">
            {createdRequests
              .filter((request) => request.status !== "Completed")
              .map((request) => (
              <div 
                key={request.id} 
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 cursor-pointer transition hover:shadow-md hover:-translate-y-0.5"
                onClick={() => setSelectedTaskId(request.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{request.location}</p>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">Type:</span> {request.needType}
                      </p>
                      {request.distance && (
                        <>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                            <span className="font-semibold text-slate-700">Distance:</span> {formatDist(request.distance)}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                            <span className="font-semibold text-slate-700">ETA:</span> {getEta(request.distance)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">NGO</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyTheme[request.urgency]}`}>
                    {request.urgency}
                  </span>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTheme[request.status]}`}>
                    {request.status}
                  </span>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getPriority(request.urgency, request.distance).className}`}>
                    {getPriority(request.urgency, request.distance).label}
                  </span>
                </div>
                {request.assignedVolunteerName ? (
                  <div className="mt-3 space-y-1.5">
                    <p className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Assigned to: {request.assignedVolunteerName}
                    </p>
                    {liveStatus[request.id] && (
                      <p className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 animate-fade-in">
                        <Activity className="h-3 w-3 shrink-0" />
                        {liveStatus[request.id]}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAutoAssign(request.id)}
                    className="interactive-btn mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md hover:from-indigo-500 hover:to-blue-500"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Auto Assign Best Volunteer
                  </button>
                )}
                <RequestTimeline status={request.status} />
              </div>
            ))}
            {createdRequests.filter((r) => r.status !== "Completed").length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50/80 py-8 text-center">
                <ClipboardList className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No active requests</p>
                <p className="text-xs text-slate-400">Create one using the Emergency Request Form below</p>
              </div>
            ) : null}
            </div>
          </div>
        </article>
        </div>
      </section>

      <section className="mt-6">
        <ReliefMap title="Nearby Volunteers" markers={VOLUNTEER_MAP_MARKERS} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md sm:p-7">
          <h2 className="text-xl font-semibold text-slate-900">Emergency Request Form</h2>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g., Andheri East"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="needType" className="block text-sm font-medium text-slate-700">
                Type of Need
              </label>
              <select
                id="needType"
                value={need_type}
                onChange={(event) => setNeedType(event.target.value as NeedType)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="Food">Food</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="urgency" className="block text-sm font-medium text-slate-700">
                Urgency
              </label>
              <select
                id="urgency"
                value={urgency}
                onChange={(event) => setUrgency(event.target.value as Urgency)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${urgencyBadgeClass}`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                {urgency.toUpperCase()} PRIORITY
              </span>
            </div>

            <button
              type="button"
              onClick={handleMatch}
              disabled={!canSubmit}
              className="interactive-btn inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="spinner" />
                  Analyzing with AI...
                </span>
              ) : (
                "Find Volunteers"
              )}
            </button>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </div>
        </article>

        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md sm:p-7">
          <h2 className="text-xl font-semibold text-slate-900">Volunteer List</h2>
          <p className="mt-1 text-sm text-slate-600">Preloaded volunteers available for matching.</p>
          <div className="mt-5 space-y-3">
            {PRELOADED_VOLUNTEERS.map((volunteer) => (
              <div key={volunteer.name} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{volunteer.name}</p>
                <p className="mt-1 text-sm text-slate-600">{volunteer.skills.join(" | ")}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDist(volunteer.distance)} • {volunteer.availability}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-[1.75rem] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Top Matched Volunteers
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Results</h2>
            {loading ? (
              <p className="mt-1 text-sm text-blue-600">Analyzing volunteer suitability...</p>
            ) : null}
          </div>
        </div>

        {sortedResults.length > 0 && (
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl bg-slate-50/80 p-4 ring-1 ring-slate-100">
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Skill</label>
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All Skills</option>
                {allSkills.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Max Distance</label>
              <select
                value={filterMaxDist}
                onChange={(e) => setFilterMaxDist(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Any Distance</option>
                <option value="2">Within 2 km</option>
                <option value="3">Within 3 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Availability</label>
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Any Availability</option>
                <option value="weekday">Weekdays</option>
                <option value="weekend">Weekends</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            {(filterSkill || filterMaxDist || filterAvailability) && (
              <button
                type="button"
                onClick={() => { setFilterSkill(""); setFilterMaxDist(""); setFilterAvailability(""); }}
                className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-300"
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {results.length === 0 && !loading && hasSubmitted ? (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-slate-600">
            No volunteers were matched for this request. Try changing location, need type, or urgency.
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filteredResults.map((volunteer, index) => {
            const isBestMatch = index === 0;
            const clampedScore = Math.max(0, Math.min(100, volunteer.match_score));

            return (
            <article
              key={`${volunteer.name}-${volunteer.distance}`}
              className={`result-card card-lift rounded-3xl border p-6 shadow-sm transition-all duration-300 ${
                isBestMatch
                  ? "border-orange-200 bg-gradient-to-br from-orange-50 via-white to-white shadow-[0_12px_24px_rgba(249,115,22,0.12)] ring-1 ring-orange-100"
                  : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-md"
              }`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{volunteer.name}</h3>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${isBestMatch ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                  {volunteer.match_score}% Match
                </span>
              </div>
              {isBestMatch ? (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-sm">
                  <Zap className="h-3 w-3" />
                  Best Match
                </div>
              ) : null}
              <p className="mt-3 text-sm text-slate-700">
                <span className="font-medium text-slate-900">🛠 Skills:</span>{" "}
                {volunteer.skills.join(", ")}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                <span className="font-medium text-slate-900">📍 Distance:</span> {formatDist(volunteer.distance)}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                <span className="font-medium text-slate-900">🕐 ETA:</span>{" "}
                {getEta(parseFloat(volunteer.distance))}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                <span className="font-medium text-slate-900">⏱ Availability:</span>{" "}
                {volunteer.availability}
              </p>
              {(() => {
                const ratingValues = Object.values(volunteerRatings);
                if (ratingValues.length === 0) return null;
                const avg = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;
                return (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                    <Star className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" />
                    <span className="font-semibold text-yellow-600">{avg.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">avg rating ({ratingValues.length} {ratingValues.length === 1 ? "review" : "reviews"})</span>
                  </p>
                );
              })()}
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Match Score</span>
                  <span className="font-bold">{clampedScore}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`progress-bar-fill h-full rounded-full ${isBestMatch ? "bg-gradient-to-r from-orange-400 to-orange-500" : "bg-gradient-to-r from-blue-500 to-blue-600"}`}
                    style={{ width: `${clampedScore}%` }}
                  />
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Reason:</span> {volunteer.reason}
              </p>
              <div className="mt-2 flex items-start gap-2 rounded-xl bg-indigo-50/60 p-3">
                <Brain className="mt-0.5 h-4 w-4 text-indigo-500 shrink-0" />
                <p className="text-xs text-indigo-700">
                  <span className="font-semibold">AI Reasoning:</span> Matched due to skill overlap ({volunteer.skills.slice(0, 2).join(", ")}) and proximity ({formatDist(volunteer.distance)}). Confidence based on availability, distance, and urgency alignment.
                </p>
              </div>
            </article>
          );
          })}
        </div>

        <div className="mt-7 space-y-4">
          <button
            type="button"
            onClick={handleNotifyVolunteers}
            disabled={filteredResults.length === 0 || isNotifying}
            className="interactive-btn inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200/40 transition hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isNotifying ? (
              <>
                <span className="spinner" />
                Sending WhatsApp notifications...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Notify Volunteers via WhatsApp
              </>
            )}
          </button>

          {notifyMessage ? (
            <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <Phone className="h-4 w-4" />
              {notifyMessage}
            </p>
          ) : null}

          {showWhatsAppPreview && filteredResults.length > 0 ? (
            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500">
                  <MessageSquare className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">WhatsApp Message Preview</p>
                  <p className="text-[10px] text-slate-400">Sent to {Math.min(filteredResults.length, 3)} matched volunteers</p>
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                <p className="text-sm font-bold text-slate-900">🚨 Emergency Request</p>
                <div className="mt-2 space-y-1 text-xs text-slate-700">
                  <p>📍 <span className="font-semibold">Location:</span> {location || "Mumbai"}</p>
                  <p>🏥 <span className="font-semibold">Need:</span> {need_type}</p>
                  <p>⚡ <span className="font-semibold">Urgency:</span> {urgency}</p>
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-600 italic">You have been selected as a top match. Please respond to confirm availability.</p>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">via Ctrl+Relief · AI-Powered Disaster Response</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filteredResults.slice(0, 3).map((v) => (
                  <span key={v.name} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {v.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md sm:p-7">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-indigo-500" />
            <h3 className="text-xl font-semibold text-slate-900">Past Requests</h3>
          </div>
          <div className="mt-5 space-y-3">
            {ngoRequests
              .filter((request) => request.status === "Completed" || request.status === "In Progress")
              .map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 cursor-pointer transition hover:shadow-md hover:-translate-y-0.5 p-4"
                onClick={() => setSelectedTaskId(request.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{request.location}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                      <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">Type:</span> {request.needType}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${request.source === "public" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                    {request.source === "public" ? "Public" : "NGO"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyTheme[request.urgency]}`}>
                    {request.urgency}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTheme[request.status]}`}
                  >
                    {request.status}
                  </span>
                </div>
                {request.assignedVolunteerName && (
                  <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Assigned to: {request.assignedVolunteerName}
                  </p>
                )}
                {request.status === "Completed" && (
                  <div className="mt-3 rounded-xl bg-yellow-50/70 px-3.5 py-2.5 ring-1 ring-yellow-100/60">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Rate Volunteer</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setVolunteerRatings((prev) => ({ ...prev, [request.id]: star }))}
                          className="transition hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`h-5 w-5 transition ${(volunteerRatings[request.id] ?? 0) >= star ? "text-yellow-400" : "text-slate-200"}`}
                            fill={(volunteerRatings[request.id] ?? 0) >= star ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                      {volunteerRatings[request.id] && (
                        <span className="ml-2 text-xs font-bold text-yellow-600">Rated: {volunteerRatings[request.id]} ⭐</span>
                      )}
                    </div>
                  </div>
                )}
                <RequestTimeline status={request.status} />
              </div>
            ))}
            {ngoRequests.filter((r) => r.status === "Completed" || r.status === "In Progress").length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50/80 py-8 text-center">
                <CalendarClock className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">No past requests yet</p>
                <p className="text-xs text-slate-400">Completed and in-progress requests will show here</p>
              </div>
            ) : null}
          </div>
        </article>

        <article className="ai-panel-border rounded-3xl p-6 shadow-md sm:p-7">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-orange-500">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">AI Insights Engine</h3>
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-700">
            <p className="flex items-start gap-2 rounded-xl bg-rose-50/60 p-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-rose-500 shrink-0" />
              <span>{dynamicInsight}</span>
            </p>
            <div className="flex items-start gap-2 rounded-xl bg-blue-50/60 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
              <div>
                <span>Match confidence: <strong>{dynamicConfidence}%</strong></span>
                <p className="mt-1 text-xs text-blue-600/80">Confidence based on availability, distance, and urgency alignment with volunteer profiles.</p>
              </div>
            </div>
            <p className="flex items-start gap-2 rounded-xl bg-emerald-50/60 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
              <span>Recommended action: Deploy volunteer within 2 hours</span>
            </p>
          </div>

          {/* Predicted Needs */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <h4 className="text-sm font-semibold text-slate-900">Predicted Needs</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-xl bg-orange-50/60 p-3">
                <TrendingUp className="mt-0.5 h-3.5 w-3.5 text-orange-500 shrink-0" />
                <span className="text-xs text-orange-800">Food demand expected to increase in next 12 hours based on displacement patterns.</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-violet-50/60 p-3">
                <Brain className="mt-0.5 h-3.5 w-3.5 text-violet-500 shrink-0" />
                <span className="text-xs text-violet-800">Medical support requests trending upward in eastern zones — recommend preemptive volunteer staging.</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-sky-50/60 p-3">
                <Activity className="mt-0.5 h-3.5 w-3.5 text-sky-500 shrink-0" />
                <span className="text-xs text-sky-800">Education relief likely needed in 24–48 hrs as temporary shelters stabilize.</span>
              </div>
            </div>
          </div>
        </article>
      </section>
        </>
      ) : (
        <section className="space-y-6 animate-fade-in-up">

          {/* ── Role Permissions ─── */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50/80 px-5 py-3 ring-1 ring-slate-100">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-700">Volunteer Permissions:</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">✓ Accept Tasks</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">✓ Reject Tasks</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">✓ Earn Credits</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">✗ Create Requests</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">✗ Assign Volunteers</span>
          </div>

          <section className="grid gap-4 sm:grid-cols-5">
            <article className="card-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <ClipboardList className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-slate-900">{volunteerPendingTasks.length}</p>
                </div>
              </div>
            </article>
            <article className="card-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Active Tasks</p>
                  <p className="text-2xl font-bold text-slate-900">{volunteerActiveTasks.length}</p>
                </div>
              </div>
            </article>
            <article className="card-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Completed</p>
                  <p className="text-2xl font-bold text-slate-900">{completedTasks.length}</p>
                </div>
              </div>
            </article>
            <article className="card-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Credits</p>
                  <p className="text-2xl font-bold text-slate-900">{volunteerCredits}</p>
                </div>
              </div>
            </article>
            <article className="card-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {volunteerProfile.availability ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:col-span-1">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
                    <Users className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Volunteer Profile</h3>
                    <p className="text-[11px] text-slate-400">Your volunteer identity</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingVolunteerProfile((prev) => !prev)}
                  className="interactive-btn rounded-lg bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                >
                  {isEditingVolunteerProfile ? "Cancel" : "Edit"}
                </button>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center">
                {volunteerProfile.profileImage ? (
                  <Image
                    src={volunteerProfile.profileImage}
                    alt="Volunteer profile"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-md ring-2 ring-slate-100"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner ring-2 ring-white"
                  style={{ display: volunteerProfile.profileImage ? "none" : "flex" }}
                >
                  <UserCircle2 className="h-10 w-10 text-blue-400" />
                </div>
                {!isEditingVolunteerProfile && (
                  <h4 className="mt-3 text-base font-semibold text-slate-900">{volunteerProfile.name || "Volunteer"}</h4>
                )}
              </div>

              {!isEditingVolunteerProfile ? (
                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 px-4 py-3">
                    <Wrench className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Skills</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">{volunteerProfile.skills || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/80 px-4 py-3">
                    <CalendarClock className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Availability</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">{volunteerProfile.availability || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-amber-50/80 px-4 py-3">
                    <Award className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Credits</p>
                      <p className="mt-0.5 text-sm font-bold text-slate-800">{volunteerCredits}</p>
                    </div>
                  </div>
                  {volunteerCredits > 50 && (
                    <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2.5 ring-1 ring-amber-200/60">
                      <Award className="h-4.5 w-4.5 text-amber-600" />
                      <span className="text-xs font-bold tracking-wide text-amber-700">⭐ Top Volunteer</span>
                    </div>
                  )}
                  {(() => {
                    const ratingValues = Object.values(volunteerRatings);
                    if (ratingValues.length === 0) return null;
                    const avg = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;
                    return (
                      <div className="flex items-center gap-2.5 rounded-xl bg-yellow-50/80 px-4 py-3">
                        <Star className="h-4 w-4 text-yellow-500 shrink-0" fill="currentColor" />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Average Rating</p>
                          <p className="mt-0.5 text-sm font-bold text-slate-800">{avg.toFixed(1)} ⭐ <span className="text-xs font-medium text-slate-500">({ratingValues.length} {ratingValues.length === 1 ? "review" : "reviews"})</span></p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="mt-5 space-y-3.5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Full Name</label>
                    <input
                      value={volunteerProfile.name}
                      onChange={(event) => setVolunteerProfile((prev) => ({ ...prev, name: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g., Aisha Patel"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Skills</label>
                    <input
                      value={volunteerProfile.skills}
                      onChange={(event) => setVolunteerProfile((prev) => ({ ...prev, skills: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g., First Aid, Logistics"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Availability</label>
                    <input
                      value={volunteerProfile.availability}
                      onChange={(event) => setVolunteerProfile((prev) => ({ ...prev, availability: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g., Weekdays, 9 AM - 2 PM"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Profile Image URL</label>
                    <input
                      value={volunteerProfile.profileImage}
                      onChange={(event) => setVolunteerProfile((prev) => ({ ...prev, profileImage: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingVolunteerProfile(false);
                      setToastMessage("Volunteer profile saved");
                      setTimeout(() => setToastMessage(""), 2200);
                    }}
                    className="interactive-btn w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200/40 transition hover:shadow-lg"
                  >
                    Save Profile
                  </button>
                </div>
              )}
            </article>

            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-900">Pending Requests</h3>
                <span className="ml-auto rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-600">{volunteerPendingTasks.length}</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">Accept or reject incoming assignments</p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {volunteerPendingTasks.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white p-4 transition hover:-translate-y-1 hover:shadow-sm cursor-pointer"
                    onClick={() => setSelectedTaskId(request.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {request.location}
                      </p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${request.source === "public" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                        {request.source === "public" ? "Public" : "NGO"}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">Type:</span> {request.needType}
                      </p>
                      {request.userId && request.userId !== userId && (
                        <p className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Users className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-700">Assigned by:</span> {request.source === "public" ? "Citizen Report" : "Organization"}
                        </p>
                      )}
                      {request.distance && (
                        <>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                            <span className="font-semibold text-slate-700">Distance:</span> {formatDist(request.distance)}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                            <span className="font-semibold text-slate-700">ETA:</span> {getEta(request.distance)}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyTheme[request.urgency]}`}>
                        {request.urgency}
                      </span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTheme[request.status]}`}>
                        {request.status}
                      </span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getPriority(request.urgency, request.distance).className}`}>
                        {getPriority(request.urgency, request.distance).label}
                      </span>
                    </div>
                    {/* Progress: 0% for pending */}
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                        <span>Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-200" style={{ width: "0%" }} />
                      </div>
                    </div>
                    <RequestTimeline status={request.status} />
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(request.id)}
                        className="interactive-btn rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectTask(request.id)}
                        className="interactive-btn rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {volunteerPendingTasks.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50/80 py-8 text-center sm:col-span-2 xl:col-span-3">
                    <ClipboardList className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No pending requests</p>
                    <p className="text-xs text-slate-400">New assignments will appear here when matched</p>
                  </div>
                ) : null}
              </div>
            </article>
          </section>

          <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-100 px-7 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                <Globe className="h-5 w-5 text-teal-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900">Available Requests</h3>
                <p className="text-xs text-slate-400">Open requests you can volunteer for</p>
              </div>
              <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-600 ring-1 ring-teal-100">
                {volunteerAvailableRequests.length} open
              </span>
            </div>
            <div className="max-h-[480px] overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {volunteerAvailableRequests.map((request) => (
                  <div key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:shadow-sm cursor-pointer hover:-translate-y-0.5" onClick={() => setSelectedTaskId(request.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{request.location}</p>
                        <div className="mt-2 space-y-1">
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-700">Type:</span> {request.needType}
                          </p>
                          {request.distance && (
                            <>
                              <p className="flex items-center gap-1.5 text-xs text-slate-600">
                                <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                                <span className="font-semibold text-slate-700">Distance:</span> {formatDist(request.distance)}
                              </p>
                              <p className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                                <span className="font-semibold text-slate-700">ETA:</span> {getEta(request.distance)}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${request.source === "public" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                        {request.source === "public" ? "Public" : "NGO"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyTheme[request.urgency]}`}>
                        {request.urgency}
                      </span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getPriority(request.urgency, request.distance).className}`}>
                        {getPriority(request.urgency, request.distance).label}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleClaimRequest(request.id)}
                        className="interactive-btn flex-1 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:shadow-md hover:from-teal-500 hover:to-emerald-500"
                      >
                        Claim Request
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDismissRequest(request.id)}
                        className="interactive-btn rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
                {volunteerAvailableRequests.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50/80 py-8 text-center sm:col-span-2 xl:col-span-3">
                    <Globe className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No available requests</p>
                    <p className="text-xs text-slate-400">New open requests will appear here</p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-7">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-slate-900">Active Tasks</h3>
              <span className="ml-auto rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-600">{volunteerActiveTasks.length}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Tasks you&apos;re currently working on</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {volunteerActiveTasks.map((task) => {
                const progressPercent = task.status === "Accepted" ? 30 : 70;
                const progressColor = task.status === "Accepted"
                  ? "bg-gradient-to-r from-blue-400 to-blue-500"
                  : "bg-gradient-to-r from-purple-400 to-purple-500";
                return (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50/30 to-white p-4 transition hover:-translate-y-1 hover:shadow-sm cursor-pointer"
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        {task.location}
                      </p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${task.source === "public" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                        {task.source === "public" ? "Public" : "NGO"}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">Type:</span> {task.needType}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Users className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">Assigned by:</span> {task.source === "public" ? "Citizen Report" : "Organization"}
                      </p>
                      {task.distance && (
                        <>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                            <span className="font-semibold text-slate-700">Distance:</span> {formatDist(task.distance)}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                            <span className="font-semibold text-slate-700">ETA:</span> {getEta(task.distance)}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyTheme[task.urgency]}`}>
                        {task.urgency}
                      </span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTheme[task.status]}`}>
                        {task.status}
                      </span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getPriority(task.urgency, task.distance).className}`}>
                        {getPriority(task.urgency, task.distance).label}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className={`progress-bar-fill h-full rounded-full ${progressColor}`} style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                    <RequestTimeline status={task.status} />
                    <div className="mt-4">
                      {task.status === "Accepted" ? (
                        <button
                          type="button"
                          onClick={() => handleStartTask(task.id)}
                          className="interactive-btn inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Start Task
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCompleteTask(task.id)}
                          className="interactive-btn inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {volunteerActiveTasks.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50/80 py-8 text-center sm:col-span-2 lg:col-span-3">
                  <Activity className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">No active tasks</p>
                  <p className="text-xs text-slate-400">Accept a pending request to start working</p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-semibold text-slate-900">Completed Tasks</h3>
                <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">{completedTasks.length}</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Successfully fulfilled assignments</p>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 cursor-pointer transition hover:shadow-sm hover:-translate-y-0.5" onClick={() => setSelectedTaskId(task.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{task.location}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${task.source === "public" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                        {task.source === "public" ? "Public" : "NGO"}
                      </span>
                    </div>
                    <div className="mt-1.5 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Wrench className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">Type:</span> {task.needType}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Users className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">Source:</span> {task.source === "public" ? "Citizen Report" : "Organization"}
                      </p>
                      {task.distance && (
                        <>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-blue-400 shrink-0" />
                            <span className="font-semibold text-slate-700">Distance:</span> {formatDist(task.distance)}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                            <span className="font-semibold text-slate-700">ETA:</span> {getEta(task.distance)}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${urgencyTheme[task.urgency]}`}>
                        {task.urgency}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {task.status}
                      </span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getPriority(task.urgency, task.distance).className}`}>
                        {getPriority(task.urgency, task.distance).label}
                      </span>
                    </div>
                    {/* Progress: 100% */}
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                        <span>Progress</span>
                        <span className="text-emerald-600">100%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: "100%" }} />
                      </div>
                    </div>
                    {/* Star Rating */}
                    <div className="mt-3 flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-slate-400 mr-1">Rate:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setVolunteerRatings((prev) => ({ ...prev, [task.id]: star }))}
                          className="transition hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`h-4 w-4 transition ${(volunteerRatings[task.id] ?? 0) >= star ? "text-yellow-400" : "text-slate-200"}`}
                            fill={(volunteerRatings[task.id] ?? 0) >= star ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                      {volunteerRatings[task.id] && (
                        <span className="ml-1.5 text-xs font-bold text-yellow-600">{volunteerRatings[task.id]}.0</span>
                      )}
                    </div>
                    <RequestTimeline status={task.status} />
                  </div>
                ))}
                {completedTasks.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50/80 py-8 text-center">
                    <CheckCircle2 className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No completed tasks yet</p>
                    <p className="text-xs text-slate-400">Tasks you finish will be recorded here</p>
                  </div>
                ) : null}
              </div>
            </article>

            <ReliefMap title="Nearby NGOs" markers={NGO_MAP_MARKERS} />
          </section>

          <article className="ai-panel-border rounded-3xl p-6 shadow-md sm:p-7">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-orange-500">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">AI Insights Engine</h3>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p className="flex items-start gap-2 rounded-xl bg-rose-50/60 p-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 text-rose-500 shrink-0" />
                <span>{dynamicInsight}</span>
              </p>
              <div className="flex items-start gap-2 rounded-xl bg-blue-50/60 p-3">
                <Sparkles className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />
                <div>
                  <span>Match confidence: <strong>{dynamicConfidence}%</strong></span>
                  <p className="mt-1 text-xs text-blue-600/80">Confidence based on availability, distance, and urgency alignment with your profile.</p>
                </div>
              </div>
              <p className="flex items-start gap-2 rounded-xl bg-emerald-50/60 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <span>Recommended action: Deploy volunteer within 2 hours</span>
              </p>
            </div>

            {/* Predicted Needs */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <h4 className="text-sm font-semibold text-slate-900">Predicted Needs</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-xl bg-orange-50/60 p-3">
                  <TrendingUp className="mt-0.5 h-3.5 w-3.5 text-orange-500 shrink-0" />
                  <span className="text-xs text-orange-800">Food demand expected to increase in next 12 hours based on displacement patterns.</span>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-violet-50/60 p-3">
                  <Brain className="mt-0.5 h-3.5 w-3.5 text-violet-500 shrink-0" />
                  <span className="text-xs text-violet-800">Medical support requests trending upward — your skills may be needed in eastern zones.</span>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-sky-50/60 p-3">
                  <Activity className="mt-0.5 h-3.5 w-3.5 text-sky-500 shrink-0" />
                  <span className="text-xs text-sky-800">Education relief likely needed in 24–48 hrs as temporary shelters stabilize.</span>
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

    </main>

      {/* ── Footer ─── */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Heart className="h-4 w-4 text-blue-600" />
            Ctrl+Relief
          </div>
          <p className="text-xs text-slate-400">Smart Disaster Coordination Platform • Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}

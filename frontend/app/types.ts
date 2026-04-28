export type NeedType = "Food" | "Medical" | "Education";
export type Urgency = "High" | "Medium" | "Low";
export type Role = "ngo" | "volunteer";
export type RequestSource = "ngo" | "public";
export type RequestStatus = "Pending" | "Accepted" | "In Progress" | "Completed";

export type VolunteerRequest = {
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

export type NGOProfile = {
  organizationName: string;
  location: string;
  type: string;
  bio: string;
};

export type VolunteerProfile = {
  name: string;
  skills: string;
  availability: string;
  profileImage: string;
};

export type MatchPayload = {
  location: string;
  need_type: Lowercase<NeedType>;
  urgency: Lowercase<Urgency>;
};

export type Volunteer = {
  name: string;
  skills: string[];
  distance: string;
  availability: string;
  match_score: number;
  reason: string;
};

export type MatchApiResponse =
  | Volunteer[]
  | { matches?: Volunteer[] | Record<string, unknown>[] }
  | { volunteers?: Volunteer[] | Record<string, unknown>[] };

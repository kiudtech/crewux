export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORGANIZATION: "ORGANIZATION",
  VOLUNTEER: "VOLUNTEER",
  TEAM: "TEAM",
  COLLEGE: "COLLEGE",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ORGANIZATION: "Organization",
  VOLUNTEER: "Volunteer",
  TEAM: "Team",
  COLLEGE: "College / School",
};

export const ORG_TYPES = [
  { value: "STARTUP", label: "Startup" },
  { value: "NGO", label: "NGO" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "COLLEGE_CLUB", label: "College Club" },
  { value: "COMMUNITY", label: "Community" },
];

export const VERIFICATION_STATUS = {
  UNVERIFIED: "UNVERIFIED",
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
} as const;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export const DISCIPLINES = [
  "Computer Science", "Information Technology", "Electronics",
  "Mechanical", "Civil", "Design", "Management", "Media",
  "Arts", "Commerce", "Science", "Law", "Medicine", "Other",
];

export const SKILLS = [
  "Web Development", "Mobile Development", "UI/UX Design",
  "Graphic Design", "Content Writing", "Social Media Marketing",
  "Photography", "Videography", "Event Management",
  "Public Speaking", "Data Analysis", "Machine Learning",
  "Artificial Intelligence", "Cybersecurity", "Cloud Computing",
  "Project Management", "Leadership", "Communication",
  "Teamwork", "Problem Solving", "Research", "Teaching",
  "Mentoring", "Fundraising", "Community Outreach",
];

// ─── EVENT CONSTANTS ────────────────────────────────────────

export const EVENT_CATEGORIES = [
  { value: "HACKATHON", label: "Hackathon" },
  { value: "SUMMIT", label: "Summit" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "CSR_DRIVE", label: "CSR Drive" },
  { value: "TECH_FEST", label: "Tech Fest" },
  { value: "WEBINAR", label: "Webinar" },
  { value: "OTHER", label: "Other" },
] as const;

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  HACKATHON: "Hackathon",
  SUMMIT: "Summit",
  CONFERENCE: "Conference",
  WORKSHOP: "Workshop",
  CSR_DRIVE: "CSR Drive",
  TECH_FEST: "Tech Fest",
  WEBINAR: "Webinar",
  OTHER: "Other",
};

export const EVENT_TYPES = [
  { value: "IN_PERSON", label: "In Person" },
  { value: "VIRTUAL", label: "Virtual" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

export const EVENT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  ARCHIVED: "ARCHIVED",
} as const;

export const EVENT_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ARCHIVED: "Archived",
};

export const APPLICATION_STATUS = {
  APPLIED: "APPLIED",
  SHORTLISTED: "SHORTLISTED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const EVENT_ROLES = [
  "Volunteer Coordinator", "Registration Desk", "Technical Support",
  "Stage Management", "Social Media Handler", "Photography",
  "Videography", "Hospitality", "Logistics", "Content Writer",
  "Graphic Designer", "MC / Anchor", "Mentor", "Judge",
  "Workshop Facilitator", "General Volunteer",
];

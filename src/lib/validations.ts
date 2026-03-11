import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const volunteerRegisterSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  college: z.string().optional(),
  course: z.string().optional(),
  discipline: z.string().optional(),
  yearOfStudy: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const organizationRegisterSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  type: z.enum(["STARTUP", "NGO", "CORPORATE", "COLLEGE_CLUB", "COMMUNITY"]),
  officialEmail: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  contactPerson: z.string().min(2, "Contact person name is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const collegeRegisterSchema = z.object({
  collegeName: z.string().min(2, "College name is required"),
  officialEmail: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  contactPerson: z.string().min(2, "Contact person name is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  city: z.string().optional(),
  state: z.string().optional(),
  affiliatedUniversity: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type VolunteerRegisterInput = z.infer<typeof volunteerRegisterSchema>;
export type OrganizationRegisterInput = z.infer<typeof organizationRegisterSchema>;
export type CollegeRegisterInput = z.infer<typeof collegeRegisterSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;

// ─── EVENT VALIDATIONS ──────────────────────────────────────

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDesc: z.string().max(200).optional(),
  category: z.enum(["HACKATHON", "SUMMIT", "CONFERENCE", "WORKSHOP", "CSR_DRIVE", "TECH_FEST", "WEBINAR", "OTHER"]),
  eventType: z.enum(["IN_PERSON", "VIRTUAL", "HYBRID"]).default("IN_PERSON"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  registrationDeadline: z.string().optional(),
  venue: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  virtualLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  requiredSkills: z.array(z.string()).default([]),
  rolesNeeded: z.array(z.object({
    role: z.string(),
    count: z.number().min(1),
    description: z.string().optional(),
  })).default([]),
  totalSlots: z.number().min(1, "At least 1 slot is required").default(1),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  perks: z.string().optional(),
  eligibility: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const applyEventSchema = z.object({
  eventId: z.string().min(1),
  role: z.string().optional(),
  message: z.string().max(500).optional(),
  teamId: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type ApplyEventInput = z.infer<typeof applyEventSchema>;

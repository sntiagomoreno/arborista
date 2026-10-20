/**
 * Mock data for marketing screenshots and assets.
 * Dates are relative to 2026-10-01 to produce a realistic mix of
 * neutral (< 2 weeks), alert (2–6 weeks), and negative (> 6 weeks) tags.
 */

import type { ProjectQueryData } from "@/utils/fetchProject";
import type {
  GetFileResponse,
  GetFileVersionsResponse,
} from "@figma/rest-api-spec";

// ─── Users ───────────────────────────────────────────────────────────────────

const DICEBEAR = (seed: string) =>
  `https://api.dicebear.com/10.x/gaze/svg?seed=${seed}&backgroundType=gradientLinear&backgroundColor=ff5d8f,ffb703,43aa8b,4d96ff,b57bff&backgroundSecondaryColor=ffc2d4,fff0a0,a8e6cf,bdd7ff,e2ccff`;

const USERS = {
  maya: {
    id: "u1",
    handle: "Maya Chen",
    img_url: DICEBEAR("maya-chen"),
    email: "",
  },
  alex: {
    id: "u2",
    handle: "Alex Rivera",
    img_url: DICEBEAR("alex-rivera"),
    email: "",
  },
  jordan: {
    id: "u3",
    handle: "Jordan Kim",
    img_url: DICEBEAR("jordan-kim"),
    email: "",
  },
  sam: {
    id: "u4",
    handle: "Sam Walsh",
    img_url: DICEBEAR("sam-walsh"),
    email: "",
  },
  taylor: {
    id: "u5",
    handle: "Taylor Park",
    img_url: DICEBEAR("taylor-park"),
    email: "",
  },
} as const;

// ─── Projects ─────────────────────────────────────────────────────────────────

export const mockProject: ProjectQueryData = {
  name: "Product Design",
  files: [
    {
      key: "mock-file-design-system",
      name: "Design System",
      last_modified: "2026-09-30T10:24:00Z",
      thumbnail_url: "",
    },
    {
      key: "mock-file-ios-app",
      name: "iOS App",
      last_modified: "2026-09-22T14:05:00Z",
      thumbnail_url: "",
    },
    {
      key: "mock-file-web-dashboard",
      name: "Web Dashboard",
      last_modified: "2026-09-28T09:17:00Z",
      thumbnail_url: "",
    },
    {
      key: "mock-file-marketing-site",
      name: "Marketing Site",
      last_modified: "2026-09-29T16:48:00Z",
      thumbnail_url: "",
    },
  ],
};

export const mockProjectBrand: ProjectQueryData = {
  name: "Brand & Identity",
  files: [
    {
      key: "mock-file-logo-system",
      name: "Logo System",
      last_modified: "2026-09-25T09:10:00Z",
      thumbnail_url: "",
    },
    {
      key: "mock-file-color-type",
      name: "Color & Typography",
      last_modified: "2026-09-18T14:30:00Z",
      thumbnail_url: "",
    },
    {
      key: "mock-file-illustrations",
      name: "Illustration Library",
      last_modified: "2026-09-12T11:00:00Z",
      thumbnail_url: "",
    },
  ],
};

export const mockProjectGrowth: ProjectQueryData = {
  name: "Growth",
  files: [
    {
      key: "mock-file-landing-pages",
      name: "Landing Pages",
      last_modified: "2026-09-29T12:00:00Z",
      thumbnail_url: "",
    },
    {
      key: "mock-file-email-campaigns",
      name: "Email Campaigns",
      last_modified: "2026-09-23T16:20:00Z",
      thumbnail_url: "",
    },
  ],
};

// ─── File responses (branches) ────────────────────────────────────────────────

export const mockFileData: Record<string, Partial<GetFileResponse>> = {
  "mock-file-design-system": {
    name: "Design System",
    lastModified: "2026-09-30T10:24:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-token-redesign",
        name: "feat/token-redesign",
        last_modified: "2026-09-30T10:24:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-button-states",
        name: "fix/button-states",
        last_modified: "2026-09-14T11:30:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-motion-system",
        name: "experiment/motion-system",
        last_modified: "2026-07-12T08:00:00Z",
        thumbnail_url: "",
      },
    ],
  },

  "mock-file-ios-app": {
    name: "iOS App",
    lastModified: "2026-09-22T14:05:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-bottom-bar",
        name: "nav/bottom-bar-redesign",
        last_modified: "2026-09-22T14:05:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-push-notifs",
        name: "feat/push-notifications",
        last_modified: "2026-09-01T10:00:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-ios-onboarding",
        name: "redesign/onboarding",
        last_modified: "2026-08-05T13:20:00Z",
        thumbnail_url: "",
      },
    ],
  },

  "mock-file-web-dashboard": {
    name: "Web Dashboard",
    lastModified: "2026-09-28T09:17:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-analytics-page",
        name: "redesign/analytics-page",
        last_modified: "2026-09-28T09:17:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-export-options",
        name: "feat/export-options",
        last_modified: "2026-08-18T15:45:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-table-overflow",
        name: "fix/table-overflow",
        last_modified: "2026-06-22T10:10:00Z",
        thumbnail_url: "",
      },
    ],
  },

  // Brand & Identity files
  "mock-file-logo-system": {
    name: "Logo System",
    lastModified: "2026-09-25T09:10:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-dark-variation",
        name: "feat/dark-variation",
        last_modified: "2026-09-25T09:10:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-spacing-rules",
        name: "fix/spacing-rules",
        last_modified: "2026-08-10T10:00:00Z",
        thumbnail_url: "",
      },
    ],
  },

  "mock-file-color-type": {
    name: "Color & Typography",
    lastModified: "2026-09-18T14:30:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-font-pairing",
        name: "update/font-pairing",
        last_modified: "2026-09-18T14:30:00Z",
        thumbnail_url: "",
      },
    ],
  },

  "mock-file-illustrations": {
    name: "Illustration Library",
    lastModified: "2026-09-12T11:00:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-spot-illustrations",
        name: "feat/spot-illustrations",
        last_modified: "2026-09-12T11:00:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-icon-cleanup",
        name: "style/icon-cleanup",
        last_modified: "2026-07-05T08:30:00Z",
        thumbnail_url: "",
      },
    ],
  },

  // Growth files
  "mock-file-landing-pages": {
    name: "Landing Pages",
    lastModified: "2026-09-29T12:00:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-ab-test-hero",
        name: "feat/ab-test-hero",
        last_modified: "2026-09-29T12:00:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-pricing-redesign",
        name: "redesign/pricing",
        last_modified: "2026-09-08T10:30:00Z",
        thumbnail_url: "",
      },
    ],
  },

  "mock-file-email-campaigns": {
    name: "Email Campaigns",
    lastModified: "2026-09-23T16:20:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-onboarding-template",
        name: "template/onboarding",
        last_modified: "2026-09-23T16:20:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-email-mobile",
        name: "fix/mobile-layout",
        last_modified: "2026-08-28T13:00:00Z",
        thumbnail_url: "",
      },
    ],
  },

  "mock-file-marketing-site": {
    name: "Marketing Site",
    lastModified: "2026-09-29T16:48:00Z",
    editorType: "figma",
    branches: [
      {
        key: "mock-branch-hero-refresh",
        name: "homepage/hero-refresh",
        last_modified: "2026-09-29T16:48:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-blog-template",
        name: "blog/template-update",
        last_modified: "2026-09-20T11:00:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-testimonials",
        name: "feat/testimonials",
        last_modified: "2026-08-26T09:30:00Z",
        thumbnail_url: "",
      },
      {
        key: "mock-branch-pricing-page",
        name: "redesign/pricing-page",
        last_modified: "2026-07-30T14:00:00Z",
        thumbnail_url: "",
      },
    ],
  },
};

// ─── Version responses (last editor + date per branch) ───────────────────────

function makeVersion(
  id: string,
  created_at: string,
  user: (typeof USERS)[keyof typeof USERS],
): GetFileVersionsResponse["versions"][number] {
  return {
    id,
    created_at,
    label: null,
    description: null,
    user,
    thumbnail_url: "",
  };
}

export const mockVersionData: Record<string, GetFileVersionsResponse> = {
  // Design System branches
  "mock-branch-token-redesign": {
    versions: [makeVersion("v1a", "2026-09-30T10:24:00Z", USERS.maya)],
    pagination: {},
  },
  "mock-branch-button-states": {
    versions: [makeVersion("v1b", "2026-09-14T11:30:00Z", USERS.alex)],
    pagination: {},
  },
  "mock-branch-motion-system": {
    versions: [makeVersion("v1c", "2026-07-12T08:00:00Z", USERS.jordan)],
    pagination: {},
  },

  // iOS App branches
  "mock-branch-bottom-bar": {
    versions: [makeVersion("v2a", "2026-09-22T14:05:00Z", USERS.sam)],
    pagination: {},
  },
  "mock-branch-push-notifs": {
    versions: [makeVersion("v2b", "2026-09-01T10:00:00Z", USERS.maya)],
    pagination: {},
  },
  "mock-branch-ios-onboarding": {
    versions: [makeVersion("v2c", "2026-08-05T13:20:00Z", USERS.taylor)],
    pagination: {},
  },

  // Web Dashboard branches
  "mock-branch-analytics-page": {
    versions: [makeVersion("v3a", "2026-09-28T09:17:00Z", USERS.alex)],
    pagination: {},
  },
  "mock-branch-export-options": {
    versions: [makeVersion("v3b", "2026-08-18T15:45:00Z", USERS.jordan)],
    pagination: {},
  },
  "mock-branch-table-overflow": {
    versions: [makeVersion("v3c", "2026-06-22T10:10:00Z", USERS.sam)],
    pagination: {},
  },

  // Brand & Identity branches
  "mock-branch-dark-variation": {
    versions: [makeVersion("v5a", "2026-09-25T09:10:00Z", USERS.sam)],
    pagination: {},
  },
  "mock-branch-spacing-rules": {
    versions: [makeVersion("v5b", "2026-08-10T10:00:00Z", USERS.taylor)],
    pagination: {},
  },
  "mock-branch-font-pairing": {
    versions: [makeVersion("v5c", "2026-09-18T14:30:00Z", USERS.alex)],
    pagination: {},
  },
  "mock-branch-spot-illustrations": {
    versions: [makeVersion("v5d", "2026-09-12T11:00:00Z", USERS.jordan)],
    pagination: {},
  },
  "mock-branch-icon-cleanup": {
    versions: [makeVersion("v5e", "2026-07-05T08:30:00Z", USERS.maya)],
    pagination: {},
  },

  // Growth branches
  "mock-branch-ab-test-hero": {
    versions: [makeVersion("v6a", "2026-09-29T12:00:00Z", USERS.taylor)],
    pagination: {},
  },
  "mock-branch-pricing-redesign": {
    versions: [makeVersion("v6b", "2026-09-08T10:30:00Z", USERS.alex)],
    pagination: {},
  },
  "mock-branch-onboarding-template": {
    versions: [makeVersion("v6c", "2026-09-23T16:20:00Z", USERS.sam)],
    pagination: {},
  },
  "mock-branch-email-mobile": {
    versions: [makeVersion("v6d", "2026-08-28T13:00:00Z", USERS.jordan)],
    pagination: {},
  },

  // Marketing Site branches
  "mock-branch-hero-refresh": {
    versions: [makeVersion("v4a", "2026-09-29T16:48:00Z", USERS.taylor)],
    pagination: {},
  },
  "mock-branch-blog-template": {
    versions: [makeVersion("v4b", "2026-09-20T11:00:00Z", USERS.maya)],
    pagination: {},
  },
  "mock-branch-testimonials": {
    versions: [makeVersion("v4c", "2026-08-26T09:30:00Z", USERS.alex)],
    pagination: {},
  },
  "mock-branch-pricing-page": {
    versions: [makeVersion("v4d", "2026-07-30T14:00:00Z", USERS.jordan)],
    pagination: {},
  },
};

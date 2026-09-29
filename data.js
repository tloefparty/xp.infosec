// XP quest data — standardized with Philippine Pesos (₱)[cite: 1]

let QUESTS = [
  // ---- Paid Quests ----
  { id: "p1", tier: "paid", title: "Campus Library Shelver", org: "University Library",
    description: "Sort and re-shelve returned books for a few hours a week (You're getting paid if you do these tasks!).",
    payout: 180, xp: 120, time_hours: 4, location: "on-campus" },
  { id: "p2", tier: "paid", title: "Paid AI & Tech Seminar Assistant", org: "Tech Summit PH",
    description: "Join a PAID seminar event as support staff and handle registration logistics.",
    payout: 750, xp: 250, time_hours: 6, location: "local" },
  { id: "p3", tier: "paid", title: "Data Entry Freelancer", org: "Remote Client via XP Marketplace",
    description: "Clean and organize spreadsheets for a small business, from your desk (You're getting paid if you do these tasks!).",
    payout: 250, xp: 100, time_hours: 5, location: "remote" },
  { id: "p4", tier: "paid", title: "Weekend Event Crew", org: "City Convention Center",
    description: "Help set up and staff a corporate seminar near campus.",
    payout: 500, xp: 220, time_hours: 8, location: "local" },

  // ---- Free Quests ----
  { id: "f1", tier: "free", title: "Weekend Market Cleanup & Stroll", org: "Neighborhood Council",
    description: "Free task just for fun! Help coordinate community stalls at the Saturday morning food market.",
    payout: 0, xp: 90, time_hours: 2, location: "local" },
  { id: "f2", tier: "free", title: "Community Garden Volunteer Day", org: "Neighborhood Green Initiative",
    description: "Plant, weed, take care of regular landscaping chores, and meet neighbors.",
    payout: 0, xp: 70, time_hours: 3, location: "local" },
  { id: "f3", tier: "free", title: "Intro to Public Speaking", org: "Student Union Workshop Series",
    description: "A free interactive workshop on structuring talks and calming nerves.",
    payout: 0, xp: 60, time_hours: 2, location: "on-campus" },
  { id: "f4", tier: "free", title: "Neighborhood Chores Swap Day", org: "Academic Success Center",
    description: "Help nearby residents with quick chores just for fun and trade household tips.",
    payout: 0, xp: 80, time_hours: 2, location: "local" },

  // ---- Premium Quests ----
  { id: "pr1", tier: "premium", title: "Weekend UX Design Bootcamp", org: "XP Skill Academy",
    description: "Two intensive days building a portfolio-ready case study.",
    cost: 450, xp: 400, time_hours: 16, location: "on-campus" },
  { id: "pr2", tier: "premium", title: "Google Analytics Certification Prep", org: "XP Skill Academy",
    description: "Guided prep course ending in an official certificate exam.",
    cost: 300, xp: 350, time_hours: 10, location: "remote" },
];

const TIER_LABELS = { paid: "Paid", free: "Free", premium: "Premium" };
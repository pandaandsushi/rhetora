export type TimePracticePoint = {
  label: string;
  minutes: number;
};

export type TimePracticeRange = {
  id: string;
  label: string;
  points: TimePracticePoint[];
  overview: string[];
};

export type TimePracticeData = {
  dailyRanges: TimePracticeRange[];
  weeklyRanges: TimePracticeRange[];
  monthlyRanges: TimePracticeRange[];
  yearlyRanges: TimePracticeRange[];
};

export const timePracticeData: TimePracticeData = {
  dailyRanges: [
    {
      id: "daily-week-1",
      label: "21 May 2024 to 27 May 2024",
      points: [
        { label: "Mon", minutes: 6 },
        { label: "Tue", minutes: 14 },
        { label: "Wed", minutes: 12 },
        { label: "Thu", minutes: 8 },
        { label: "Fri", minutes: 11 },
        { label: "Sat", minutes: 7 },
        { label: "Sun", minutes: 13 },
      ],
      overview: [
        "You practiced for 71 minutes this week.",
        "Your most active day was Tuesday with 14 minutes of practice.",
      ],
    },
    {
      id: "daily-week-2",
      label: "14 May 2024 to 20 May 2024",
      points: [
        { label: "Mon", minutes: 4 },
        { label: "Tue", minutes: 8 },
        { label: "Wed", minutes: 10 },
        { label: "Thu", minutes: 6 },
        { label: "Fri", minutes: 9 },
        { label: "Sat", minutes: 12 },
        { label: "Sun", minutes: 5 },
      ],
      overview: [
        "You practiced for 54 minutes during this week.",
        "Your practice time became more consistent near the weekend.",
      ],
    },
  ],

  // Weekly = pilih bulan, graph menampilkan minutes per week
  weeklyRanges: [
    {
      id: "weekly-jan-2024",
      label: "January 2024",
      points: [
        { label: "W1", minutes: 42 },
        { label: "W2", minutes: 55 },
        { label: "W3", minutes: 38 },
        { label: "W4", minutes: 64 },
      ],
      overview: [
        "Your weekly practice time increased toward the end of January.",
      ],
    },
    {
      id: "weekly-feb-2024",
      label: "February 2024",
      points: [
        { label: "W1", minutes: 36 },
        { label: "W2", minutes: 48 },
        { label: "W3", minutes: 52 },
        { label: "W4", minutes: 60 },
      ],
      overview: [
        "Your practice time improved gradually throughout February.",
      ],
    },
  ],

  // Monthly = pilih tahun, graph menampilkan minutes per month
  monthlyRanges: [
    {
      id: "monthly-2024",
      label: "2024",
      points: [
        { label: "Jan", minutes: 199 },
        { label: "Feb", minutes: 196 },
        { label: "Mar", minutes: 220 },
        { label: "Apr", minutes: 245 },
        { label: "May", minutes: 260 },
        { label: "Jun", minutes: 230 },
      ],
      overview: [
        "Your monthly practice time shows a positive trend in 2024.",
      ],
    },
    {
      id: "monthly-2025",
      label: "2025",
      points: [
        { label: "Jan", minutes: 210 },
        { label: "Feb", minutes: 225 },
        { label: "Mar", minutes: 240 },
        { label: "Apr", minutes: 270 },
        { label: "May", minutes: 285 },
        { label: "Jun", minutes: 260 },
      ],
      overview: [
        "Your practice activity remained strong in 2025.",
      ],
    },
  ],

  // Yearly = tampilkan semua tahun
  yearlyRanges: [
    {
      id: "yearly-all",
      label: "2022 to 2026",
      points: [
        { label: "2022", minutes: 840 },
        { label: "2023", minutes: 1260 },
        { label: "2024", minutes: 1560 },
        { label: "2025", minutes: 1740 },
        { label: "2026", minutes: 920 },
      ],
      overview: [
        "Your total yearly practice time increased from 2022 to 2025.",
        "The 2026 value is still lower because the year is not complete yet.",
      ],
    },
  ],
};
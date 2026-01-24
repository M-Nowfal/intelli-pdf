interface DashboardStats {
  totalDocuments: number;
  weeklyUploads: number;
  flashcardsMastered: number;
  studyStreak: {
    streak: number;
    lastStudyDate: Date | null;
  };
  aiCredits: number;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  stats: DashboardStats | null;
  password?: string;
  provider: "credentials" | "google";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
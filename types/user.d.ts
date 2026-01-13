interface DashboardStats {
  totalDocuments: number;
  flashcardsMastered: number;
  studyStreak: {
    streak: number;
    lastActive: Date;
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
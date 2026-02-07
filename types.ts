
export interface Task {
  id: number;
  title: string;
  impact: string;
  completed: boolean;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  points: number;
  rank: number;
}

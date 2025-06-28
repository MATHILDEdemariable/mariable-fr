
export interface PlanningShareToken {
  id: string;
  coordination_id: string;
  token: string;
  name: string;
  roles_filter?: string[] | null;
  expires_at?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicPlanningView {
  coordination: {
    id: string;
    title: string;
    description?: string;
  };
  tasks: {
    id: string;
    title: string;
    description?: string;
    start_time: string;
    duration: number;
    category: string;
    priority: "low" | "medium" | "high";
    assigned_role?: string;
    position: number;
  }[];
  share_info: {
    name: string;
    roles_filter?: string[] | null;
    expires_at?: string | null;
  };
}

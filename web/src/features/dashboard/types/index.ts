// Deal related types
export interface Deal {
  id: string;
  dealName: string;
  dealInitial: string;
  dealColor: string;
  client: string;
  stage: "Negotiation" | "Proposal Sent" | "Qualified" | "Discovery";
  value: number;
  owner: string;
  ownerInitials: string;
  expectedClose: string;
}

// Stats related types
export interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  changeValue: string;
  isPositive: boolean;
  icon: string;
}

// Chart data types
export interface LeadSourceData {
  name: string;
  value: number;
  color: string;
}

export interface RevenueFlowData {
  month: string;
  thisYear: number;
  prevYear: number;
}

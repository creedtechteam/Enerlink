export interface ISP {
  id: string;
  name: string;
}

export interface DataPlan {
  id: string;
  ispId: string;
  description: string;
  amountInNaira: number;
}

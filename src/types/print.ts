// src/types/print.ts
export interface Label {
    title: string;
    variation?: string;
    condition?: string;
    identifier: string;
    price: string;
  }
  
  export interface PrintJob {
    labels: Label[];
    labelSize: string;
    showPrice: boolean;
    showCondition: boolean;
    expires: number;
  }
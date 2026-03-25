export interface Service {
  id: string;
  clientName: string;
  vehiclePlate: string;
  date: string;
  paymentMethod: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'outro';
  totalValue: number;
  items: ServiceItem[];
  notes: string;
}

export interface ServiceItem {
  id: string;
  label: string;
  quantity: number;
  unitValue: number;
  completed: boolean;
}

export type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

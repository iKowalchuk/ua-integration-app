export interface GuestCar {
  id: string;
  carNumber: string;
  status: 'active' | 'completed';
  actualTo: string;
  createdAt: string;
  completedAt: string | null;
}
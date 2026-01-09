export interface FavoriteLocation {
  id: string;
  name: string; // "서울특별시-종로구-청운동"
  alias: string | null;
  lat: number;
  lon: number;
  createdAt: number;
}

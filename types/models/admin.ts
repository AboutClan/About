import { Location } from "@/types/services/locationTypes";

export interface ISpaceControl {
  branch?: string;
  latitude?: number;
  longitude?: number;
  brand?: string;
  location?: Location;
  status?: string;
  image?: string;
}

export interface ICounter {
  key: "enthusiasticMember";
  location: Location;
}

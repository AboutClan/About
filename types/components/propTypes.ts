import { ThemeTypings } from "@chakra-ui/react";

import { LocationEn } from "../services/locationTypes";

export interface ILocationParam {
  locationParam: LocationEn;
}

export interface LinkButtonProp {
  text: string;
  url: string;
}

export interface ITextAndColorSchemes {
  text: string;
  colorScheme: ThemeTypings["colorSchemes"];
}

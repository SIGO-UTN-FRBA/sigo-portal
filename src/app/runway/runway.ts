import {RunwayDirection} from "./runwayDirection";

export class Runway {
  id: number;
  name: string;
  width: number;
  length: number;
  surface_id: number;
  aerodrome_id: number;
  directions: RunwayDirection[]
}

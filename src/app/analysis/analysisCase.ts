import {Airport} from "../airport/airport";

export class AnalysisCase {
  id:number;
  airportId:number;
  airport:Airport;
  regulationId:number;
  areaId:number;
  searchRadius:number;
  includeTerrain: boolean;
}

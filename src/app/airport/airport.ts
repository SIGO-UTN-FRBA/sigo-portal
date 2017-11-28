import {Runway} from "../runway/runway";

export class Airport {
  id: number;
  regionId: number;
  regulationId: number;
  nameFIR: string;
  codeFIR: string;
  codeIATA: string;
  codeLocal: string;
  runways: Runway[]
}

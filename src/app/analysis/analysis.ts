import {Airport} from "../airport/airport";

export class Analysis {
  id: number;
  caseId: number;
  creationDate: number;
  editionDate:number;
  stageId: number;
  statusId: number;
  airportId: number;
  airport: Airport;
  regulationId: number;
  userId: string;
  userNickname: string;
}

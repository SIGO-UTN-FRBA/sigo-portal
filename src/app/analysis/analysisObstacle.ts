import {AnalysisException} from "../exception/analysisException";

export class AnalysisObstacle {
  id:number;
  surfaceId:number;
  surfaceName:string;
  objectId:number;
  objectName: string;
  objectType: number;
  caseId:number;
  exceptionId:number;
  objectHeight:number;
  surfaceHeight:number;
  penetration:number;
  coordinate:number[];
  directionId:number;
  directionName:string;
}

import {PlacedObject} from "../object/object";
import {AnalysisCase} from "./analysisCase";

export class AnalysisObject {
  id:number;
  caseId:number;
  analysisCase:AnalysisCase;
  objectId:number;
  object:PlacedObject;
  included:boolean;
}

import {PlacedObject} from "../object/placedObject";
import {AnalysisCase} from "./analysisCase";
import {TerrainObject} from '../object/terrainObject';

export class AnalysisObject {
  id:number;
  caseId:number;
  analysisCase:AnalysisCase;
  objectId:number;
  object:PlacedObject|TerrainObject;
  included:boolean;
  objectTypeId:number;
}

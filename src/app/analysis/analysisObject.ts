import {PlacedObject} from "../object/placedObject";
import {AnalysisCase} from "./analysisCase";
import {TerrainObject} from '../object/terrainObject';
import {ElevatedObject} from '../object/elevatedObject';

export class AnalysisObject {
  id: number;
  caseId: number;
  analysisCase: AnalysisCase;
  objectId: number;
  object: ElevatedObject;
  included: boolean;
  objectTypeId: number;
}

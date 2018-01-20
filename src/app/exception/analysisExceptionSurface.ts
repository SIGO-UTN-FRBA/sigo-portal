import {AnalysisException} from './analysisException';
import Polygon = ol.geom.Polygon;

export class AnalysisExceptionSurface extends AnalysisException {

  geom:Polygon;
  heightAmls:number;

  constructor(
    id:number,
    caseId:number,
    name:string,
    heightAmls: number,
    geom: Polygon
  ){
    super(id, caseId, name);
    this.typeId = 0;
    this.heightAmls = heightAmls;
    this.geom = geom;
  }
}

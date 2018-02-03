import Feature = ol.Feature;

export class RunwayTakeoffSection {
  id : number;
  clearwayLength : number;
  clearwayWidth : number;
  stopwayLength : number;
  enabled : number;
  directionId : number;
  clearwayFeature: Feature;
  stopwayFeature: Feature;
}

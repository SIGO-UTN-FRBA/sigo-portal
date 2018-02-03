import Feature = ol.Feature;

export class RunwayApproachSection {
  id: number;
  thresholdElevation: number;
  thresholdLength: number;
  enabled: boolean;
  directionId : number;
  thresholdFeature: Feature;
}

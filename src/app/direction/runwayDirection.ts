import {Runway} from "../runway/runway";
import Feature = ol.Feature;
import {RunwayTakeoffSection} from './runwayTakeoffSection';
import {RunwayApproachSection} from './runwayApproachSection';

export class RunwayDirection {
  id: number;
  runwayId : number;
  runway: Runway;
  number: number;
  position: number;
  name : string;
  azimuth : number;
  height: number;
  feature: Feature;
  takeoffSection: RunwayTakeoffSection;
  approachSection: RunwayApproachSection;
}

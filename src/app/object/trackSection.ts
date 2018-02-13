import Feature = ol.Feature;
import {ElevatedObject} from './elevatedObject';

export class TrackSection implements ElevatedObject {
  id : number;
  name : string;
  typeId : number;
  subtypeId : number;
  verified : boolean;
  heightAgl : number;
  heightAmls : number;
  feature:Feature;

  constructor() {
    this.typeId = 4;
  }
}

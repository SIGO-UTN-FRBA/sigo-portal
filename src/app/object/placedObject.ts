import Feature = ol.Feature;
import {ElevatedObject} from './elevatedObject';

export class PlacedObject implements ElevatedObject {
  id : number;
  name : string;
  typeId : number;
  subtype : string;
  verified : boolean;
  locationId : number;
  ownerId : number;
  heightAgl : number;
  heightAmls : number;
  temporary : boolean;
  lightingId : number;
  markIndicatorId : number;
  feature:Feature;

  constructor(typeId: number) {
    this.typeId = typeId;
  }
}

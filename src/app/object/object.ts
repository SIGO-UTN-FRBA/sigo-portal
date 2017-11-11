import Feature = ol.Feature;

export class PlacedObject {
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
}

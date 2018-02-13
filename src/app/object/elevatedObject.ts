import Feature = ol.Feature;

export interface ElevatedObject{
  id : number;
  name : string;
  typeId : number;
  verified : boolean;
  heightAgl : number;
  heightAmls : number;
  feature:Feature;
}

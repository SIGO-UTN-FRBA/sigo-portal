
export class PlacedObjectType {
  id : number;
  code : string;
  description : string;
  geometry: string
}

let PlacedObjectTypes : PlacedObjectType[] = [
  {
    description : 'Building',
    code : 'BUILDING',
    id: 0,
    geometry: 'Polygon'
  },
  {
    description : 'Individual',
    code : 'INDIVIDUAL',
    id: 1,
    geometry: 'Point'
  },
  {
    description: 'Overhead wired',
    code : 'OVERHEAD_WIRED',
    id: 2,
    geometry: 'LineString'
  }
];

export default PlacedObjectTypes;

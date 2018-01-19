import Feature = ol.Feature;

export class TerrainObject {

  id: number;
  name: string;
  typeId: number;
  heightAgl: number;
  heightAmls: number;
  source: string;
  representation: string;
  feature:Feature;
}

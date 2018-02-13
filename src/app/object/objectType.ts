
export class ElevatedObjectType {
  id : number;
  code : string;
  description : string;
  geometry: string;


  constructor(id: number, code: string, description: string, geometry: string) {
    this.id = id;
    this.code = code;
    this.description = description;
    this.geometry = geometry;
  }

}

export class ElevatedObjectTypeFactory {

  static getBuildingType(): ElevatedObjectType{
    return new ElevatedObjectType(0, 'BUILDING', 'Building', 'MultiPolygon');
  }

  static getIndividualType(): ElevatedObjectType{
    return new ElevatedObjectType(1, 'INDIVIDUAL', 'Individual', 'Point');
  }

  static getWireType(): ElevatedObjectType{
    return new ElevatedObjectType(2, 'OVERHEAD_WIRED', 'Overhead wired', 'LineString');
  }

  static getTrackSectionType(): ElevatedObjectType{
    return new ElevatedObjectType(4, 'TRACK_SECTION', 'Track section', 'LineString');
  }

  static getTypes(): ElevatedObjectType[]{
    return [this.getBuildingType(), this.getIndividualType(), this.getWireType(), this.getTrackSectionType()]
  }

  static getTypeById(id: number): ElevatedObjectType{
    return this.getTypes().find( t => t.id == id);
  }
}

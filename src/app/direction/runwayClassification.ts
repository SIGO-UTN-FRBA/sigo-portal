export interface RunwayClassification {
  id: number,
  type: string,
  directionId: number;
}

export class RunwayClassificationFAA implements RunwayClassification {
  id: number;
  type: string;
  directionId: number;
  runwayClassification : number;
  runwayCategory : number;
  aircraftApproachCategory : number;
  aircraftClassification : number;
  aircraftDesignGroup : number;
  runwayTypeLetter : number;

  constructor(){
    this.type ='RunwayClassificationFAA';
  }
}

export class RunwayClassificationICAOAnnex14 implements RunwayClassification {
  id : number;
  type : string;
  directionId : number;
  runwayClassification : number;
  runwayCategory : number;
  runwayTypeNumber : number;
  runwayTypeLetter : number;

  constructor(){
    this.type ='RunwayClassificationICAOAnnex14';
  }
}


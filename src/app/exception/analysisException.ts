export class AnalysisException {
  id:number;
  typeId:number;
  caseId:number;
  name:string;

  constructor(id:number, caseId:number, name:string){
    this.id = id;
    this.caseId = caseId;
    this.name = name;
  }
}

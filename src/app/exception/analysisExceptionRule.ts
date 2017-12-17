import {AnalysisException} from "./analysisException";

export class AnalysisExceptionRule extends AnalysisException {
  ruleId:number;
  value:number;
  regulationId:number;

  constructor(id:number, caseId:number, name:string, ruleId:number, value:number, regulationId:number){
    super(id, caseId, name);
    this.ruleId = ruleId;
    this.value = value;
    this.typeId =  1;
    this.regulationId = regulationId;
  }
}

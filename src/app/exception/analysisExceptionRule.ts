import {AnalysisException} from "./analysisException";

export class AnalysisExceptionRule extends AnalysisException {
  olsRuleId:number;
  property:string;
  value:number;

  constructor(id:number, caseId:number, name:string, olsRuleId:number, property:string, value:number){
    super(id, caseId, name);
    this.olsRuleId = olsRuleId;
    this.property = property;
    this.value = value;
    this.typeId =  1;
  }
}

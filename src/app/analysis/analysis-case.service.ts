import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AnalysisObject} from "./analysisObject";
import {AppSettings} from "../main/app-settings";
import {AnalysisCase} from "./analysisCase";

@Injectable()
export class AnalysisCaseService extends ApiService {

  constructor(http:Http){super(http)}

  get(analysisId:number, caseId:number):Promise<AnalysisCase> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${caseId}`)
      .toPromise()
      .then(response => response.json() as AnalysisCase)
      .catch(this.handleError)
  }

  update(analysisId:number, caseId:number, radius:number):Promise<AnalysisCase> {
    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${caseId}`,{searchRadius: radius})
      .toPromise()
      .then(response => response.json() as AnalysisCase)
      .catch(this.handleError)
  }

  getObjects(analysisId:number, caseId:number) : Promise<AnalysisObject[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${caseId}/objects`)
      .toPromise()
      .then(response => response.json() as AnalysisObject[])
      .catch(this.handleError)
  }
}

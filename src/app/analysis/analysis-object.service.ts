import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AnalysisObject} from "./analysisObject";
import {AppSettings} from "../main/app-settings";

@Injectable()
export class AnalysisObjectService extends ApiService {

  constructor(http:Http){super(http)}

  list(analysisId:number, caseId:number):Promise<AnalysisObject[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${caseId}/objects`)
      .toPromise()
      .then(response => response.json() as AnalysisObject[])
      .catch(this.handleError)
  }

  update(analysisId:number, caseId:number, objectId:number, included:boolean):Promise<AnalysisObject> {
    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${caseId}/objects/${objectId}`, {included: included})
      .toPromise()
      .then(response => response.json() as AnalysisObject)
      .catch(this.handleError)
  }
}

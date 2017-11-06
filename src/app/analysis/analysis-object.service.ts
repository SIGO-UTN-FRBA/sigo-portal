import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AnalysisObject} from "./analysisObject";
import {AppSettings} from "../main/app-settings";

@Injectable()
export class AnalysisObjectService extends ApiService {

  constructor(http:Http){super(http)}

  getList(analysisId:number) : Promise<AnalysisObject[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/objects`)
      .toPromise()
      .then(response => response.json() as AnalysisObject[])
      .catch(this.handleError)
  }

  updateList(analysisId:number):Promise<AnalysisObject[]>{
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/objects`,"")
      .toPromise()
      .then(response => response.json() as AnalysisObject[])
      .catch(this.handleError)
  }
}

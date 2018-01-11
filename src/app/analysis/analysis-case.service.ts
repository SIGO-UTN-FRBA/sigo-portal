import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AppSettings} from "../main/app-settings";
import {AnalysisCase} from "./analysisCase";

@Injectable()
export class AnalysisCaseService extends ApiService {

  constructor(http:Http){super(http)}

  get(analysisId: number):Promise<AnalysisCase> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case`)
      .toPromise()
      .then(response => response.json() as AnalysisCase)
      .catch(this.handleError)
  }

  update(analysisId: number, radius: number):Promise<AnalysisCase> {
    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case`,{searchRadius: radius})
      .toPromise()
      .then(response => response.json() as AnalysisCase)
      .catch(this.handleError)
  }
}

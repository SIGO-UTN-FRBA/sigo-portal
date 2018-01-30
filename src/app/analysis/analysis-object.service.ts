import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {AnalysisObject} from "./analysisObject";
import {AppSettings} from "../main/app-settings";
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class AnalysisObjectService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  list(analysisId: number):Promise<AnalysisObject[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/objects`)
      .toPromise()
      .then(response => response.json() as AnalysisObject[])
      .catch(this.handleError)
  }

  update(analysisId: number, objectId: number, included: boolean):Promise<AnalysisObject> {
    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/objects/${objectId}`, {included: included})
      .toPromise()
      .then(response => response.json() as AnalysisObject)
      .catch(this.handleError)
  }
}

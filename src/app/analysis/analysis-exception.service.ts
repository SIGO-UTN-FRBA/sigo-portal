import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AppSettings} from "../main/app-settings";
import {AnalysisException} from "./analysisException";

@Injectable()
export class AnalysisExceptionService extends ApiService {

  constructor(http:Http){super(http)}

  list(analysisId:number):Promise<AnalysisException[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${analysisId}/exceptions`)
      .toPromise()
      .then(response => response.json() as AnalysisException[])
      .catch(this.handleError)
  }

  create(analysisId:number, exception:AnalysisException):Promise<AnalysisException> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${analysisId}/exceptions`, exception)
      .toPromise()
      .then(response => response.json() as AnalysisException)
      .catch(this.handleError)
  }

  update(analysisId:number, exception:AnalysisException):Promise<AnalysisException> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${analysisId}/exceptions/${exception.id}`, exception)
      .toPromise()
      .then(response => response.json() as AnalysisException)
      .catch(this.handleError)
  }

  delete(analysisId:number, exceptionId:number):Promise<any> {
    return this.http
      .delete(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/${analysisId}/exceptions/${exceptionId}`)
      .toPromise()
      .then(()=> null)
      .catch(this.handleError)
  }

  types(){
    return ["Surface", "Rule"];
  }
}

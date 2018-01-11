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
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions`)
      .toPromise()
      .then(response => response.json() as AnalysisException[])
      .catch(this.handleError)
  }

  get(analysisId:number, exceptionId:number):Promise<AnalysisException>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/${exceptionId}`)
      .toPromise()
      .then(response => response.json() as AnalysisException)
      .catch(this.handleError)
  }

  create(analysisId:number, exception:AnalysisException):Promise<AnalysisException> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions`, exception)
      .toPromise()
      .then(response => response.json() as AnalysisException)
      .catch(this.handleError)
  }

  update(analysisId:number, exception:AnalysisException):Promise<AnalysisException> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/${exception.id}`, exception)
      .toPromise()
      .then(response => response.json() as AnalysisException)
      .catch(this.handleError)
  }

  delete(analysisId:number, exceptionId:number):Promise<any> {
    return this.http
      .delete(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/${exceptionId}`)
      .toPromise()
      .then(()=> null)
      .catch(this.handleError)
  }

  types() : ExceptionType[]{
    return [
      {name: "Surface", code: "surface", ordinal:0},
      {name:"Rule", code:"rule", ordinal:1},
      {name: "Dynamic Surface", code: "dynamic_surface", ordinal:2}
    ] ;
  }
}

export interface ExceptionType {
  name:string;
  code:string;
  ordinal:number
}

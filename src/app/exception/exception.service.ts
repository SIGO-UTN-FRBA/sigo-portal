import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {AppSettings} from "../main/app-settings";
import {AnalysisException} from "./analysisException";
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class AnalysisExceptionService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  list(analysisId:number):Promise<AnalysisException[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions`)
      .toPromise()
      .then(response => response.json() as AnalysisException[])
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

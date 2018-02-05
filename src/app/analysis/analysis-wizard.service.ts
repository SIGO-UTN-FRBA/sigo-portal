import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";
import {Analysis} from "./analysis";
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class AnalysisWizardService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  stages(){
    return [
      "undefined",
      "object",
      "exception",
      "analysis",
      "inform"
    ];
  }

  start(analysisId:number):Promise<Analysis>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/wizard/${analysisId}?action=start`,{})
      .toPromise()
      .then(response => response.json() as Analysis)
      .catch(this.handleError)
  }

  next(analysisId:number):Promise<Analysis>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/wizard/${analysisId}?action=next`,{})
      .toPromise()
      .then(response => response.json() as Analysis)
      .catch(this.handleError)
  }

  previous(analysisId:number):Promise<Analysis>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/wizard/${analysisId}?action=previous`,{})
      .toPromise()
      .then(response => response.json() as Analysis)
      .catch(this.handleError)
  }

  finish(analysisId:number):Promise<Analysis>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/wizard/${analysisId}?action=finish`,{})
      .toPromise()
      .then(response => response.json() as Analysis)
      .catch(this.handleError)
  }

  cancel(analysisId:number):Promise<Analysis>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/wizard/${analysisId}?action=cancel`,{})
      .toPromise()
      .then(response => response.json() as Analysis)
      .catch(this.handleError)
  }
}

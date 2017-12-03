import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";
import {Analysis} from "./analysis";

@Injectable()
export class AnalysisWizardService extends ApiService {

  constructor(http:Http){super(http)}

  stages(){
    return [
      "object",
      "exception",
      "analysis",
      "inform"
    ];
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

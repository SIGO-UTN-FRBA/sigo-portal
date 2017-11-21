import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {ParamMap} from "@angular/router";
import {AppSettings} from "../main/app-settings";
import {Analysis} from "./analysis";
import "rxjs/add/operator/toPromise";

@Injectable()

export class AnalysisService extends ApiService {

  constructor(http:Http){super(http)}

  search(paramMap : ParamMap) : Promise<Analysis[]> {

    let queryString = paramMap.keys.reduce((total, key) => {return `${total}&${key}=${paramMap.get(key)}` }, '');

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis?${queryString}`)
      .toPromise()
      .then(response => response.json() as Analysis[])
      .catch(this.handleError)

  }

  create(parentId:number) : Promise<Analysis> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/analysis`, {parentId: parentId})
      .toPromise()
      .then(response => response.json() as Analysis)
      .catch(this.handleError)
  }

  get(analysisId: number) : Promise<Analysis> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}`)
      .toPromise()
      .then(response => response.json() as Analysis)
      .catch(this.handleError);
  }

  update(analysisId: number, stageId:number) : Promise<Analysis> {
    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}`, {stageId: stageId})
      .toPromise()
      .then(response => response.json() as Analysis)
      .catch(this.handleError);
  }

  stages(){
    return [
      "object",
      "exception",
      "analysis",
      "inform"
    ];
  }
}

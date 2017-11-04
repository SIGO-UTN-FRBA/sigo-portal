import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {AnalysisCase} from "./analysisCase";
import {ParamMap} from "@angular/router";
import {AppSettings} from "../main/app-settings";

@Injectable()

export class AnalysisCaseService extends ApiService {

  constructor(http:Http){super(http)}

  search(paramMap : ParamMap) : Promise<AnalysisCase[]> {

    let queryString = paramMap.keys.reduce((total, key) => {return `${total}&${key}=${paramMap.get(key)}` }, '');

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/cases?${queryString}`)
      .toPromise()
      .then(response => response.json() as AnalysisCase[])
      .catch(this.handleError)

  }

  create(baseCaseId:number) : Promise<AnalysisCase> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/analysis/cases`, {baseId: baseCaseId})
      .toPromise()
      .then(response => response.json() as AnalysisCase)
      .catch(this.handleError)
  }
}

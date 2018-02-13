import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {AnalysisObstacle} from "./analysisObstacle";
import "rxjs/add/operator/toPromise";
import {AppSettings} from "../main/app-settings";
import {AuthHttp} from 'angular2-jwt';
import {convertToParamMap} from '@angular/router';

@Injectable()
export class AnalysisObstacleService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  list(analysisId: number, options: {excepting?: boolean, validity?: boolean}):Promise<AnalysisObstacle[]>{

    let paramMap = convertToParamMap(options);

    let queryString = paramMap.keys.reduce((total, key) => {return `${total}&${key}=${paramMap.get(key)}` }, '');

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/obstacles?${queryString}`)
      .toPromise()
      .then(response => response.json() as AnalysisObstacle[])
      .catch(this.handleError)
  }

  get(analysisId: number, obstacleId: number):Promise<AnalysisObstacle>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/obstacles/${obstacleId}`)
      .toPromise()
      .then(response => response.json() as AnalysisObstacle)
      .catch(this.handleError)
  }
}

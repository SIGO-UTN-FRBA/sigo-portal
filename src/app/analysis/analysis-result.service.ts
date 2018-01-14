import {Injectable} from '@angular/core';
import {ApiService} from '../main/api.service';
import {Http} from '@angular/http';
import {AnalysisResult} from './analysisResult';
import "rxjs/add/operator/toPromise";
import {AppSettings} from '../main/app-settings';
import {AnalysisResultReason} from './analysisResultReason';

@Injectable()
export class AnalysisResultService extends ApiService {

  constructor(http:Http){super(http)}

  get(analysisId: number, obstacleId: number): Promise<AnalysisResult>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/obstacles/${obstacleId}/result`)
      .toPromise()
      .then(response => response.json() as AnalysisResult)
      .catch(this.handleError)
  }

  save(analysisId: number, obstacleId: number, result: AnalysisResult){
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/obstacles/${obstacleId}/result`, result)
      .toPromise()
      .then(response => response.json() as AnalysisResult)
      .catch(this.handleError)
  }

  getReasons(): Promise<AnalysisResultReason[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/analysis/resultReasons`)
      .toPromise()
      .then(response => response.json() as AnalysisResultReason[])
      .catch(this.handleError)
  }
}

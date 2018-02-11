import {Injectable} from '@angular/core';
import {ApiService} from '../main/api.service';
import {AnalysisResult} from './analysisResult';
import "rxjs/add/operator/toPromise";
import {AppSettings} from '../main/app-settings';
import {AuthHttp} from 'angular2-jwt';
import {AnalysisMitigation} from './analysisMitigation';
import {AnalysisAspect} from './analysisAspect';

@Injectable()
export class AnalysisResultService extends ApiService {

  constructor(http: AuthHttp){super(http)}

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
      //.catch(this.handleError)
  }

  getAspects(): Promise<AnalysisAspect[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/analysis/aspects`)
      .toPromise()
      .then(response => response.json() as AnalysisAspect[])
      .catch(this.handleError)
  }

  getMitigationMeasuresByAspect(aspectId: number): Promise<AnalysisMitigation[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/analysis/aspects/${aspectId}/mitigations`)
      .toPromise()
      .then(response => response.json() as AnalysisMitigation[])
      .catch(this.handleError)
  }
}

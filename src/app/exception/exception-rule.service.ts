import {Injectable} from '@angular/core';
import {ApiService} from '../main/api.service';
import {AppSettings} from '../main/app-settings';
import {AnalysisExceptionRule} from './analysisExceptionRule';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class AnalysisExceptionRuleService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  get(analysisId:number, exceptionId:number):Promise<AnalysisExceptionRule>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/rule/${exceptionId}`)
      .toPromise()
      .then(response => response.json() as AnalysisExceptionRule)
      .catch(this.handleError)
  }

  create(analysisId:number, exception:AnalysisExceptionRule):Promise<AnalysisExceptionRule> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/rule`, exception)
      .toPromise()
      .then(response => response.json() as AnalysisExceptionRule)
      .catch(this.handleError)
  }

  update(analysisId:number, exception:AnalysisExceptionRule):Promise<AnalysisExceptionRule> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/rule/${exception.id}`, exception)
      .toPromise()
      .then(response => response.json() as AnalysisExceptionRule)
      .catch(this.handleError)
  }
}

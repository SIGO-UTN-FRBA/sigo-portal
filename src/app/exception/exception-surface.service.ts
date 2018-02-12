import {Injectable} from '@angular/core';
import {ApiService} from '../main/api.service';
import {AppSettings} from '../main/app-settings';
import {AnalysisExceptionSurface} from './analysisExceptionSurface';
import Feature = ol.Feature;
import GeoJSON = ol.format.GeoJSON;
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class AnalysisExceptionSurfaceService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  list(analysisId:number): Promise<AnalysisExceptionSurface[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions?type=0`)
      .toPromise()
      .then(response => response.json() as AnalysisExceptionSurface[])
      .catch(this.handleError)
  }

  get(analysisId:number, exceptionId:number):Promise<AnalysisExceptionSurface>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/surface/${exceptionId}`)
      .toPromise()
      .then(response => response.json() as AnalysisExceptionSurface)
      .catch(this.handleError)
  }

  create(analysisId:number, exception:AnalysisExceptionSurface):Promise<AnalysisExceptionSurface> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/surface`, exception)
      .toPromise()
      .then(response => response.json() as AnalysisExceptionSurface)
      .catch(this.handleError)
  }

  update(analysisId:number, exception:AnalysisExceptionSurface):Promise<AnalysisExceptionSurface> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/surface/${exception.id}`, exception)
      .toPromise()
      .then(response => response.json() as AnalysisExceptionSurface)
      .catch(this.handleError)
  }

  getFeature(analysisId:number, exceptionId:number):Promise<Feature>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/exceptions/surface/${exceptionId}/feature`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }
}

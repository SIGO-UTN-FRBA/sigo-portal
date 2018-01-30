import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Feature} from "openlayers";
import {AppSettings} from "../main/app-settings";
import "rxjs/add/operator/toPromise";
import GeoJSON = ol.format.GeoJSON;
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class AnalysisSurfaceService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  get(analysisId : number, directionId: number) : Promise<Feature[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/analysis/${analysisId}/case/surfaces?direction=${directionId}`)
      .toPromise()
      .then(response => {
        let rawFeatures = response.json() as Feature[];
        return rawFeatures.map(f => new GeoJSON().readFeature(f));
      })
      .catch(this.handleError);
  }
}

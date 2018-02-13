import {Injectable} from "@angular/core";
import {AppSettings} from "../main/app-settings";
import {ApiService} from "../main/api.service";
import {ObjectMarkIndicator} from "./objectMarkIndicator";
import {ObjectLighting} from "./objectLighting";
import {ElevatedObjectType} from "./objectType";
import "rxjs/add/operator/toPromise";
import {AuthHttp} from 'angular2-jwt';
import {TrackSectionType} from './trackSectionType';

@Injectable()
export class PlacedObjectCatalogService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  listTypeObject() : Promise<ElevatedObjectType[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/objects/objectTypes`)
      .toPromise()
      .then(response => response.json() as ElevatedObjectType[])
      .catch(this.handleError);
  }

  listMarkIndicator() : Promise<ObjectMarkIndicator[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/objects/markIndicators`)
      .toPromise()
      .then(response => response.json() as ObjectMarkIndicator[])
      .catch(this.handleError);
  }

  listLighting() : Promise<ObjectLighting[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/objects/lightings`)
      .toPromise()
      .then(response => response.json() as ObjectLighting[])
      .catch(this.handleError);
  }

  listTrackSectionTypes(): Promise<TrackSectionType[]>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/objects/trackTypes`)
      .toPromise()
      .then(response => response.json() as TrackSectionType[])
      .catch(this.handleError);
  }
}

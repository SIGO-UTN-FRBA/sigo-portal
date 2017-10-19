import {Injectable} from "@angular/core";
import {AppSettings} from "../main/app-settings";
import {ApiService} from "../main/api.service";
import {ObjectMarkIndicator} from "./objectMarkIndicator";
import {ObjectLighting} from "./objectLighting";
import {PlacedObjectType} from "./objectType";
import {Http} from "@angular/http";

@Injectable()
export class PlacedObjectCatalogService extends ApiService {

  constructor(http:Http){super(http)}

  listTypeObject() : Promise<PlacedObjectType[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/objects/objectTypes`)
      .toPromise()
      .then(response => response.json() as PlacedObjectType[])
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
}

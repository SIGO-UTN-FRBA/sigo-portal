import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {Http} from "@angular/http";
import {PlacedObject} from "./object";
import {AppSettings} from "../main/app-settings";
import {ParamMap} from "@angular/router";
import Geometry = ol.geom.Geometry;
import "rxjs/add/operator/toPromise";
import Point = ol.geom.Point;
import Polygon = ol.geom.Polygon;
import LineString = ol.geom.LineString;
import Object = ol.Object;

@Injectable()
export class PlacedObjectService extends ApiService {

  constructor(http: Http){super(http)}

  search(paramMap : ParamMap) : Promise<PlacedObject[]> {

    let queryString = paramMap.keys.reduce((total, key) => {return `${total}&${key}=${paramMap.get(key)}` }, '');

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects?${queryString}`)
      .toPromise()
      .then(response => response.json() as PlacedObject[])
      .catch(this.handleError)
  }

  get(objectId : number) : Promise<PlacedObject>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects/${objectId}`)
      .toPromise()
      .then(response => response.json() as PlacedObject)
      .catch(this.handleError);
  }

  save(placedObject: PlacedObject) : Promise<PlacedObject> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/objects`, placedObject)
      .toPromise()
      .then( response => response.json() as PlacedObject)
      .catch(this.handleError)
  }

  delete(placedObjectId: number) : Promise<void> {
    return this.http
      .delete(`${AppSettings.API_ENDPOINT}/objects/${placedObjectId}`)
      .toPromise()
      .then(()=> null)
      .catch(this.handleError);
  }

  update(placedObject: PlacedObject) : Promise<PlacedObject> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/objects/${placedObject.id}`, PlacedObject)
      .toPromise()
      .then(response => response.json() as PlacedObject)
      .catch(this.handleError)
  }

  getGeom(placedObjectId : number) : Promise<Geometry> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects/${placedObjectId}/geometry`)
      .toPromise()
      .then(response => response.json() as Geometry)
      .catch(this.handleError)
  }

  saveGeom(placedObjectId : number, geom : Geometry) : Promise<Geometry>{
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/objects/${placedObjectId}/geometry`, geom)
      .toPromise()
      .then(response => response.json() as Geometry)
      .catch(this.handleError)
  }
}

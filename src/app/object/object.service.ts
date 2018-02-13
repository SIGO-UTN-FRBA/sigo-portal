import {Injectable} from "@angular/core";
import {ApiService} from "../main/api.service";
import {PlacedObject} from "./placedObject";
import {AppSettings} from "../main/app-settings";
import {ParamMap} from "@angular/router";
import Geometry = ol.geom.Geometry;
import "rxjs/add/operator/toPromise";
import Feature = ol.Feature;
import GeoJSON = ol.format.GeoJSON;
import {AuthHttp} from 'angular2-jwt';
import {ElevatedObject} from './elevatedObject';

@Injectable()
export class ElevatedObjectService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  search(paramMap : ParamMap) : Promise<ElevatedObject[]> {

    let queryString = paramMap.keys.reduce((total, key) => {return `${total}&${key}=${paramMap.get(key)}` }, '');

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects?${queryString}`)
      .toPromise()
      .then(response => response.json() as ElevatedObject[])
      .catch(this.handleError)
  }

  get(objectId : number, typeId:number) : Promise<ElevatedObject>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects/${objectId}?type=${typeId}`)
      .toPromise()
      .then(response => response.json() as ElevatedObject)
      .catch(this.handleError);
  }

  save(elevatedObject: ElevatedObject) : Promise<ElevatedObject> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/objects?type=${elevatedObject.typeId}`, elevatedObject)
      .toPromise()
      .then( response => response.json() as ElevatedObject)
      .catch(this.handleError)
  }

  delete(placedObjectId: number, typeId: number) : Promise<void> {
    return this.http
      .delete(`${AppSettings.API_ENDPOINT}/objects/${placedObjectId}?type=${typeId}`)
      .toPromise()
      .then(()=> null)
      .catch(this.handleError);
  }

  update(elevatedObject: ElevatedObject) : Promise<ElevatedObject> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/objects/${elevatedObject.id}?type=${elevatedObject.typeId}`, elevatedObject)
      .toPromise()
      .then(response => response.json() as ElevatedObject)
      .catch(this.handleError)
  }

  getFeature(objectId : number, typeId: number) : Promise<Feature> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects/${objectId}/feature?type=${typeId}`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }

  updateFeature(objectId : number, typeId:number, geom : Geometry) : Promise<Geometry>{

    let jsonGeom = JSON.parse(new GeoJSON().writeGeometry(geom));

    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/objects/${objectId}/feature?type=${typeId}`, {geometry: jsonGeom})
      .toPromise()
      .then(response => response.json() as Geometry)
      .catch(this.handleError)
  }
}

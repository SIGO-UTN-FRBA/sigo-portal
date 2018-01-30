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

@Injectable()
export class ElevatedObjectService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  search(paramMap : ParamMap) : Promise<PlacedObject[]> {

    let queryString = paramMap.keys.reduce((total, key) => {return `${total}&${key}=${paramMap.get(key)}` }, '');

    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects?${queryString}`)
      .toPromise()
      .then(response => response.json() as PlacedObject[])
      .catch(this.handleError)
  }

  get(objectId : number, typeId:number) : Promise<PlacedObject>{
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects/${objectId}?type=${typeId}`)
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
      .put(`${AppSettings.API_ENDPOINT}/objects/${placedObject.id}`, placedObject)
      .toPromise()
      .then(response => response.json() as PlacedObject)
      .catch(this.handleError)
  }

  getFeature(placedObjectId : number, typeId: number) : Promise<Feature> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/objects/${placedObjectId}/feature?type=${typeId}`)
      .toPromise()
      .then(response => new GeoJSON().readFeature(response.json()))
      .catch(this.handleError)
  }

  updateFeature(placedObjectId : number, typeId:number, geom : Geometry) : Promise<Geometry>{

    let jsonGeom = JSON.parse(new GeoJSON().writeGeometry(geom));

    return this.http
      .patch(`${AppSettings.API_ENDPOINT}/objects/${placedObjectId}/feature?type=${typeId}`, {geometry: jsonGeom})
      .toPromise()
      .then(response => response.json() as Geometry)
      .catch(this.handleError)
  }
}

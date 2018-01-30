import {Injectable} from "@angular/core";
import {ListItem} from "../commons/listItem";
import {ApiService} from "../main/api.service";
import {AppSettings} from "../main/app-settings";
import {ObjectOwner} from "./objectOwner";
import "rxjs/add/operator/toPromise";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class ObjectOwnerService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  list() : Promise<ListItem[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/owners`)
      .toPromise()
      .then(response => response.json() as ListItem[])
      .catch(this.handleError)
  }

  get(ownerId: number) : Promise<ObjectOwner> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/owners/${ownerId}`)
      .toPromise()
      .then(response => response.json() as ObjectOwner)
      .catch(this.handleError)
  }

  update(objectOwner: ObjectOwner) : Promise<ObjectOwner> {
    return this.http
      .put(`${AppSettings.API_ENDPOINT}/owners/${objectOwner.id}`, objectOwner)
      .toPromise()
      .then(response => response.json() as ObjectOwner)
      .catch(this.handleError)
  }

  save(objectOwner: ObjectOwner) : Promise<ObjectOwner> {
    return this.http
      .post(`${AppSettings.API_ENDPOINT}/owners`, objectOwner)
      .toPromise()
      .then( response => response.json() as ObjectOwner)
      .catch(this.handleError)
  }

  delete(ownerId: number) : Promise<void> {
    return this.http
      .delete(`${AppSettings.API_ENDPOINT}/owners/${ownerId}`)
      .toPromise()
      .then(()=> null)
      .catch(this.handleError);
  }


}

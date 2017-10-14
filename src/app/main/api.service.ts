import {Http} from "@angular/http";
import {ApiError} from "./apiError";

export class ApiService {

  constructor(protected http: Http) {}

  protected handleError(response: Response): Promise<ApiError> {

    if(response.status > 0){
      let body = response.json();

      return Promise.reject(new ApiError(response, body['code'], body['description']));
    }

    return Promise.reject(new ApiError(response));
  }

}

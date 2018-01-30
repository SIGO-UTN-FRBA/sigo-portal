import {ApiError} from "./apiError";
import {AuthHttp} from 'angular2-jwt';

export class ApiService {

  constructor(protected http: AuthHttp) {}

  protected handleError(response: Response): Promise<ApiError> {
debugger;
    if(response.status > 0){
      let body = response.json();

      return Promise.reject(new ApiError(response, body['code'], body['description']));
    }

    return Promise.reject(new ApiError(response));
  }

}

import {ApiError} from "./apiError";
import {AuthHttp} from 'angular2-jwt';

export class ApiService {

  constructor(protected http: AuthHttp) {}

  protected handleError(response: Response): Promise<ApiError> {

    debugger;

    let body = response.json();

    if(response.status > 0){
      return Promise.reject(new ApiError(response, body['code'], body['description']));
    } else if (response.status == 0 ){
      return Promise.reject(new ApiError(response,'net::ERR_CONNECTION_REFUSED',"Fail to connect to to API resource server."))
    } else {
      return Promise.reject(new ApiError(response,response.statusText,"Unexpected error occurred"));
    }
  }

}

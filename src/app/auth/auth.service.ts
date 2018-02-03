import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import "rxjs/add/operator/toPromise";
import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'P5zqY0quWRi1U_Truva9-JI-4Ee2BKeG',
    domain: 'sigo-utn.auth0.com',
    issuer: "https://sigo-utn.auth0.com/",
    responseType: 'token id_token',
    audience: 'http://localhost:8080/sigo/api',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile email app_metadata'
  });

  userProfile: any;

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(){
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        console.log(err);
        this.router.navigate(['/unauthorized']);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public getProfile(cb): void {

    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });

  }

  public getLocalProfile(): any{
    const idToken = localStorage.getItem('token');

    if (!idToken) {
      throw new Error('Id token must exist to fetch profile');
    }

    let decodedJwt = new JwtHelper().decodeToken(idToken);

    debugger;

    return decodedJwt;
  }

  public userHasRole(): boolean {

    let decodedToken = this.getLocalProfile();

    return decodedToken.hasOwnProperty("http://localhost:8080/sigo/api/app_metadata")
      && decodedToken["http://localhost:8080/sigo/api/app_metadata"].hasOwnProperty("role");

  }
}

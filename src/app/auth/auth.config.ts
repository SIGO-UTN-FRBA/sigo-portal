interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  scope: string;
  responseType: string;
  audience: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'P5zqY0quWRi1U_Truva9-JI-4Ee2BKeG',
  domain: 'sigo-utn.auth0.com',
  callbackURL: 'http://localhost:4200/callback',
  scope: 'openid profile',
  responseType: 'token id_token',
  audience: 'https://sigo-utn.auth0.com/userinfo'
};

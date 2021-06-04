import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { API_CONFIG } from '../config/api.config';
import { CredentialsDTO } from '../models/credentials.dto';
import { LocalUser } from '../models/local_user';
import { StorageService } from './storage.service';

@Injectable()
export class AuthenticationService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public http: HttpClient, public storage: StorageService) {
  }

  authenticate(credentials: CredentialsDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/login`,
      credentials,
      {
        observe: 'response',
        responseType: 'text'
      });
  }

  successfulLogin(authorizationValue: string) {
    let webToken = authorizationValue.substring(7);
    let user: LocalUser = {
      token: webToken,
      email: this.jwtHelper.decodeToken(webToken).sub
    };
    this.storage.setLocalUser(user);
  }

  successfulLogout() {
    this.storage.setLocalUser(null);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userIsAuthenticted = true;
  userID = 'abc';

  constructor() {}

  get userIsuserIsAuthenticted() {
    return this.userIsAuthenticted;
  }

  get userId() {
    return this.userID;
  }

  onLogin() {
    this.userIsAuthenticted = true;
  }
  onLogout() {
    this.userIsAuthenticted = false;
  }
}

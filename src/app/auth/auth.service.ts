import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userIsAuthenticted = true;
  userID = 'yxc';

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

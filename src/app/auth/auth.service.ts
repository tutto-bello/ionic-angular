import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userIsAuthenticted = false;

  constructor() {}

  get userIsuserIsAuthenticted() {
    return this.userIsAuthenticted;
  }

  onLogin() {
    this.userIsAuthenticted = true;
  }
  onLogout() {
    this.userIsAuthenticted = false;
  }
}

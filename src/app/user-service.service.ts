import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private userId: string = '';

  constructor() {
    this.userId = '';
  }

  setUserId(id: string) {
    this.userId = id;
  }

  getUserId() {
    return this.userId;
  }
}

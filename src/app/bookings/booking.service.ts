import { Injectable } from '@angular/core';
import { Booking } from './booking.module';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bbookings: Booking[] = [
    {
      id: 'fgh',
      placeId: 'p1',
      placeTitle: 'Manhattan',
      guestNumber: 2,
      userId: 'abc',
    },
  ];

  get booking() {
    return [...this.bbookings];
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, delay, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.module';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bbookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService) {}

  get booking() {
    return this.bbookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userID,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.booking.pipe(
      take(1),
      delay(1000),
      tap((booking) => {
        this.bbookings.next(booking.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.booking.pipe(
      take(1),
      delay(1000),
      tap((booking) => {
        this.bbookings.next(booking.filter((b) => b.id !== bookingId));
      })
    );
  }
}

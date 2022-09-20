import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { take, delay, tap, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.module';

interface BookingDataResponse {
  placeId: string;
  userId: string;
  placeTitle: string;
  placeImage: string;
  firstName: string;
  lastName: string;
  guestNumber: number;
  bookedFrom: Date;
  bookedTo: Date;
}
@Injectable({ providedIn: 'root' })
export class BookingService {
  private bbookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

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
    let generatedId: string;

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
    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-course-cc323-default-rtdb.europe-west1.firebasedatabase.app/bookings.json',
        { ...newBooking, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.booking;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
          this.bbookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string) {
    return this.http
      .delete(
        `https://ionic-angular-course-cc323-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => this.booking),
        take(1),
        tap((booking) => {
          this.bbookings.next(booking.filter((b) => b.id !== bookingId));
        })
      );
  }

  fetchBookings() {
    return this.http
      .get<{ [key: string]: BookingDataResponse }>(
        // eslint-disable-next-line max-len
        `https://ionic-angular-course-cc323-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${this.authService.userID}"`
      )
      .pipe(
        map((resData) => {
          const bookings = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  key,
                  resData[key].placeId,
                  resData[key].userId,
                  resData[key].placeTitle,
                  resData[key].placeImage,
                  resData[key].firstName,
                  resData[key].lastName,
                  resData[key].guestNumber,
                  new Date(resData[key].bookedFrom),
                  new Date(resData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
        }),
        tap((bookings) => this.bbookings.next(bookings))
      );
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.module';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    {
      id: 'p1',
      title: 'New York Manhattan',
      description: 'New York Manhattan heart of cty',
      imgUrl:
        'https://blog-www.pods.com/wp-content/uploads/2019/04/MG_1_1_New_York_City-1.jpg',
      price: 149.99,
      avilableFrom: new Date(),
      avilableTo: new Date('2022.12.31'),
      userId: 'abc',
    },
    {
      id: 'p2',
      title: 'L/amour toujours',
      description: 'sjchaéigubfv fjnvőpewiurgh fvku ',
      imgUrl: 'https://data.whicdn.com/images/134079763/original.jpg',
      price: 109.99,
      avilableFrom: new Date(),
      avilableTo: new Date('2022.12.31'),
      userId: 'fgh',
    },
    {
      id: 'p3',
      title: 'The foggy palace',
      description: 'The big height palace of germeny',
      imgUrl: 'https://tangiyoga.files.wordpress.com/2015/04/castle-in-fog.jpg',
      price: 99.99,
      avilableFrom: new Date(),
      avilableTo: new Date('2022.12.31'),
      userId: 'fga',
    },
  ]);

  constructor(private authService: AuthService) {}

  get places() {
    // eslint-disable-next-line no-underscore-dangle
    return this._places.asObservable();
  }

  getPlace(placeId: string) {
    return this.places.pipe(
      take(1),
      map((places) => ({
        ...places.find((place) => place.id === placeId),
      }))
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://tangiyoga.files.wordpress.com/2015/04/castle-in-fog.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userID
    );

    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        // eslint-disable-next-line no-underscore-dangle
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updateOffer(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex(
          (place) => place.id === placeId
        );
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imgUrl,
          oldPlace.price,
          oldPlace.avilableFrom,
          oldPlace.avilableTo,
          oldPlace.userId
        );
        // eslint-disable-next-line no-underscore-dangle
        this._places.next(updatedPlaces);
      })
    );
  }
}

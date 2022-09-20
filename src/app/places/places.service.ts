import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.module';

interface PlaceDataResponse {
  avilableFrom: string;
  avilableTo: string;
  description: string;
  imgUrl: string;
  price: number;
  title: string;
  userId: string;
}

// {
//   id: 'p1',
//   title: 'New York Manhattan',
//   description: 'New York Manhattan heart of cty',
//   imgUrl:
//     'https://blog-www.pods.com/wp-content/uploads/2019/04/MG_1_1_New_York_City-1.jpg',
//   price: 149.99,
//   avilableFrom: new Date(),
//   avilableTo: new Date('2022.12.31'),
//   userId: 'abc',
// },
// {
//   id: 'p2',
//   title: 'L/amour toujours',
//   description: 'sjchaéigubfv fjnvőpewiurgh fvku ',
//   imgUrl: 'https://data.whicdn.com/images/134079763/original.jpg',
//   price: 109.99,
//   avilableFrom: new Date(),
//   avilableTo: new Date('2022.12.31'),
//   userId: 'fgh',
// },
// {
//   id: 'p3',
//   title: 'The foggy palace',
//   description: 'The big height palace of germeny',
//   imgUrl: 'https://tangiyoga.files.wordpress.com/2015/04/castle-in-fog.jpg',
//   price: 99.99,
//   avilableFrom: new Date(),
//   avilableTo: new Date('2022.12.31'),
//   userId: 'fga',
// },
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    // eslint-disable-next-line no-underscore-dangle
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceDataResponse }>(
        'https://ionic-angular-course-cc323-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imgUrl,
                  resData[key].price,
                  new Date(resData[key].avilableFrom),
                  new Date(resData[key].avilableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
          // return [];
        }),
        // eslint-disable-next-line no-underscore-dangle
        tap((places) => this._places.next(places))
      );
  }

  getPlace(placeId: string) {
    return this.http
      .get<PlaceDataResponse>(
        `https://ionic-angular-course-cc323-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`
      )
      .pipe(
        map(
          (resData) =>
            new Place(
              placeId,
              resData.title,
              resData.description,
              resData.imgUrl,
              resData.price,
              new Date(resData.avilableFrom),
              new Date(resData.avilableTo),
              resData.userId
            )
        )
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
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

    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-course-cc323-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json',
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          // eslint-disable-next-line no-underscore-dangle
          this._places.next(places.concat(newPlace));
        })
      );

    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     // eslint-disable-next-line no-underscore-dangle
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updateOffer(placeId: string, title: string, description: string) {
    // const headers = new HttpHeaders({
    //   // eslint-disable-next-line @typescript-eslint/naming-convention
    //   'Access-Control-Allow-Origin': 'https://console.firebase.google.com',
    // });
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex(
          (place) => place.id === placeId
        );
        updatedPlaces = [...places];
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
        return this.http.put(
          `https://ionic-angular-course-cc323-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        // eslint-disable-next-line no-underscore-dangle
        this._places.next(updatedPlaces);
      })
    );
  }
}

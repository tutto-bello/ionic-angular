import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './offers/loaction.module';
import { Place } from './place.module';

interface PlaceDataResponse {
  avilableFrom: string;
  avilableTo: string;
  description: string;
  imgUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

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
                  resData[key].userId,
                  resData[key].location
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
              resData.userId,
              resData.location
            )
        )
      );
  }

  uploadImaeg(image: File) {
    const uploadedData = new FormData();
    uploadedData.append('image', image);

    return this.http.post<{ imageUrl: string; imagePath: string }>(
      'https://us-central1-ionic-angular-course-cc323.cloudfunctions.net/storeImage',
      uploadedData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    console.log(location, 'addPlace');
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      dateFrom,
      dateTo,
      this.authService.userID,
      location
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
          oldPlace.userId,
          oldPlace.location
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

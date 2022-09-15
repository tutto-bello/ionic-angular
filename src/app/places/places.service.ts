import { Injectable } from '@angular/core';
import { Place } from './place.module';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    {
      id: 'p1',
      title: 'New York Manhattan',
      description: 'New York Manhattan heart of cty',
      imgUrl:
        'https://blog-www.pods.com/wp-content/uploads/2019/04/MG_1_1_New_York_City-1.jpg',
      price: 149.99,
      avilableFrom: new Date(),
      avilableTo: new Date('2022.12.31'),
    },
    {
      id: 'p2',
      title: 'L/amour toujours',
      description: 'sjchaéigubfv fjnvőpewiurgh fvku ',
      imgUrl: 'https://data.whicdn.com/images/134079763/original.jpg',
      price: 109.99,
      avilableFrom: new Date(),
      avilableTo: new Date('2022.12.31'),
    },
    {
      id: 'p3',
      title: 'The foggy palace',
      description: 'The big height palace of germeny',
      imgUrl: 'https://tangiyoga.files.wordpress.com/2015/04/castle-in-fog.jpg',
      price: 99.99,
      avilableFrom: new Date(),
      avilableTo: new Date('2022.12.31'),
    },
  ];

  constructor() {}

  get places() {
    // eslint-disable-next-line no-underscore-dangle
    return [...this._places];
  }

  getPlace(placeId: string) {
    // eslint-disable-next-line no-underscore-dangle
    return { ...this._places.find((place) => place.id === placeId) };
  }
}

import { PlaceLocation } from './offers/loaction.module';

export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imgUrl: string,
    public price: number,
    public avilableFrom: Date,
    public avilableTo: Date,
    public userId: string,
    public location: PlaceLocation
  ) {}
}

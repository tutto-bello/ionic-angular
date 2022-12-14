/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import {
  Coordinates,
  PlaceLocation,
} from '../../../places/offers/loaction.module';
import { of } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  isLoading = false;
  selectedLocationImg: string;
  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Pleace choose',
        buttons: [
          {
            text: 'Auto-Location',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Pick on map',
            handler: () => {
              this.openMap();
            },
          },
          { text: 'Cancel', role: 'cancel' },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  locateUser() {
    // Geolocation.checkPermissions().then((permission) => {
    //   console.log(permission, 'permission');
    //   if (!permission.coarseLocation && !permission.location) {
    //     Geolocation.requestPermissions();
    //   }
    // });
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert('Could not fetch geolocation, caouse of capacitor');
      return;
    }
    this.isLoading = true;
    Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })
      .then((geoPosition) => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch((err) => {
        this.showErrorAlert(
          'Could not fetch geolocation, caouse of Geolaction'
        );
      });
  }

  showErrorAlert(header: string) {
    this.alertCtrl
      .create({
        header,
        message: 'Please use Pick on map opion',
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }

  openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    });
  }

  createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat,
      lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe((staticMapImgageUrl) => {
        pickedLocation.staticMapImageUrl = staticMapImgageUrl;
        this.selectedLocationImg = staticMapImgageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapeApiKey}`
      )
      .pipe(
        map((geoData) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x400&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapeApiKey}`;
  }
}

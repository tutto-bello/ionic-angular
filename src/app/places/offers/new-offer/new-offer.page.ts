import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { PlacesService } from '../../places.service';
import { PlaceLocation } from '../loaction.module';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCrt: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      descripiton: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.max(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateForm: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null),
    });
  }

  onLocationPicked(placeLocation: PlaceLocation) {
    this.form.patchValue({ ['location']: placeLocation });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = this.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }

  base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    console.log(this.form.value);
    this.loadingCrt
      .create({
        message: 'Creating place..',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesService
          .uploadImaeg(this.form.value.image)
          .pipe(
            switchMap((uploadResponse) =>
              this.placesService.addPlace(
                this.form.value.title,
                this.form.value.descripiton,
                +this.form.value.price,
                new Date(this.form.value.dateForm),
                new Date(this.form.value.dateTo),
                this.form.value.location,
                uploadResponse.imageUrl
              )
            )
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}

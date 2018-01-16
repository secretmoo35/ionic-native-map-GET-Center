import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoogleMapsAutocompletePage } from './google-maps-autocomplete';

@NgModule({
  declarations: [
    GoogleMapsAutocompletePage,
  ],
  imports: [
    IonicPageModule.forChild(GoogleMapsAutocompletePage),
  ],
})
export class GoogleMapsAutocompletePageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoogleMapsPage } from './google-maps';

@NgModule({
  declarations: [
    GoogleMapsPage,
  ],
  imports: [
    IonicPageModule.forChild(GoogleMapsPage),
  ],
})
export class GoogleMapsPageModule { }

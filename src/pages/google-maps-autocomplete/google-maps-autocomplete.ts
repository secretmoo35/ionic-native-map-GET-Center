import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

declare let google: any;

@IonicPage()
@Component({
  selector: 'page-google-maps-autocomplete',
  templateUrl: 'google-maps-autocomplete.html',
})
export class GoogleMapsAutocompletePage {
  autocompleteItems: any;
  autocomplete: any = {
    query: ''
  };
  acService: any;
  placesService: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
  }

  ionViewWillEnter() {
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let config = {
      types: [], // other types available in the API: 'establishment', 'regions', and 'cities'
      input: this.autocomplete.query
    }
    this.acService.getPlacePredictions(config, (predictions, status) => {
      this.autocompleteItems = [];
      if (status === 'OK') {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      }
    });
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

}

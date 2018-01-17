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
    this.acService.getPlacePredictions(config, (places_predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.autocompleteItems = places_predictions;
      }
      else {
        this.autocompleteItems = [];
      }
    });
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

  getItems(e) {
    if (e.keyCode == 13) {
      let activeElement = <HTMLElement>document.activeElement;
      activeElement && activeElement.blur && activeElement.blur();
    }
  }

}

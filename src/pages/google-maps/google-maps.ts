import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, LatLng, GoogleMapsEvent } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
declare let google: any;

@IonicPage()
@Component({
  selector: 'page-google-maps',
  templateUrl: 'google-maps.html',
})
export class GoogleMapsPage {

  @ViewChild('map') mapElement: ElementRef;
  private map: GoogleMap;
  private location: LatLng;
  private placesService: any;
  private address: any = '';
  constructor(
    public navCtrl: NavController,
    public navParam: NavParams,
    private platform: Platform,
    private googleMaps: GoogleMaps,
    private modalCtrl: ModalController,
    private nativeGeocoder: NativeGeocoder
  ) {

  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.initialMap();
    });
  }

  initialMap() {
    let element = this.mapElement.nativeElement;
    this.map = this.googleMaps.create(element, {
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true,
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'bearing': 0,
        'tilt': 0
      }
    });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.map.getMyLocation().then((res) => {
        this.location = res.latLng;
        let options = {
          target: this.location,
          zoom: 16,
          duration: 3000
        };

        this.map.moveCamera(options);
        this.reverseGeocode();
        this.onMapMove();
        this.onMyLocationClick();
      });
    });
  }

  onMapMove() {
    this.map.on(GoogleMapsEvent.MAP_DRAG_END).subscribe((res) => {
      let location = this.map.getCameraTarget();
      this.location = new LatLng(location.lat, location.lng);
      this.reverseGeocode();
    });
  }

  onMyLocationClick() {
    this.map.on(GoogleMapsEvent.MY_LOCATION_BUTTON_CLICK).subscribe(() => {
      this.map.one(GoogleMapsEvent.CAMERA_MOVE_END).then(() => {
        let location = this.map.getCameraTarget();
        this.location = new LatLng(location.lat, location.lng);
        this.reverseGeocode();
      });
    });
  }

  addMarker() {
    let position = {
      lat: this.location.lat,
      lng: this.location.lng
    };

    this.map.clear();

    this.map.addMarker({
      title: this.address,
      snippet: "Edit detail. Click here!",
      icon: {
        url: './assets/icon/pin_transparent.png',
        size: {
          width: 40,
          height: 40
        }
      },
      position: position
    })
      .then((marker) => {
        this.map.setCameraTarget(position);
        marker.showInfoWindow();
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          marker.target(position);
        });
        marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
          alert('Info edit');
        });
      });
  }

  reverseGeocode() {
    this.nativeGeocoder.reverseGeocode(this.location.lat, this.location.lng)
      .then((result: NativeGeocoderReverseResult) => {
        this.address = '';
        this.address += (result.subThoroughfare ? result.subThoroughfare + ' ' : '');
        this.address += (result.thoroughfare ? result.thoroughfare + ' ' : '')
        this.address += (result.locality ? result.locality + ' ' : '')
        this.address += (result.subLocality ? result.subLocality + ' ' : '')
        this.address += (result.subAdministrativeArea ? result.subAdministrativeArea + ' ' : '')
        this.address += (result.administrativeArea ? result.administrativeArea + ' ' : '')
        this.address += (result.postalCode ? result.postalCode + ' ' : '')
        this.address += (result.countryName ? result.countryName : '');
        this.addMarker();
      })
      .catch((error: any) => alert('error ' + JSON.stringify(error)));
  }

  googleMapsAutocomplete() {
    let googleMapsAutocompleteModal = this.modalCtrl.create('GoogleMapsAutocompletePage');
    googleMapsAutocompleteModal.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.getPlaceDetail(data.place_id);
      }
    })
    googleMapsAutocompleteModal.present();
  }

  getPlaceDetail(place_id: string) {
    let request = {
      placeId: place_id
    };
    this.placesService = new google.maps.places.PlacesService(this.mapElement.nativeElement);
    this.placesService.getDetails(request, (place, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        this.address = place.name + ' ' + place.formatted_address;
        this.location = new LatLng(place.geometry.location.lat(), place.geometry.location.lng());
        this.map.setCameraTarget(this.location);
        this.addMarker();
      } else {
        console.log('page > getPlaceDetail > status > ', status);
      }
    });
  }

  doConfirm() {
    this.reverseGeocode();
  }

}

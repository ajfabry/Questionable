import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google: any;

@Component({
  selector: 'app-local',
  templateUrl: './local.page.html',
  styleUrls: ['./local.page.scss'],
})
export class LocalPage implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;
  markers = [];

  constructor(
    public navController: NavController,
    public platform: Platform,
    private geolocation: Geolocation
  ) 
  { 
    platform.ready().then(() => {
      this.initMap();
    });
  }

  ngOnInit() {
  }

  initMap() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true}).then((resp) => {
        let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 15,
          center: mylocation
        });
    });

    let watch = this.geolocation.watchPosition();

    watch.subscribe((data) => {
      console.log(data);
      let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      let image = 'assets/icon/favicon.png';
      this.addMarker(updatelocation,image);
      this.setMapOnAll(this.map);
    });

    // watch.subscribe((data) => {
    //   let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
    //   let image = 'assets/imgs/blue-bike.png';
    //   this.addMarker(updatelocation,image);
    //   this.setMapOnAll(this.map);
    // })
    // this.map = new google.maps.Map(this.mapElement.nativeElement, {
    //   zoom: 7,
    //   center: {lat: 41.85, lng: -87.65}
    // });
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

}

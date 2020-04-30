import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { sum, values } from 'lodash';

import { HomePage } from '../home/home.page';
import { Service } from '../question.service';

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

  questions: Array<any>;
  cutoffDate: Date;
  cutoffDisplay: string;
  toProfile = false;
  sortBy = "votes";

  constructor(
    public navController: NavController,
    public platform: Platform,
    private geolocation: Geolocation,
    public homePage: HomePage,
    public service: Service
  ) 
  { 
    platform.ready().then(() => {
      this.initMap();
    });
  }

  ngOnInit() {
    var self = this;
    let startDate = "0001 01 01";
    this.service.db.collection("questions").onSnapshot(function(querySnapshot) {
      self.questions = [];
      var numQuestions = 0;
      querySnapshot.forEach(function(doc) {
        numQuestions++;
        var item = doc.data();

        var question = {question: item.question, username: "", uid: item.uid, votes: 0, 
                        timestamp: item.timestamp, id: doc.ref.id, path: doc.ref.path};

        self.homePage.getUsername(item.uid).get().then(username => {
          question.username = username.data().username;
        });

        self.homePage.getQuestionVotes(question).get().then(upvotes => {
          question.votes = sum(values(upvotes.data()));
          self.questions.push(question);
          // if (self.questions.length == numQuestions) {
          //   self.sortQuestions();
          // }
        });
      });
      this.questions = self.questions;
    });
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

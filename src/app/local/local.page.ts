import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { sum, values } from 'lodash';

import { HomePage } from '../home/home.page';
import { Service } from '../question.service';

import { PopoverController } from '@ionic/angular';
import { FilterDateLocalComponent } from './filter-date-local/filter-date-local.component';
import { SortLocalComponent } from './sort-local/sort-local.component';

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

  loadMap = true;

  constructor(
    public navController: NavController,
    public platform: Platform,
    private geolocation: Geolocation,
    public homePage: HomePage,
    public service: Service,
    public popoverController: PopoverController
  ) 
  { 
    this.service.getObservable().subscribe((data) => {
      if (data.sort != null) {
        this.setCutoff(data.sort, data.allTime);
        this.loadMap = true;
      }
      if (data.sortMethod != null) {
        this.setSort(data.sortMethod);
        this.loadMap = false;
      }
      if (data.page == "LocalPage") {
        this.ngOnInit();
        this.loadMap = true;
      }
    })
  }

  ngOnInit() {
    var self = this;

    var myLocation = {};
    this.getLocation().then((resp) => {
      myLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
    });

    let startDate = this.cutoffDate || new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (startDate < new Date(Date.now() - 366 * 24 * 60 * 60 * 1000))
      this.cutoffDisplay = "all time";
    else if (startDate < new Date(Date.now() - 364 * 24 * 60 * 60 * 1000))
      this.cutoffDisplay = "past year";
    else if (startDate < new Date(Date.now() - 29 * 24 * 60 * 60 * 1000))
        this.cutoffDisplay = "past month";
    else if (startDate < new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
      this.cutoffDisplay = "past week";
    else if (startDate < new Date(Date.now() - 23 * 60 * 60 * 1000))
      this.cutoffDisplay = "past day";
    else
      this.cutoffDisplay = "past hour";

    if (this.loadMap) {
      this.getLocation().then((resp) => {
        let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 15,
          center: mylocation
        });

        this.map.addListener('center_changed', function() {
          self.questions = [];
          var bounds = self.map.getBounds();

          self.markers.forEach((marker) => {
            if (bounds.contains(marker.getPosition())) {
              let path = marker.getTitle();
              var question = {question: "", username: "", uid: "", votes: 0, timestamp: new Date(), id: "", path: "", geopoint: {latitude: 0, longitude: 0}};
              self.service.db.doc(path).get().then(data => {
                let docData = data.data();
                question.question = docData.question;
                self.homePage.getUsername(docData.uid).get().then(username => {
                  question.username = username.data().username;
                });
                question.uid = docData.uid;
                question.timestamp = docData.timestamp;
                question.id = data.ref.id;
                question.path = data.ref.path;
                question.geopoint = docData.location;
                self.homePage.getQuestionVotes(question).get().then(upvotes => {
                  question.votes = sum(values(upvotes.data()));
                  self.questions = self.homePage.sortQuestions(self.questions);
                });
              });
              self.questions.push(question);
            }
          });

          this.questions = self.questions;
        });
        
        this.service.db.collection("questions").where("timestamp", '>', startDate).onSnapshot(function(querySnapshot) {
          self.questions = [];
          self.clearMarkers();
          self.markers = [];
          var numQuestions = 0;
          querySnapshot.forEach(function(doc) {
            numQuestions++;
            var item = doc.data();
            
            var question = {question: item.question, username: "", uid: item.uid, votes: 0, timestamp: item.timestamp, id: doc.ref.id, path: doc.ref.path, geopoint: item.location};
            
            if (question.geopoint != undefined) {
              var canvas : any = document.getElementById('textCanvas');
              canvas.width = 400;
              canvas.height = 30;
              var context = canvas.getContext('2d');
              context.fillStyle = "black";
              context.font = "20px Arial";
              context.fillText(question.question, 5, 20);
              context.globalCompositeOperation = "destination-over";
              context.fillStyle = "#ffffff";
              context.fillRect(0,0,context.measureText(question.question).width + 10,canvas.height);
              context.globalCompositeOperation = "source-over";
              context.lineWidth = 2;
              context.strokeStyle="#000000";
              context.strokeRect(0, 0, context.measureText(question.question).width + 10, canvas.height);
              let imgUrl = context.canvas.toDataURL();          
              
              let lat = question.geopoint.latitude + (Math.random() < 0.5 ? -1 : 1) * 0.01 * Math.random();
              let lng = question.geopoint.longitude + (Math.random() < 0.5 ? -1 : 1) * 0.01 * Math.random();
              let marker = new google.maps.Marker({
                position: {lat, lng},
                map: self.map,
                icon: imgUrl,
                title: question.path
              })
              self.markers.push(marker);
              
              if (self.map.getBounds().contains(marker.getPosition())) {
                
                marker.setMap(self.map);
                
                self.homePage.getUsername(item.uid).get().then(username => {
                  question.username = username.data().username;
                });
                
                self.homePage.getQuestionVotes(question).get().then(upvotes => {
                  question.votes = sum(values(upvotes.data()));
                  self.questions.push(question);
                  // if (self.questions.length == numQuestions) {
                    self.questions = self.homePage.sortQuestions(self.questions);
                  // }
                });
              } 
            }
          })
          this.questions = self.questions;
        });
      });
    } else {
      // Just load questions


      this.service.db.collection("questions").where("timestamp", '>', startDate).onSnapshot(function(querySnapshot) {
        self.questions = [];
        var numQuestions = 0;
        querySnapshot.forEach(function(doc) {
          numQuestions++;
          var item = doc.data();
          
          var question = {question: item.question, username: "", uid: item.uid, votes: 0, timestamp: item.timestamp, id: doc.ref.id, path: doc.ref.path, geopoint: item.location};
          
              
          self.homePage.getUsername(item.uid).get().then(username => {
            question.username = username.data().username;
          });
          
          self.homePage.getQuestionVotes(question).get().then(upvotes => {
            question.votes = sum(values(upvotes.data()));
            self.questions.push(question);
            if (self.questions.length == numQuestions) {
              self.questions = self.homePage.sortQuestions(self.questions);
            }
          });


        })
        this.questions = self.questions;
      });






    }
  }
    
  refreshLocal() {
    this.ngOnInit();
  }
    
  initMap() {
    this.getLocation().then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: mylocation
      });
    });
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

  getLocation() {
    return this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
  }

  async presentPopover(event) {
    console.log("presenting popover");
    const popover = await this.popoverController.create({
      component: FilterDateLocalComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
  }

  async presentSortPopover(event) {
    console.log("presenting popover");
    const popover = await this.popoverController.create({
      component: SortLocalComponent,
      event: event,
      translucent: true
    });
    return await popover.present();
  }

  setCutoff(cutoff, allTime) {
    if (allTime)
      this.cutoffDate = new Date("0001-01-01");
    else
      this.cutoffDate = new Date(Date.now() - cutoff);
  }

  setSort(sortMethod) {
    this.sortBy = sortMethod;
  }
}

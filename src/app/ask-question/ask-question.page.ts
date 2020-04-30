import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import { Service } from '../question.service';
import { NavController } from '@ionic/angular';

import { LocalPage } from '../local/local.page';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.page.html',
  styleUrls: ['./ask-question.page.scss'],
})
export class AskQuestionPage implements OnInit {
  question;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service,
    private nav: NavController,
    private localPage: LocalPage) { }

  ngOnInit() {
  }

  submit() {
    let uid = firebase.auth().currentUser.uid;

    this.localPage.getLocation().then((resp) => {
      let myLocation = {lat: resp.coords.latitude, long: resp.coords.longitude};
      
      let entry = {
        "question":this.question,
        "uid":uid,
        "timestamp": new Date(),
        "location": new firebase.firestore.GeoPoint(myLocation.lat, myLocation.long)
      };
      
      var self = this;
      this.service.db.collection("questions").add(entry)
      .then(function(docRef) {
        docRef.collection("votes").doc("votes").set({
          [uid]: 1
        }).then(() => {
          const increment = firebase.firestore.FieldValue.increment(1);
          
          self.service.db.collection("username").doc(uid).update({ numPosts: increment});
          self.service.publishEvent({page: "HomePage"});
          self.nav.back();
        });
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
      
    });
      
    }
  }
  
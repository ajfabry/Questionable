import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import { Service } from '../question.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.page.html',
  styleUrls: ['./answer-question.page.scss'],
})
export class AnswerQuestionPage implements OnInit {
  question:any;
  answer = "";
  followup = "";
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service,
    private nav: NavController) { }

  ngOnInit() {
    this.route.params.subscribe(
      param=>{
        this.question = param
      }
    )
  }

  submit() {
    let uid = firebase.auth().currentUser.uid;
    let entry = {
      "answer":this.answer,
      "question":this.followup,
      "uid":uid,
      "timestamp": new Date()
    };
    
    let docRef = this.service.db.doc(this.question.path);

    var self = this;
    docRef.collection("answers").add(entry)
    .then(newDoc => {
      console.log("Document written with ID: ", newDoc.id);
      
      self.service.db.collection("username").doc(uid).collection("posts").add({
        "path": newDoc.path
      })

      newDoc.collection("votes").doc("votes").set({
        [uid]: 1
      }).then(() => {
        const increment = firebase.firestore.FieldValue.increment(1);
    
        self.service.db.collection("username").doc(uid).update({ numPosts: increment});
        self.service.publishEvent({page: "QuestionPage"});
        self.nav.back();
      })
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

  }
}

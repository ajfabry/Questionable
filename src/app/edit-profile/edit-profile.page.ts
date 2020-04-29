import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../question.service';
import * as firebase from 'firebase';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  newUsername="";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service,
    private nav: NavController
  ) { }

  ngOnInit() {
  }

  edit() {
    var self = this;
    var uid = firebase.auth().currentUser.uid;
    console.log(this.newUsername);
    this.service.db.collection("username").doc(uid).update({ username: this.newUsername});
    self.service.publishEvent({page: "ProfilePage"});
    self.nav.back();
  }
}

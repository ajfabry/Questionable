import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { Service } from '../question.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  new_item_form: FormGroup;
  db = firebase.firestore();

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private service: Service
  ) { }

  ngOnInit() {
    this.new_item_form = this.formBuilder.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  signup() {
    this.router.navigate(['/signup']);
  }

  login(item) {
    var self=this;
    var email=item.email;
    var password=item.password;

    firebase.auth().signOut();

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);

      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else if (errorCode === 'auth/user-not-found'){
        alert("User does not exist");
      }
      console.log(error);
    }).then(function(result){
      self.service.publishEvent({page: "HomePage"});
      self.service.publishEvent({page: "FollowingPage"});
      self.router.navigate(["../tabs/home"]);
    });
  }

  guestLogin() {
    this.service.publishEvent({page: "HomePage"});
	  this.router.navigate(["../tabs/home"]);
  }

}

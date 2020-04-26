import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Router,Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
//import { AppService } from '../app.service';


import * as firebase from 'firebase';

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
 	  public formBuilder: FormBuilder
 	     //public service: AppService
  ) { }

  ngOnInit() {

    this.new_item_form = this.formBuilder.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
});
}

signup() {

}

login(item){
  console.log(item.email+"   "+item.password)
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
    }
    ).then(function(result){
    var user= firebase.auth().currentUser;
        console.log("login succeeded");
        console.log(user.uid);

        // firebase.auth().currentUser
        // self.router.navigate(["/login"]);
        //this.service.logged(1);
        self.router.navigate(["../tabs/tab1"]);
    });
  }

  loginGoogle() {}
  /*
  loginGoogle(){
    var self=this;
    console.log("google login")
    // Using a popup.
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token.
    var token = result.credential.providerId;
    // The signed-in user info.
    var user = result.user;
    console.log(user);
    console.log("login succeeded")
    //this.service.logged(1);
    self.router.navigate(["../tabs/tab1"]);
    });
  }
  */
}

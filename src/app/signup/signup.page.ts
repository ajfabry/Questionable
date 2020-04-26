import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  user= {
    email:"",
    password:""
  };
  username="";

  constructor( private router: Router) { }

  ngOnInit() {
  }

  signup(){
  	console.log(this.user.email+"  "+this.user.password)
  	var email=this.user.email;
  	var password=this.user.password;
  	var self=this;
    
    firebase.auth().signOut();

  	firebase.auth().createUserWithEmailAndPassword(email, password).catch(
  		function(error) {
        // Handle Errors here.
        console.log(error);
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error.message);
        if(errorCode.length > 0){
          console.log("Failed");
        }
        else{
          console.log("signup ok")
        }
	      // ...
      }).then(function(result){
		    var user= firebase.auth().currentUser;
		    var db = firebase.firestore();
			  db.collection("username").add({
				'uid':user.uid,
				  'username': self.username
			  
		    })
		    .then(function(docRef) {
			  console.log("usetype written with ID: ", docRef.id);

			  //update this products arrays
		  })
		  .catch(function(error) {
			  console.error("Error adding document: ", error);
		  });



		  console.log("finished creating account")
		  console.log(user.uid)
		  // self.router.navigate(["/login"]);
		  self.router.navigate(["../tabs/tab1"]);
    });


  }

}

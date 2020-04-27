import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import {Subject} from 'rxjs';

@Injectable(
    {  providedIn: 'root' }
)

export class Service
{
    private eventSubject = new Subject<any>();
    questions: Array<any>;

    ref = firebase.database().ref('questions/');
    db = firebase.firestore();

    publishEvent(data: any) {
        this.eventSubject.next(data);
    }
    getObservable(): Subject<any> {
        return this.eventSubject;
    }
    
    async getUsername() {
        var self = this;
        var username="Prof";
        if(firebase.auth().currentUser!=null){
            console.log("Logged in");
            console.log(firebase.auth().currentUser.uid);
            await this.db.collection("username").where("uid", "==", firebase.auth().currentUser.uid)
            .onSnapshot(function(querySnapshot) {
                console.log("username loaded");
                querySnapshot.forEach(function(doc) {
                    var item = doc.data();
                    //console.log(item);
                    username = item.username;
                    //console.log(username);
                });
                // self.events.publish('dataloaded',Date.now());
                self.publishEvent({
                    foo: 'bar'
                });
                console.log(username)
                return username
            } );
        }
    }
    
    constructor() {}
}
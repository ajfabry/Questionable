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

    constructor() {
        var self = this;

        this.db.collection("questions").onSnapshot(function(querySnapshot) {
            self.questions = [];
            querySnapshot.forEach(function(doc) {
                var item = doc.data();
                self.questions.push({question:item.question, id: doc.ref.id});
            });

            self.publishEvent({
                Message: "Questions Loaded"
            });

            this.questions = self.questions;
        });
    }
}
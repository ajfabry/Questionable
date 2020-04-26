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

    constructor() {}
}
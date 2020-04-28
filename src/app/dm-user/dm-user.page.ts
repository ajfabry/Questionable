import { Component, OnInit } from '@angular/core';
import { ViewChild} from '@angular/core';
//import { NavController, NavParams, Content } from '@ionic/angular';
//import { RoomPage } from '../room/room';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-dm-user',
  templateUrl: './dm-user.page.html',
  styleUrls: ['./dm-user.page.scss'],
})
export class DmUserPage implements OnInit {
  //@ViewChild(Content) content: Content;
  data = { type:'', nickname:'', message:'' };
  messages = [];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;
  constructor() { }

  ngOnInit() {
  }

}

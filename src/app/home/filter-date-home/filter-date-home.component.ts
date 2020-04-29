import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Service } from '../../question.service';

@Component({
  selector: 'app-filter-date-home',
  templateUrl: './filter-date-home.component.html',
  styleUrls: ['./filter-date-home.component.scss'],
})
export class FilterDateHomeComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    public service: Service
    ) { }

  ngOnInit() {}

  setCutoff(cutOff) {
    this.service.publishEvent({
      page: "HomePage",
      sort: cutOff
    });
    this.popoverController.dismiss();
  }
}

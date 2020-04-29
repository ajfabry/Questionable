import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { ComponentsModule } from '../components/components.module';
import { FilterDateHomeComponent } from './filter-date-home/filter-date-home.component';
import { SortHomeComponent } from './sort-home/sort-home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule
  ],
  entryComponents: [FilterDateHomeComponent, SortHomeComponent],
  declarations: [HomePage, FilterDateHomeComponent, SortHomeComponent]
})
export class HomePageModule {}

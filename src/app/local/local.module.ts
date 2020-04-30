import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalPageRoutingModule } from './local-routing.module';

import { ComponentsModule } from '../components/components.module';

import { LocalPage } from './local.page';
import { HomePage } from '../home/home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LocalPage],
  providers: [HomePage]
})
export class LocalPageModule {}

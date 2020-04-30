import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AskQuestionPageRoutingModule } from './ask-question-routing.module';

import { AskQuestionPage } from './ask-question.page';
import { LocalPage } from '../local/local.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AskQuestionPageRoutingModule
  ],
  declarations: [AskQuestionPage],
  providers: [LocalPage]
})
export class AskQuestionPageModule {}

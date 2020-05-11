import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FollowingQuestionsPage } from './following-questions.page';

const routes: Routes = [
  {
    path: '',
    component: FollowingQuestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowingQuestionsPageRoutingModule {}

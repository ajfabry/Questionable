import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'question',
    loadChildren: () => import('./question/question.module').then( m => m.QuestionPageModule)
  },  {
    path: 'dm-menu',
    loadChildren: () => import('./dm-menu/dm-menu.module').then( m => m.DmMenuPageModule)
  },
  {
    path: 'dm-user',
    loadChildren: () => import('./dm-user/dm-user.module').then( m => m.DmUserPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

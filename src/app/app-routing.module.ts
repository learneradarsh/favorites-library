import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyFavoritesComponent } from './my-favorites/my-favorites.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
},
{
  path: 'my-fav',
  component: MyFavoritesComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

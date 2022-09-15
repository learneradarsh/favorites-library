import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MyFavoritesComponent } from './components/my-favorites/my-favorites.component';

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

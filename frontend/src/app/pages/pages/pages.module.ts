import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { PagesRoutes } from "./pages.routing";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forChild(PagesRoutes)],
  declarations: [
    LoginComponent,
    RegisterComponent,
  ]
})
export class PagesModule {}

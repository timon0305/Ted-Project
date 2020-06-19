import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { LockComponent } from "./lock/lock.component";
import { RegisterComponent } from "./register/register.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PagesRoutes } from "./pages.routing";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {ComponentsModule} from '../../components/components.module';
import {ArchwizardModule} from 'angular-archwizard';
import {JwBootstrapSwitchNg2Module} from 'jw-bootstrap-switch-ng2';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ComponentsModule,
      ArchwizardModule,
      JwBootstrapSwitchNg2Module,
      NgbModule,
      AngularMultiSelectModule,
      RouterModule.forChild(PagesRoutes)
  ],
  declarations: [
    LoginComponent,
    LockComponent,
    RegisterComponent,
    PricingComponent,
  ]
})
export class PagesModule {}

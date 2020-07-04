import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentsModule } from "../../components/components.module";

import { DashboardRoutes } from "./dashboard.routing";

import { DashboardComponent } from "./dashboard.component";
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgxDatatableModule,
    RouterModule.forChild(DashboardRoutes),
    ComponentsModule,
    ChartsModule
  ],
  declarations: [DashboardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule {}

import { Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard.component";
import {AuthGuard} from '../../core/auth/guards/auth.guard';

export const DashboardRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      }
    ]
  }
];

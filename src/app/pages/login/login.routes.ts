import { Routes } from "@angular/router";
import { LoginComponent } from "./login.component";
import { LayoutPassportComponent } from "../../layout/layout-passport/layout-passport.component";

export const LOGIN_ROUTES: Routes = [
    {
        path: '',
        component: LayoutPassportComponent,
        children: [
            { path: '', component: LoginComponent }
        ]
    }
]
import { Routes } from "@angular/router";
import { PassportComponent } from "../../layout/passport/passport.component";
import { LoginComponent } from "./login.component";

export const LOGIN_ROUTES: Routes = [
    {
        path: '',
        component: PassportComponent,
        children: [
            { path: '', component: LoginComponent }
        ]
    }
]
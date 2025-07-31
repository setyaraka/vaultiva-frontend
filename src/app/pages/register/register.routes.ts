import { Routes } from "@angular/router";
import { LayoutPassportComponent } from "../../layout/layout-passport/layout-passport.component";
import { RegisterComponent } from "./register.component";

export const REGISTER_ROUTES: Routes = [
    {
        path: '',
        component: LayoutPassportComponent,
        children: [
            { path: '', component: RegisterComponent }
        ]
    }
]
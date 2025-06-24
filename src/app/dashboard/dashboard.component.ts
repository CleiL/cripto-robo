import { Component } from "@angular/core";
import { ToolbarComponent } from "../components/toolbar.component";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-dashboard",
    standalone: true,
    imports: [
        RouterModule,

        ToolbarComponent
    ],
    providers: [],
    template: `
        <main>
            <app-toolbar></app-toolbar>
            <section>
                <router-outlet></router-outlet>
            </section>
        </main>
    `,
    styles: [``],
})

export class DashboardComponent {

}
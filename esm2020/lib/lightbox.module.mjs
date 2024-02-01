import { Lightbox } from './lightbox.service';
import { LightboxComponent, SafePipe } from './lightbox.component';
import { LightboxConfig } from './lightbox-config.service';
import { LightboxEvent, LightboxWindowRef } from './lightbox-event.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class LightboxModule {
}
LightboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
LightboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxModule, declarations: [LightboxOverlayComponent, LightboxComponent, SafePipe], imports: [CommonModule] });
LightboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxModule, providers: [
        Lightbox,
        LightboxConfig,
        LightboxEvent,
        LightboxWindowRef
    ], imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [LightboxOverlayComponent, LightboxComponent, SafePipe],
                    providers: [
                        Lightbox,
                        LightboxConfig,
                        LightboxEvent,
                        LightboxWindowRef
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3gubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWxpZ2h0Ym94L3NyYy9saWIvbGlnaHRib3gubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsUUFBUSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7QUFZN0MsTUFBTSxPQUFPLGNBQWM7OzRHQUFkLGNBQWM7NkdBQWQsY0FBYyxpQkFSUix3QkFBd0IsRUFBRSxpQkFBaUIsRUFBRSxRQUFRLGFBRDFELFlBQVk7NkdBU2IsY0FBYyxhQVBaO1FBQ1AsUUFBUTtRQUNSLGNBQWM7UUFDZCxhQUFhO1FBQ2IsaUJBQWlCO0tBQ3BCLFlBUFEsQ0FBQyxZQUFZLENBQUM7NEZBU2QsY0FBYztrQkFWMUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLHdCQUF3QixFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQztvQkFDckUsU0FBUyxFQUFFO3dCQUNQLFFBQVE7d0JBQ1IsY0FBYzt3QkFDZCxhQUFhO3dCQUNiLGlCQUFpQjtxQkFDcEI7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMaWdodGJveCB9IGZyb20gJy4vbGlnaHRib3guc2VydmljZSc7XHJcbmltcG9ydCB7TGlnaHRib3hDb21wb25lbnQsIFNhZmVQaXBlfSBmcm9tICcuL2xpZ2h0Ym94LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IExpZ2h0Ym94Q29uZmlnIH0gZnJvbSAnLi9saWdodGJveC1jb25maWcuc2VydmljZSc7XHJcbmltcG9ydCB7IExpZ2h0Ym94RXZlbnQsIExpZ2h0Ym94V2luZG93UmVmIH0gZnJvbSAnLi9saWdodGJveC1ldmVudC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGlnaHRib3hPdmVybGF5Q29tcG9uZW50IH0gZnJvbSAnLi9saWdodGJveC1vdmVybGF5LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbTGlnaHRib3hPdmVybGF5Q29tcG9uZW50LCBMaWdodGJveENvbXBvbmVudCwgU2FmZVBpcGVdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgTGlnaHRib3gsXHJcbiAgICAgICAgTGlnaHRib3hDb25maWcsXHJcbiAgICAgICAgTGlnaHRib3hFdmVudCxcclxuICAgICAgICBMaWdodGJveFdpbmRvd1JlZlxyXG4gICAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTGlnaHRib3hNb2R1bGUgeyB9XHJcbiJdfQ==
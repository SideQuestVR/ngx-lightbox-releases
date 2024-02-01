import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export const LIGHTBOX_EVENT = {
    CHANGE_PAGE: 1,
    CLOSE: 2,
    OPEN: 3,
    ZOOM_IN: 4,
    ZOOM_OUT: 5,
    ROTATE_LEFT: 6,
    ROTATE_RIGHT: 7,
    FILE_NOT_FOUND: 8
};
export class LightboxEvent {
    constructor() {
        this._lightboxEventSource = new Subject();
        this.lightboxEvent$ = this._lightboxEventSource.asObservable();
    }
    broadcastLightboxEvent(event) {
        this._lightboxEventSource.next(event);
    }
}
LightboxEvent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxEvent, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LightboxEvent.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxEvent, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxEvent, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
function getWindow() {
    return window;
}
export class LightboxWindowRef {
    get nativeWindow() {
        return getWindow();
    }
}
LightboxWindowRef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxWindowRef, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LightboxWindowRef.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxWindowRef, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxWindowRef, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3gtZXZlbnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1saWdodGJveC9zcmMvbGliL2xpZ2h0Ym94LWV2ZW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUzQyxPQUFPLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQWMxQyxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUc7SUFDNUIsV0FBVyxFQUFFLENBQUM7SUFDZCxLQUFLLEVBQUUsQ0FBQztJQUNSLElBQUksRUFBRSxDQUFDO0lBQ1AsT0FBTyxFQUFFLENBQUM7SUFDVixRQUFRLEVBQUUsQ0FBQztJQUNYLFdBQVcsRUFBRSxDQUFDO0lBQ2QsWUFBWSxFQUFFLENBQUM7SUFDZixjQUFjLEVBQUUsQ0FBQztDQUNsQixDQUFDO0FBS0YsTUFBTSxPQUFPLGFBQWE7SUFHeEI7UUFDRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUNsRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQsc0JBQXNCLENBQUMsS0FBVTtRQUMvQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7OzJHQVZVLGFBQWE7K0dBQWIsYUFBYSxjQUZaLE1BQU07NEZBRVAsYUFBYTtrQkFIekIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7O0FBY0QsU0FBUyxTQUFTO0lBQ2hCLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFLRCxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLElBQUksWUFBWTtRQUNaLE9BQU8sU0FBUyxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7K0dBSFUsaUJBQWlCO21IQUFqQixpQkFBaUIsY0FGaEIsTUFBTTs0RkFFUCxpQkFBaUI7a0JBSDdCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgSW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFdmVudCB7XHJcbiAgaWQ6IG51bWJlcjtcclxuICBkYXRhPzogYW55O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBbGJ1bSB7XHJcbiAgc3JjOiBzdHJpbmc7XHJcbiAgY2FwdGlvbj86IHN0cmluZztcclxuICB0aHVtYjogc3RyaW5nO1xyXG4gIGlmcmFtZT86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBMSUdIVEJPWF9FVkVOVCA9IHtcclxuICBDSEFOR0VfUEFHRTogMSxcclxuICBDTE9TRTogMixcclxuICBPUEVOOiAzLFxyXG4gIFpPT01fSU46IDQsXHJcbiAgWk9PTV9PVVQ6IDUsXHJcbiAgUk9UQVRFX0xFRlQ6IDYsXHJcbiAgUk9UQVRFX1JJR0hUOiA3LFxyXG4gIEZJTEVfTk9UX0ZPVU5EOiA4XHJcbn07XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaWdodGJveEV2ZW50IHtcclxuICBwcml2YXRlIF9saWdodGJveEV2ZW50U291cmNlOiBTdWJqZWN0PE9iamVjdD47XHJcbiAgcHVibGljIGxpZ2h0Ym94RXZlbnQkOiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl9saWdodGJveEV2ZW50U291cmNlID0gbmV3IFN1YmplY3Q8T2JqZWN0PigpO1xyXG4gICAgdGhpcy5saWdodGJveEV2ZW50JCA9IHRoaXMuX2xpZ2h0Ym94RXZlbnRTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBicm9hZGNhc3RMaWdodGJveEV2ZW50KGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuX2xpZ2h0Ym94RXZlbnRTb3VyY2UubmV4dChldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRXaW5kb3cgKCk6IGFueSB7XHJcbiAgcmV0dXJuIHdpbmRvdztcclxufVxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTGlnaHRib3hXaW5kb3dSZWYge1xyXG4gIGdldCBuYXRpdmVXaW5kb3cgKCk6IGFueSB7XHJcbiAgICAgIHJldHVybiBnZXRXaW5kb3coKTtcclxuICB9XHJcbn1cclxuIl19
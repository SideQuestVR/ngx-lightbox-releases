import { Component, HostListener, Inject, Input } from '@angular/core';
import { LIGHTBOX_EVENT } from './lightbox-event.service';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./lightbox-event.service";
export class LightboxOverlayComponent {
    constructor(_elemRef, _rendererRef, _lightboxEvent, _documentRef) {
        this._elemRef = _elemRef;
        this._rendererRef = _rendererRef;
        this._lightboxEvent = _lightboxEvent;
        this._documentRef = _documentRef;
        this.classList = 'lightboxOverlay animation fadeInOverlay';
        this._subscription = this._lightboxEvent.lightboxEvent$.subscribe((event) => this._onReceivedEvent(event));
    }
    close() {
        // broadcast to itself and all others subscriber including the components
        this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CLOSE, data: null });
    }
    ngAfterViewInit() {
        const fadeDuration = this.options.fadeDuration;
        this._rendererRef.setStyle(this._elemRef.nativeElement, '-webkit-animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle(this._elemRef.nativeElement, 'animation-duration', `${fadeDuration}s`);
        this._sizeOverlay();
    }
    onResize() {
        this._sizeOverlay();
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
    _sizeOverlay() {
        const width = this._getOverlayWidth();
        const height = this._getOverlayHeight();
        this._rendererRef.setStyle(this._elemRef.nativeElement, 'width', `${width}px`);
        this._rendererRef.setStyle(this._elemRef.nativeElement, 'height', `${height}px`);
    }
    _onReceivedEvent(event) {
        switch (event.id) {
            case LIGHTBOX_EVENT.CLOSE:
                this._end();
                break;
            default:
                break;
        }
    }
    _end() {
        this.classList = 'lightboxOverlay animation fadeOutOverlay';
        // queue self destruction after the animation has finished
        // FIXME: not sure if there is any way better than this
        setTimeout(() => {
            this.cmpRef.destroy();
        }, this.options.fadeDuration * 1000);
    }
    _getOverlayWidth() {
        return Math.max(this._documentRef.body.scrollWidth, this._documentRef.body.offsetWidth, this._documentRef.documentElement.clientWidth, this._documentRef.documentElement.scrollWidth, this._documentRef.documentElement.offsetWidth);
    }
    _getOverlayHeight() {
        return Math.max(this._documentRef.body.scrollHeight, this._documentRef.body.offsetHeight, this._documentRef.documentElement.clientHeight, this._documentRef.documentElement.scrollHeight, this._documentRef.documentElement.offsetHeight);
    }
}
LightboxOverlayComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxOverlayComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.LightboxEvent }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
LightboxOverlayComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: LightboxOverlayComponent, selector: "[lb-overlay]", inputs: { options: "options", cmpRef: "cmpRef" }, host: { listeners: { "click": "close()", "window:resize": "onResize()" }, properties: { "class": "classList" } }, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxOverlayComponent, decorators: [{
            type: Component,
            args: [{
                    selector: '[lb-overlay]',
                    template: '',
                    host: {
                        '[class]': 'classList'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.LightboxEvent }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { options: [{
                type: Input
            }], cmpRef: [{
                type: Input
            }], close: [{
                type: HostListener,
                args: ['click']
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3gtb3ZlcmxheS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtbGlnaHRib3gvc3JjL2xpYi9saWdodGJveC1vdmVybGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBRUwsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUdOLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBVSxjQUFjLEVBQWlCLE1BQU0sMEJBQTBCLENBQUM7QUFDakYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFTM0MsTUFBTSxPQUFPLHdCQUF3QjtJQUtuQyxZQUNVLFFBQW9CLEVBQ3BCLFlBQXVCLEVBQ3ZCLGNBQTZCLEVBQ1gsWUFBWTtRQUg5QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLGlCQUFZLEdBQVosWUFBWSxDQUFXO1FBQ3ZCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQ1gsaUJBQVksR0FBWixZQUFZLENBQUE7UUFFdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyx5Q0FBeUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDckgsQ0FBQztJQUdNLEtBQUs7UUFDVix5RUFBeUU7UUFDekUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLEVBQUUsRUFBRSxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFTSxlQUFlO1FBQ3BCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBRS9D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QkFBZCxLQUFLO2dCQWNDLEtBQUs7c0JBRFgsWUFBWTt1QkFBQyxPQUFPO2dCQWlCZCxRQUFRO3NCQURkLFlBQVk7dUJBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEhvc3RMaXN0ZW5lcixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIFJlbmRlcmVyMlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgSUV2ZW50LCBMSUdIVEJPWF9FVkVOVCwgTGlnaHRib3hFdmVudCB9IGZyb20gJy4vbGlnaHRib3gtZXZlbnQuc2VydmljZSc7XHJcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnW2xiLW92ZXJsYXldJyxcclxuICB0ZW1wbGF0ZTogJycsXHJcbiAgaG9zdDoge1xyXG4gICAgJ1tjbGFzc10nOiAnY2xhc3NMaXN0J1xyXG4gIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIExpZ2h0Ym94T3ZlcmxheUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XHJcbiAgQElucHV0KCkgb3B0aW9uczogYW55O1xyXG4gIEBJbnB1dCgpIGNtcFJlZjogYW55O1xyXG4gIHB1YmxpYyBjbGFzc0xpc3Q7XHJcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIF9lbGVtUmVmOiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXJSZWY6IFJlbmRlcmVyMixcclxuICAgIHByaXZhdGUgX2xpZ2h0Ym94RXZlbnQ6IExpZ2h0Ym94RXZlbnQsXHJcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudFJlZixcclxuICApIHtcclxuICAgIHRoaXMuY2xhc3NMaXN0ID0gJ2xpZ2h0Ym94T3ZlcmxheSBhbmltYXRpb24gZmFkZUluT3ZlcmxheSc7XHJcbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSB0aGlzLl9saWdodGJveEV2ZW50LmxpZ2h0Ym94RXZlbnQkLnN1YnNjcmliZSgoZXZlbnQ6IElFdmVudCkgPT4gdGhpcy5fb25SZWNlaXZlZEV2ZW50KGV2ZW50KSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXHJcbiAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xyXG4gICAgLy8gYnJvYWRjYXN0IHRvIGl0c2VsZiBhbmQgYWxsIG90aGVycyBzdWJzY3JpYmVyIGluY2x1ZGluZyB0aGUgY29tcG9uZW50c1xyXG4gICAgdGhpcy5fbGlnaHRib3hFdmVudC5icm9hZGNhc3RMaWdodGJveEV2ZW50KHsgaWQ6IExJR0hUQk9YX0VWRU5ULkNMT1NFLCBkYXRhOiBudWxsIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGZhZGVEdXJhdGlvbiA9IHRoaXMub3B0aW9ucy5mYWRlRHVyYXRpb247XHJcblxyXG4gICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fZWxlbVJlZi5uYXRpdmVFbGVtZW50LFxyXG4gICAgICAnLXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb24nLCBgJHtmYWRlRHVyYXRpb259c2ApO1xyXG4gICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fZWxlbVJlZi5uYXRpdmVFbGVtZW50LFxyXG4gICAgICAnYW5pbWF0aW9uLWR1cmF0aW9uJywgYCR7ZmFkZUR1cmF0aW9ufXNgKTtcclxuICAgIHRoaXMuX3NpemVPdmVybGF5KCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcclxuICBwdWJsaWMgb25SZXNpemUoKTogdm9pZCB7XHJcbiAgICB0aGlzLl9zaXplT3ZlcmxheSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9zaXplT3ZlcmxheSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fZ2V0T3ZlcmxheVdpZHRoKCk7XHJcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLl9nZXRPdmVybGF5SGVpZ2h0KCk7XHJcblxyXG4gICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fZWxlbVJlZi5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCBgJHt3aWR0aH1weGApO1xyXG4gICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fZWxlbVJlZi5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgYCR7aGVpZ2h0fXB4YCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9vblJlY2VpdmVkRXZlbnQoZXZlbnQ6IElFdmVudCk6IHZvaWQge1xyXG4gICAgc3dpdGNoIChldmVudC5pZCkge1xyXG4gICAgICBjYXNlIExJR0hUQk9YX0VWRU5ULkNMT1NFOlxyXG4gICAgICAgIHRoaXMuX2VuZCgpO1xyXG4gICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9lbmQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNsYXNzTGlzdCA9ICdsaWdodGJveE92ZXJsYXkgYW5pbWF0aW9uIGZhZGVPdXRPdmVybGF5JztcclxuXHJcbiAgICAvLyBxdWV1ZSBzZWxmIGRlc3RydWN0aW9uIGFmdGVyIHRoZSBhbmltYXRpb24gaGFzIGZpbmlzaGVkXHJcbiAgICAvLyBGSVhNRTogbm90IHN1cmUgaWYgdGhlcmUgaXMgYW55IHdheSBiZXR0ZXIgdGhhbiB0aGlzXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5jbXBSZWYuZGVzdHJveSgpO1xyXG4gICAgfSwgdGhpcy5vcHRpb25zLmZhZGVEdXJhdGlvbiAqIDEwMDApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheVdpZHRoKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5tYXgoXHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmJvZHkuc2Nyb2xsV2lkdGgsXHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmJvZHkub2Zmc2V0V2lkdGgsXHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCxcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoLFxyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5kb2N1bWVudEVsZW1lbnQub2Zmc2V0V2lkdGhcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9nZXRPdmVybGF5SGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5tYXgoXHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmJvZHkuc2Nyb2xsSGVpZ2h0LFxyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5ib2R5Lm9mZnNldEhlaWdodCxcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCxcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCxcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodFxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl19
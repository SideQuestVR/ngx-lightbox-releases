import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class LightboxConfig {
    constructor() {
        this.fadeDuration = 0.7;
        this.resizeDuration = 0.5;
        this.fitImageInViewPort = true;
        this.positionFromTop = 20;
        this.showImageNumberLabel = false;
        this.alwaysShowNavOnTouchDevices = false;
        this.wrapAround = false;
        this.disableKeyboardNav = false;
        this.disableScrolling = false;
        this.centerVertically = false;
        this.enableTransition = true;
        this.albumLabel = 'Image %1 of %2';
        this.showZoom = false;
        this.showRotate = false;
        this.containerElementResolver = (documentRef) => documentRef.querySelector('body');
    }
}
LightboxConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LightboxConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3gtY29uZmlnLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtbGlnaHRib3gvc3JjL2xpYi9saWdodGJveC1jb25maWcuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUkzQyxNQUFNLE9BQU8sY0FBYztJQWlCekI7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUN4QixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUMxQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7UUFDbEMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JGLENBQUM7OzRHQWpDVSxjQUFjO2dIQUFkLGNBQWMsY0FGYixNQUFNOzRGQUVQLGNBQWM7a0JBSDFCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaWdodGJveENvbmZpZyB7XHJcbiAgcHVibGljIGZhZGVEdXJhdGlvbjogbnVtYmVyO1xyXG4gIHB1YmxpYyByZXNpemVEdXJhdGlvbjogbnVtYmVyO1xyXG4gIHB1YmxpYyBmaXRJbWFnZUluVmlld1BvcnQ6IGJvb2xlYW47XHJcbiAgcHVibGljIHBvc2l0aW9uRnJvbVRvcDogbnVtYmVyO1xyXG4gIHB1YmxpYyBzaG93SW1hZ2VOdW1iZXJMYWJlbDogYm9vbGVhbjtcclxuICBwdWJsaWMgYWx3YXlzU2hvd05hdk9uVG91Y2hEZXZpY2VzOiBib29sZWFuO1xyXG4gIHB1YmxpYyB3cmFwQXJvdW5kOiBib29sZWFuO1xyXG4gIHB1YmxpYyBkaXNhYmxlS2V5Ym9hcmROYXY6IGJvb2xlYW47XHJcbiAgcHVibGljIGRpc2FibGVTY3JvbGxpbmc6IGJvb2xlYW47XHJcbiAgcHVibGljIGNlbnRlclZlcnRpY2FsbHk6IGJvb2xlYW47XHJcbiAgcHVibGljIGVuYWJsZVRyYW5zaXRpb246IGJvb2xlYW47XHJcbiAgcHVibGljIGFsYnVtTGFiZWw6IHN0cmluZztcclxuICBwdWJsaWMgc2hvd1pvb206IGJvb2xlYW47XHJcbiAgcHVibGljIHNob3dSb3RhdGU6IGJvb2xlYW47XHJcbiAgcHVibGljIGNvbnRhaW5lckVsZW1lbnRSZXNvbHZlcjogKGRvY3VtZW50OiBhbnkpID0+IEhUTUxFbGVtZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZmFkZUR1cmF0aW9uID0gMC43O1xyXG4gICAgdGhpcy5yZXNpemVEdXJhdGlvbiA9IDAuNTtcclxuICAgIHRoaXMuZml0SW1hZ2VJblZpZXdQb3J0ID0gdHJ1ZTtcclxuICAgIHRoaXMucG9zaXRpb25Gcm9tVG9wID0gMjA7XHJcbiAgICB0aGlzLnNob3dJbWFnZU51bWJlckxhYmVsID0gZmFsc2U7XHJcbiAgICB0aGlzLmFsd2F5c1Nob3dOYXZPblRvdWNoRGV2aWNlcyA9IGZhbHNlO1xyXG4gICAgdGhpcy53cmFwQXJvdW5kID0gZmFsc2U7XHJcbiAgICB0aGlzLmRpc2FibGVLZXlib2FyZE5hdiA9IGZhbHNlO1xyXG4gICAgdGhpcy5kaXNhYmxlU2Nyb2xsaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmNlbnRlclZlcnRpY2FsbHkgPSBmYWxzZTtcclxuICAgIHRoaXMuZW5hYmxlVHJhbnNpdGlvbiA9IHRydWU7XHJcbiAgICB0aGlzLmFsYnVtTGFiZWwgPSAnSW1hZ2UgJTEgb2YgJTInO1xyXG4gICAgdGhpcy5zaG93Wm9vbSA9IGZhbHNlO1xyXG4gICAgdGhpcy5zaG93Um90YXRlID0gZmFsc2U7XHJcbiAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnRSZXNvbHZlciA9IChkb2N1bWVudFJlZikgPT4gZG9jdW1lbnRSZWYucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG4gIH1cclxufVxyXG4iXX0=
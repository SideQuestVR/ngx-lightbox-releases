import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Input, Pipe, SecurityContext, ViewChild, } from '@angular/core';
import { LIGHTBOX_EVENT } from './lightbox-event.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "./lightbox-event.service";
import * as i3 from "@angular/common";
export class SafePipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
SafePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SafePipe, deps: [{ token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Pipe });
SafePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SafePipe, name: "safe" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SafePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'safe' }]
        }], ctorParameters: function () { return [{ type: i1.DomSanitizer }]; } });
export class LightboxComponent {
    constructor(_elemRef, _rendererRef, _lightboxEvent, _lightboxElem, _lightboxWindowRef, _sanitizer, _documentRef) {
        this._elemRef = _elemRef;
        this._rendererRef = _rendererRef;
        this._lightboxEvent = _lightboxEvent;
        this._lightboxElem = _lightboxElem;
        this._lightboxWindowRef = _lightboxWindowRef;
        this._sanitizer = _sanitizer;
        this._documentRef = _documentRef;
        // initialize data
        this.options = this.options || {};
        this.album = this.album || [];
        this.currentImageIndex = this.currentImageIndex || 0;
        this._windowRef = this._lightboxWindowRef.nativeWindow;
        // control the interactive of the directive
        this.ui = {
            // control the appear of the reloader
            // false: image has loaded completely and ready to be shown
            // true: image is still loading
            showReloader: true,
            // control the appear of the nav arrow
            // the arrowNav is the parent of both left and right arrow
            // in some cases, the parent shows but the child does not show
            showLeftArrow: false,
            showRightArrow: false,
            showArrowNav: false,
            // control the appear of the zoom and rotate buttons
            showZoomButton: false,
            showRotateButton: false,
            // control whether to show the
            // page number or not
            showPageNumber: false,
            showCaption: false,
            classList: 'lightbox animation fadeIn'
        };
        this.content = {
            pageNumber: ''
        };
        this._event = {};
        this._lightboxElem = this._elemRef;
        this._event.subscription = this._lightboxEvent.lightboxEvent$
            .subscribe((event) => this._onReceivedEvent(event));
        this.rotate = 0;
    }
    ngOnInit() {
        this.album.forEach(album => {
            if (album.caption) {
                album.caption = this._sanitizer.sanitize(SecurityContext.HTML, album.caption);
            }
        });
    }
    ngAfterViewInit() {
        // need to init css value here, after the view ready
        // actually these values are always 0
        this._cssValue = {
            containerTopPadding: Math.round(this._getCssStyleValue(this._containerElem, 'padding-top')),
            containerRightPadding: Math.round(this._getCssStyleValue(this._containerElem, 'padding-right')),
            containerBottomPadding: Math.round(this._getCssStyleValue(this._containerElem, 'padding-bottom')),
            containerLeftPadding: Math.round(this._getCssStyleValue(this._containerElem, 'padding-left')),
            imageBorderWidthTop: Math.round(this._getCssStyleValue(this._imageElem || this._iframeElem, 'border-top-width')),
            imageBorderWidthBottom: Math.round(this._getCssStyleValue(this._imageElem || this._iframeElem, 'border-bottom-width')),
            imageBorderWidthLeft: Math.round(this._getCssStyleValue(this._imageElem || this._iframeElem, 'border-left-width')),
            imageBorderWidthRight: Math.round(this._getCssStyleValue(this._imageElem || this._iframeElem, 'border-right-width'))
        };
        if (this._validateInputData()) {
            this._prepareComponent();
            this._registerImageLoadingEvent();
        }
    }
    ngOnDestroy() {
        if (!this.options.disableKeyboardNav) {
            // unbind keyboard event
            this._disableKeyboardNav();
        }
        this._event.subscription.unsubscribe();
    }
    close($event) {
        $event.stopPropagation();
        if ($event.target.classList.contains('lightbox') ||
            $event.target.classList.contains('lb-loader') ||
            $event.target.classList.contains('lb-close')) {
            this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CLOSE, data: null });
        }
    }
    control($event) {
        $event.stopPropagation();
        let height;
        let width;
        if ($event.target.classList.contains('lb-turnLeft')) {
            this.rotate = this.rotate - 90;
            this._rotateContainer();
            this._calcTransformPoint();
            this._documentRef.getElementById('image').style.transform = `rotate(${this.rotate}deg)`;
            this._documentRef.getElementById('image').style.webkitTransform = `rotate(${this.rotate}deg)`;
            this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.ROTATE_LEFT, data: null });
        }
        else if ($event.target.classList.contains('lb-turnRight')) {
            this.rotate = this.rotate + 90;
            this._rotateContainer();
            this._calcTransformPoint();
            this._documentRef.getElementById('image').style.transform = `rotate(${this.rotate}deg)`;
            this._documentRef.getElementById('image').style.webkitTransform = `rotate(${this.rotate}deg)`;
            this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.ROTATE_RIGHT, data: null });
        }
        else if ($event.target.classList.contains('lb-zoomOut')) {
            height = parseInt(this._documentRef.getElementById('outerContainer').style.height, 10) / 1.5;
            width = parseInt(this._documentRef.getElementById('outerContainer').style.width, 10) / 1.5;
            this._documentRef.getElementById('outerContainer').style.height = height + 'px';
            this._documentRef.getElementById('outerContainer').style.width = width + 'px';
            height = parseInt(this._documentRef.getElementById('image').style.height, 10) / 1.5;
            width = parseInt(this._documentRef.getElementById('image').style.width, 10) / 1.5;
            this._documentRef.getElementById('image').style.height = height + 'px';
            this._documentRef.getElementById('image').style.width = width + 'px';
            this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.ZOOM_OUT, data: null });
        }
        else if ($event.target.classList.contains('lb-zoomIn')) {
            height = parseInt(this._documentRef.getElementById('outerContainer').style.height, 10) * 1.5;
            width = parseInt(this._documentRef.getElementById('outerContainer').style.width, 10) * 1.5;
            this._documentRef.getElementById('outerContainer').style.height = height + 'px';
            this._documentRef.getElementById('outerContainer').style.width = width + 'px';
            height = parseInt(this._documentRef.getElementById('image').style.height, 10) * 1.5;
            width = parseInt(this._documentRef.getElementById('image').style.width, 10) * 1.5;
            this._documentRef.getElementById('image').style.height = height + 'px';
            this._documentRef.getElementById('image').style.width = width + 'px';
            this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.ZOOM_IN, data: null });
        }
    }
    _rotateContainer() {
        let temp = this.rotate;
        if (temp < 0) {
            temp *= -1;
        }
        if (temp / 90 % 4 === 1 || temp / 90 % 4 === 3) {
            this._documentRef.getElementById('outerContainer').style.height = this._documentRef.getElementById('image').style.width;
            this._documentRef.getElementById('outerContainer').style.width = this._documentRef.getElementById('image').style.height;
            this._documentRef.getElementById('container').style.height = this._documentRef.getElementById('image').style.width;
            this._documentRef.getElementById('container').style.width = this._documentRef.getElementById('image').style.height;
        }
        else {
            this._documentRef.getElementById('outerContainer').style.height = this._documentRef.getElementById('image').style.height;
            this._documentRef.getElementById('outerContainer').style.width = this._documentRef.getElementById('image').style.width;
            this._documentRef.getElementById('container').style.height = this._documentRef.getElementById('image').style.width;
            this._documentRef.getElementById('container').style.width = this._documentRef.getElementById('image').style.height;
        }
    }
    _resetImage() {
        this.rotate = 0;
        const image = this._documentRef.getElementById('image');
        if (image) {
            image.style.transform = `rotate(${this.rotate}deg)`;
            image.style.webkitTransform = `rotate(${this.rotate}deg)`;
        }
    }
    _calcTransformPoint() {
        let height = parseInt(this._documentRef.getElementById('image').style.height, 10);
        let width = parseInt(this._documentRef.getElementById('image').style.width, 10);
        let temp = this.rotate % 360;
        if (temp < 0) {
            temp = 360 + temp;
        }
        if (temp === 90) {
            this._documentRef.getElementById('image').style.transformOrigin = (height / 2) + 'px ' + (height / 2) + 'px';
        }
        else if (temp === 180) {
            this._documentRef.getElementById('image').style.transformOrigin = (width / 2) + 'px ' + (height / 2) + 'px';
        }
        else if (temp === 270) {
            this._documentRef.getElementById('image').style.transformOrigin = (width / 2) + 'px ' + (width / 2) + 'px';
        }
    }
    nextImage() {
        if (this.album.length === 1) {
            return;
        }
        else if (this.currentImageIndex === this.album.length - 1) {
            this._changeImage(0);
        }
        else {
            this._changeImage(this.currentImageIndex + 1);
        }
    }
    prevImage() {
        if (this.album.length === 1) {
            return;
        }
        else if (this.currentImageIndex === 0 && this.album.length > 1) {
            this._changeImage(this.album.length - 1);
        }
        else {
            this._changeImage(this.currentImageIndex - 1);
        }
    }
    _validateInputData() {
        if (this.album &&
            this.album instanceof Array &&
            this.album.length > 0) {
            for (let i = 0; i < this.album.length; i++) {
                // check whether each _nside
                // album has src data or not
                if (this.album[i].src) {
                    continue;
                }
                throw new Error('One of the album data does not have source data');
            }
        }
        else {
            throw new Error('No album data or album data is not correct in type');
        }
        // to prevent data understand as string
        // convert it to number
        if (isNaN(this.currentImageIndex)) {
            throw new Error('Current image index is not a number');
        }
        else {
            this.currentImageIndex = Number(this.currentImageIndex);
        }
        return true;
    }
    _registerImageLoadingEvent() {
        const src = this.album[this.currentImageIndex].src;
        if (this.album[this.currentImageIndex].iframe || this.needsIframe(src)) {
            setTimeout(() => {
                this._onLoadImageSuccess();
            });
            return;
        }
        const preloader = new Image();
        preloader.onload = () => {
            this._onLoadImageSuccess();
        };
        preloader.onerror = (e) => {
            this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.FILE_NOT_FOUND, data: e });
        };
        preloader.src = this._sanitizer.sanitize(SecurityContext.URL, src);
    }
    /**
     * Fire when the image is loaded
     */
    _onLoadImageSuccess() {
        if (!this.options.disableKeyboardNav) {
            // unbind keyboard event during transition
            this._disableKeyboardNav();
        }
        let imageHeight;
        let imageWidth;
        let maxImageHeight;
        let maxImageWidth;
        let windowHeight;
        let windowWidth;
        let naturalImageWidth;
        let naturalImageHeight;
        // set default width and height of image to be its natural
        imageWidth = naturalImageWidth = this._imageElem ? this._imageElem.nativeElement.naturalWidth : this._windowRef.innerWidth * .8;
        imageHeight = naturalImageHeight = this._imageElem ? this._imageElem.nativeElement.naturalHeight : this._windowRef.innerHeight * .8;
        if (this.options.fitImageInViewPort) {
            windowWidth = this._windowRef.innerWidth;
            windowHeight = this._windowRef.innerHeight;
            maxImageWidth = windowWidth - this._cssValue.containerLeftPadding -
                this._cssValue.containerRightPadding - this._cssValue.imageBorderWidthLeft -
                this._cssValue.imageBorderWidthRight - 20;
            maxImageHeight = windowHeight - this._cssValue.containerTopPadding -
                this._cssValue.containerTopPadding - this._cssValue.imageBorderWidthTop -
                this._cssValue.imageBorderWidthBottom - 120;
            if (naturalImageWidth > maxImageWidth || naturalImageHeight > maxImageHeight) {
                if ((naturalImageWidth / maxImageWidth) > (naturalImageHeight / maxImageHeight)) {
                    imageWidth = maxImageWidth;
                    imageHeight = Math.round(naturalImageHeight / (naturalImageWidth / imageWidth));
                }
                else {
                    imageHeight = maxImageHeight;
                    imageWidth = Math.round(naturalImageWidth / (naturalImageHeight / imageHeight));
                }
            }
            this._rendererRef.setStyle((this._imageElem || this._iframeElem).nativeElement, 'width', `${imageWidth}px`);
            this._rendererRef.setStyle((this._imageElem || this._iframeElem).nativeElement, 'height', `${imageHeight}px`);
        }
        this._sizeContainer(imageWidth, imageHeight);
        if (this.options.centerVertically) {
            this._centerVertically(imageWidth, imageHeight);
        }
    }
    _centerVertically(imageWidth, imageHeight) {
        const scrollOffset = this._documentRef.documentElement.scrollTop;
        const windowHeight = this._windowRef.innerHeight;
        const viewOffset = windowHeight / 2 - imageHeight / 2;
        const topDistance = scrollOffset + viewOffset;
        this._rendererRef.setStyle(this._lightboxElem.nativeElement, 'top', `${topDistance}px`);
    }
    _sizeContainer(imageWidth, imageHeight) {
        const oldWidth = this._outerContainerElem.nativeElement.offsetWidth;
        const oldHeight = this._outerContainerElem.nativeElement.offsetHeight;
        const newWidth = imageWidth + this._cssValue.containerRightPadding + this._cssValue.containerLeftPadding +
            this._cssValue.imageBorderWidthLeft + this._cssValue.imageBorderWidthRight;
        const newHeight = imageHeight + this._cssValue.containerTopPadding + this._cssValue.containerBottomPadding +
            this._cssValue.imageBorderWidthTop + this._cssValue.imageBorderWidthBottom;
        // make sure that distances are large enough for transitionend event to be fired, at least 5px.
        if (Math.abs(oldWidth - newWidth) + Math.abs(oldHeight - newHeight) > 5) {
            this._rendererRef.setStyle(this._outerContainerElem.nativeElement, 'width', `${newWidth}px`);
            this._rendererRef.setStyle(this._outerContainerElem.nativeElement, 'height', `${newHeight}px`);
            // bind resize event to outer container
            // use enableTransition to prevent infinite loader
            if (this.options.enableTransition) {
                this._event.transitions = [];
                ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd'].forEach(eventName => {
                    this._event.transitions.push(this._rendererRef.listen(this._outerContainerElem.nativeElement, eventName, (event) => {
                        if (event.target === event.currentTarget) {
                            this._postResize(newWidth, newHeight);
                        }
                    }));
                });
            }
            else {
                this._postResize(newWidth, newHeight);
            }
        }
        else {
            this._postResize(newWidth, newHeight);
        }
    }
    _postResize(newWidth, newHeight) {
        // unbind resize event
        if (Array.isArray(this._event.transitions)) {
            this._event.transitions.forEach((eventHandler) => {
                eventHandler();
            });
            this._event.transitions = [];
        }
        this._rendererRef.setStyle(this._dataContainerElem.nativeElement, 'width', `${newWidth}px`);
        this._showImage();
    }
    _showImage() {
        this.ui.showReloader = false;
        this._updateNav();
        this._updateDetails();
        if (!this.options.disableKeyboardNav) {
            this._enableKeyboardNav();
        }
    }
    _prepareComponent() {
        // add css3 animation
        this._addCssAnimation();
        // position the image according to user's option
        this._positionLightBox();
        // update controls visibility on next view generation
        setTimeout(() => {
            this.ui.showZoomButton = this.options.showZoom;
            this.ui.showRotateButton = this.options.showRotate;
        }, 0);
    }
    _positionLightBox() {
        // @see https://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
        const top = (this._windowRef.pageYOffset || this._documentRef.documentElement.scrollTop) +
            this.options.positionFromTop;
        const left = this._windowRef.pageXOffset || this._documentRef.documentElement.scrollLeft;
        if (!this.options.centerVertically) {
            this._rendererRef.setStyle(this._lightboxElem.nativeElement, 'top', `${top}px`);
        }
        this._rendererRef.setStyle(this._lightboxElem.nativeElement, 'left', `${left}px`);
        this._rendererRef.setStyle(this._lightboxElem.nativeElement, 'display', 'block');
        // disable scrolling of the page while open
        if (this.options.disableScrolling) {
            this._rendererRef.addClass(this._documentRef.documentElement, 'lb-disable-scrolling');
        }
    }
    /**
     * addCssAnimation add css3 classes for animate lightbox
     */
    _addCssAnimation() {
        const resizeDuration = this.options.resizeDuration;
        const fadeDuration = this.options.fadeDuration;
        this._rendererRef.setStyle(this._lightboxElem.nativeElement, '-webkit-animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle(this._lightboxElem.nativeElement, 'animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle(this._outerContainerElem.nativeElement, '-webkit-transition-duration', `${resizeDuration}s`);
        this._rendererRef.setStyle(this._outerContainerElem.nativeElement, 'transition-duration', `${resizeDuration}s`);
        this._rendererRef.setStyle(this._dataContainerElem.nativeElement, '-webkit-animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle(this._dataContainerElem.nativeElement, 'animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle((this._imageElem || this._iframeElem).nativeElement, '-webkit-animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle((this._imageElem || this._iframeElem).nativeElement, 'animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle(this._captionElem.nativeElement, '-webkit-animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle(this._captionElem.nativeElement, 'animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle(this._numberElem.nativeElement, '-webkit-animation-duration', `${fadeDuration}s`);
        this._rendererRef.setStyle(this._numberElem.nativeElement, 'animation-duration', `${fadeDuration}s`);
    }
    _end() {
        this.ui.classList = 'lightbox animation fadeOut';
        if (this.options.disableScrolling) {
            this._rendererRef.removeClass(this._documentRef.documentElement, 'lb-disable-scrolling');
        }
        setTimeout(() => {
            this.cmpRef.destroy();
        }, this.options.fadeDuration * 1000);
    }
    _updateDetails() {
        // update the caption
        if (typeof this.album[this.currentImageIndex].caption !== 'undefined' &&
            this.album[this.currentImageIndex].caption !== '') {
            this.ui.showCaption = true;
        }
        // update the page number if user choose to do so
        // does not perform numbering the page if the
        // array length in album <= 1
        if (this.album.length > 1 && this.options.showImageNumberLabel) {
            this.ui.showPageNumber = true;
            this.content.pageNumber = this._albumLabel();
        }
    }
    _albumLabel() {
        // due to {this.currentImageIndex} is set from 0 to {this.album.length} - 1
        return this.options.albumLabel.replace(/%1/g, Number(this.currentImageIndex + 1)).replace(/%2/g, this.album.length);
    }
    _changeImage(newIndex) {
        this._resetImage();
        this.currentImageIndex = newIndex;
        this._hideImage();
        this._registerImageLoadingEvent();
        this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CHANGE_PAGE, data: newIndex });
    }
    _hideImage() {
        this.ui.showReloader = true;
        this.ui.showArrowNav = false;
        this.ui.showLeftArrow = false;
        this.ui.showRightArrow = false;
        this.ui.showPageNumber = false;
        this.ui.showCaption = false;
    }
    _updateNav() {
        let alwaysShowNav = false;
        // check to see the browser support touch event
        try {
            this._documentRef.createEvent('TouchEvent');
            alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices) ? true : false;
        }
        catch (e) {
            // noop
        }
        // initially show the arrow nav
        // which is the parent of both left and right nav
        this._showArrowNav();
        if (this.album.length > 1) {
            if (this.options.wrapAround) {
                if (alwaysShowNav) {
                    // alternatives this.$lightbox.find('.lb-prev, .lb-next').css('opacity', '1');
                    this._rendererRef.setStyle(this._leftArrowElem.nativeElement, 'opacity', '1');
                    this._rendererRef.setStyle(this._rightArrowElem.nativeElement, 'opacity', '1');
                }
                // alternatives this.$lightbox.find('.lb-prev, .lb-next').show();
                this._showLeftArrowNav();
                this._showRightArrowNav();
            }
            else {
                if (this.currentImageIndex > 0) {
                    // alternatives this.$lightbox.find('.lb-prev').show();
                    this._showLeftArrowNav();
                    if (alwaysShowNav) {
                        // alternatives this.$lightbox.find('.lb-prev').css('opacity', '1');
                        this._rendererRef.setStyle(this._leftArrowElem.nativeElement, 'opacity', '1');
                    }
                }
                if (this.currentImageIndex < this.album.length - 1) {
                    // alternatives this.$lightbox.find('.lb-next').show();
                    this._showRightArrowNav();
                    if (alwaysShowNav) {
                        // alternatives this.$lightbox.find('.lb-next').css('opacity', '1');
                        this._rendererRef.setStyle(this._rightArrowElem.nativeElement, 'opacity', '1');
                    }
                }
            }
        }
    }
    _showLeftArrowNav() {
        this.ui.showLeftArrow = true;
    }
    _showRightArrowNav() {
        this.ui.showRightArrow = true;
    }
    _showArrowNav() {
        this.ui.showArrowNav = (this.album.length !== 1);
    }
    _enableKeyboardNav() {
        this._event.keyup = this._rendererRef.listen('document', 'keyup', (event) => {
            this._keyboardAction(event);
        });
    }
    _disableKeyboardNav() {
        if (this._event.keyup) {
            this._event.keyup();
        }
    }
    _keyboardAction($event) {
        const KEYCODE_ESC = 27;
        const KEYCODE_LEFTARROW = 37;
        const KEYCODE_RIGHTARROW = 39;
        const keycode = $event.keyCode;
        const key = String.fromCharCode(keycode).toLowerCase();
        if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
            this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CLOSE, data: null });
        }
        else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
            if (this.currentImageIndex !== 0) {
                this._changeImage(this.currentImageIndex - 1);
            }
            else if (this.options.wrapAround && this.album.length > 1) {
                this._changeImage(this.album.length - 1);
            }
        }
        else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
            if (this.currentImageIndex !== this.album.length - 1) {
                this._changeImage(this.currentImageIndex + 1);
            }
            else if (this.options.wrapAround && this.album.length > 1) {
                this._changeImage(0);
            }
        }
    }
    _getCssStyleValue(elem, propertyName) {
        return parseFloat(this._windowRef
            .getComputedStyle(elem.nativeElement, null)
            .getPropertyValue(propertyName));
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
    needsIframe(src) {
        // const sanitizedUrl = this._sanitizer.sanitize(SecurityContext.URL, src);
        if (src.match(/\.pdf$/)) {
            return true;
        }
        return false;
    }
}
LightboxComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i2.LightboxEvent }, { token: i0.ElementRef }, { token: i2.LightboxWindowRef }, { token: i1.DomSanitizer }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
LightboxComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: LightboxComponent, selector: "[lb-content]", inputs: { album: "album", currentImageIndex: "currentImageIndex", options: "options", cmpRef: "cmpRef" }, host: { listeners: { "close": "close($event)" }, properties: { "class": "ui.classList" } }, viewQueries: [{ propertyName: "_outerContainerElem", first: true, predicate: ["outerContainer"], descendants: true }, { propertyName: "_containerElem", first: true, predicate: ["container"], descendants: true }, { propertyName: "_leftArrowElem", first: true, predicate: ["leftArrow"], descendants: true }, { propertyName: "_rightArrowElem", first: true, predicate: ["rightArrow"], descendants: true }, { propertyName: "_navArrowElem", first: true, predicate: ["navArrow"], descendants: true }, { propertyName: "_dataContainerElem", first: true, predicate: ["dataContainer"], descendants: true }, { propertyName: "_imageElem", first: true, predicate: ["image"], descendants: true }, { propertyName: "_iframeElem", first: true, predicate: ["iframe"], descendants: true }, { propertyName: "_captionElem", first: true, predicate: ["caption"], descendants: true }, { propertyName: "_numberElem", first: true, predicate: ["number"], descendants: true }], ngImport: i0, template: "<div class=\"lb-outerContainer transition\" #outerContainer id=\"outerContainer\">\r\n    <div class=\"lb-container\" #container id=\"container\">\r\n        <img class=\"lb-image\" id=\"image\" [src]=\"album[currentImageIndex].src\" class=\"lb-image animation fadeIn\"\r\n            [hidden]=\"ui.showReloader\" #image\r\n            *ngIf=\"!album[currentImageIndex].iframe && !needsIframe(album[currentImageIndex].src)\">\r\n        <iframe class=\"lb-image\" id=\"iframe\" [src]=\"album[currentImageIndex].src | safe\"\r\n            class=\"lb-image lb-iframe animation fadeIn\" [hidden]=\"ui.showReloader\" #iframe\r\n            *ngIf=\"album[currentImageIndex].iframe || needsIframe(album[currentImageIndex].src)\">\r\n        </iframe>\r\n        <div class=\"lb-nav\" [hidden]=\"!ui.showArrowNav\" #navArrow>\r\n            <a class=\"lb-prev\" [hidden]=\"!ui.showLeftArrow\" (click)=\"prevImage()\" #leftArrow></a>\r\n            <a class=\"lb-next\" [hidden]=\"!ui.showRightArrow\" (click)=\"nextImage()\" #rightArrow></a>\r\n        </div>\r\n        <div class=\"lb-loader\" [hidden]=\"!ui.showReloader\" (click)=\"close($event)\">\r\n            <a class=\"lb-cancel\"></a>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"lb-dataContainer\" [hidden]=\"ui.showReloader\" #dataContainer>\r\n    <div class=\"lb-data\">\r\n        <div class=\"lb-details\">\r\n            <span class=\"lb-caption animation fadeIn\" [hidden]=\"!ui.showCaption\"\r\n                [innerHtml]=\"album[currentImageIndex].caption\" #caption>\r\n            </span>\r\n            <span class=\"lb-number animation fadeIn\" [hidden]=\"!ui.showPageNumber\" #number>{{ content.pageNumber\r\n                }}</span>\r\n        </div>\r\n        <div class=\"lb-controlContainer\">\r\n            <div class=\"lb-closeContainer\">\r\n                <a class=\"lb-close\" (click)=\"close($event)\"></a>\r\n            </div>\r\n            <div class=\"lb-turnContainer\" [hidden]=\"!ui.showRotateButton\">\r\n                <a class=\"lb-turnLeft\" (click)=\"control($event)\"></a>\r\n                <a class=\"lb-turnRight\" (click)=\"control($event)\"></a>\r\n            </div>\r\n            <div class=\"lb-zoomContainer\" [hidden]=\"!ui.showZoomButton\">\r\n                <a class=\"lb-zoomOut\" (click)=\"control($event)\"></a>\r\n                <a class=\"lb-zoomIn\" (click)=\"control($event)\"></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>", directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "safe": SafePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: LightboxComponent, decorators: [{
            type: Component,
            args: [{ selector: '[lb-content]', host: {
                        '[class]': 'ui.classList'
                    }, template: "<div class=\"lb-outerContainer transition\" #outerContainer id=\"outerContainer\">\r\n    <div class=\"lb-container\" #container id=\"container\">\r\n        <img class=\"lb-image\" id=\"image\" [src]=\"album[currentImageIndex].src\" class=\"lb-image animation fadeIn\"\r\n            [hidden]=\"ui.showReloader\" #image\r\n            *ngIf=\"!album[currentImageIndex].iframe && !needsIframe(album[currentImageIndex].src)\">\r\n        <iframe class=\"lb-image\" id=\"iframe\" [src]=\"album[currentImageIndex].src | safe\"\r\n            class=\"lb-image lb-iframe animation fadeIn\" [hidden]=\"ui.showReloader\" #iframe\r\n            *ngIf=\"album[currentImageIndex].iframe || needsIframe(album[currentImageIndex].src)\">\r\n        </iframe>\r\n        <div class=\"lb-nav\" [hidden]=\"!ui.showArrowNav\" #navArrow>\r\n            <a class=\"lb-prev\" [hidden]=\"!ui.showLeftArrow\" (click)=\"prevImage()\" #leftArrow></a>\r\n            <a class=\"lb-next\" [hidden]=\"!ui.showRightArrow\" (click)=\"nextImage()\" #rightArrow></a>\r\n        </div>\r\n        <div class=\"lb-loader\" [hidden]=\"!ui.showReloader\" (click)=\"close($event)\">\r\n            <a class=\"lb-cancel\"></a>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"lb-dataContainer\" [hidden]=\"ui.showReloader\" #dataContainer>\r\n    <div class=\"lb-data\">\r\n        <div class=\"lb-details\">\r\n            <span class=\"lb-caption animation fadeIn\" [hidden]=\"!ui.showCaption\"\r\n                [innerHtml]=\"album[currentImageIndex].caption\" #caption>\r\n            </span>\r\n            <span class=\"lb-number animation fadeIn\" [hidden]=\"!ui.showPageNumber\" #number>{{ content.pageNumber\r\n                }}</span>\r\n        </div>\r\n        <div class=\"lb-controlContainer\">\r\n            <div class=\"lb-closeContainer\">\r\n                <a class=\"lb-close\" (click)=\"close($event)\"></a>\r\n            </div>\r\n            <div class=\"lb-turnContainer\" [hidden]=\"!ui.showRotateButton\">\r\n                <a class=\"lb-turnLeft\" (click)=\"control($event)\"></a>\r\n                <a class=\"lb-turnRight\" (click)=\"control($event)\"></a>\r\n            </div>\r\n            <div class=\"lb-zoomContainer\" [hidden]=\"!ui.showZoomButton\">\r\n                <a class=\"lb-zoomOut\" (click)=\"control($event)\"></a>\r\n                <a class=\"lb-zoomIn\" (click)=\"control($event)\"></a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i2.LightboxEvent }, { type: i0.ElementRef }, { type: i2.LightboxWindowRef }, { type: i1.DomSanitizer }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { album: [{
                type: Input
            }], currentImageIndex: [{
                type: Input
            }], options: [{
                type: Input
            }], cmpRef: [{
                type: Input
            }], _outerContainerElem: [{
                type: ViewChild,
                args: ['outerContainer']
            }], _containerElem: [{
                type: ViewChild,
                args: ['container']
            }], _leftArrowElem: [{
                type: ViewChild,
                args: ['leftArrow']
            }], _rightArrowElem: [{
                type: ViewChild,
                args: ['rightArrow']
            }], _navArrowElem: [{
                type: ViewChild,
                args: ['navArrow']
            }], _dataContainerElem: [{
                type: ViewChild,
                args: ['dataContainer']
            }], _imageElem: [{
                type: ViewChild,
                args: ['image']
            }], _iframeElem: [{
                type: ViewChild,
                args: ['iframe']
            }], _captionElem: [{
                type: ViewChild,
                args: ['caption']
            }], _numberElem: [{
                type: ViewChild,
                args: ['number']
            }], close: [{
                type: HostListener,
                args: ['close', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWxpZ2h0Ym94L3NyYy9saWIvbGlnaHRib3guY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWxpZ2h0Ym94L3NyYy9saWIvbGlnaHRib3guY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxTQUFTLEVBRVQsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUcsSUFBSSxFQUVaLGVBQWUsRUFDZixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFpQixjQUFjLEVBQW1DLE1BQU0sMEJBQTBCLENBQUM7Ozs7O0FBRzFHLE1BQU0sT0FBTyxRQUFRO0lBQ25CLFlBQW9CLFNBQXVCO1FBQXZCLGNBQVMsR0FBVCxTQUFTLENBQWM7SUFBRyxDQUFDO0lBQy9DLFNBQVMsQ0FBQyxHQUFHO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVELENBQUM7O3NHQUpVLFFBQVE7b0dBQVIsUUFBUTs0RkFBUixRQUFRO2tCQURwQixJQUFJO21CQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTs7QUFldEIsTUFBTSxPQUFPLGlCQUFpQjtJQXFCNUIsWUFDVSxRQUFvQixFQUNwQixZQUF1QixFQUN2QixjQUE2QixFQUM5QixhQUF5QixFQUN4QixrQkFBcUMsRUFDckMsVUFBd0IsRUFDTixZQUFZO1FBTjlCLGFBQVEsR0FBUixRQUFRLENBQVk7UUFDcEIsaUJBQVksR0FBWixZQUFZLENBQVc7UUFDdkIsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDOUIsa0JBQWEsR0FBYixhQUFhLENBQVk7UUFDeEIsdUJBQWtCLEdBQWxC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QyxVQUFVO2dCQUNPLGtCQUFrQjtzQkFBN0MsU0FBUzt1QkFBQyxlQUFlO2dCQUNOLFVBQVU7c0JBQTdCLFNBQVM7dUJBQUMsT0FBTztnQkFDRyxXQUFXO3NCQUEvQixTQUFTO3VCQUFDLFFBQVE7Z0JBQ0csWUFBWTtzQkFBakMsU0FBUzt1QkFBQyxTQUFTO2dCQUNDLFdBQVc7c0JBQS9CLFNBQVM7dUJBQUMsUUFBUTtnQkFnR1osS0FBSztzQkFEWCxZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7XHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgSW5qZWN0LFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBPbkluaXQsIFBpcGUsIFBpcGVUcmFuc2Zvcm0sXHJcbiAgUmVuZGVyZXIyLFxyXG4gIFNlY3VyaXR5Q29udGV4dCxcclxuICBWaWV3Q2hpbGQsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7RG9tU2FuaXRpemVyfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcclxuXHJcbmltcG9ydCB7SUFsYnVtLCBJRXZlbnQsIExJR0hUQk9YX0VWRU5ULCBMaWdodGJveEV2ZW50LCBMaWdodGJveFdpbmRvd1JlZn0gZnJvbSAnLi9saWdodGJveC1ldmVudC5zZXJ2aWNlJztcclxuXHJcbkBQaXBlKHsgbmFtZTogJ3NhZmUnIH0pXHJcbmV4cG9ydCBjbGFzcyBTYWZlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIpIHt9XHJcbiAgdHJhbnNmb3JtKHVybCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCh1cmwpO1xyXG4gIH1cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdbbGItY29udGVudF0nLFxyXG4gIGhvc3Q6IHtcclxuICAgICdbY2xhc3NdJzogJ3VpLmNsYXNzTGlzdCdcclxuICB9LFxyXG4gIHRlbXBsYXRlVXJsOiBcIi4vbGlnaHRib3guY29tcG9uZW50Lmh0bWxcIixcclxufSlcclxuZXhwb3J0IGNsYXNzIExpZ2h0Ym94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgYWxidW06IEFycmF5PElBbGJ1bT47XHJcbiAgQElucHV0KCkgY3VycmVudEltYWdlSW5kZXg6IG51bWJlcjtcclxuICBASW5wdXQoKSBvcHRpb25zOiBhbnk7XHJcbiAgQElucHV0KCkgY21wUmVmOiBhbnk7XHJcbiAgQFZpZXdDaGlsZCgnb3V0ZXJDb250YWluZXInKSBfb3V0ZXJDb250YWluZXJFbGVtOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIF9jb250YWluZXJFbGVtOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2xlZnRBcnJvdycpIF9sZWZ0QXJyb3dFbGVtOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ3JpZ2h0QXJyb3cnKSBfcmlnaHRBcnJvd0VsZW06IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnbmF2QXJyb3cnKSBfbmF2QXJyb3dFbGVtOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2RhdGFDb250YWluZXInKSBfZGF0YUNvbnRhaW5lckVsZW06IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnaW1hZ2UnKSBfaW1hZ2VFbGVtOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2lmcmFtZScpIF9pZnJhbWVFbGVtOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2NhcHRpb24nKSBfY2FwdGlvbkVsZW06IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnbnVtYmVyJykgX251bWJlckVsZW06IEVsZW1lbnRSZWY7XHJcbiAgcHVibGljIGNvbnRlbnQ6IGFueTtcclxuICBwdWJsaWMgdWk6IGFueTtcclxuICBwcml2YXRlIF9jc3NWYWx1ZTogYW55O1xyXG4gIHByaXZhdGUgX2V2ZW50OiBhbnk7XHJcbiAgcHJpdmF0ZSBfd2luZG93UmVmOiBhbnk7XHJcbiAgcHJpdmF0ZSByb3RhdGU6IG51bWJlcjtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgX2VsZW1SZWY6IEVsZW1lbnRSZWYsXHJcbiAgICBwcml2YXRlIF9yZW5kZXJlclJlZjogUmVuZGVyZXIyLFxyXG4gICAgcHJpdmF0ZSBfbGlnaHRib3hFdmVudDogTGlnaHRib3hFdmVudCxcclxuICAgIHB1YmxpYyBfbGlnaHRib3hFbGVtOiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSBfbGlnaHRib3hXaW5kb3dSZWY6IExpZ2h0Ym94V2luZG93UmVmLFxyXG4gICAgcHJpdmF0ZSBfc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXHJcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudFJlZlxyXG4gICkge1xyXG4gICAgLy8gaW5pdGlhbGl6ZSBkYXRhXHJcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgfHwge307XHJcbiAgICB0aGlzLmFsYnVtID0gdGhpcy5hbGJ1bSB8fCBbXTtcclxuICAgIHRoaXMuY3VycmVudEltYWdlSW5kZXggPSB0aGlzLmN1cnJlbnRJbWFnZUluZGV4IHx8IDA7XHJcbiAgICB0aGlzLl93aW5kb3dSZWYgPSB0aGlzLl9saWdodGJveFdpbmRvd1JlZi5uYXRpdmVXaW5kb3c7XHJcblxyXG4gICAgLy8gY29udHJvbCB0aGUgaW50ZXJhY3RpdmUgb2YgdGhlIGRpcmVjdGl2ZVxyXG4gICAgdGhpcy51aSA9IHtcclxuICAgICAgLy8gY29udHJvbCB0aGUgYXBwZWFyIG9mIHRoZSByZWxvYWRlclxyXG4gICAgICAvLyBmYWxzZTogaW1hZ2UgaGFzIGxvYWRlZCBjb21wbGV0ZWx5IGFuZCByZWFkeSB0byBiZSBzaG93blxyXG4gICAgICAvLyB0cnVlOiBpbWFnZSBpcyBzdGlsbCBsb2FkaW5nXHJcbiAgICAgIHNob3dSZWxvYWRlcjogdHJ1ZSxcclxuXHJcbiAgICAgIC8vIGNvbnRyb2wgdGhlIGFwcGVhciBvZiB0aGUgbmF2IGFycm93XHJcbiAgICAgIC8vIHRoZSBhcnJvd05hdiBpcyB0aGUgcGFyZW50IG9mIGJvdGggbGVmdCBhbmQgcmlnaHQgYXJyb3dcclxuICAgICAgLy8gaW4gc29tZSBjYXNlcywgdGhlIHBhcmVudCBzaG93cyBidXQgdGhlIGNoaWxkIGRvZXMgbm90IHNob3dcclxuICAgICAgc2hvd0xlZnRBcnJvdzogZmFsc2UsXHJcbiAgICAgIHNob3dSaWdodEFycm93OiBmYWxzZSxcclxuICAgICAgc2hvd0Fycm93TmF2OiBmYWxzZSxcclxuXHJcbiAgICAgIC8vIGNvbnRyb2wgdGhlIGFwcGVhciBvZiB0aGUgem9vbSBhbmQgcm90YXRlIGJ1dHRvbnNcclxuICAgICAgc2hvd1pvb21CdXR0b246IGZhbHNlLFxyXG4gICAgICBzaG93Um90YXRlQnV0dG9uOiBmYWxzZSxcclxuXHJcbiAgICAgIC8vIGNvbnRyb2wgd2hldGhlciB0byBzaG93IHRoZVxyXG4gICAgICAvLyBwYWdlIG51bWJlciBvciBub3RcclxuICAgICAgc2hvd1BhZ2VOdW1iZXI6IGZhbHNlLFxyXG4gICAgICBzaG93Q2FwdGlvbjogZmFsc2UsXHJcbiAgICAgIGNsYXNzTGlzdDogJ2xpZ2h0Ym94IGFuaW1hdGlvbiBmYWRlSW4nXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY29udGVudCA9IHtcclxuICAgICAgcGFnZU51bWJlcjogJydcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fZXZlbnQgPSB7fTtcclxuICAgIHRoaXMuX2xpZ2h0Ym94RWxlbSA9IHRoaXMuX2VsZW1SZWY7XHJcbiAgICB0aGlzLl9ldmVudC5zdWJzY3JpcHRpb24gPSB0aGlzLl9saWdodGJveEV2ZW50LmxpZ2h0Ym94RXZlbnQkXHJcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBJRXZlbnQpID0+IHRoaXMuX29uUmVjZWl2ZWRFdmVudChldmVudCkpO1xyXG4gICAgdGhpcy5yb3RhdGUgPSAwO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFsYnVtLmZvckVhY2goYWxidW0gPT4ge1xyXG4gICAgICBpZiAoYWxidW0uY2FwdGlvbikge1xyXG4gICAgICAgIGFsYnVtLmNhcHRpb24gPSB0aGlzLl9zYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIGFsYnVtLmNhcHRpb24pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICAvLyBuZWVkIHRvIGluaXQgY3NzIHZhbHVlIGhlcmUsIGFmdGVyIHRoZSB2aWV3IHJlYWR5XHJcbiAgICAvLyBhY3R1YWxseSB0aGVzZSB2YWx1ZXMgYXJlIGFsd2F5cyAwXHJcbiAgICB0aGlzLl9jc3NWYWx1ZSA9IHtcclxuICAgICAgY29udGFpbmVyVG9wUGFkZGluZzogTWF0aC5yb3VuZCh0aGlzLl9nZXRDc3NTdHlsZVZhbHVlKHRoaXMuX2NvbnRhaW5lckVsZW0sICdwYWRkaW5nLXRvcCcpKSxcclxuICAgICAgY29udGFpbmVyUmlnaHRQYWRkaW5nOiBNYXRoLnJvdW5kKHRoaXMuX2dldENzc1N0eWxlVmFsdWUodGhpcy5fY29udGFpbmVyRWxlbSwgJ3BhZGRpbmctcmlnaHQnKSksXHJcbiAgICAgIGNvbnRhaW5lckJvdHRvbVBhZGRpbmc6IE1hdGgucm91bmQodGhpcy5fZ2V0Q3NzU3R5bGVWYWx1ZSh0aGlzLl9jb250YWluZXJFbGVtLCAncGFkZGluZy1ib3R0b20nKSksXHJcbiAgICAgIGNvbnRhaW5lckxlZnRQYWRkaW5nOiBNYXRoLnJvdW5kKHRoaXMuX2dldENzc1N0eWxlVmFsdWUodGhpcy5fY29udGFpbmVyRWxlbSwgJ3BhZGRpbmctbGVmdCcpKSxcclxuICAgICAgaW1hZ2VCb3JkZXJXaWR0aFRvcDogTWF0aC5yb3VuZCh0aGlzLl9nZXRDc3NTdHlsZVZhbHVlKHRoaXMuX2ltYWdlRWxlbSB8fCB0aGlzLl9pZnJhbWVFbGVtLCAnYm9yZGVyLXRvcC13aWR0aCcpKSxcclxuICAgICAgaW1hZ2VCb3JkZXJXaWR0aEJvdHRvbTogTWF0aC5yb3VuZCh0aGlzLl9nZXRDc3NTdHlsZVZhbHVlKHRoaXMuX2ltYWdlRWxlbSB8fCB0aGlzLl9pZnJhbWVFbGVtLCAnYm9yZGVyLWJvdHRvbS13aWR0aCcpKSxcclxuICAgICAgaW1hZ2VCb3JkZXJXaWR0aExlZnQ6IE1hdGgucm91bmQodGhpcy5fZ2V0Q3NzU3R5bGVWYWx1ZSh0aGlzLl9pbWFnZUVsZW0gfHwgdGhpcy5faWZyYW1lRWxlbSwgJ2JvcmRlci1sZWZ0LXdpZHRoJykpLFxyXG4gICAgICBpbWFnZUJvcmRlcldpZHRoUmlnaHQ6IE1hdGgucm91bmQodGhpcy5fZ2V0Q3NzU3R5bGVWYWx1ZSh0aGlzLl9pbWFnZUVsZW0gfHwgdGhpcy5faWZyYW1lRWxlbSwgJ2JvcmRlci1yaWdodC13aWR0aCcpKVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAodGhpcy5fdmFsaWRhdGVJbnB1dERhdGEoKSkge1xyXG4gICAgICB0aGlzLl9wcmVwYXJlQ29tcG9uZW50KCk7XHJcbiAgICAgIHRoaXMuX3JlZ2lzdGVySW1hZ2VMb2FkaW5nRXZlbnQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5vcHRpb25zLmRpc2FibGVLZXlib2FyZE5hdikge1xyXG4gICAgICAvLyB1bmJpbmQga2V5Ym9hcmQgZXZlbnRcclxuICAgICAgdGhpcy5fZGlzYWJsZUtleWJvYXJkTmF2KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZXZlbnQuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbG9zZScsIFsnJGV2ZW50J10pXHJcbiAgcHVibGljIGNsb3NlKCRldmVudDogYW55KTogdm9pZCB7XHJcbiAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBpZiAoJGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpZ2h0Ym94JykgfHxcclxuICAgICAgJGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xiLWxvYWRlcicpIHx8XHJcbiAgICAgICRldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsYi1jbG9zZScpKSB7XHJcbiAgICAgIHRoaXMuX2xpZ2h0Ym94RXZlbnQuYnJvYWRjYXN0TGlnaHRib3hFdmVudCh7IGlkOiBMSUdIVEJPWF9FVkVOVC5DTE9TRSwgZGF0YTogbnVsbCB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb250cm9sKCRldmVudDogYW55KTogdm9pZCB7XHJcbiAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBsZXQgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBsZXQgd2lkdGg6IG51bWJlcjtcclxuICAgIGlmICgkZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbGItdHVybkxlZnQnKSkge1xyXG4gICAgICB0aGlzLnJvdGF0ZSA9IHRoaXMucm90YXRlIC0gOTA7XHJcbiAgICAgIHRoaXMuX3JvdGF0ZUNvbnRhaW5lcigpO1xyXG4gICAgICB0aGlzLl9jYWxjVHJhbnNmb3JtUG9pbnQoKTtcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke3RoaXMucm90YXRlfWRlZylgO1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBgcm90YXRlKCR7dGhpcy5yb3RhdGV9ZGVnKWA7XHJcbiAgICAgIHRoaXMuX2xpZ2h0Ym94RXZlbnQuYnJvYWRjYXN0TGlnaHRib3hFdmVudCh7IGlkOiBMSUdIVEJPWF9FVkVOVC5ST1RBVEVfTEVGVCwgZGF0YTogbnVsbCB9KTtcclxuICAgIH0gZWxzZSBpZiAoJGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xiLXR1cm5SaWdodCcpKSB7XHJcbiAgICAgIHRoaXMucm90YXRlID0gdGhpcy5yb3RhdGUgKyA5MDtcclxuICAgICAgdGhpcy5fcm90YXRlQ29udGFpbmVyKCk7XHJcbiAgICAgIHRoaXMuX2NhbGNUcmFuc2Zvcm1Qb2ludCgpO1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7dGhpcy5yb3RhdGV9ZGVnKWA7XHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdpbWFnZScpLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IGByb3RhdGUoJHt0aGlzLnJvdGF0ZX1kZWcpYDtcclxuICAgICAgdGhpcy5fbGlnaHRib3hFdmVudC5icm9hZGNhc3RMaWdodGJveEV2ZW50KHsgaWQ6IExJR0hUQk9YX0VWRU5ULlJPVEFURV9SSUdIVCwgZGF0YTogbnVsbCB9KTtcclxuICAgIH0gZWxzZSBpZiAoJGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xiLXpvb21PdXQnKSkge1xyXG4gICAgICBoZWlnaHQgPSBwYXJzZUludCh0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnb3V0ZXJDb250YWluZXInKS5zdHlsZS5oZWlnaHQsIDEwKSAvIDEuNTtcclxuICAgICAgd2lkdGggPSBwYXJzZUludCh0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnb3V0ZXJDb250YWluZXInKS5zdHlsZS53aWR0aCwgMTApIC8gMS41O1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnb3V0ZXJDb250YWluZXInKS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnb3V0ZXJDb250YWluZXInKS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcclxuICAgICAgaGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUuaGVpZ2h0LCAxMCkgLyAxLjU7XHJcbiAgICAgIHdpZHRoID0gcGFyc2VJbnQodGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUud2lkdGgsIDEwKSAvIDEuNTtcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XHJcbiAgICAgIHRoaXMuX2xpZ2h0Ym94RXZlbnQuYnJvYWRjYXN0TGlnaHRib3hFdmVudCh7IGlkOiBMSUdIVEJPWF9FVkVOVC5aT09NX09VVCwgZGF0YTogbnVsbCB9KTtcclxuICAgIH0gZWxzZSBpZiAoJGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2xiLXpvb21JbicpKSB7XHJcbiAgICAgIGhlaWdodCA9IHBhcnNlSW50KHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdvdXRlckNvbnRhaW5lcicpLnN0eWxlLmhlaWdodCwgMTApICogMS41O1xyXG4gICAgICB3aWR0aCA9IHBhcnNlSW50KHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdvdXRlckNvbnRhaW5lcicpLnN0eWxlLndpZHRoLCAxMCkgKiAxLjU7XHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdvdXRlckNvbnRhaW5lcicpLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdvdXRlckNvbnRhaW5lcicpLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xyXG4gICAgICBoZWlnaHQgPSBwYXJzZUludCh0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS5oZWlnaHQsIDEwKSAqIDEuNTtcclxuICAgICAgd2lkdGggPSBwYXJzZUludCh0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS53aWR0aCwgMTApICogMS41O1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcclxuICAgICAgdGhpcy5fbGlnaHRib3hFdmVudC5icm9hZGNhc3RMaWdodGJveEV2ZW50KHsgaWQ6IExJR0hUQk9YX0VWRU5ULlpPT01fSU4sIGRhdGE6IG51bGwgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9yb3RhdGVDb250YWluZXIoKTogdm9pZCB7XHJcbiAgICBsZXQgdGVtcCA9IHRoaXMucm90YXRlO1xyXG4gICAgaWYgKHRlbXAgPCAwKSB7XHJcbiAgICAgIHRlbXAgKj0gLTE7XHJcbiAgICB9XHJcbiAgICBpZiAodGVtcCAvIDkwICUgNCA9PT0gMSB8fCB0ZW1wIC8gOTAgJSA0ID09PSAzKSB7XHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdvdXRlckNvbnRhaW5lcicpLnN0eWxlLmhlaWdodCA9IHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdpbWFnZScpLnN0eWxlLndpZHRoO1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnb3V0ZXJDb250YWluZXInKS5zdHlsZS53aWR0aCA9IHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdpbWFnZScpLnN0eWxlLmhlaWdodDtcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpLnN0eWxlLmhlaWdodCA9IHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdpbWFnZScpLnN0eWxlLndpZHRoO1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJykuc3R5bGUud2lkdGggPSB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS5oZWlnaHQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnb3V0ZXJDb250YWluZXInKS5zdHlsZS5oZWlnaHQgPSB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS5oZWlnaHQ7XHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdvdXRlckNvbnRhaW5lcicpLnN0eWxlLndpZHRoID0gdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUud2lkdGg7XHJcbiAgICAgIHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKS5zdHlsZS5oZWlnaHQgPSB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS53aWR0aDtcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpLnN0eWxlLndpZHRoID0gdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUuaGVpZ2h0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfcmVzZXRJbWFnZSgpOiB2b2lkIHtcclxuICAgIHRoaXMucm90YXRlID0gMDtcclxuICAgIGNvbnN0IGltYWdlID0gdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJyk7XHJcbiAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgaW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke3RoaXMucm90YXRlfWRlZylgO1xyXG4gICAgICBpbWFnZS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBgcm90YXRlKCR7dGhpcy5yb3RhdGV9ZGVnKWA7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfY2FsY1RyYW5zZm9ybVBvaW50KCk6IHZvaWQge1xyXG4gICAgbGV0IGhlaWdodCA9IHBhcnNlSW50KHRoaXMuX2RvY3VtZW50UmVmLmdldEVsZW1lbnRCeUlkKCdpbWFnZScpLnN0eWxlLmhlaWdodCwgMTApO1xyXG4gICAgbGV0IHdpZHRoID0gcGFyc2VJbnQodGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUud2lkdGgsIDEwKTtcclxuICAgIGxldCB0ZW1wID0gdGhpcy5yb3RhdGUgJSAzNjA7XHJcbiAgICBpZiAodGVtcCA8IDApIHtcclxuICAgICAgdGVtcCA9IDM2MCArIHRlbXA7XHJcbiAgICB9XHJcbiAgICBpZiAodGVtcCA9PT0gOTApIHtcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gKGhlaWdodCAvIDIpICsgJ3B4ICcgKyAoaGVpZ2h0IC8gMikgKyAncHgnO1xyXG4gICAgfSBlbHNlIGlmICh0ZW1wID09PSAxODApIHtcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gKHdpZHRoIC8gMikgKyAncHggJyArIChoZWlnaHQgLyAyKSArICdweCc7XHJcbiB9IGVsc2UgaWYgKHRlbXAgPT09IDI3MCkge1xyXG4gICAgICB0aGlzLl9kb2N1bWVudFJlZi5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSAod2lkdGggLyAyKSArICdweCAnICsgKHdpZHRoIC8gMikgKyAncHgnO1xyXG4gfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG5leHRJbWFnZSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmFsYnVtLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudEltYWdlSW5kZXggPT09IHRoaXMuYWxidW0ubGVuZ3RoIC0gMSkge1xyXG4gICAgICB0aGlzLl9jaGFuZ2VJbWFnZSgwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2NoYW5nZUltYWdlKHRoaXMuY3VycmVudEltYWdlSW5kZXggKyAxKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBwcmV2SW1hZ2UoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hbGJ1bS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRJbWFnZUluZGV4ID09PSAwICYmIHRoaXMuYWxidW0ubGVuZ3RoID4gMSkge1xyXG4gICAgICB0aGlzLl9jaGFuZ2VJbWFnZSh0aGlzLmFsYnVtLmxlbmd0aCAtIDEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fY2hhbmdlSW1hZ2UodGhpcy5jdXJyZW50SW1hZ2VJbmRleCAtIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdmFsaWRhdGVJbnB1dERhdGEoKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5hbGJ1bSAmJlxyXG4gICAgICB0aGlzLmFsYnVtIGluc3RhbmNlb2YgQXJyYXkgJiZcclxuICAgICAgdGhpcy5hbGJ1bS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbGJ1bS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgZWFjaCBfbnNpZGVcclxuICAgICAgICAvLyBhbGJ1bSBoYXMgc3JjIGRhdGEgb3Igbm90XHJcbiAgICAgICAgaWYgKHRoaXMuYWxidW1baV0uc3JjKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignT25lIG9mIHRoZSBhbGJ1bSBkYXRhIGRvZXMgbm90IGhhdmUgc291cmNlIGRhdGEnKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhbGJ1bSBkYXRhIG9yIGFsYnVtIGRhdGEgaXMgbm90IGNvcnJlY3QgaW4gdHlwZScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRvIHByZXZlbnQgZGF0YSB1bmRlcnN0YW5kIGFzIHN0cmluZ1xyXG4gICAgLy8gY29udmVydCBpdCB0byBudW1iZXJcclxuICAgIGlmIChpc05hTih0aGlzLmN1cnJlbnRJbWFnZUluZGV4KSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0N1cnJlbnQgaW1hZ2UgaW5kZXggaXMgbm90IGEgbnVtYmVyJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZUluZGV4ID0gTnVtYmVyKHRoaXMuY3VycmVudEltYWdlSW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfcmVnaXN0ZXJJbWFnZUxvYWRpbmdFdmVudCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNyYzogYW55ID0gdGhpcy5hbGJ1bVt0aGlzLmN1cnJlbnRJbWFnZUluZGV4XS5zcmM7XHJcblxyXG4gICAgaWYgKHRoaXMuYWxidW1bdGhpcy5jdXJyZW50SW1hZ2VJbmRleF0uaWZyYW1lIHx8IHRoaXMubmVlZHNJZnJhbWUoc3JjKSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fb25Mb2FkSW1hZ2VTdWNjZXNzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJlbG9hZGVyID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgcHJlbG9hZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgdGhpcy5fb25Mb2FkSW1hZ2VTdWNjZXNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlbG9hZGVyLm9uZXJyb3IgPSAoZSkgPT4ge1xyXG4gICAgICB0aGlzLl9saWdodGJveEV2ZW50LmJyb2FkY2FzdExpZ2h0Ym94RXZlbnQoeyBpZDogTElHSFRCT1hfRVZFTlQuRklMRV9OT1RfRk9VTkQsIGRhdGE6IGUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlbG9hZGVyLnNyYyA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuVVJMLCBzcmMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmlyZSB3aGVuIHRoZSBpbWFnZSBpcyBsb2FkZWRcclxuICAgKi9cclxuICBwcml2YXRlIF9vbkxvYWRJbWFnZVN1Y2Nlc3MoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5kaXNhYmxlS2V5Ym9hcmROYXYpIHtcclxuICAgICAgLy8gdW5iaW5kIGtleWJvYXJkIGV2ZW50IGR1cmluZyB0cmFuc2l0aW9uXHJcbiAgICAgIHRoaXMuX2Rpc2FibGVLZXlib2FyZE5hdigpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbWFnZUhlaWdodDtcclxuICAgIGxldCBpbWFnZVdpZHRoO1xyXG4gICAgbGV0IG1heEltYWdlSGVpZ2h0O1xyXG4gICAgbGV0IG1heEltYWdlV2lkdGg7XHJcbiAgICBsZXQgd2luZG93SGVpZ2h0O1xyXG4gICAgbGV0IHdpbmRvd1dpZHRoO1xyXG4gICAgbGV0IG5hdHVyYWxJbWFnZVdpZHRoO1xyXG4gICAgbGV0IG5hdHVyYWxJbWFnZUhlaWdodDtcclxuXHJcbiAgICAvLyBzZXQgZGVmYXVsdCB3aWR0aCBhbmQgaGVpZ2h0IG9mIGltYWdlIHRvIGJlIGl0cyBuYXR1cmFsXHJcbiAgICBpbWFnZVdpZHRoID0gbmF0dXJhbEltYWdlV2lkdGggPSB0aGlzLl9pbWFnZUVsZW0gPyB0aGlzLl9pbWFnZUVsZW0ubmF0aXZlRWxlbWVudC5uYXR1cmFsV2lkdGggOiB0aGlzLl93aW5kb3dSZWYuaW5uZXJXaWR0aCAqIC44O1xyXG4gICAgaW1hZ2VIZWlnaHQgPSBuYXR1cmFsSW1hZ2VIZWlnaHQgPSB0aGlzLl9pbWFnZUVsZW0gPyB0aGlzLl9pbWFnZUVsZW0ubmF0aXZlRWxlbWVudC5uYXR1cmFsSGVpZ2h0IDogdGhpcy5fd2luZG93UmVmLmlubmVySGVpZ2h0ICogLjg7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmZpdEltYWdlSW5WaWV3UG9ydCkge1xyXG4gICAgICB3aW5kb3dXaWR0aCA9IHRoaXMuX3dpbmRvd1JlZi5pbm5lcldpZHRoO1xyXG4gICAgICB3aW5kb3dIZWlnaHQgPSB0aGlzLl93aW5kb3dSZWYuaW5uZXJIZWlnaHQ7XHJcbiAgICAgIG1heEltYWdlV2lkdGggPSB3aW5kb3dXaWR0aCAtIHRoaXMuX2Nzc1ZhbHVlLmNvbnRhaW5lckxlZnRQYWRkaW5nIC1cclxuICAgICAgICB0aGlzLl9jc3NWYWx1ZS5jb250YWluZXJSaWdodFBhZGRpbmcgLSB0aGlzLl9jc3NWYWx1ZS5pbWFnZUJvcmRlcldpZHRoTGVmdCAtXHJcbiAgICAgICAgdGhpcy5fY3NzVmFsdWUuaW1hZ2VCb3JkZXJXaWR0aFJpZ2h0IC0gMjA7XHJcbiAgICAgIG1heEltYWdlSGVpZ2h0ID0gd2luZG93SGVpZ2h0IC0gdGhpcy5fY3NzVmFsdWUuY29udGFpbmVyVG9wUGFkZGluZyAtXHJcbiAgICAgICAgdGhpcy5fY3NzVmFsdWUuY29udGFpbmVyVG9wUGFkZGluZyAtIHRoaXMuX2Nzc1ZhbHVlLmltYWdlQm9yZGVyV2lkdGhUb3AgLVxyXG4gICAgICAgIHRoaXMuX2Nzc1ZhbHVlLmltYWdlQm9yZGVyV2lkdGhCb3R0b20gLSAxMjA7XHJcbiAgICAgIGlmIChuYXR1cmFsSW1hZ2VXaWR0aCA+IG1heEltYWdlV2lkdGggfHwgbmF0dXJhbEltYWdlSGVpZ2h0ID4gbWF4SW1hZ2VIZWlnaHQpIHtcclxuICAgICAgICBpZiAoKG5hdHVyYWxJbWFnZVdpZHRoIC8gbWF4SW1hZ2VXaWR0aCkgPiAobmF0dXJhbEltYWdlSGVpZ2h0IC8gbWF4SW1hZ2VIZWlnaHQpKSB7XHJcbiAgICAgICAgICBpbWFnZVdpZHRoID0gbWF4SW1hZ2VXaWR0aDtcclxuICAgICAgICAgIGltYWdlSGVpZ2h0ID0gTWF0aC5yb3VuZChuYXR1cmFsSW1hZ2VIZWlnaHQgLyAobmF0dXJhbEltYWdlV2lkdGggLyBpbWFnZVdpZHRoKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGltYWdlSGVpZ2h0ID0gbWF4SW1hZ2VIZWlnaHQ7XHJcbiAgICAgICAgICBpbWFnZVdpZHRoID0gTWF0aC5yb3VuZChuYXR1cmFsSW1hZ2VXaWR0aCAvIChuYXR1cmFsSW1hZ2VIZWlnaHQgLyBpbWFnZUhlaWdodCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUoKHRoaXMuX2ltYWdlRWxlbSB8fCB0aGlzLl9pZnJhbWVFbGVtKS5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCBgJHtpbWFnZVdpZHRofXB4YCk7XHJcbiAgICAgIHRoaXMuX3JlbmRlcmVyUmVmLnNldFN0eWxlKCh0aGlzLl9pbWFnZUVsZW0gfHwgdGhpcy5faWZyYW1lRWxlbSkubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsIGAke2ltYWdlSGVpZ2h0fXB4YCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc2l6ZUNvbnRhaW5lcihpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCk7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jZW50ZXJWZXJ0aWNhbGx5KSB7XHJcbiAgICAgIHRoaXMuX2NlbnRlclZlcnRpY2FsbHkoaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfY2VudGVyVmVydGljYWxseShpbWFnZVdpZHRoOiBudW1iZXIsIGltYWdlSGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNjcm9sbE9mZnNldCA9IHRoaXMuX2RvY3VtZW50UmVmLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB0aGlzLl93aW5kb3dSZWYuaW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgY29uc3Qgdmlld09mZnNldCA9IHdpbmRvd0hlaWdodCAvIDIgLSBpbWFnZUhlaWdodCAvIDI7XHJcbiAgICBjb25zdCB0b3BEaXN0YW5jZSA9IHNjcm9sbE9mZnNldCArIHZpZXdPZmZzZXQ7XHJcblxyXG4gICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fbGlnaHRib3hFbGVtLm5hdGl2ZUVsZW1lbnQsICd0b3AnLCBgJHt0b3BEaXN0YW5jZX1weGApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfc2l6ZUNvbnRhaW5lcihpbWFnZVdpZHRoOiBudW1iZXIsIGltYWdlSGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IG9sZFdpZHRoID0gdGhpcy5fb3V0ZXJDb250YWluZXJFbGVtLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICBjb25zdCBvbGRIZWlnaHQgPSB0aGlzLl9vdXRlckNvbnRhaW5lckVsZW0ubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICBjb25zdCBuZXdXaWR0aCA9IGltYWdlV2lkdGggKyB0aGlzLl9jc3NWYWx1ZS5jb250YWluZXJSaWdodFBhZGRpbmcgKyB0aGlzLl9jc3NWYWx1ZS5jb250YWluZXJMZWZ0UGFkZGluZyArXHJcbiAgICAgIHRoaXMuX2Nzc1ZhbHVlLmltYWdlQm9yZGVyV2lkdGhMZWZ0ICsgdGhpcy5fY3NzVmFsdWUuaW1hZ2VCb3JkZXJXaWR0aFJpZ2h0O1xyXG4gICAgY29uc3QgbmV3SGVpZ2h0ID0gaW1hZ2VIZWlnaHQgKyB0aGlzLl9jc3NWYWx1ZS5jb250YWluZXJUb3BQYWRkaW5nICsgdGhpcy5fY3NzVmFsdWUuY29udGFpbmVyQm90dG9tUGFkZGluZyArXHJcbiAgICAgIHRoaXMuX2Nzc1ZhbHVlLmltYWdlQm9yZGVyV2lkdGhUb3AgKyB0aGlzLl9jc3NWYWx1ZS5pbWFnZUJvcmRlcldpZHRoQm90dG9tO1xyXG5cclxuICAgIC8vIG1ha2Ugc3VyZSB0aGF0IGRpc3RhbmNlcyBhcmUgbGFyZ2UgZW5vdWdoIGZvciB0cmFuc2l0aW9uZW5kIGV2ZW50IHRvIGJlIGZpcmVkLCBhdCBsZWFzdCA1cHguXHJcbiAgICBpZiAoTWF0aC5hYnMob2xkV2lkdGggLSBuZXdXaWR0aCkgKyBNYXRoLmFicyhvbGRIZWlnaHQgLSBuZXdIZWlnaHQpID4gNSkge1xyXG4gICAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9vdXRlckNvbnRhaW5lckVsZW0ubmF0aXZlRWxlbWVudCwgJ3dpZHRoJywgYCR7bmV3V2lkdGh9cHhgKTtcclxuICAgICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fb3V0ZXJDb250YWluZXJFbGVtLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCBgJHtuZXdIZWlnaHR9cHhgKTtcclxuXHJcbiAgICAgIC8vIGJpbmQgcmVzaXplIGV2ZW50IHRvIG91dGVyIGNvbnRhaW5lclxyXG4gICAgICAvLyB1c2UgZW5hYmxlVHJhbnNpdGlvbiB0byBwcmV2ZW50IGluZmluaXRlIGxvYWRlclxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmVuYWJsZVRyYW5zaXRpb24pIHtcclxuICAgICAgICB0aGlzLl9ldmVudC50cmFuc2l0aW9ucyA9IFtdO1xyXG4gICAgICAgIFsndHJhbnNpdGlvbmVuZCcsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgJ29UcmFuc2l0aW9uRW5kJywgJ01TVHJhbnNpdGlvbkVuZCddLmZvckVhY2goZXZlbnROYW1lID0+IHtcclxuICAgICAgICAgIHRoaXMuX2V2ZW50LnRyYW5zaXRpb25zLnB1c2goXHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcmVyUmVmLmxpc3Rlbih0aGlzLl9vdXRlckNvbnRhaW5lckVsZW0ubmF0aXZlRWxlbWVudCwgZXZlbnROYW1lLCAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGV2ZW50LmN1cnJlbnRUYXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Bvc3RSZXNpemUobmV3V2lkdGgsIG5ld0hlaWdodCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl9wb3N0UmVzaXplKG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9wb3N0UmVzaXplKG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfcG9zdFJlc2l6ZShuZXdXaWR0aDogbnVtYmVyLCBuZXdIZWlnaHQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgLy8gdW5iaW5kIHJlc2l6ZSBldmVudFxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5fZXZlbnQudHJhbnNpdGlvbnMpKSB7XHJcbiAgICAgIHRoaXMuX2V2ZW50LnRyYW5zaXRpb25zLmZvckVhY2goKGV2ZW50SGFuZGxlcjogYW55KSA9PiB7XHJcbiAgICAgICAgZXZlbnRIYW5kbGVyKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5fZXZlbnQudHJhbnNpdGlvbnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9kYXRhQ29udGFpbmVyRWxlbS5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCBgJHtuZXdXaWR0aH1weGApO1xyXG4gICAgdGhpcy5fc2hvd0ltYWdlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9zaG93SW1hZ2UoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVpLnNob3dSZWxvYWRlciA9IGZhbHNlO1xyXG4gICAgdGhpcy5fdXBkYXRlTmF2KCk7XHJcbiAgICB0aGlzLl91cGRhdGVEZXRhaWxzKCk7XHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5kaXNhYmxlS2V5Ym9hcmROYXYpIHtcclxuICAgICAgdGhpcy5fZW5hYmxlS2V5Ym9hcmROYXYoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3ByZXBhcmVDb21wb25lbnQoKTogdm9pZCB7XHJcbiAgICAvLyBhZGQgY3NzMyBhbmltYXRpb25cclxuICAgIHRoaXMuX2FkZENzc0FuaW1hdGlvbigpO1xyXG5cclxuICAgIC8vIHBvc2l0aW9uIHRoZSBpbWFnZSBhY2NvcmRpbmcgdG8gdXNlcidzIG9wdGlvblxyXG4gICAgdGhpcy5fcG9zaXRpb25MaWdodEJveCgpO1xyXG5cclxuICAgIC8vIHVwZGF0ZSBjb250cm9scyB2aXNpYmlsaXR5IG9uIG5leHQgdmlldyBnZW5lcmF0aW9uXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy51aS5zaG93Wm9vbUJ1dHRvbiA9IHRoaXMub3B0aW9ucy5zaG93Wm9vbTtcclxuICAgICAgdGhpcy51aS5zaG93Um90YXRlQnV0dG9uID0gdGhpcy5vcHRpb25zLnNob3dSb3RhdGU7XHJcbiAgICB9LCAwKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3Bvc2l0aW9uTGlnaHRCb3goKTogdm9pZCB7XHJcbiAgICAvLyBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM0NjQ4NzYvamF2YXNjcmlwdC1nZXQtd2luZG93LXgteS1wb3NpdGlvbi1mb3Itc2Nyb2xsXHJcbiAgICBjb25zdCB0b3AgPSAodGhpcy5fd2luZG93UmVmLnBhZ2VZT2Zmc2V0IHx8IHRoaXMuX2RvY3VtZW50UmVmLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApICtcclxuICAgICAgdGhpcy5vcHRpb25zLnBvc2l0aW9uRnJvbVRvcDtcclxuICAgIGNvbnN0IGxlZnQgPSB0aGlzLl93aW5kb3dSZWYucGFnZVhPZmZzZXQgfHwgdGhpcy5fZG9jdW1lbnRSZWYuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuY2VudGVyVmVydGljYWxseSkge1xyXG4gICAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9saWdodGJveEVsZW0ubmF0aXZlRWxlbWVudCwgJ3RvcCcsIGAke3RvcH1weGApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3JlbmRlcmVyUmVmLnNldFN0eWxlKHRoaXMuX2xpZ2h0Ym94RWxlbS5uYXRpdmVFbGVtZW50LCAnbGVmdCcsIGAke2xlZnR9cHhgKTtcclxuICAgIHRoaXMuX3JlbmRlcmVyUmVmLnNldFN0eWxlKHRoaXMuX2xpZ2h0Ym94RWxlbS5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdibG9jaycpO1xyXG5cclxuICAgIC8vIGRpc2FibGUgc2Nyb2xsaW5nIG9mIHRoZSBwYWdlIHdoaWxlIG9wZW5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlzYWJsZVNjcm9sbGluZykge1xyXG4gICAgICB0aGlzLl9yZW5kZXJlclJlZi5hZGRDbGFzcyh0aGlzLl9kb2N1bWVudFJlZi5kb2N1bWVudEVsZW1lbnQsICdsYi1kaXNhYmxlLXNjcm9sbGluZycpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYWRkQ3NzQW5pbWF0aW9uIGFkZCBjc3MzIGNsYXNzZXMgZm9yIGFuaW1hdGUgbGlnaHRib3hcclxuICAgKi9cclxuICBwcml2YXRlIF9hZGRDc3NBbmltYXRpb24oKTogdm9pZCB7XHJcbiAgICBjb25zdCByZXNpemVEdXJhdGlvbiA9IHRoaXMub3B0aW9ucy5yZXNpemVEdXJhdGlvbjtcclxuICAgIGNvbnN0IGZhZGVEdXJhdGlvbiA9IHRoaXMub3B0aW9ucy5mYWRlRHVyYXRpb247XHJcblxyXG4gICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fbGlnaHRib3hFbGVtLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgICctd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbicsIGAke2ZhZGVEdXJhdGlvbn1zYCk7XHJcbiAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9saWdodGJveEVsZW0ubmF0aXZlRWxlbWVudCxcclxuICAgICAgJ2FuaW1hdGlvbi1kdXJhdGlvbicsIGAke2ZhZGVEdXJhdGlvbn1zYCk7XHJcbiAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9vdXRlckNvbnRhaW5lckVsZW0ubmF0aXZlRWxlbWVudCxcclxuICAgICAgJy13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvbicsIGAke3Jlc2l6ZUR1cmF0aW9ufXNgKTtcclxuICAgIHRoaXMuX3JlbmRlcmVyUmVmLnNldFN0eWxlKHRoaXMuX291dGVyQ29udGFpbmVyRWxlbS5uYXRpdmVFbGVtZW50LFxyXG4gICAgICAndHJhbnNpdGlvbi1kdXJhdGlvbicsIGAke3Jlc2l6ZUR1cmF0aW9ufXNgKTtcclxuICAgIHRoaXMuX3JlbmRlcmVyUmVmLnNldFN0eWxlKHRoaXMuX2RhdGFDb250YWluZXJFbGVtLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgICctd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbicsIGAke2ZhZGVEdXJhdGlvbn1zYCk7XHJcbiAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9kYXRhQ29udGFpbmVyRWxlbS5uYXRpdmVFbGVtZW50LFxyXG4gICAgICAnYW5pbWF0aW9uLWR1cmF0aW9uJywgYCR7ZmFkZUR1cmF0aW9ufXNgKTtcclxuICAgIHRoaXMuX3JlbmRlcmVyUmVmLnNldFN0eWxlKCh0aGlzLl9pbWFnZUVsZW0gfHwgdGhpcy5faWZyYW1lRWxlbSkubmF0aXZlRWxlbWVudCxcclxuICAgICAgJy13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uJywgYCR7ZmFkZUR1cmF0aW9ufXNgKTtcclxuICAgIHRoaXMuX3JlbmRlcmVyUmVmLnNldFN0eWxlKCh0aGlzLl9pbWFnZUVsZW0gfHwgdGhpcy5faWZyYW1lRWxlbSkubmF0aXZlRWxlbWVudCxcclxuICAgICAgJ2FuaW1hdGlvbi1kdXJhdGlvbicsIGAke2ZhZGVEdXJhdGlvbn1zYCk7XHJcbiAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9jYXB0aW9uRWxlbS5uYXRpdmVFbGVtZW50LFxyXG4gICAgICAnLXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb24nLCBgJHtmYWRlRHVyYXRpb259c2ApO1xyXG4gICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fY2FwdGlvbkVsZW0ubmF0aXZlRWxlbWVudCxcclxuICAgICAgJ2FuaW1hdGlvbi1kdXJhdGlvbicsIGAke2ZhZGVEdXJhdGlvbn1zYCk7XHJcbiAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9udW1iZXJFbGVtLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgICctd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbicsIGAke2ZhZGVEdXJhdGlvbn1zYCk7XHJcbiAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9udW1iZXJFbGVtLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgICdhbmltYXRpb24tZHVyYXRpb24nLCBgJHtmYWRlRHVyYXRpb259c2ApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZW5kKCk6IHZvaWQge1xyXG4gICAgdGhpcy51aS5jbGFzc0xpc3QgPSAnbGlnaHRib3ggYW5pbWF0aW9uIGZhZGVPdXQnO1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlU2Nyb2xsaW5nKSB7XHJcbiAgICAgIHRoaXMuX3JlbmRlcmVyUmVmLnJlbW92ZUNsYXNzKHRoaXMuX2RvY3VtZW50UmVmLmRvY3VtZW50RWxlbWVudCwgJ2xiLWRpc2FibGUtc2Nyb2xsaW5nJyk7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5jbXBSZWYuZGVzdHJveSgpO1xyXG4gICAgfSwgdGhpcy5vcHRpb25zLmZhZGVEdXJhdGlvbiAqIDEwMDApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdXBkYXRlRGV0YWlscygpOiB2b2lkIHtcclxuICAgIC8vIHVwZGF0ZSB0aGUgY2FwdGlvblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLmFsYnVtW3RoaXMuY3VycmVudEltYWdlSW5kZXhdLmNhcHRpb24gIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgIHRoaXMuYWxidW1bdGhpcy5jdXJyZW50SW1hZ2VJbmRleF0uY2FwdGlvbiAhPT0gJycpIHtcclxuICAgICAgdGhpcy51aS5zaG93Q2FwdGlvbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIHRoZSBwYWdlIG51bWJlciBpZiB1c2VyIGNob29zZSB0byBkbyBzb1xyXG4gICAgLy8gZG9lcyBub3QgcGVyZm9ybSBudW1iZXJpbmcgdGhlIHBhZ2UgaWYgdGhlXHJcbiAgICAvLyBhcnJheSBsZW5ndGggaW4gYWxidW0gPD0gMVxyXG4gICAgaWYgKHRoaXMuYWxidW0ubGVuZ3RoID4gMSAmJiB0aGlzLm9wdGlvbnMuc2hvd0ltYWdlTnVtYmVyTGFiZWwpIHtcclxuICAgICAgdGhpcy51aS5zaG93UGFnZU51bWJlciA9IHRydWU7XHJcbiAgICAgIHRoaXMuY29udGVudC5wYWdlTnVtYmVyID0gdGhpcy5fYWxidW1MYWJlbCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfYWxidW1MYWJlbCgpOiBzdHJpbmcge1xyXG4gICAgLy8gZHVlIHRvIHt0aGlzLmN1cnJlbnRJbWFnZUluZGV4fSBpcyBzZXQgZnJvbSAwIHRvIHt0aGlzLmFsYnVtLmxlbmd0aH0gLSAxXHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFsYnVtTGFiZWwucmVwbGFjZSgvJTEvZywgTnVtYmVyKHRoaXMuY3VycmVudEltYWdlSW5kZXggKyAxKSkucmVwbGFjZSgvJTIvZywgdGhpcy5hbGJ1bS5sZW5ndGgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfY2hhbmdlSW1hZ2UobmV3SW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5fcmVzZXRJbWFnZSgpO1xyXG4gICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9IG5ld0luZGV4O1xyXG4gICAgdGhpcy5faGlkZUltYWdlKCk7XHJcbiAgICB0aGlzLl9yZWdpc3RlckltYWdlTG9hZGluZ0V2ZW50KCk7XHJcbiAgICB0aGlzLl9saWdodGJveEV2ZW50LmJyb2FkY2FzdExpZ2h0Ym94RXZlbnQoeyBpZDogTElHSFRCT1hfRVZFTlQuQ0hBTkdFX1BBR0UsIGRhdGE6IG5ld0luZGV4IH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfaGlkZUltYWdlKCk6IHZvaWQge1xyXG4gICAgdGhpcy51aS5zaG93UmVsb2FkZXIgPSB0cnVlO1xyXG4gICAgdGhpcy51aS5zaG93QXJyb3dOYXYgPSBmYWxzZTtcclxuICAgIHRoaXMudWkuc2hvd0xlZnRBcnJvdyA9IGZhbHNlO1xyXG4gICAgdGhpcy51aS5zaG93UmlnaHRBcnJvdyA9IGZhbHNlO1xyXG4gICAgdGhpcy51aS5zaG93UGFnZU51bWJlciA9IGZhbHNlO1xyXG4gICAgdGhpcy51aS5zaG93Q2FwdGlvbiA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdXBkYXRlTmF2KCk6IHZvaWQge1xyXG4gICAgbGV0IGFsd2F5c1Nob3dOYXYgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBjaGVjayB0byBzZWUgdGhlIGJyb3dzZXIgc3VwcG9ydCB0b3VjaCBldmVudFxyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5fZG9jdW1lbnRSZWYuY3JlYXRlRXZlbnQoJ1RvdWNoRXZlbnQnKTtcclxuICAgICAgYWx3YXlzU2hvd05hdiA9ICh0aGlzLm9wdGlvbnMuYWx3YXlzU2hvd05hdk9uVG91Y2hEZXZpY2VzKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgLy8gbm9vcFxyXG4gICAgfVxyXG5cclxuICAgIC8vIGluaXRpYWxseSBzaG93IHRoZSBhcnJvdyBuYXZcclxuICAgIC8vIHdoaWNoIGlzIHRoZSBwYXJlbnQgb2YgYm90aCBsZWZ0IGFuZCByaWdodCBuYXZcclxuICAgIHRoaXMuX3Nob3dBcnJvd05hdigpO1xyXG4gICAgaWYgKHRoaXMuYWxidW0ubGVuZ3RoID4gMSkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLndyYXBBcm91bmQpIHtcclxuICAgICAgICBpZiAoYWx3YXlzU2hvd05hdikge1xyXG4gICAgICAgICAgLy8gYWx0ZXJuYXRpdmVzIHRoaXMuJGxpZ2h0Ym94LmZpbmQoJy5sYi1wcmV2LCAubGItbmV4dCcpLmNzcygnb3BhY2l0eScsICcxJyk7XHJcbiAgICAgICAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9sZWZ0QXJyb3dFbGVtLm5hdGl2ZUVsZW1lbnQsICdvcGFjaXR5JywgJzEnKTtcclxuICAgICAgICAgIHRoaXMuX3JlbmRlcmVyUmVmLnNldFN0eWxlKHRoaXMuX3JpZ2h0QXJyb3dFbGVtLm5hdGl2ZUVsZW1lbnQsICdvcGFjaXR5JywgJzEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFsdGVybmF0aXZlcyB0aGlzLiRsaWdodGJveC5maW5kKCcubGItcHJldiwgLmxiLW5leHQnKS5zaG93KCk7XHJcbiAgICAgICAgdGhpcy5fc2hvd0xlZnRBcnJvd05hdigpO1xyXG4gICAgICAgIHRoaXMuX3Nob3dSaWdodEFycm93TmF2KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEltYWdlSW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAvLyBhbHRlcm5hdGl2ZXMgdGhpcy4kbGlnaHRib3guZmluZCgnLmxiLXByZXYnKS5zaG93KCk7XHJcbiAgICAgICAgICB0aGlzLl9zaG93TGVmdEFycm93TmF2KCk7XHJcbiAgICAgICAgICBpZiAoYWx3YXlzU2hvd05hdikge1xyXG4gICAgICAgICAgICAvLyBhbHRlcm5hdGl2ZXMgdGhpcy4kbGlnaHRib3guZmluZCgnLmxiLXByZXYnKS5jc3MoJ29wYWNpdHknLCAnMScpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJlclJlZi5zZXRTdHlsZSh0aGlzLl9sZWZ0QXJyb3dFbGVtLm5hdGl2ZUVsZW1lbnQsICdvcGFjaXR5JywgJzEnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUluZGV4IDwgdGhpcy5hbGJ1bS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAvLyBhbHRlcm5hdGl2ZXMgdGhpcy4kbGlnaHRib3guZmluZCgnLmxiLW5leHQnKS5zaG93KCk7XHJcbiAgICAgICAgICB0aGlzLl9zaG93UmlnaHRBcnJvd05hdigpO1xyXG4gICAgICAgICAgaWYgKGFsd2F5c1Nob3dOYXYpIHtcclxuICAgICAgICAgICAgLy8gYWx0ZXJuYXRpdmVzIHRoaXMuJGxpZ2h0Ym94LmZpbmQoJy5sYi1uZXh0JykuY3NzKCdvcGFjaXR5JywgJzEnKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyZXJSZWYuc2V0U3R5bGUodGhpcy5fcmlnaHRBcnJvd0VsZW0ubmF0aXZlRWxlbWVudCwgJ29wYWNpdHknLCAnMScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfc2hvd0xlZnRBcnJvd05hdigpOiB2b2lkIHtcclxuICAgIHRoaXMudWkuc2hvd0xlZnRBcnJvdyA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9zaG93UmlnaHRBcnJvd05hdigpOiB2b2lkIHtcclxuICAgIHRoaXMudWkuc2hvd1JpZ2h0QXJyb3cgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfc2hvd0Fycm93TmF2KCk6IHZvaWQge1xyXG4gICAgdGhpcy51aS5zaG93QXJyb3dOYXYgPSAodGhpcy5hbGJ1bS5sZW5ndGggIT09IDEpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZW5hYmxlS2V5Ym9hcmROYXYoKTogdm9pZCB7XHJcbiAgICB0aGlzLl9ldmVudC5rZXl1cCA9IHRoaXMuX3JlbmRlcmVyUmVmLmxpc3RlbignZG9jdW1lbnQnLCAna2V5dXAnLCAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICB0aGlzLl9rZXlib2FyZEFjdGlvbihldmVudCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2Rpc2FibGVLZXlib2FyZE5hdigpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl9ldmVudC5rZXl1cCkge1xyXG4gICAgICB0aGlzLl9ldmVudC5rZXl1cCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfa2V5Ym9hcmRBY3Rpb24oJGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIGNvbnN0IEtFWUNPREVfRVNDID0gMjc7XHJcbiAgICBjb25zdCBLRVlDT0RFX0xFRlRBUlJPVyA9IDM3O1xyXG4gICAgY29uc3QgS0VZQ09ERV9SSUdIVEFSUk9XID0gMzk7XHJcbiAgICBjb25zdCBrZXljb2RlID0gJGV2ZW50LmtleUNvZGU7XHJcbiAgICBjb25zdCBrZXkgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGtleWNvZGUpLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgaWYgKGtleWNvZGUgPT09IEtFWUNPREVfRVNDIHx8IGtleS5tYXRjaCgveHxvfGMvKSkge1xyXG4gICAgICB0aGlzLl9saWdodGJveEV2ZW50LmJyb2FkY2FzdExpZ2h0Ym94RXZlbnQoeyBpZDogTElHSFRCT1hfRVZFTlQuQ0xPU0UsIGRhdGE6IG51bGwgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3AnIHx8IGtleWNvZGUgPT09IEtFWUNPREVfTEVGVEFSUk9XKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgdGhpcy5fY2hhbmdlSW1hZ2UodGhpcy5jdXJyZW50SW1hZ2VJbmRleCAtIDEpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy53cmFwQXJvdW5kICYmIHRoaXMuYWxidW0ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZUltYWdlKHRoaXMuYWxidW0ubGVuZ3RoIC0gMSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnbicgfHwga2V5Y29kZSA9PT0gS0VZQ09ERV9SSUdIVEFSUk9XKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUluZGV4ICE9PSB0aGlzLmFsYnVtLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICB0aGlzLl9jaGFuZ2VJbWFnZSh0aGlzLmN1cnJlbnRJbWFnZUluZGV4ICsgMSk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLndyYXBBcm91bmQgJiYgdGhpcy5hbGJ1bS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgdGhpcy5fY2hhbmdlSW1hZ2UoMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2dldENzc1N0eWxlVmFsdWUoZWxlbTogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLl93aW5kb3dSZWZcclxuICAgICAgLmdldENvbXB1dGVkU3R5bGUoZWxlbS5uYXRpdmVFbGVtZW50LCBudWxsKVxyXG4gICAgICAuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eU5hbWUpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX29uUmVjZWl2ZWRFdmVudChldmVudDogSUV2ZW50KTogdm9pZCB7XHJcbiAgICBzd2l0Y2ggKGV2ZW50LmlkKSB7XHJcbiAgICAgIGNhc2UgTElHSFRCT1hfRVZFTlQuQ0xPU0U6XHJcbiAgICAgICAgdGhpcy5fZW5kKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmVlZHNJZnJhbWUoc3JjOiBzdHJpbmcpIHtcclxuICAgIC8vIGNvbnN0IHNhbml0aXplZFVybCA9IHRoaXMuX3Nhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuVVJMLCBzcmMpO1xyXG4gICAgaWYgKHNyYy5tYXRjaCgvXFwucGRmJC8pKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG4iLCI8ZGl2IGNsYXNzPVwibGItb3V0ZXJDb250YWluZXIgdHJhbnNpdGlvblwiICNvdXRlckNvbnRhaW5lciBpZD1cIm91dGVyQ29udGFpbmVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwibGItY29udGFpbmVyXCIgI2NvbnRhaW5lciBpZD1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxpbWcgY2xhc3M9XCJsYi1pbWFnZVwiIGlkPVwiaW1hZ2VcIiBbc3JjXT1cImFsYnVtW2N1cnJlbnRJbWFnZUluZGV4XS5zcmNcIiBjbGFzcz1cImxiLWltYWdlIGFuaW1hdGlvbiBmYWRlSW5cIlxyXG4gICAgICAgICAgICBbaGlkZGVuXT1cInVpLnNob3dSZWxvYWRlclwiICNpbWFnZVxyXG4gICAgICAgICAgICAqbmdJZj1cIiFhbGJ1bVtjdXJyZW50SW1hZ2VJbmRleF0uaWZyYW1lICYmICFuZWVkc0lmcmFtZShhbGJ1bVtjdXJyZW50SW1hZ2VJbmRleF0uc3JjKVwiPlxyXG4gICAgICAgIDxpZnJhbWUgY2xhc3M9XCJsYi1pbWFnZVwiIGlkPVwiaWZyYW1lXCIgW3NyY109XCJhbGJ1bVtjdXJyZW50SW1hZ2VJbmRleF0uc3JjIHwgc2FmZVwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwibGItaW1hZ2UgbGItaWZyYW1lIGFuaW1hdGlvbiBmYWRlSW5cIiBbaGlkZGVuXT1cInVpLnNob3dSZWxvYWRlclwiICNpZnJhbWVcclxuICAgICAgICAgICAgKm5nSWY9XCJhbGJ1bVtjdXJyZW50SW1hZ2VJbmRleF0uaWZyYW1lIHx8IG5lZWRzSWZyYW1lKGFsYnVtW2N1cnJlbnRJbWFnZUluZGV4XS5zcmMpXCI+XHJcbiAgICAgICAgPC9pZnJhbWU+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImxiLW5hdlwiIFtoaWRkZW5dPVwiIXVpLnNob3dBcnJvd05hdlwiICNuYXZBcnJvdz5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJsYi1wcmV2XCIgW2hpZGRlbl09XCIhdWkuc2hvd0xlZnRBcnJvd1wiIChjbGljayk9XCJwcmV2SW1hZ2UoKVwiICNsZWZ0QXJyb3c+PC9hPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cImxiLW5leHRcIiBbaGlkZGVuXT1cIiF1aS5zaG93UmlnaHRBcnJvd1wiIChjbGljayk9XCJuZXh0SW1hZ2UoKVwiICNyaWdodEFycm93PjwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibGItbG9hZGVyXCIgW2hpZGRlbl09XCIhdWkuc2hvd1JlbG9hZGVyXCIgKGNsaWNrKT1cImNsb3NlKCRldmVudClcIj5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJsYi1jYW5jZWxcIj48L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbjxkaXYgY2xhc3M9XCJsYi1kYXRhQ29udGFpbmVyXCIgW2hpZGRlbl09XCJ1aS5zaG93UmVsb2FkZXJcIiAjZGF0YUNvbnRhaW5lcj5cclxuICAgIDxkaXYgY2xhc3M9XCJsYi1kYXRhXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImxiLWRldGFpbHNcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYi1jYXB0aW9uIGFuaW1hdGlvbiBmYWRlSW5cIiBbaGlkZGVuXT1cIiF1aS5zaG93Q2FwdGlvblwiXHJcbiAgICAgICAgICAgICAgICBbaW5uZXJIdG1sXT1cImFsYnVtW2N1cnJlbnRJbWFnZUluZGV4XS5jYXB0aW9uXCIgI2NhcHRpb24+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYi1udW1iZXIgYW5pbWF0aW9uIGZhZGVJblwiIFtoaWRkZW5dPVwiIXVpLnNob3dQYWdlTnVtYmVyXCIgI251bWJlcj57eyBjb250ZW50LnBhZ2VOdW1iZXJcclxuICAgICAgICAgICAgICAgIH19PC9zcGFuPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsYi1jb250cm9sQ29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYi1jbG9zZUNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJsYi1jbG9zZVwiIChjbGljayk9XCJjbG9zZSgkZXZlbnQpXCI+PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxiLXR1cm5Db250YWluZXJcIiBbaGlkZGVuXT1cIiF1aS5zaG93Um90YXRlQnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImxiLXR1cm5MZWZ0XCIgKGNsaWNrKT1cImNvbnRyb2woJGV2ZW50KVwiPjwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibGItdHVyblJpZ2h0XCIgKGNsaWNrKT1cImNvbnRyb2woJGV2ZW50KVwiPjwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsYi16b29tQ29udGFpbmVyXCIgW2hpZGRlbl09XCIhdWkuc2hvd1pvb21CdXR0b25cIj5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibGItem9vbU91dFwiIChjbGljayk9XCJjb250cm9sKCRldmVudClcIj48L2E+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImxiLXpvb21JblwiIChjbGljayk9XCJjb250cm9sKCRldmVudClcIj48L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PiJdfQ==
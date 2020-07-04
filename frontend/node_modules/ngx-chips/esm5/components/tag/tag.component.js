import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter, TemplateRef, ElementRef, HostListener, HostBinding, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { TagRipple } from '../tag/tag-ripple.component';
// mocking navigator
var navigator = typeof window !== 'undefined' ? window.navigator : {
    userAgent: 'Chrome',
    vendor: 'Google Inc'
};
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var TagComponent = /** @class */ (function () {
    function TagComponent(element, renderer, cdRef) {
        this.element = element;
        this.renderer = renderer;
        this.cdRef = cdRef;
        /**
         * @name disabled
         */
        this.disabled = false;
        /**
         * @name onSelect
         */
        this.onSelect = new EventEmitter();
        /**
         * @name onRemove
         */
        this.onRemove = new EventEmitter();
        /**
         * @name onBlur
         */
        this.onBlur = new EventEmitter();
        /**
         * @name onKeyDown
         */
        this.onKeyDown = new EventEmitter();
        /**
         * @name onTagEdited
         */
        this.onTagEdited = new EventEmitter();
        /**
         * @name editing
         */
        this.editing = false;
        /**
         * @name rippleState
         */
        this.rippleState = 'none';
    }
    Object.defineProperty(TagComponent.prototype, "readonly", {
        /**
         * @name readonly {boolean}
         */
        get: function () {
            return typeof this.model !== 'string' && this.model.readonly === true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @name select
     */
    TagComponent.prototype.select = function ($event) {
        if (this.readonly || this.disabled) {
            return;
        }
        if ($event) {
            $event.stopPropagation();
        }
        this.focus();
        this.onSelect.emit(this.model);
    };
    /**
     * @name remove
     */
    TagComponent.prototype.remove = function ($event) {
        $event.stopPropagation();
        this.onRemove.emit(this);
    };
    /**
     * @name focus
     */
    TagComponent.prototype.focus = function () {
        this.element.nativeElement.focus();
    };
    TagComponent.prototype.move = function () {
        this.moving = true;
    };
    /**
     * @name keydown
     * @param event
     */
    TagComponent.prototype.keydown = function (event) {
        if (this.editing) {
            if (event.keyCode === 13) {
                return this.disableEditMode(event);
            }
        }
        else {
            this.onKeyDown.emit({ event: event, model: this.model });
        }
    };
    /**
     * @name blink
     */
    TagComponent.prototype.blink = function () {
        var classList = this.element.nativeElement.classList;
        classList.add('blink');
        setTimeout(function () { return classList.remove('blink'); }, 50);
    };
    /**
     * @name toggleEditMode
     */
    TagComponent.prototype.toggleEditMode = function () {
        if (this.editable) {
            return this.editing ? undefined : this.activateEditMode();
        }
    };
    /**
     * @name onBlurred
     * @param event
     */
    TagComponent.prototype.onBlurred = function (event) {
        var _a;
        // Checks if it is editable first before handeling the onBlurred event in order to prevent
        // a bug in IE where tags are still editable with onlyFromAutocomplete set to true
        if (!this.editable) {
            return;
        }
        this.disableEditMode();
        var value = event.target.innerText;
        var result = typeof this.model === 'string'
            ? value
            : tslib_1.__assign({}, this.model, (_a = {}, _a[this.displayBy] = value, _a));
        this.onBlur.emit(result);
    };
    /**
     * @name getDisplayValue
     * @param item
     */
    TagComponent.prototype.getDisplayValue = function (item) {
        return typeof item === 'string' ? item : item[this.displayBy];
    };
    Object.defineProperty(TagComponent.prototype, "isRippleVisible", {
        /**
         * @desc returns whether the ripple is visible or not
         * only works in Chrome
         * @name isRippleVisible
         */
        get: function () {
            return !this.readonly && !this.editing && isChrome && this.hasRipple;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @name disableEditMode
     * @param $event
     */
    TagComponent.prototype.disableEditMode = function ($event) {
        var classList = this.element.nativeElement.classList;
        var input = this.getContentEditableText();
        this.editing = false;
        classList.remove('tag--editing');
        if (!input) {
            this.setContentEditableText(this.model);
            return;
        }
        this.storeNewValue(input);
        this.cdRef.detectChanges();
        if ($event) {
            $event.preventDefault();
        }
    };
    /**
     * @name isDeleteIconVisible
     */
    TagComponent.prototype.isDeleteIconVisible = function () {
        return (!this.readonly && !this.disabled && this.removable && !this.editing);
    };
    /**
     * @name getContentEditableText
     */
    TagComponent.prototype.getContentEditableText = function () {
        var input = this.getContentEditable();
        return input ? input.innerText.trim() : '';
    };
    /**
     * @name setContentEditableText
     * @param model
     */
    TagComponent.prototype.setContentEditableText = function (model) {
        var input = this.getContentEditable();
        var value = this.getDisplayValue(model);
        input.innerText = value;
    };
    /**
     * @name
     */
    TagComponent.prototype.activateEditMode = function () {
        var classList = this.element.nativeElement.classList;
        classList.add('tag--editing');
        this.editing = true;
    };
    /**
     * @name storeNewValue
     * @param input
     */
    TagComponent.prototype.storeNewValue = function (input) {
        var _a;
        var _this = this;
        var exists = function (tag) {
            return typeof tag === 'string'
                ? tag === input
                : tag[_this.displayBy] === input;
        };
        var hasId = function () {
            return _this.model[_this.identifyBy] !== _this.model[_this.displayBy];
        };
        // if the value changed, replace the value in the model
        if (exists(this.model)) {
            return;
        }
        var model = typeof this.model === 'string'
            ? input
            : (_a = {
                    index: this.index
                },
                _a[this.identifyBy] = hasId()
                    ? this.model[this.identifyBy]
                    : input,
                _a[this.displayBy] = input,
                _a);
        if (this.canAddTag(model)) {
            this.onTagEdited.emit({ tag: model, index: this.index });
        }
        else {
            this.setContentEditableText(this.model);
        }
    };
    /**
     * @name getContentEditable
     */
    TagComponent.prototype.getContentEditable = function () {
        return this.element.nativeElement.querySelector('[contenteditable]');
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], TagComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], TagComponent.prototype, "removable", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], TagComponent.prototype, "editable", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", TemplateRef)
    ], TagComponent.prototype, "template", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], TagComponent.prototype, "displayBy", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], TagComponent.prototype, "identifyBy", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], TagComponent.prototype, "index", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], TagComponent.prototype, "hasRipple", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], TagComponent.prototype, "disabled", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Function)
    ], TagComponent.prototype, "canAddTag", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], TagComponent.prototype, "onSelect", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], TagComponent.prototype, "onRemove", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], TagComponent.prototype, "onBlur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], TagComponent.prototype, "onKeyDown", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], TagComponent.prototype, "onTagEdited", void 0);
    tslib_1.__decorate([
        HostBinding('class.moving'),
        tslib_1.__metadata("design:type", Boolean)
    ], TagComponent.prototype, "moving", void 0);
    tslib_1.__decorate([
        ViewChild(TagRipple, { static: false }),
        tslib_1.__metadata("design:type", TagRipple)
    ], TagComponent.prototype, "ripple", void 0);
    tslib_1.__decorate([
        HostListener('keydown', ['$event']),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], TagComponent.prototype, "keydown", null);
    TagComponent = tslib_1.__decorate([
        Component({
            selector: 'tag',
            template: "<div (click)=\"select($event)\"\n     (dblclick)=\"toggleEditMode()\"\n     (mousedown)=\"rippleState='clicked'\"\n     (mouseup)=\"rippleState='none'\"\n     [ngSwitch]=\"!!template\"\n     [class.disabled]=\"disabled\"\n     [attr.tabindex]=\"-1\"\n     [attr.aria-label]=\"getDisplayValue(model)\">\n\n    <div *ngSwitchCase=\"true\" [attr.contenteditable]=\"editing\">\n        <!-- CUSTOM TEMPLATE -->\n        <ng-template\n            [ngTemplateOutletContext]=\"{ item: model, index: index }\"\n            [ngTemplateOutlet]=\"template\">\n        </ng-template>\n    </div>\n\n    <div *ngSwitchCase=\"false\" class=\"tag-wrapper\">\n        <!-- TAG NAME -->\n        <div [attr.contenteditable]=\"editing\"\n             [attr.title]=\"getDisplayValue(model)\"\n             class=\"tag__text inline\"\n             spellcheck=\"false\"\n             (keydown.enter)=\"disableEditMode($event)\"\n             (keydown.escape)=\"disableEditMode($event)\"\n             (click)=\"editing ? $event.stopPropagation() : undefined\"\n             (blur)=\"onBlurred($event)\">\n            {{ getDisplayValue(model) }}\n        </div>\n\n        <!-- 'X' BUTTON -->\n        <delete-icon\n            aria-label=\"Remove tag\"\n            role=\"button\"\n            (click)=\"remove($event)\"\n            *ngIf=\"isDeleteIconVisible()\">\n        </delete-icon>\n    </div>\n</div>\n\n<tag-ripple [state]=\"rippleState\"\n            [attr.tabindex]=\"-1\"\n            *ngIf=\"isRippleVisible\">\n</tag-ripple>\n",
            styles: [":host,:host>div,:host>div:focus{outline:0;overflow:hidden;transition:opacity 1s;z-index:1}:host{max-width:400px}:host.blink{-webkit-animation:.3s ease-in-out forwards blink;animation:.3s ease-in-out forwards blink}@-webkit-keyframes blink{0%{opacity:.3}}@keyframes blink{0%{opacity:.3}}:host .disabled{cursor:not-allowed}:host [contenteditable=true]{outline:0}.tag-wrapper{flex-direction:row;display:flex}.tag__text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"]
        }),
        tslib_1.__metadata("design:paramtypes", [ElementRef,
            Renderer2,
            ChangeDetectorRef])
    ], TagComponent);
    return TagComponent;
}());
export { TagComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jaGlwcy8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdGFnL3RhZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osV0FBVyxFQUNYLFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUd4RCxvQkFBb0I7QUFDcEIsSUFBTSxTQUFTLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqRSxTQUFTLEVBQUUsUUFBUTtJQUNuQixNQUFNLEVBQUUsWUFBWTtDQUN2QixDQUFDO0FBRUYsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFPM0Y7SUF3SEksc0JBQ1csT0FBbUIsRUFDbkIsUUFBbUIsRUFDbEIsS0FBd0I7UUFGekIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ2xCLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBMUVwQzs7V0FFRztRQUVJLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFReEI7O1dBRUc7UUFFSSxhQUFRLEdBQTJCLElBQUksWUFBWSxFQUFZLENBQUM7UUFFdkU7O1dBRUc7UUFFSSxhQUFRLEdBQTJCLElBQUksWUFBWSxFQUFZLENBQUM7UUFFdkU7O1dBRUc7UUFFSSxXQUFNLEdBQTJCLElBQUksWUFBWSxFQUFZLENBQUM7UUFF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bURBQ2tCO0lBTTFCO1FBREMsS0FBSyxFQUFFOztrREFDaUI7SUFNekI7UUFEQyxLQUFLLEVBQUU7MENBQ1MsV0FBVztrREFBTTtJQU1sQztRQURDLEtBQUssRUFBRTs7bURBQ2lCO0lBTXpCO1FBREMsS0FBSyxFQUFFOztvREFDa0I7SUFNMUI7UUFEQyxLQUFLLEVBQUU7OytDQUNhO0lBTXJCO1FBREMsS0FBSyxFQUFFOzttREFDa0I7SUFNMUI7UUFEQyxLQUFLLEVBQUU7O2tEQUNnQjtJQU14QjtRQURDLEtBQUssRUFBRTs7bURBQ3FDO0lBTTdDO1FBREMsTUFBTSxFQUFFOzBDQUNRLFlBQVk7a0RBQTBDO0lBTXZFO1FBREMsTUFBTSxFQUFFOzBDQUNRLFlBQVk7a0RBQTBDO0lBTXZFO1FBREMsTUFBTSxFQUFFOzBDQUNNLFlBQVk7Z0RBQTBDO0lBTXJFO1FBREMsTUFBTSxFQUFFOzBDQUNTLFlBQVk7bURBQWdDO0lBTTlEO1FBREMsTUFBTSxFQUFFOzBDQUNXLFlBQVk7cURBQTBDO0lBa0IxRTtRQURDLFdBQVcsQ0FBQyxjQUFjLENBQUM7O2dEQUNMO0lBV3ZCO1FBREMsU0FBUyxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQzswQ0FDekIsU0FBUztnREFBQztJQWlEekI7UUFEQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7K0NBU25DO0lBL0tRLFlBQVk7UUFMeEIsU0FBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLEtBQUs7WUFDZiwrL0NBQWtDOztTQUVyQyxDQUFDO2lEQTBIc0IsVUFBVTtZQUNULFNBQVM7WUFDWCxpQkFBaUI7T0EzSDNCLFlBQVksQ0FzVnhCO0lBQUQsbUJBQUM7Q0FBQSxBQXRWRCxJQXNWQztTQXRWWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBFbGVtZW50UmVmLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBIb3N0QmluZGluZyxcbiAgICBWaWV3Q2hpbGQsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgUmVuZGVyZXIyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBUYWdNb2RlbCB9IGZyb20gJy4uLy4uL2NvcmUvYWNjZXNzb3InO1xuaW1wb3J0IHsgVGFnUmlwcGxlIH0gZnJvbSAnLi4vdGFnL3RhZy1yaXBwbGUuY29tcG9uZW50JztcbmltcG9ydCB7IEV2ZW50TGlrZSB9IGZyb20gJy4uLy4uL2NvcmUvaGVscGVycy9ldmVudC1saWtlJztcblxuLy8gbW9ja2luZyBuYXZpZ2F0b3JcbmNvbnN0IG5hdmlnYXRvciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm5hdmlnYXRvciA6IHtcbiAgICB1c2VyQWdlbnQ6ICdDaHJvbWUnLFxuICAgIHZlbmRvcjogJ0dvb2dsZSBJbmMnXG59O1xuXG5jb25zdCBpc0Nocm9tZSA9IC9DaHJvbWUvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0dvb2dsZSBJbmMvLnRlc3QobmF2aWdhdG9yLnZlbmRvcik7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGFnJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdGFnLnRlbXBsYXRlLmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL3RhZy1jb21wb25lbnQuc3R5bGUuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFRhZ0NvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogQG5hbWUgbW9kZWwge1RhZ01vZGVsfVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1vZGVsOiBUYWdNb2RlbDtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJlbW92YWJsZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByZW1vdmFibGU6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBlZGl0YWJsZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBlZGl0YWJsZTogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRlbXBsYXRlIHtUZW1wbGF0ZVJlZjxhbnk+fVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZGlzcGxheUJ5IHtzdHJpbmd9XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGlzcGxheUJ5OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpZGVudGlmeUJ5IHtzdHJpbmd9XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWRlbnRpZnlCeTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaW5kZXgge251bWJlcn1cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpbmRleDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaGFzUmlwcGxlXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaGFzUmlwcGxlOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZGlzYWJsZWRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgY2FuQWRkVGFnXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2FuQWRkVGFnOiAodGFnOiBUYWdNb2RlbCkgPT4gYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uU2VsZWN0XG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+ID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uUmVtb3ZlXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uUmVtb3ZlOiBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+ID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uQmx1clxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBvbkJsdXI6IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25LZXlEb3duXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uS2V5RG93bjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uVGFnRWRpdGVkXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uVGFnRWRpdGVkOiBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+ID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJlYWRvbmx5IHtib29sZWFufVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcmVhZG9ubHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5tb2RlbCAhPT0gJ3N0cmluZycgJiYgdGhpcy5tb2RlbC5yZWFkb25seSA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBlZGl0aW5nXG4gICAgICovXG4gICAgcHVibGljIGVkaXRpbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG1vdmluZ1xuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MubW92aW5nJylcbiAgICBwdWJsaWMgbW92aW5nOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmlwcGxlU3RhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmlwcGxlU3RhdGUgPSAnbm9uZSc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSByaXBwbGUge1RhZ1JpcHBsZX1cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKFRhZ1JpcHBsZSwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gICAgcHVibGljIHJpcHBsZTogVGFnUmlwcGxlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgICAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgcHJpdmF0ZSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgICApIHt9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZWxlY3RcbiAgICAgKi9cbiAgICBwdWJsaWMgc2VsZWN0KCRldmVudD86IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZG9ubHkgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mb2N1cygpO1xuXG4gICAgICAgIHRoaXMub25TZWxlY3QuZW1pdCh0aGlzLm1vZGVsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSByZW1vdmVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlKCRldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMub25SZW1vdmUuZW1pdCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBmb2N1c1xuICAgICAqL1xuICAgIHB1YmxpYyBmb2N1cygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW92ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGtleWRvd25cbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgICBwdWJsaWMga2V5ZG93bihldmVudDogRXZlbnRMaWtlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmVkaXRpbmcpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRpc2FibGVFZGl0TW9kZShldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uS2V5RG93bi5lbWl0KHsgZXZlbnQsIG1vZGVsOiB0aGlzLm1vZGVsIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYmxpbmtcbiAgICAgKi9cbiAgICBwdWJsaWMgYmxpbmsoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdDtcbiAgICAgICAgY2xhc3NMaXN0LmFkZCgnYmxpbmsnKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNsYXNzTGlzdC5yZW1vdmUoJ2JsaW5rJyksIDUwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB0b2dnbGVFZGl0TW9kZVxuICAgICAqL1xuICAgIHB1YmxpYyB0b2dnbGVFZGl0TW9kZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZWRpdGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVkaXRpbmcgPyB1bmRlZmluZWQgOiB0aGlzLmFjdGl2YXRlRWRpdE1vZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uQmx1cnJlZFxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkJsdXJyZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICAvLyBDaGVja3MgaWYgaXQgaXMgZWRpdGFibGUgZmlyc3QgYmVmb3JlIGhhbmRlbGluZyB0aGUgb25CbHVycmVkIGV2ZW50IGluIG9yZGVyIHRvIHByZXZlbnRcbiAgICAgICAgLy8gYSBidWcgaW4gSUUgd2hlcmUgdGFncyBhcmUgc3RpbGwgZWRpdGFibGUgd2l0aCBvbmx5RnJvbUF1dG9jb21wbGV0ZSBzZXQgdG8gdHJ1ZVxuICAgICAgICBpZiAoIXRoaXMuZWRpdGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzYWJsZUVkaXRNb2RlKCk7XG5cbiAgICAgICAgY29uc3QgdmFsdWU6IHN0cmluZyA9IGV2ZW50LnRhcmdldC5pbm5lclRleHQ7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgICAgICB0eXBlb2YgdGhpcy5tb2RlbCA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IHZhbHVlXG4gICAgICAgICAgICAgICAgOiB7IC4uLnRoaXMubW9kZWwsIFt0aGlzLmRpc3BsYXlCeV06IHZhbHVlIH07XG5cbiAgICAgICAgdGhpcy5vbkJsdXIuZW1pdChyZXN1bHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldERpc3BsYXlWYWx1ZVxuICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICovXG4gICAgcHVibGljIGdldERpc3BsYXlWYWx1ZShpdGVtOiBUYWdNb2RlbCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgPyBpdGVtIDogaXRlbVt0aGlzLmRpc3BsYXlCeV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIHRoZSByaXBwbGUgaXMgdmlzaWJsZSBvciBub3RcbiAgICAgKiBvbmx5IHdvcmtzIGluIENocm9tZVxuICAgICAqIEBuYW1lIGlzUmlwcGxlVmlzaWJsZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgaXNSaXBwbGVWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMuZWRpdGluZyAmJiBpc0Nocm9tZSAmJiB0aGlzLmhhc1JpcHBsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkaXNhYmxlRWRpdE1vZGVcbiAgICAgKiBAcGFyYW0gJGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIGRpc2FibGVFZGl0TW9kZSgkZXZlbnQ/OiBFdmVudExpa2UpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0Q29udGVudEVkaXRhYmxlVGV4dCgpO1xuXG4gICAgICAgIHRoaXMuZWRpdGluZyA9IGZhbHNlO1xuICAgICAgICBjbGFzc0xpc3QucmVtb3ZlKCd0YWctLWVkaXRpbmcnKTtcblxuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnRFZGl0YWJsZVRleHQodGhpcy5tb2RlbCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JlTmV3VmFsdWUoaW5wdXQpO1xuICAgICAgICB0aGlzLmNkUmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICBpZiAoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlzRGVsZXRlSWNvblZpc2libGVcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNEZWxldGVJY29uVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLmRpc2FibGVkICYmIHRoaXMucmVtb3ZhYmxlICYmICF0aGlzLmVkaXRpbmdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBnZXRDb250ZW50RWRpdGFibGVUZXh0XG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRDb250ZW50RWRpdGFibGVUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZXRDb250ZW50RWRpdGFibGUoKTtcblxuICAgICAgICByZXR1cm4gaW5wdXQgPyBpbnB1dC5pbm5lclRleHQudHJpbSgpIDogJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0Q29udGVudEVkaXRhYmxlVGV4dFxuICAgICAqIEBwYXJhbSBtb2RlbFxuICAgICAqL1xuICAgIHByaXZhdGUgc2V0Q29udGVudEVkaXRhYmxlVGV4dChtb2RlbDogVGFnTW9kZWwpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldENvbnRlbnRFZGl0YWJsZSgpO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0RGlzcGxheVZhbHVlKG1vZGVsKTtcblxuICAgICAgICBpbnB1dC5pbm5lclRleHQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZVxuICAgICAqL1xuICAgIHByaXZhdGUgYWN0aXZhdGVFZGl0TW9kZSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgICBjbGFzc0xpc3QuYWRkKCd0YWctLWVkaXRpbmcnKTtcblxuICAgICAgICB0aGlzLmVkaXRpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHN0b3JlTmV3VmFsdWVcbiAgICAgKiBAcGFyYW0gaW5wdXRcbiAgICAgKi9cbiAgICBwcml2YXRlIHN0b3JlTmV3VmFsdWUoaW5wdXQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBleGlzdHMgPSAodGFnOiBUYWdNb2RlbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgPyB0YWcgPT09IGlucHV0XG4gICAgICAgICAgICAgICAgOiB0YWdbdGhpcy5kaXNwbGF5QnldID09PSBpbnB1dDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBoYXNJZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsW3RoaXMuaWRlbnRpZnlCeV0gIT09IHRoaXMubW9kZWxbdGhpcy5kaXNwbGF5QnldO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGlmIHRoZSB2YWx1ZSBjaGFuZ2VkLCByZXBsYWNlIHRoZSB2YWx1ZSBpbiB0aGUgbW9kZWxcbiAgICAgICAgaWYgKGV4aXN0cyh0aGlzLm1vZGVsKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW9kZWwgPVxuICAgICAgICAgICAgdHlwZW9mIHRoaXMubW9kZWwgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgPyBpbnB1dFxuICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgIFt0aGlzLmlkZW50aWZ5QnldOiBoYXNJZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5tb2RlbFt0aGlzLmlkZW50aWZ5QnldXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgICAgW3RoaXMuZGlzcGxheUJ5XTogaW5wdXRcbiAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuY2FuQWRkVGFnKG1vZGVsKSkge1xuICAgICAgICAgICAgdGhpcy5vblRhZ0VkaXRlZC5lbWl0KHsgdGFnOiBtb2RlbCwgaW5kZXg6IHRoaXMuaW5kZXggfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnRFZGl0YWJsZVRleHQodGhpcy5tb2RlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBnZXRDb250ZW50RWRpdGFibGVcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldENvbnRlbnRFZGl0YWJsZSgpOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tjb250ZW50ZWRpdGFibGVdJyk7XG4gICAgfVxufVxuIl19
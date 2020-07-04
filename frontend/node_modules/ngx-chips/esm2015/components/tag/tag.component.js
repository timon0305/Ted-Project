import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter, TemplateRef, ElementRef, HostListener, HostBinding, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { TagRipple } from '../tag/tag-ripple.component';
// mocking navigator
const navigator = typeof window !== 'undefined' ? window.navigator : {
    userAgent: 'Chrome',
    vendor: 'Google Inc'
};
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
let TagComponent = class TagComponent {
    constructor(element, renderer, cdRef) {
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
    /**
     * @name readonly {boolean}
     */
    get readonly() {
        return typeof this.model !== 'string' && this.model.readonly === true;
    }
    /**
     * @name select
     */
    select($event) {
        if (this.readonly || this.disabled) {
            return;
        }
        if ($event) {
            $event.stopPropagation();
        }
        this.focus();
        this.onSelect.emit(this.model);
    }
    /**
     * @name remove
     */
    remove($event) {
        $event.stopPropagation();
        this.onRemove.emit(this);
    }
    /**
     * @name focus
     */
    focus() {
        this.element.nativeElement.focus();
    }
    move() {
        this.moving = true;
    }
    /**
     * @name keydown
     * @param event
     */
    keydown(event) {
        if (this.editing) {
            if (event.keyCode === 13) {
                return this.disableEditMode(event);
            }
        }
        else {
            this.onKeyDown.emit({ event, model: this.model });
        }
    }
    /**
     * @name blink
     */
    blink() {
        const classList = this.element.nativeElement.classList;
        classList.add('blink');
        setTimeout(() => classList.remove('blink'), 50);
    }
    /**
     * @name toggleEditMode
     */
    toggleEditMode() {
        if (this.editable) {
            return this.editing ? undefined : this.activateEditMode();
        }
    }
    /**
     * @name onBlurred
     * @param event
     */
    onBlurred(event) {
        // Checks if it is editable first before handeling the onBlurred event in order to prevent
        // a bug in IE where tags are still editable with onlyFromAutocomplete set to true
        if (!this.editable) {
            return;
        }
        this.disableEditMode();
        const value = event.target.innerText;
        const result = typeof this.model === 'string'
            ? value
            : Object.assign({}, this.model, { [this.displayBy]: value });
        this.onBlur.emit(result);
    }
    /**
     * @name getDisplayValue
     * @param item
     */
    getDisplayValue(item) {
        return typeof item === 'string' ? item : item[this.displayBy];
    }
    /**
     * @desc returns whether the ripple is visible or not
     * only works in Chrome
     * @name isRippleVisible
     */
    get isRippleVisible() {
        return !this.readonly && !this.editing && isChrome && this.hasRipple;
    }
    /**
     * @name disableEditMode
     * @param $event
     */
    disableEditMode($event) {
        const classList = this.element.nativeElement.classList;
        const input = this.getContentEditableText();
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
    }
    /**
     * @name isDeleteIconVisible
     */
    isDeleteIconVisible() {
        return (!this.readonly && !this.disabled && this.removable && !this.editing);
    }
    /**
     * @name getContentEditableText
     */
    getContentEditableText() {
        const input = this.getContentEditable();
        return input ? input.innerText.trim() : '';
    }
    /**
     * @name setContentEditableText
     * @param model
     */
    setContentEditableText(model) {
        const input = this.getContentEditable();
        const value = this.getDisplayValue(model);
        input.innerText = value;
    }
    /**
     * @name
     */
    activateEditMode() {
        const classList = this.element.nativeElement.classList;
        classList.add('tag--editing');
        this.editing = true;
    }
    /**
     * @name storeNewValue
     * @param input
     */
    storeNewValue(input) {
        const exists = (tag) => {
            return typeof tag === 'string'
                ? tag === input
                : tag[this.displayBy] === input;
        };
        const hasId = () => {
            return this.model[this.identifyBy] !== this.model[this.displayBy];
        };
        // if the value changed, replace the value in the model
        if (exists(this.model)) {
            return;
        }
        const model = typeof this.model === 'string'
            ? input
            : {
                index: this.index,
                [this.identifyBy]: hasId()
                    ? this.model[this.identifyBy]
                    : input,
                [this.displayBy]: input
            };
        if (this.canAddTag(model)) {
            this.onTagEdited.emit({ tag: model, index: this.index });
        }
        else {
            this.setContentEditableText(this.model);
        }
    }
    /**
     * @name getContentEditable
     */
    getContentEditable() {
        return this.element.nativeElement.querySelector('[contenteditable]');
    }
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
export { TagComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jaGlwcy8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdGFnL3RhZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osV0FBVyxFQUNYLFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUd4RCxvQkFBb0I7QUFDcEIsTUFBTSxTQUFTLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqRSxTQUFTLEVBQUUsUUFBUTtJQUNuQixNQUFNLEVBQUUsWUFBWTtDQUN2QixDQUFDO0FBRUYsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFPM0YsSUFBYSxZQUFZLEdBQXpCLE1BQWEsWUFBWTtJQXdIckIsWUFDVyxPQUFtQixFQUNuQixRQUFtQixFQUNsQixLQUF3QjtRQUZ6QixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbEIsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUExRXBDOztXQUVHO1FBRUksYUFBUSxHQUFHLEtBQUssQ0FBQztRQVF4Qjs7V0FFRztRQUVJLGFBQVEsR0FBMkIsSUFBSSxZQUFZLEVBQVksQ0FBQztRQUV2RTs7V0FFRztRQUVJLGFBQVEsR0FBMkIsSUFBSSxZQUFZLEVBQVksQ0FBQztRQUV2RTs7V0FFRztRQUVJLFdBQU0sR0FB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QztJQURDLEtBQUssRUFBRTs7K0NBQ2lCO0FBTXpCO0lBREMsS0FBSyxFQUFFOztnREFDa0I7QUFNMUI7SUFEQyxLQUFLLEVBQUU7OzJDQUNhO0FBTXJCO0lBREMsS0FBSyxFQUFFOzsrQ0FDa0I7QUFNMUI7SUFEQyxLQUFLLEVBQUU7OzhDQUNnQjtBQU14QjtJQURDLEtBQUssRUFBRTs7K0NBQ3FDO0FBTTdDO0lBREMsTUFBTSxFQUFFO3NDQUNRLFlBQVk7OENBQTBDO0FBTXZFO0lBREMsTUFBTSxFQUFFO3NDQUNRLFlBQVk7OENBQTBDO0FBTXZFO0lBREMsTUFBTSxFQUFFO3NDQUNNLFlBQVk7NENBQTBDO0FBTXJFO0lBREMsTUFBTSxFQUFFO3NDQUNTLFlBQVk7K0NBQWdDO0FBTTlEO0lBREMsTUFBTSxFQUFFO3NDQUNXLFlBQVk7aURBQTBDO0FBa0IxRTtJQURDLFdBQVcsQ0FBQyxjQUFjLENBQUM7OzRDQUNMO0FBV3ZCO0lBREMsU0FBUyxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQztzQ0FDekIsU0FBUzs0Q0FBQztBQWlEekI7SUFEQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7MkNBU25DO0FBL0tRLFlBQVk7SUFMeEIsU0FBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLEtBQUs7UUFDZiwrL0NBQWtDOztLQUVyQyxDQUFDOzZDQTBIc0IsVUFBVTtRQUNULFNBQVM7UUFDWCxpQkFBaUI7R0EzSDNCLFlBQVksQ0FzVnhCO1NBdFZZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBJbnB1dCxcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgSG9zdExpc3RlbmVyLFxuICAgIEhvc3RCaW5kaW5nLFxuICAgIFZpZXdDaGlsZCxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBSZW5kZXJlcjJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFRhZ01vZGVsIH0gZnJvbSAnLi4vLi4vY29yZS9hY2Nlc3Nvcic7XG5pbXBvcnQgeyBUYWdSaXBwbGUgfSBmcm9tICcuLi90YWcvdGFnLXJpcHBsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRXZlbnRMaWtlIH0gZnJvbSAnLi4vLi4vY29yZS9oZWxwZXJzL2V2ZW50LWxpa2UnO1xuXG4vLyBtb2NraW5nIG5hdmlnYXRvclxuY29uc3QgbmF2aWdhdG9yID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cubmF2aWdhdG9yIDoge1xuICAgIHVzZXJBZ2VudDogJ0Nocm9tZScsXG4gICAgdmVuZG9yOiAnR29vZ2xlIEluYydcbn07XG5cbmNvbnN0IGlzQ2hyb21lID0gL0Nocm9tZS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvR29vZ2xlIEluYy8udGVzdChuYXZpZ2F0b3IudmVuZG9yKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd0YWcnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi90YWcudGVtcGxhdGUuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vdGFnLWNvbXBvbmVudC5zdHlsZS5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVGFnQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICAgKiBAbmFtZSBtb2RlbCB7VGFnTW9kZWx9XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbW9kZWw6IFRhZ01vZGVsO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmVtb3ZhYmxlIHtib29sZWFufVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHJlbW92YWJsZTogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGVkaXRhYmxlIHtib29sZWFufVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGVkaXRhYmxlOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdGVtcGxhdGUge1RlbXBsYXRlUmVmPGFueT59XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkaXNwbGF5Qnkge3N0cmluZ31cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNwbGF5Qnk6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlkZW50aWZ5Qnkge3N0cmluZ31cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpZGVudGlmeUJ5OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbmRleCB7bnVtYmVyfVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGluZGV4OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBoYXNSaXBwbGVcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBoYXNSaXBwbGU6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkaXNhYmxlZFxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBjYW5BZGRUYWdcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBjYW5BZGRUYWc6ICh0YWc6IFRhZ01vZGVsKSA9PiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25TZWxlY3RcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25SZW1vdmVcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb25SZW1vdmU6IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25CbHVyXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uQmx1cjogRXZlbnRFbWl0dGVyPFRhZ01vZGVsPiA9IG5ldyBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbktleURvd25cbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb25LZXlEb3duOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25UYWdFZGl0ZWRcbiAgICAgKi9cbiAgICBAT3V0cHV0KClcbiAgICBwdWJsaWMgb25UYWdFZGl0ZWQ6IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmVhZG9ubHkge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHVibGljIGdldCByZWFkb25seSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLm1vZGVsICE9PSAnc3RyaW5nJyAmJiB0aGlzLm1vZGVsLnJlYWRvbmx5ID09PSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGVkaXRpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgZWRpdGluZyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgbW92aW5nXG4gICAgICovXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tb3ZpbmcnKVxuICAgIHB1YmxpYyBtb3Zpbmc6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSByaXBwbGVTdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyByaXBwbGVTdGF0ZSA9ICdub25lJztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJpcHBsZSB7VGFnUmlwcGxlfVxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoVGFnUmlwcGxlLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgICBwdWJsaWMgcmlwcGxlOiBUYWdSaXBwbGU7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICBwcml2YXRlIGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZlxuICAgICkge31cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlbGVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3QoJGV2ZW50PzogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5yZWFkb25seSB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvY3VzKCk7XG5cbiAgICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KHRoaXMubW9kZWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJlbW92ZVxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmUoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5vblJlbW92ZS5lbWl0KHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGZvY3VzXG4gICAgICovXG4gICAgcHVibGljIGZvY3VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBtb3ZlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vdmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUga2V5ZG93blxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBrZXlkb3duKGV2ZW50OiBFdmVudExpa2UpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZWRpdGluZykge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZUVkaXRNb2RlKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25LZXlEb3duLmVtaXQoeyBldmVudCwgbW9kZWw6IHRoaXMubW9kZWwgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBibGlua1xuICAgICAqL1xuICAgIHB1YmxpYyBibGluaygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgICBjbGFzc0xpc3QuYWRkKCdibGluaycpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2xhc3NMaXN0LnJlbW92ZSgnYmxpbmsnKSwgNTApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRvZ2dsZUVkaXRNb2RlXG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZUVkaXRNb2RlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5lZGl0YWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWRpdGluZyA/IHVuZGVmaW5lZCA6IHRoaXMuYWN0aXZhdGVFZGl0TW9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25CbHVycmVkXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIG9uQmx1cnJlZChldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIC8vIENoZWNrcyBpZiBpdCBpcyBlZGl0YWJsZSBmaXJzdCBiZWZvcmUgaGFuZGVsaW5nIHRoZSBvbkJsdXJyZWQgZXZlbnQgaW4gb3JkZXIgdG8gcHJldmVudFxuICAgICAgICAvLyBhIGJ1ZyBpbiBJRSB3aGVyZSB0YWdzIGFyZSBzdGlsbCBlZGl0YWJsZSB3aXRoIG9ubHlGcm9tQXV0b2NvbXBsZXRlIHNldCB0byB0cnVlXG4gICAgICAgIGlmICghdGhpcy5lZGl0YWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlRWRpdE1vZGUoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZTogc3RyaW5nID0gZXZlbnQudGFyZ2V0LmlubmVyVGV4dDtcbiAgICAgICAgY29uc3QgcmVzdWx0ID1cbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLm1vZGVsID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgID8gdmFsdWVcbiAgICAgICAgICAgICAgICA6IHsgLi4udGhpcy5tb2RlbCwgW3RoaXMuZGlzcGxheUJ5XTogdmFsdWUgfTtcblxuICAgICAgICB0aGlzLm9uQmx1ci5lbWl0KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0RGlzcGxheVZhbHVlXG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RGlzcGxheVZhbHVlKGl0ZW06IFRhZ01vZGVsKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyA/IGl0ZW0gOiBpdGVtW3RoaXMuZGlzcGxheUJ5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgdGhlIHJpcHBsZSBpcyB2aXNpYmxlIG9yIG5vdFxuICAgICAqIG9ubHkgd29ya3MgaW4gQ2hyb21lXG4gICAgICogQG5hbWUgaXNSaXBwbGVWaXNpYmxlXG4gICAgICovXG4gICAgcHVibGljIGdldCBpc1JpcHBsZVZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhdGhpcy5yZWFkb25seSAmJiAhdGhpcy5lZGl0aW5nICYmIGlzQ2hyb21lICYmIHRoaXMuaGFzUmlwcGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRpc2FibGVFZGl0TW9kZVxuICAgICAqIEBwYXJhbSAkZXZlbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZGlzYWJsZUVkaXRNb2RlKCRldmVudD86IEV2ZW50TGlrZSk6IHZvaWQge1xuICAgICAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZXRDb250ZW50RWRpdGFibGVUZXh0KCk7XG5cbiAgICAgICAgdGhpcy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoJ3RhZy0tZWRpdGluZycpO1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudEVkaXRhYmxlVGV4dCh0aGlzLm1vZGVsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmVOZXdWYWx1ZShpbnB1dCk7XG4gICAgICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgIGlmICgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNEZWxldGVJY29uVmlzaWJsZVxuICAgICAqL1xuICAgIHB1YmxpYyBpc0RlbGV0ZUljb25WaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5yZW1vdmFibGUgJiYgIXRoaXMuZWRpdGluZ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldENvbnRlbnRFZGl0YWJsZVRleHRcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldENvbnRlbnRFZGl0YWJsZVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldENvbnRlbnRFZGl0YWJsZSgpO1xuXG4gICAgICAgIHJldHVybiBpbnB1dCA/IGlucHV0LmlubmVyVGV4dC50cmltKCkgOiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZXRDb250ZW50RWRpdGFibGVUZXh0XG4gICAgICogQHBhcmFtIG1vZGVsXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRDb250ZW50RWRpdGFibGVUZXh0KG1vZGVsOiBUYWdNb2RlbCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0Q29udGVudEVkaXRhYmxlKCk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXREaXNwbGF5VmFsdWUobW9kZWwpO1xuXG4gICAgICAgIGlucHV0LmlubmVyVGV4dCA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lXG4gICAgICovXG4gICAgcHJpdmF0ZSBhY3RpdmF0ZUVkaXRNb2RlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICAgIGNsYXNzTGlzdC5hZGQoJ3RhZy0tZWRpdGluZycpO1xuXG4gICAgICAgIHRoaXMuZWRpdGluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc3RvcmVOZXdWYWx1ZVxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHByaXZhdGUgc3RvcmVOZXdWYWx1ZShpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9ICh0YWc6IFRhZ01vZGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHRhZyA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IHRhZyA9PT0gaW5wdXRcbiAgICAgICAgICAgICAgICA6IHRhZ1t0aGlzLmRpc3BsYXlCeV0gPT09IGlucHV0O1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhc0lkID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kZWxbdGhpcy5pZGVudGlmeUJ5XSAhPT0gdGhpcy5tb2RlbFt0aGlzLmRpc3BsYXlCeV07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gaWYgdGhlIHZhbHVlIGNoYW5nZWQsIHJlcGxhY2UgdGhlIHZhbHVlIGluIHRoZSBtb2RlbFxuICAgICAgICBpZiAoZXhpc3RzKHRoaXMubW9kZWwpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb2RlbCA9XG4gICAgICAgICAgICB0eXBlb2YgdGhpcy5tb2RlbCA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IGlucHV0XG4gICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHRoaXMuaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgW3RoaXMuaWRlbnRpZnlCeV06IGhhc0lkKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLm1vZGVsW3RoaXMuaWRlbnRpZnlCeV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBpbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICBbdGhpcy5kaXNwbGF5QnldOiBpbnB1dFxuICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5jYW5BZGRUYWcobW9kZWwpKSB7XG4gICAgICAgICAgICB0aGlzLm9uVGFnRWRpdGVkLmVtaXQoeyB0YWc6IG1vZGVsLCBpbmRleDogdGhpcy5pbmRleCB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudEVkaXRhYmxlVGV4dCh0aGlzLm1vZGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldENvbnRlbnRFZGl0YWJsZVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0Q29udGVudEVkaXRhYmxlKCk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignW2NvbnRlbnRlZGl0YWJsZV0nKTtcbiAgICB9XG59XG4iXX0=
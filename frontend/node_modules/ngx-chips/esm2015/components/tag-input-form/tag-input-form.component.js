import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
let TagInputForm = class TagInputForm {
    constructor() {
        /**
         * @name onSubmit
         */
        this.onSubmit = new EventEmitter();
        /**
         * @name onBlur
         */
        this.onBlur = new EventEmitter();
        /**
         * @name onFocus
         */
        this.onFocus = new EventEmitter();
        /**
         * @name onKeyup
         */
        this.onKeyup = new EventEmitter();
        /**
         * @name onKeydown
         */
        this.onKeydown = new EventEmitter();
        /**
         * @name inputTextChange
         */
        this.inputTextChange = new EventEmitter();
        /**
         * @name validators
         */
        this.validators = [];
        /**
         * @name asyncValidators
         * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
         */
        this.asyncValidators = [];
        /**
         * @name tabindex
         * @desc pass through the specified tabindex to the input
         */
        this.tabindex = '';
        /**
         * @name disabled
         */
        this.disabled = false;
        this.item = new FormControl({ value: '', disabled: this.disabled });
    }
    /**
     * @name inputText
     */
    get inputText() {
        return this.item.value;
    }
    /**
     * @name inputText
     * @param text {string}
     */
    set inputText(text) {
        this.item.setValue(text);
        this.inputTextChange.emit(text);
    }
    ngOnInit() {
        this.item.setValidators(this.validators);
        this.item.setAsyncValidators(this.asyncValidators);
        // creating form
        this.form = new FormGroup({
            item: this.item
        });
    }
    ngOnChanges(changes) {
        if (changes.disabled && !changes.disabled.firstChange) {
            if (changes.disabled.currentValue) {
                this.form.controls['item'].disable();
            }
            else {
                this.form.controls['item'].enable();
            }
        }
    }
    /**
     * @name value
     */
    get value() {
        return this.form.get('item');
    }
    /**
     * @name isInputFocused
     */
    isInputFocused() {
        const doc = typeof document !== 'undefined' ? document : undefined;
        return doc ? doc.activeElement === this.input.nativeElement : false;
    }
    /**
     * @name getErrorMessages
     * @param messages
     */
    getErrorMessages(messages) {
        return Object.keys(messages)
            .filter(err => this.value.hasError(err))
            .map(err => messages[err]);
    }
    /**
     * @name hasErrors
     */
    hasErrors() {
        const { dirty, value, valid } = this.form;
        return dirty && value.item && !valid;
    }
    /**
     * @name focus
     */
    focus() {
        this.input.nativeElement.focus();
    }
    /**
     * @name blur
     */
    blur() {
        this.input.nativeElement.blur();
    }
    /**
     * @name getElementPosition
     */
    getElementPosition() {
        return this.input.nativeElement.getBoundingClientRect();
    }
    /**
     * - removes input from the component
     * @name destroy
     */
    destroy() {
        const input = this.input.nativeElement;
        input.parentElement.removeChild(input);
    }
    /**
     * @name onKeyDown
     * @param $event
     */
    onKeyDown($event) {
        this.inputText = this.value.value;
        if ($event.key === 'Enter') {
            this.submit($event);
        }
        else {
            return this.onKeydown.emit($event);
        }
    }
    /**
     * @name onKeyUp
     * @param $event
     */
    onKeyUp($event) {
        this.inputText = this.value.value;
        return this.onKeyup.emit($event);
    }
    /**
     * @name submit
     */
    submit($event) {
        $event.preventDefault();
        this.onSubmit.emit($event);
    }
};
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TagInputForm.prototype, "onSubmit", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TagInputForm.prototype, "onBlur", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TagInputForm.prototype, "onFocus", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TagInputForm.prototype, "onKeyup", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TagInputForm.prototype, "onKeydown", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TagInputForm.prototype, "inputTextChange", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputForm.prototype, "placeholder", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], TagInputForm.prototype, "validators", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], TagInputForm.prototype, "asyncValidators", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputForm.prototype, "inputId", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputForm.prototype, "inputClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputForm.prototype, "tabindex", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputForm.prototype, "disabled", void 0);
tslib_1.__decorate([
    ViewChild('input', { static: false }),
    tslib_1.__metadata("design:type", Object)
], TagInputForm.prototype, "input", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], TagInputForm.prototype, "inputText", null);
TagInputForm = tslib_1.__decorate([
    Component({
        selector: 'tag-input-form',
        template: "<!-- form -->\n<form (ngSubmit)=\"submit($event)\" [formGroup]=\"form\">\n    <input #input\n\n           type=\"text\"\n           class=\"ng2-tag-input__text-input\"\n           autocomplete=\"off\"\n           tabindex=\"{{ disabled ? -1 : tabindex ? tabindex : 0 }}\"\n           minlength=\"1\"\n           formControlName=\"item\"\n\n           [ngClass]=\"inputClass\"\n           [attr.id]=\"inputId\"\n           [attr.placeholder]=\"placeholder\"\n           [attr.aria-label]=\"placeholder\"\n           [attr.tabindex]=\"tabindex\"\n           [attr.disabled]=\"disabled ? disabled : null\"\n\n           (focus)=\"onFocus.emit($event)\"\n           (blur)=\"onBlur.emit($event)\"\n           (keydown)=\"onKeyDown($event)\"\n           (keyup)=\"onKeyUp($event)\"\n    />\n</form>\n",
        styles: [".dark tag:focus{box-shadow:0 0 0 1px #323232}.ng2-tag-input.bootstrap3-info{background-color:#fff;display:inline-block;color:#555;vertical-align:middle;max-width:100%;height:42px;line-height:44px}.ng2-tag-input.bootstrap3-info input{border:none;box-shadow:none;outline:0;background-color:transparent;padding:0 6px;margin:0;width:auto;max-width:inherit}.ng2-tag-input.bootstrap3-info .form-control input::-moz-placeholder{color:#777;opacity:1}.ng2-tag-input.bootstrap3-info .form-control input:-ms-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info .form-control input::-webkit-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info input:focus{border:none;box-shadow:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--focused{box-shadow:inset 0 1px 1px rgba(0,0,0,.4);border:1px solid #ccc}.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;transition:.25s;padding:.25rem 0;min-height:32px;cursor:text;border-bottom:2px solid #efefef}.ng2-tag-input:focus{outline:0}.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #2196f3}.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #f44336}.ng2-tag-input.ng2-tag-input--loading{border:none}.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.ng2-tag-input form{margin:.1em 0}.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.minimal.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:1px solid transparent}.minimal.ng2-tag-input:focus{outline:0}.minimal.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.minimal.ng2-tag-input.ng2-tag-input--loading{border:none}.minimal.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.minimal.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.dark.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:2px solid #444}.dark.ng2-tag-input:focus{outline:0}.dark.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.dark.ng2-tag-input.ng2-tag-input--loading{border:none}.dark.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.dark.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.bootstrap.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:2px solid #efefef}.bootstrap.ng2-tag-input:focus{outline:0}.bootstrap.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #0275d8}.bootstrap.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #d9534f}.bootstrap.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.bootstrap.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.bootstrap3-info.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;padding:4px;cursor:text;box-shadow:inset 0 1px 1px rgba(0,0,0,.075);border-radius:4px}.bootstrap3-info.ng2-tag-input:focus{outline:0}.bootstrap3-info.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap3-info.ng2-tag-input.ng2-tag-input--invalid{box-shadow:inset 0 1px 1px #d9534f;border-bottom:1px solid #d9534f}.bootstrap3-info.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.bootstrap3-info.ng2-tag-input form{margin:.1em 0}.bootstrap3-info.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.error-message{font-size:.8em;color:#f44336;margin:.5em 0 0}.bootstrap .error-message{color:#d9534f}.ng2-tag-input__text-input{display:inline;vertical-align:middle;border:none;padding:0 .5rem;height:38px;font-size:1em;font-family:Roboto,\"Helvetica Neue\",sans-serif}.ng2-tag-input__text-input:focus{outline:0}.ng2-tag-input__text-input[disabled=true]{opacity:.5;background:#fff}"]
    })
], TagInputForm);
export { TagInputForm };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0LWZvcm0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWNoaXBzLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy90YWctaW5wdXQtZm9ybS90YWctaW5wdXQtZm9ybS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEgsT0FBTyxFQUFvQixXQUFXLEVBQUUsU0FBUyxFQUFlLE1BQU0sZ0JBQWdCLENBQUM7QUFPdkYsSUFBYSxZQUFZLEdBQXpCLE1BQWEsWUFBWTtJQUx6QjtRQU1JOztXQUVHO1FBQ2MsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWxFOztXQUVHO1FBQ2MsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWhFOztXQUVHO1FBQ2MsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpFOztXQUVHO1FBQ2MsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpFOztXQUVHO1FBQ2MsY0FBUyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRW5FOztXQUVHO1FBQ2Msb0JBQWUsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVM1RTs7V0FFRztRQUNhLGVBQVUsR0FBa0IsRUFBRSxDQUFDO1FBRS9DOzs7V0FHRztRQUNhLG9CQUFlLEdBQXVCLEVBQUUsQ0FBQztRQVl6RDs7O1dBR0c7UUFDYSxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBRTlCOztXQUVHO1FBQ2EsYUFBUSxHQUFHLEtBQUssQ0FBQztRQThCaEIsU0FBSSxHQUFnQixJQUFJLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBa0hqRyxDQUFDO0lBcElHOztPQUVHO0lBRUgsSUFBVyxTQUFTO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsU0FBUyxDQUFDLElBQVk7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUlELFFBQVE7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFbkQsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUM7WUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2xCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtnQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDeEM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDdkM7U0FDSjtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsS0FBSztRQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFnQixDQUFDO0lBQ2hELENBQUM7SUFFRDs7T0FFRztJQUNJLGNBQWM7UUFDakIsTUFBTSxHQUFHLEdBQUcsT0FBTyxRQUFRLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNuRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7O09BR0c7SUFDSSxnQkFBZ0IsQ0FBQyxRQUFtQztRQUN2RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUNJLFNBQVM7UUFDWixNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFDLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksS0FBSztRQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7T0FFRztJQUNJLElBQUk7UUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxrQkFBa0I7UUFDckIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDSSxPQUFPO1FBQ1YsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDdkMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFNBQVMsQ0FBQyxNQUFNO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbEMsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLE9BQU8sRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE9BQU8sQ0FBQyxNQUFNO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsTUFBVztRQUNyQixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztDQUNKLENBQUE7QUFoTmE7SUFBVCxNQUFNLEVBQUU7c0NBQWtCLFlBQVk7OENBQTJCO0FBS3hEO0lBQVQsTUFBTSxFQUFFO3NDQUFnQixZQUFZOzRDQUEyQjtBQUt0RDtJQUFULE1BQU0sRUFBRTtzQ0FBaUIsWUFBWTs2Q0FBMkI7QUFLdkQ7SUFBVCxNQUFNLEVBQUU7c0NBQWlCLFlBQVk7NkNBQTJCO0FBS3ZEO0lBQVQsTUFBTSxFQUFFO3NDQUFtQixZQUFZOytDQUEyQjtBQUt6RDtJQUFULE1BQU0sRUFBRTtzQ0FBeUIsWUFBWTtxREFBOEI7QUFPbkU7SUFBUixLQUFLLEVBQUU7O2lEQUE0QjtBQUszQjtJQUFSLEtBQUssRUFBRTs7Z0RBQXVDO0FBTXRDO0lBQVIsS0FBSyxFQUFFOztxREFBaUQ7QUFLaEQ7SUFBUixLQUFLLEVBQUU7OzZDQUF3QjtBQUt2QjtJQUFSLEtBQUssRUFBRTs7Z0RBQTJCO0FBTTFCO0lBQVIsS0FBSyxFQUFFOzs4Q0FBc0I7QUFLckI7SUFBUixLQUFLLEVBQUU7OzhDQUF5QjtBQUtNO0lBQXRDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7OzJDQUFjO0FBV3BEO0lBREMsS0FBSyxFQUFFOzs7NkNBR1A7QUF0RlEsWUFBWTtJQUx4QixTQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsZ0JBQWdCO1FBRTFCLHV5QkFBNkM7O0tBQ2hELENBQUM7R0FDVyxZQUFZLENBb054QjtTQXBOWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFzeW5jVmFsaWRhdG9yRm4sIEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIFZhbGlkYXRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3RhZy1pbnB1dC1mb3JtJyxcbiAgICBzdHlsZVVybHM6IFsnLi90YWctaW5wdXQtZm9ybS5zdHlsZS5zY3NzJ10sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3RhZy1pbnB1dC1mb3JtLnRlbXBsYXRlLmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIFRhZ0lucHV0Rm9ybSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblN1Ym1pdFxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25TdWJtaXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25CbHVyXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbkJsdXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25Gb2N1c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25Gb2N1czogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbktleXVwXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbktleXVwOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uS2V5ZG93blxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25LZXlkb3duOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlucHV0VGV4dENoYW5nZVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgaW5wdXRUZXh0Q2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIC8vIGlucHV0c1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcGxhY2Vob2xkZXJcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHZhbGlkYXRvcnNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYXN5bmNWYWxpZGF0b3JzXG4gICAgICogQGRlc2MgYXJyYXkgb2YgQXN5bmNWYWxpZGF0b3IgdGhhdCBhcmUgdXNlZCB0byB2YWxpZGF0ZSB0aGUgdGFnIGJlZm9yZSBpdCBnZXRzIGFwcGVuZGVkIHRvIHRoZSBsaXN0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGFzeW5jVmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbltdID0gW107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dElkXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGlucHV0SWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlucHV0Q2xhc3NcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgaW5wdXRDbGFzczogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdGFiaW5kZXhcbiAgICAgKiBAZGVzYyBwYXNzIHRocm91Z2ggdGhlIHNwZWNpZmllZCB0YWJpbmRleCB0byB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgdGFiaW5kZXggPSAnJztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRpc2FibGVkXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dFxuICAgICAqL1xuICAgIEBWaWV3Q2hpbGQoJ2lucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyBpbnB1dDtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGZvcm1cbiAgICAgKi9cbiAgICBwdWJsaWMgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaW5wdXRUZXh0XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGlucHV0VGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtLnZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlucHV0VGV4dFxuICAgICAqIEBwYXJhbSB0ZXh0IHtzdHJpbmd9XG4gICAgICovXG4gICAgcHVibGljIHNldCBpbnB1dFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaXRlbS5zZXRWYWx1ZSh0ZXh0KTtcblxuICAgICAgICB0aGlzLmlucHV0VGV4dENoYW5nZS5lbWl0KHRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaXRlbTogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woeyB2YWx1ZTogJycsIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkIH0pO1xuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuaXRlbS5zZXRWYWxpZGF0b3JzKHRoaXMudmFsaWRhdG9ycyk7XG4gICAgICAgIHRoaXMuaXRlbS5zZXRBc3luY1ZhbGlkYXRvcnModGhpcy5hc3luY1ZhbGlkYXRvcnMpO1xuXG4gICAgICAgIC8vIGNyZWF0aW5nIGZvcm1cbiAgICAgICAgdGhpcy5mb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgICAgICAgICBpdGVtOiB0aGlzLml0ZW1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlcy5kaXNhYmxlZCAmJiAhY2hhbmdlcy5kaXNhYmxlZC5maXJzdENoYW5nZSkge1xuICAgICAgICAgICAgaWYgKGNoYW5nZXMuZGlzYWJsZWQuY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmNvbnRyb2xzWydpdGVtJ10uZGlzYWJsZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uY29udHJvbHNbJ2l0ZW0nXS5lbmFibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBGb3JtQ29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0KCdpdGVtJykgYXMgRm9ybUNvbnRyb2w7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNJbnB1dEZvY3VzZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNJbnB1dEZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudCA6IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIGRvYyA/IGRvYy5hY3RpdmVFbGVtZW50ID09PSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBnZXRFcnJvck1lc3NhZ2VzXG4gICAgICogQHBhcmFtIG1lc3NhZ2VzXG4gICAgICovXG4gICAgcHVibGljIGdldEVycm9yTWVzc2FnZXMobWVzc2FnZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhtZXNzYWdlcylcbiAgICAgICAgICAgIC5maWx0ZXIoZXJyID0+IHRoaXMudmFsdWUuaGFzRXJyb3IoZXJyKSlcbiAgICAgICAgICAgIC5tYXAoZXJyID0+IG1lc3NhZ2VzW2Vycl0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGhhc0Vycm9yc1xuICAgICAqL1xuICAgIHB1YmxpYyBoYXNFcnJvcnMoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHsgZGlydHksIHZhbHVlLCB2YWxpZCB9ID0gdGhpcy5mb3JtO1xuICAgICAgICByZXR1cm4gZGlydHkgJiYgdmFsdWUuaXRlbSAmJiAhdmFsaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZm9jdXNcbiAgICAgKi9cbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGJsdXJcbiAgICAgKi9cbiAgICBwdWJsaWMgYmx1cigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBnZXRFbGVtZW50UG9zaXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RWxlbWVudFBvc2l0aW9uKCk6IENsaWVudFJlY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIC0gcmVtb3ZlcyBpbnB1dCBmcm9tIHRoZSBjb21wb25lbnRcbiAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICovXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGlucHV0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbktleURvd25cbiAgICAgKiBAcGFyYW0gJGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIG9uS2V5RG93bigkZXZlbnQpIHtcbiAgICAgICAgdGhpcy5pbnB1dFRleHQgPSB0aGlzLnZhbHVlLnZhbHVlO1xuICAgICAgICBpZiAoJGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXQoJGV2ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vbktleWRvd24uZW1pdCgkZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25LZXlVcFxuICAgICAqIEBwYXJhbSAkZXZlbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25LZXlVcCgkZXZlbnQpIHtcbiAgICAgICAgdGhpcy5pbnB1dFRleHQgPSB0aGlzLnZhbHVlLnZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcy5vbktleXVwLmVtaXQoJGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzdWJtaXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3VibWl0KCRldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLm9uU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICB9XG59XG4iXX0=
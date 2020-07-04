import * as tslib_1 from "tslib";
import { Input } from '@angular/core';
import { OptionsProvider } from './providers/options-provider';
var TagModelClass = /** @class */ (function () {
    function TagModelClass() {
    }
    return TagModelClass;
}());
export { TagModelClass };
export function isObject(obj) {
    return obj === Object(obj);
}
var TagInputAccessor = /** @class */ (function () {
    function TagInputAccessor() {
        this._items = [];
        /**
         * @name displayBy
         */
        this.displayBy = OptionsProvider.defaults.tagInput.displayBy;
        /**
         * @name identifyBy
         */
        this.identifyBy = OptionsProvider.defaults.tagInput.identifyBy;
    }
    Object.defineProperty(TagInputAccessor.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (items) {
            this._items = items;
            this._onChangeCallback(this._items);
        },
        enumerable: true,
        configurable: true
    });
    TagInputAccessor.prototype.onTouched = function () {
        this._onTouchedCallback();
    };
    TagInputAccessor.prototype.writeValue = function (items) {
        this._items = items || [];
    };
    TagInputAccessor.prototype.registerOnChange = function (fn) {
        this._onChangeCallback = fn;
    };
    TagInputAccessor.prototype.registerOnTouched = function (fn) {
        this._onTouchedCallback = fn;
    };
    /**
     * @name getItemValue
     * @param item
     * @param fromDropdown
     */
    TagInputAccessor.prototype.getItemValue = function (item, fromDropdown) {
        if (fromDropdown === void 0) { fromDropdown = false; }
        var property = fromDropdown && this.dropdown ? this.dropdown.identifyBy : this.identifyBy;
        return isObject(item) ? item[property] : item;
    };
    /**
     * @name getItemDisplay
     * @param item
     * @param fromDropdown
     */
    TagInputAccessor.prototype.getItemDisplay = function (item, fromDropdown) {
        if (fromDropdown === void 0) { fromDropdown = false; }
        var property = fromDropdown && this.dropdown ? this.dropdown.displayBy : this.displayBy;
        return isObject(item) ? item[property] : item;
    };
    /**
     * @name getItemsWithout
     * @param index
     */
    TagInputAccessor.prototype.getItemsWithout = function (index) {
        return this.items.filter(function (item, position) { return position !== index; });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], TagInputAccessor.prototype, "displayBy", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], TagInputAccessor.prototype, "identifyBy", void 0);
    return TagInputAccessor;
}());
export { TagInputAccessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtY2hpcHMvIiwic291cmNlcyI6WyJjb3JlL2FjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUcvRDtJQUFBO0lBRUEsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7O0FBSUQsTUFBTSxVQUFVLFFBQVEsQ0FBQyxHQUFRO0lBQzdCLE9BQU8sR0FBRyxLQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQ7SUFBQTtRQUNZLFdBQU0sR0FBZSxFQUFFLENBQUM7UUFNaEM7O1dBRUc7UUFDYSxjQUFTLEdBQVcsZUFBZSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBRWhGOztXQUVHO1FBQ2EsZUFBVSxHQUFXLGVBQWUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztJQXNEdEYsQ0FBQztJQXBERyxzQkFBVyxtQ0FBSzthQUFoQjtZQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO2FBRUQsVUFBaUIsS0FBaUI7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDOzs7T0FMQTtJQU9NLG9DQUFTLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVNLHFDQUFVLEdBQWpCLFVBQWtCLEtBQVk7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLElBQUksRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFTSwyQ0FBZ0IsR0FBdkIsVUFBd0IsRUFBTztRQUMzQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFTSw0Q0FBaUIsR0FBeEIsVUFBeUIsRUFBTztRQUM1QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksdUNBQVksR0FBbkIsVUFBb0IsSUFBYyxFQUFFLFlBQW9CO1FBQXBCLDZCQUFBLEVBQUEsb0JBQW9CO1FBQ3BELElBQU0sUUFBUSxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM1RixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSx5Q0FBYyxHQUFyQixVQUFzQixJQUFjLEVBQUUsWUFBb0I7UUFBcEIsNkJBQUEsRUFBQSxvQkFBb0I7UUFDdEQsSUFBTSxRQUFRLEdBQUcsWUFBWSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFGLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNsRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ08sMENBQWUsR0FBekIsVUFBMEIsS0FBYTtRQUNuQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLFFBQVEsSUFBSyxPQUFBLFFBQVEsS0FBSyxLQUFLLEVBQWxCLENBQWtCLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBMURRO1FBQVIsS0FBSyxFQUFFOzt1REFBd0U7SUFLdkU7UUFBUixLQUFLLEVBQUU7O3dEQUEwRTtJQXNEdEYsdUJBQUM7Q0FBQSxBQXJFRCxJQXFFQztTQXJFWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPcHRpb25zUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9vcHRpb25zLXByb3ZpZGVyJztcbmltcG9ydCB7IFRhZ0lucHV0RHJvcGRvd24gfSBmcm9tICcuLi9jb21wb25lbnRzL2Ryb3Bkb3duL3RhZy1pbnB1dC1kcm9wZG93bi5jb21wb25lbnQnO1xuXG5leHBvcnQgY2xhc3MgVGFnTW9kZWxDbGFzcyB7XG4gICAgW2tleTogc3RyaW5nXTogYW55O1xufVxuXG5leHBvcnQgdHlwZSBUYWdNb2RlbCA9IHN0cmluZyB8IFRhZ01vZGVsQ2xhc3M7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xufVxuXG5leHBvcnQgY2xhc3MgVGFnSW5wdXRBY2Nlc3NvciBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICBwcml2YXRlIF9pdGVtczogVGFnTW9kZWxbXSA9IFtdO1xuICAgIHByaXZhdGUgX29uVG91Y2hlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xuICAgIHByaXZhdGUgX29uQ2hhbmdlQ2FsbGJhY2s6IChpdGVtczogVGFnTW9kZWxbXSkgPT4gdm9pZDtcblxuICAgIHB1YmxpYyBkcm9wZG93bjogVGFnSW5wdXREcm9wZG93bjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRpc3BsYXlCeVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBkaXNwbGF5Qnk6IHN0cmluZyA9IE9wdGlvbnNQcm92aWRlci5kZWZhdWx0cy50YWdJbnB1dC5kaXNwbGF5Qnk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpZGVudGlmeUJ5XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGlkZW50aWZ5Qnk6IHN0cmluZyA9IE9wdGlvbnNQcm92aWRlci5kZWZhdWx0cy50YWdJbnB1dC5pZGVudGlmeUJ5O1xuXG4gICAgcHVibGljIGdldCBpdGVtcygpOiBUYWdNb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgaXRlbXMoaXRlbXM6IFRhZ01vZGVsW10pIHtcbiAgICAgICAgdGhpcy5faXRlbXMgPSBpdGVtcztcbiAgICAgICAgdGhpcy5fb25DaGFuZ2VDYWxsYmFjayh0aGlzLl9pdGVtcyk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uVG91Y2hlZCgpIHtcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkQ2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgd3JpdGVWYWx1ZShpdGVtczogYW55W10pIHtcbiAgICAgICAgdGhpcy5faXRlbXMgPSBpdGVtcyB8fCBbXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgICAgICB0aGlzLl9vblRvdWNoZWRDYWxsYmFjayA9IGZuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldEl0ZW1WYWx1ZVxuICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICogQHBhcmFtIGZyb21Ecm9wZG93blxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRJdGVtVmFsdWUoaXRlbTogVGFnTW9kZWwsIGZyb21Ecm9wZG93biA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcHJvcGVydHkgPSBmcm9tRHJvcGRvd24gJiYgdGhpcy5kcm9wZG93biA/IHRoaXMuZHJvcGRvd24uaWRlbnRpZnlCeSA6IHRoaXMuaWRlbnRpZnlCeTtcbiAgICAgICAgcmV0dXJuIGlzT2JqZWN0KGl0ZW0pID8gaXRlbVtwcm9wZXJ0eV0gOiBpdGVtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldEl0ZW1EaXNwbGF5XG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKiBAcGFyYW0gZnJvbURyb3Bkb3duXG4gICAgICovXG4gICAgcHVibGljIGdldEl0ZW1EaXNwbGF5KGl0ZW06IFRhZ01vZGVsLCBmcm9tRHJvcGRvd24gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5ID0gZnJvbURyb3Bkb3duICYmIHRoaXMuZHJvcGRvd24gPyB0aGlzLmRyb3Bkb3duLmRpc3BsYXlCeSA6IHRoaXMuZGlzcGxheUJ5O1xuICAgICAgICByZXR1cm4gaXNPYmplY3QoaXRlbSkgPyBpdGVtW3Byb3BlcnR5XSA6IGl0ZW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0SXRlbXNXaXRob3V0XG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldEl0ZW1zV2l0aG91dChpbmRleDogbnVtYmVyKTogVGFnTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSwgcG9zaXRpb24pID0+IHBvc2l0aW9uICE9PSBpbmRleCk7XG4gICAgfVxufVxuIl19
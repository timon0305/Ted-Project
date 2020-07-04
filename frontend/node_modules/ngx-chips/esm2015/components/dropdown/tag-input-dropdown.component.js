import * as tslib_1 from "tslib";
import { Component, ContentChildren, HostListener, Injector, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { filter, first, debounceTime } from 'rxjs/operators';
import { Ng2Dropdown } from 'ng2-material-dropdown';
import { defaults } from '../../defaults';
import { TagInputComponent } from '../tag-input/tag-input';
let TagInputDropdown = class TagInputDropdown {
    constructor(injector) {
        this.injector = injector;
        /**
         * @name offset
         */
        this.offset = defaults.dropdown.offset;
        /**
         * @name focusFirstElement
         */
        this.focusFirstElement = defaults.dropdown.focusFirstElement;
        /**
         * - show autocomplete dropdown if the value of input is empty
         * @name showDropdownIfEmpty
         */
        this.showDropdownIfEmpty = defaults.dropdown.showDropdownIfEmpty;
        /**
         * - desc minimum text length in order to display the autocomplete dropdown
         * @name minimumTextLength
         */
        this.minimumTextLength = defaults.dropdown.minimumTextLength;
        /**
         * - number of items to display in the autocomplete dropdown
         * @name limitItemsTo
         */
        this.limitItemsTo = defaults.dropdown.limitItemsTo;
        /**
         * @name displayBy
         */
        this.displayBy = defaults.dropdown.displayBy;
        /**
         * @name identifyBy
         */
        this.identifyBy = defaults.dropdown.identifyBy;
        /**
         * @description a function a developer can use to implement custom matching for the autocomplete
         * @name matchingFn
         */
        this.matchingFn = defaults.dropdown.matchingFn;
        /**
         * @name appendToBody
         */
        this.appendToBody = defaults.dropdown.appendToBody;
        /**
         * @name keepOpen
         * @description option to leave dropdown open when adding a new item
         */
        this.keepOpen = defaults.dropdown.keepOpen;
        /**
         * @name dynamicUpdate
         */
        this.dynamicUpdate = defaults.dropdown.dynamicUpdate;
        /**
         * @name zIndex
         */
        this.zIndex = defaults.dropdown.zIndex;
        /**
         * list of items that match the current value of the input (for autocomplete)
         * @name items
         */
        this.items = [];
        /**
         * @name tagInput
         */
        this.tagInput = this.injector.get(TagInputComponent);
        /**
         * @name _autocompleteItems
         */
        this._autocompleteItems = [];
        /**
         *
         * @name show
         */
        this.show = () => {
            const maxItemsReached = this.tagInput.items.length === this.tagInput.maxItems;
            const value = this.getFormValue();
            const hasMinimumText = value.trim().length >= this.minimumTextLength;
            const position = this.calculatePosition();
            const items = this.getMatchingItems(value);
            const hasItems = items.length > 0;
            const isHidden = this.isVisible === false;
            const showDropdownIfEmpty = this.showDropdownIfEmpty && hasItems && !value;
            const isDisabled = this.tagInput.disable;
            const shouldShow = isHidden && ((hasItems && hasMinimumText) || showDropdownIfEmpty);
            const shouldHide = this.isVisible && !hasItems;
            if (this.autocompleteObservable && hasMinimumText) {
                return this.getItemsFromObservable(value);
            }
            if ((!this.showDropdownIfEmpty && !value) ||
                maxItemsReached ||
                isDisabled) {
                return this.dropdown.hide();
            }
            this.setItems(items);
            if (shouldShow) {
                this.dropdown.show(position);
            }
            else if (shouldHide) {
                this.hide();
            }
        };
        /**
         * @name requestAdding
         * @param item {Ng2MenuItem}
         */
        this.requestAdding = (item) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tag = this.createTagModel(item);
            yield this.tagInput.onAddingRequested(true, tag).catch(() => { });
        });
        /**
         * @name resetItems
         */
        this.resetItems = () => {
            this.items = [];
        };
        /**
         * @name getItemsFromObservable
         * @param text
         */
        this.getItemsFromObservable = (text) => {
            this.setLoadingState(true);
            const subscribeFn = (data) => {
                // hide loading animation
                this.setLoadingState(false)
                    // add items
                    .populateItems(data);
                this.setItems(this.getMatchingItems(text));
                if (this.items.length) {
                    this.dropdown.show(this.calculatePosition());
                }
                else {
                    this.dropdown.hide();
                }
            };
            this.autocompleteObservable(text)
                .pipe(first())
                .subscribe(subscribeFn, () => this.setLoadingState(false));
        };
    }
    /**
     * @name autocompleteItems
     * @param items
     */
    set autocompleteItems(items) {
        this._autocompleteItems = items;
    }
    /**
     * @name autocompleteItems
     * @desc array of items that will populate the autocomplete
     */
    get autocompleteItems() {
        const items = this._autocompleteItems;
        if (!items) {
            return [];
        }
        return items.map((item) => {
            return typeof item === 'string'
                ? {
                    [this.displayBy]: item,
                    [this.identifyBy]: item
                }
                : item;
        });
    }
    /**
     * @name ngAfterviewInit
     */
    ngAfterViewInit() {
        this.onItemClicked().subscribe((item) => {
            this.requestAdding(item);
        });
        // reset itemsMatching array when the dropdown is hidden
        this.onHide().subscribe(this.resetItems);
        const DEBOUNCE_TIME = 200;
        const KEEP_OPEN = this.keepOpen;
        this.tagInput.onTextChange
            .asObservable()
            .pipe(debounceTime(DEBOUNCE_TIME), filter((value) => {
            if (KEEP_OPEN === false) {
                return value.length > 0;
            }
            return true;
        }))
            .subscribe(this.show);
    }
    /**
     * @name updatePosition
     */
    updatePosition() {
        const position = this.tagInput.inputForm.getElementPosition();
        this.dropdown.menu.updatePosition(position, this.dynamicUpdate);
    }
    /**
     * @name isVisible
     */
    get isVisible() {
        return this.dropdown.menu.dropdownState.menuState.isVisible;
    }
    /**
     * @name onHide
     */
    onHide() {
        return this.dropdown.onHide;
    }
    /**
     * @name onItemClicked
     */
    onItemClicked() {
        return this.dropdown.onItemClicked;
    }
    /**
     * @name selectedItem
     */
    get selectedItem() {
        return this.dropdown.menu.dropdownState.dropdownState.selectedItem;
    }
    /**
     * @name state
     */
    get state() {
        return this.dropdown.menu.dropdownState;
    }
    /**
     * @name hide
     */
    hide() {
        this.resetItems();
        this.dropdown.hide();
    }
    /**
     * @name scrollListener
     */
    scrollListener() {
        if (!this.isVisible || !this.dynamicUpdate) {
            return;
        }
        this.updatePosition();
    }
    /**
     * @name onWindowBlur
     */
    onWindowBlur() {
        this.dropdown.hide();
    }
    /**
     * @name getFormValue
     */
    getFormValue() {
        const formValue = this.tagInput.formValue;
        return formValue ? formValue.toString().trim() : '';
    }
    /**
     * @name calculatePosition
     */
    calculatePosition() {
        return this.tagInput.inputForm.getElementPosition();
    }
    /**
     * @name createTagModel
     * @param item
     */
    createTagModel(item) {
        const display = typeof item.value === 'string' ? item.value : item.value[this.displayBy];
        const value = typeof item.value === 'string' ? item.value : item.value[this.identifyBy];
        return Object.assign({}, item.value, { [this.tagInput.displayBy]: display, [this.tagInput.identifyBy]: value });
    }
    /**
     *
     * @param value {string}
     */
    getMatchingItems(value) {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }
        const dupesAllowed = this.tagInput.allowDupes;
        return this.autocompleteItems.filter((item) => {
            const hasValue = dupesAllowed
                ? false
                : this.tagInput.tags.some(tag => {
                    const identifyBy = this.tagInput.identifyBy;
                    const model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];
                    return model === item[this.identifyBy];
                });
            return this.matchingFn(value, item) && hasValue === false;
        });
    }
    /**
     * @name setItems
     */
    setItems(items) {
        this.items = items.slice(0, this.limitItemsTo || items.length);
    }
    /**
     * @name populateItems
     * @param data
     */
    populateItems(data) {
        this.autocompleteItems = data.map(item => {
            return typeof item === 'string'
                ? {
                    [this.displayBy]: item,
                    [this.identifyBy]: item
                }
                : item;
        });
        return this;
    }
    /**
     * @name setLoadingState
     * @param state
     */
    setLoadingState(state) {
        this.tagInput.isLoading = state;
        return this;
    }
};
tslib_1.__decorate([
    ViewChild(Ng2Dropdown, { static: false }),
    tslib_1.__metadata("design:type", Ng2Dropdown)
], TagInputDropdown.prototype, "dropdown", void 0);
tslib_1.__decorate([
    ContentChildren(TemplateRef),
    tslib_1.__metadata("design:type", QueryList)
], TagInputDropdown.prototype, "templates", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputDropdown.prototype, "offset", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "focusFirstElement", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "showDropdownIfEmpty", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], TagInputDropdown.prototype, "autocompleteObservable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "minimumTextLength", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], TagInputDropdown.prototype, "limitItemsTo", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "displayBy", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "identifyBy", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], TagInputDropdown.prototype, "matchingFn", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "appendToBody", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "keepOpen", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "dynamicUpdate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputDropdown.prototype, "zIndex", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array),
    tslib_1.__metadata("design:paramtypes", [Array])
], TagInputDropdown.prototype, "autocompleteItems", null);
tslib_1.__decorate([
    HostListener('window:scroll'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], TagInputDropdown.prototype, "scrollListener", null);
tslib_1.__decorate([
    HostListener('window:blur'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], TagInputDropdown.prototype, "onWindowBlur", null);
TagInputDropdown = tslib_1.__decorate([
    Component({
        selector: 'tag-input-dropdown',
        template: "<ng2-dropdown [dynamicUpdate]=\"dynamicUpdate\">\n    <ng2-dropdown-menu [focusFirstElement]=\"focusFirstElement\"\n                       [zIndex]=\"zIndex\"\n                       [appendToBody]=\"appendToBody\"\n                       [offset]=\"offset\">\n        <ng2-menu-item *ngFor=\"let item of items; let index = index; let last = last\"\n                       [value]=\"item\"\n                       [ngSwitch]=\"!!templates.length\">\n\n            <span *ngSwitchCase=\"false\"\n                  [innerHTML]=\"item[displayBy] | highlight : tagInput.inputForm.value.value\">\n            </span>\n\n            <ng-template *ngSwitchDefault\n                      [ngTemplateOutlet]=\"templates.first\"\n                      [ngTemplateOutletContext]=\"{ item: item, index: index, last: last }\">\n            </ng-template>\n        </ng2-menu-item>\n    </ng2-dropdown-menu>\n</ng2-dropdown>\n"
    }),
    tslib_1.__metadata("design:paramtypes", [Injector])
], TagInputDropdown);
export { TagInputDropdown };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0LWRyb3Bkb3duLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jaGlwcy8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZHJvcGRvd24vdGFnLWlucHV0LWRyb3Bkb3duLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxlQUFlLEVBRWYsWUFBWSxFQUNaLFFBQVEsRUFDUixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBRVYsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0QsT0FBTyxFQUFFLFdBQVcsRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQU0zRCxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtJQWlJM0IsWUFBNkIsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQXJIL0M7O1dBRUc7UUFDYSxXQUFNLEdBQVcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFFMUQ7O1dBRUc7UUFDYSxzQkFBaUIsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDO1FBRXhFOzs7V0FHRztRQUNhLHdCQUFtQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7UUFRNUU7OztXQUdHO1FBQ2Esc0JBQWlCLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztRQUV4RTs7O1dBR0c7UUFDYSxpQkFBWSxHQUFXLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO1FBRXRFOztXQUVHO1FBQ2EsY0FBUyxHQUFHLFFBQVEsQ0FBQyxR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QVksQ0FBQyxlQUFlLENBQUM7Ozs7c0RBTzdCO0FBTUQ7SUFEQyxZQUFZLENBQUMsYUFBYSxDQUFDOzs7O29EQUczQjtBQS9RVSxnQkFBZ0I7SUFKNUIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLG9CQUFvQjtRQUM5Qiw0NUJBQWlEO0tBQ2xELENBQUM7NkNBa0l1QyxRQUFRO0dBaklwQyxnQkFBZ0IsQ0F1WjVCO1NBdlpZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBRdWVyeUxpc3QsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIEFmdGVyVmlld0luaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8vIHJ4XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIGZpcnN0LCBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE5nMkRyb3Bkb3duLCBOZzJNZW51SXRlbSB9IGZyb20gJ25nMi1tYXRlcmlhbC1kcm9wZG93bic7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uLy4uL2RlZmF1bHRzJztcbmltcG9ydCB7IFRhZ01vZGVsIH0gZnJvbSAnLi4vLi4vY29yZS9hY2Nlc3Nvcic7XG5pbXBvcnQgeyBUYWdJbnB1dENvbXBvbmVudCB9IGZyb20gJy4uL3RhZy1pbnB1dC90YWctaW5wdXQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0YWctaW5wdXQtZHJvcGRvd24nLFxuICB0ZW1wbGF0ZVVybDogJy4vdGFnLWlucHV0LWRyb3Bkb3duLnRlbXBsYXRlLmh0bWwnXG59KVxuZXhwb3J0IGNsYXNzIFRhZ0lucHV0RHJvcGRvd24gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgLyoqXG4gICAqIEBuYW1lIGRyb3Bkb3duXG4gICAqL1xuICBAVmlld0NoaWxkKE5nMkRyb3Bkb3duLCB7IHN0YXRpYzogZmFsc2UgfSkgcHVibGljIGRyb3Bkb3duOiBOZzJEcm9wZG93bjtcblxuICAvKipcbiAgICogQG5hbWUgbWVudVRlbXBsYXRlXG4gICAqIEBkZXNjIHJlZmVyZW5jZSB0byB0aGUgdGVtcGxhdGUgaWYgcHJvdmlkZWQgYnkgdGhlIHVzZXJcbiAgICovXG4gIEBDb250ZW50Q2hpbGRyZW4oVGVtcGxhdGVSZWYpIHB1YmxpYyB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAvKipcbiAgICogQG5hbWUgb2Zmc2V0XG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgb2Zmc2V0OiBzdHJpbmcgPSBkZWZhdWx0cy5kcm9wZG93bi5vZmZzZXQ7XG5cbiAgLyoqXG4gICAqIEBuYW1lIGZvY3VzRmlyc3RFbGVtZW50XG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgZm9jdXNGaXJzdEVsZW1lbnQgPSBkZWZhdWx0cy5kcm9wZG93bi5mb2N1c0ZpcnN0RWxlbWVudDtcblxuICAvKipcbiAgICogLSBzaG93IGF1dG9jb21wbGV0ZSBkcm9wZG93biBpZiB0aGUgdmFsdWUgb2YgaW5wdXQgaXMgZW1wdHlcbiAgICogQG5hbWUgc2hvd0Ryb3Bkb3duSWZFbXB0eVxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIHNob3dEcm9wZG93bklmRW1wdHkgPSBkZWZhdWx0cy5kcm9wZG93bi5zaG93RHJvcGRvd25JZkVtcHR5O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gb2JzZXJ2YWJsZSBwYXNzZWQgYXMgaW5wdXQgd2hpY2ggcG9wdWxhdGVzIHRoZSBhdXRvY29tcGxldGUgaXRlbXNcbiAgICogQG5hbWUgYXV0b2NvbXBsZXRlT2JzZXJ2YWJsZVxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGF1dG9jb21wbGV0ZU9ic2VydmFibGU6ICh0ZXh0OiBzdHJpbmcpID0+IE9ic2VydmFibGU8YW55PjtcblxuICAvKipcbiAgICogLSBkZXNjIG1pbmltdW0gdGV4dCBsZW5ndGggaW4gb3JkZXIgdG8gZGlzcGxheSB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duXG4gICAqIEBuYW1lIG1pbmltdW1UZXh0TGVuZ3RoXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgbWluaW11bVRleHRMZW5ndGggPSBkZWZhdWx0cy5kcm9wZG93bi5taW5pbXVtVGV4dExlbmd0aDtcblxuICAvKipcbiAgICogLSBudW1iZXIgb2YgaXRlbXMgdG8gZGlzcGxheSBpbiB0aGUgYXV0b2NvbXBsZXRlIGRyb3Bkb3duXG4gICAqIEBuYW1lIGxpbWl0SXRlbXNUb1xuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGxpbWl0SXRlbXNUbzogbnVtYmVyID0gZGVmYXVsdHMuZHJvcGRvd24ubGltaXRJdGVtc1RvO1xuXG4gIC8qKlxuICAgKiBAbmFtZSBkaXNwbGF5QnlcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBkaXNwbGF5QnkgPSBkZWZhdWx0cy5kcm9wZG93bi5kaXNwbGF5Qnk7XG5cbiAgLyoqXG4gICAqIEBuYW1lIGlkZW50aWZ5QnlcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBpZGVudGlmeUJ5ID0gZGVmYXVsdHMuZHJvcGRvd24uaWRlbnRpZnlCeTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIGEgZnVuY3Rpb24gYSBkZXZlbG9wZXIgY2FuIHVzZSB0byBpbXBsZW1lbnQgY3VzdG9tIG1hdGNoaW5nIGZvciB0aGUgYXV0b2NvbXBsZXRlXG4gICAqIEBuYW1lIG1hdGNoaW5nRm5cbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBtYXRjaGluZ0ZuOiAodmFsdWU6IHN0cmluZywgdGFyZ2V0OiBUYWdNb2RlbCkgPT4gYm9vbGVhbiA9XG4gICAgZGVmYXVsdHMuZHJvcGRvd24ubWF0Y2hpbmdGbjtcblxuICAvKipcbiAgICogQG5hbWUgYXBwZW5kVG9Cb2R5XG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgYXBwZW5kVG9Cb2R5ID0gZGVmYXVsdHMuZHJvcGRvd24uYXBwZW5kVG9Cb2R5O1xuXG4gIC8qKlxuICAgKiBAbmFtZSBrZWVwT3BlblxuICAgKiBAZGVzY3JpcHRpb24gb3B0aW9uIHRvIGxlYXZlIGRyb3Bkb3duIG9wZW4gd2hlbiBhZGRpbmcgYSBuZXcgaXRlbVxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGtlZXBPcGVuID0gZGVmYXVsdHMuZHJvcGRvd24ua2VlcE9wZW47XG5cbiAgLyoqXG4gICAqIEBuYW1lIGR5bmFtaWNVcGRhdGVcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBkeW5hbWljVXBkYXRlID0gZGVmYXVsdHMuZHJvcGRvd24uZHluYW1pY1VwZGF0ZTtcblxuICAvKipcbiAgICogQG5hbWUgekluZGV4XG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgekluZGV4ID0gZGVmYXVsdHMuZHJvcGRvd24uekluZGV4O1xuXG4gIC8qKlxuICAgKiBsaXN0IG9mIGl0ZW1zIHRoYXQgbWF0Y2ggdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGlucHV0IChmb3IgYXV0b2NvbXBsZXRlKVxuICAgKiBAbmFtZSBpdGVtc1xuICAgKi9cbiAgcHVibGljIGl0ZW1zOiBUYWdNb2RlbFtdID0gW107XG5cbiAgLyoqXG4gICAqIEBuYW1lIHRhZ0lucHV0XG4gICAqL1xuICBwdWJsaWMgdGFnSW5wdXQ6IFRhZ0lucHV0Q29tcG9uZW50ID0gdGhpcy5pbmplY3Rvci5nZXQoVGFnSW5wdXRDb21wb25lbnQpO1xuXG4gIC8qKlxuICAgKiBAbmFtZSBfYXV0b2NvbXBsZXRlSXRlbXNcbiAgICovXG4gIHByaXZhdGUgX2F1dG9jb21wbGV0ZUl0ZW1zOiBUYWdNb2RlbFtdID0gW107XG5cbiAgLyoqXG4gICAqIEBuYW1lIGF1dG9jb21wbGV0ZUl0ZW1zXG4gICAqIEBwYXJhbSBpdGVtc1xuICAgKi9cbiAgcHVibGljIHNldCBhdXRvY29tcGxldGVJdGVtcyhpdGVtczogVGFnTW9kZWxbXSkge1xuICAgIHRoaXMuX2F1dG9jb21wbGV0ZUl0ZW1zID0gaXRlbXM7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgYXV0b2NvbXBsZXRlSXRlbXNcbiAgICogQGRlc2MgYXJyYXkgb2YgaXRlbXMgdGhhdCB3aWxsIHBvcHVsYXRlIHRoZSBhdXRvY29tcGxldGVcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBnZXQgYXV0b2NvbXBsZXRlSXRlbXMoKTogVGFnTW9kZWxbXSB7XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLl9hdXRvY29tcGxldGVJdGVtcztcblxuICAgIGlmICghaXRlbXMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbXMubWFwKChpdGVtOiBUYWdNb2RlbCkgPT4ge1xuICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHtcbiAgICAgICAgICAgIFt0aGlzLmRpc3BsYXlCeV06IGl0ZW0sXG4gICAgICAgICAgICBbdGhpcy5pZGVudGlmeUJ5XTogaXRlbVxuICAgICAgICAgIH1cbiAgICAgICAgOiBpdGVtO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBpbmplY3RvcjogSW5qZWN0b3IpIHt9XG5cbiAgLyoqXG4gICAqIEBuYW1lIG5nQWZ0ZXJ2aWV3SW5pdFxuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMub25JdGVtQ2xpY2tlZCgpLnN1YnNjcmliZSgoaXRlbTogTmcyTWVudUl0ZW0pID0+IHtcbiAgICAgIHRoaXMucmVxdWVzdEFkZGluZyhpdGVtKTtcbiAgICB9KTtcblxuICAgIC8vIHJlc2V0IGl0ZW1zTWF0Y2hpbmcgYXJyYXkgd2hlbiB0aGUgZHJvcGRvd24gaXMgaGlkZGVuXG4gICAgdGhpcy5vbkhpZGUoKS5zdWJzY3JpYmUodGhpcy5yZXNldEl0ZW1zKTtcblxuICAgIGNvbnN0IERFQk9VTkNFX1RJTUUgPSAyMDA7XG4gICAgY29uc3QgS0VFUF9PUEVOID0gdGhpcy5rZWVwT3BlbjtcblxuICAgIHRoaXMudGFnSW5wdXQub25UZXh0Q2hhbmdlXG4gICAgICAuYXNPYnNlcnZhYmxlKClcbiAgICAgIC5waXBlKFxuICAgICAgICBkZWJvdW5jZVRpbWUoREVCT1VOQ0VfVElNRSksXG4gICAgICAgIGZpbHRlcigodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGlmIChLRUVQX09QRU4gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID4gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUodGhpcy5zaG93KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSB1cGRhdGVQb3NpdGlvblxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy50YWdJbnB1dC5pbnB1dEZvcm0uZ2V0RWxlbWVudFBvc2l0aW9uKCk7XG5cbiAgICB0aGlzLmRyb3Bkb3duLm1lbnUudXBkYXRlUG9zaXRpb24ocG9zaXRpb24sIHRoaXMuZHluYW1pY1VwZGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgaXNWaXNpYmxlXG4gICAqL1xuICBwdWJsaWMgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kcm9wZG93bi5tZW51LmRyb3Bkb3duU3RhdGUubWVudVN0YXRlLmlzVmlzaWJsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBvbkhpZGVcbiAgICovXG4gIHB1YmxpYyBvbkhpZGUoKTogRXZlbnRFbWl0dGVyPE5nMkRyb3Bkb3duPiB7XG4gICAgcmV0dXJuIHRoaXMuZHJvcGRvd24ub25IaWRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIG9uSXRlbUNsaWNrZWRcbiAgICovXG4gIHB1YmxpYyBvbkl0ZW1DbGlja2VkKCk6IEV2ZW50RW1pdHRlcjxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5kcm9wZG93bi5vbkl0ZW1DbGlja2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIHNlbGVjdGVkSXRlbVxuICAgKi9cbiAgcHVibGljIGdldCBzZWxlY3RlZEl0ZW0oKTogTmcyTWVudUl0ZW0ge1xuICAgIHJldHVybiB0aGlzLmRyb3Bkb3duLm1lbnUuZHJvcGRvd25TdGF0ZS5kcm9wZG93blN0YXRlLnNlbGVjdGVkSXRlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBzdGF0ZVxuICAgKi9cbiAgcHVibGljIGdldCBzdGF0ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmRyb3Bkb3duLm1lbnUuZHJvcGRvd25TdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAbmFtZSBzaG93XG4gICAqL1xuICBwdWJsaWMgc2hvdyA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBtYXhJdGVtc1JlYWNoZWQgPVxuICAgICAgdGhpcy50YWdJbnB1dC5pdGVtcy5sZW5ndGggPT09IHRoaXMudGFnSW5wdXQubWF4SXRlbXM7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldEZvcm1WYWx1ZSgpO1xuICAgIGNvbnN0IGhhc01pbmltdW1UZXh0ID0gdmFsdWUudHJpbSgpLmxlbmd0aCA+PSB0aGlzLm1pbmltdW1UZXh0TGVuZ3RoO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5nZXRNYXRjaGluZ0l0ZW1zKHZhbHVlKTtcbiAgICBjb25zdCBoYXNJdGVtcyA9IGl0ZW1zLmxlbmd0aCA+IDA7XG4gICAgY29uc3QgaXNIaWRkZW4gPSB0aGlzLmlzVmlzaWJsZSA9PT0gZmFsc2U7XG4gICAgY29uc3Qgc2hvd0Ryb3Bkb3duSWZFbXB0eSA9IHRoaXMuc2hvd0Ryb3Bkb3duSWZFbXB0eSAmJiBoYXNJdGVtcyAmJiAhdmFsdWU7XG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IHRoaXMudGFnSW5wdXQuZGlzYWJsZTtcblxuICAgIGNvbnN0IHNob3VsZFNob3cgPVxuICAgICAgaXNIaWRkZW4gJiYgKChoYXNJdGVtcyAmJiBoYXNNaW5pbXVtVGV4dCkgfHwgc2hvd0Ryb3Bkb3duSWZFbXB0eSk7XG4gICAgY29uc3Qgc2hvdWxkSGlkZSA9IHRoaXMuaXNWaXNpYmxlICYmICFoYXNJdGVtcztcblxuICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZU9ic2VydmFibGUgJiYgaGFzTWluaW11bVRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEl0ZW1zRnJvbU9ic2VydmFibGUodmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICghdGhpcy5zaG93RHJvcGRvd25JZkVtcHR5ICYmICF2YWx1ZSkgfHxcbiAgICAgIG1heEl0ZW1zUmVhY2hlZCB8fFxuICAgICAgaXNEaXNhYmxlZFxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuZHJvcGRvd24uaGlkZSgpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0SXRlbXMoaXRlbXMpO1xuXG4gICAgaWYgKHNob3VsZFNob3cpIHtcbiAgICAgIHRoaXMuZHJvcGRvd24uc2hvdyhwb3NpdGlvbik7XG4gICAgfSBlbHNlIGlmIChzaG91bGRIaWRlKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuYW1lIGhpZGVcbiAgICovXG4gIHB1YmxpYyBoaWRlKCk6IHZvaWQge1xuICAgIHRoaXMucmVzZXRJdGVtcygpO1xuICAgIHRoaXMuZHJvcGRvd24uaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIHNjcm9sbExpc3RlbmVyXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6c2Nyb2xsJylcbiAgcHVibGljIHNjcm9sbExpc3RlbmVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1Zpc2libGUgfHwgIXRoaXMuZHluYW1pY1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlUG9zaXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBvbldpbmRvd0JsdXJcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpibHVyJylcbiAgcHVibGljIG9uV2luZG93Qmx1cigpOiB2b2lkIHtcbiAgICB0aGlzLmRyb3Bkb3duLmhpZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBnZXRGb3JtVmFsdWVcbiAgICovXG4gIHByaXZhdGUgZ2V0Rm9ybVZhbHVlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZm9ybVZhbHVlID0gdGhpcy50YWdJbnB1dC5mb3JtVmFsdWU7XG4gICAgcmV0dXJuIGZvcm1WYWx1ZSA/IGZvcm1WYWx1ZS50b1N0cmluZygpLnRyaW0oKSA6ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIGNhbGN1bGF0ZVBvc2l0aW9uXG4gICAqL1xuICBwcml2YXRlIGNhbGN1bGF0ZVBvc2l0aW9uKCk6IENsaWVudFJlY3Qge1xuICAgIHJldHVybiB0aGlzLnRhZ0lucHV0LmlucHV0Rm9ybS5nZXRFbGVtZW50UG9zaXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSByZXF1ZXN0QWRkaW5nXG4gICAqIEBwYXJhbSBpdGVtIHtOZzJNZW51SXRlbX1cbiAgICovXG4gIHByaXZhdGUgcmVxdWVzdEFkZGluZyA9IGFzeW5jIChpdGVtOiBOZzJNZW51SXRlbSkgPT4ge1xuICAgIGNvbnN0IHRhZyA9IHRoaXMuY3JlYXRlVGFnTW9kZWwoaXRlbSk7XG4gICAgYXdhaXQgdGhpcy50YWdJbnB1dC5vbkFkZGluZ1JlcXVlc3RlZCh0cnVlLCB0YWcpLmNhdGNoKCgpID0+IHt9KTtcbiAgfTtcblxuICAvKipcbiAgICogQG5hbWUgY3JlYXRlVGFnTW9kZWxcbiAgICogQHBhcmFtIGl0ZW1cbiAgICovXG4gIHByaXZhdGUgY3JlYXRlVGFnTW9kZWwoaXRlbTogTmcyTWVudUl0ZW0pOiBUYWdNb2RlbCB7XG4gICAgY29uc3QgZGlzcGxheSA9XG4gICAgICB0eXBlb2YgaXRlbS52YWx1ZSA9PT0gJ3N0cmluZycgPyBpdGVtLnZhbHVlIDogaXRlbS52YWx1ZVt0aGlzLmRpc3BsYXlCeV07XG4gICAgY29uc3QgdmFsdWUgPVxuICAgICAgdHlwZW9mIGl0ZW0udmFsdWUgPT09ICdzdHJpbmcnID8gaXRlbS52YWx1ZSA6IGl0ZW0udmFsdWVbdGhpcy5pZGVudGlmeUJ5XTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5pdGVtLnZhbHVlLFxuICAgICAgW3RoaXMudGFnSW5wdXQuZGlzcGxheUJ5XTogZGlzcGxheSxcbiAgICAgIFt0aGlzLnRhZ0lucHV0LmlkZW50aWZ5QnldOiB2YWx1ZVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gICAqL1xuICBwcml2YXRlIGdldE1hdGNoaW5nSXRlbXModmFsdWU6IHN0cmluZyk6IFRhZ01vZGVsW10ge1xuICAgIGlmICghdmFsdWUgJiYgIXRoaXMuc2hvd0Ryb3Bkb3duSWZFbXB0eSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGR1cGVzQWxsb3dlZCA9IHRoaXMudGFnSW5wdXQuYWxsb3dEdXBlcztcblxuICAgIHJldHVybiB0aGlzLmF1dG9jb21wbGV0ZUl0ZW1zLmZpbHRlcigoaXRlbTogVGFnTW9kZWwpID0+IHtcbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gZHVwZXNBbGxvd2VkXG4gICAgICAgID8gZmFsc2VcbiAgICAgICAgOiB0aGlzLnRhZ0lucHV0LnRhZ3Muc29tZSh0YWcgPT4ge1xuICAgICAgICAgICAgY29uc3QgaWRlbnRpZnlCeSA9IHRoaXMudGFnSW5wdXQuaWRlbnRpZnlCeTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID1cbiAgICAgICAgICAgICAgdHlwZW9mIHRhZy5tb2RlbCA9PT0gJ3N0cmluZycgPyB0YWcubW9kZWwgOiB0YWcubW9kZWxbaWRlbnRpZnlCeV07XG5cbiAgICAgICAgICAgIHJldHVybiBtb2RlbCA9PT0gaXRlbVt0aGlzLmlkZW50aWZ5QnldO1xuICAgICAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5tYXRjaGluZ0ZuKHZhbHVlLCBpdGVtKSAmJiBoYXNWYWx1ZSA9PT0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgc2V0SXRlbXNcbiAgICovXG4gIHByaXZhdGUgc2V0SXRlbXMoaXRlbXM6IFRhZ01vZGVsW10pOiB2b2lkIHtcbiAgICB0aGlzLml0ZW1zID0gaXRlbXMuc2xpY2UoMCwgdGhpcy5saW1pdEl0ZW1zVG8gfHwgaXRlbXMubGVuZ3RoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSByZXNldEl0ZW1zXG4gICAqL1xuICBwcml2YXRlIHJlc2V0SXRlbXMgPSAoKTogdm9pZCA9PiB7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmFtZSBwb3B1bGF0ZUl0ZW1zXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqL1xuICBwcml2YXRlIHBvcHVsYXRlSXRlbXMoZGF0YTogYW55KTogVGFnSW5wdXREcm9wZG93biB7XG4gICAgdGhpcy5hdXRvY29tcGxldGVJdGVtcyA9IGRhdGEubWFwKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJ1xuICAgICAgICA/IHtcbiAgICAgICAgICAgIFt0aGlzLmRpc3BsYXlCeV06IGl0ZW0sXG4gICAgICAgICAgICBbdGhpcy5pZGVudGlmeUJ5XTogaXRlbVxuICAgICAgICAgIH1cbiAgICAgICAgOiBpdGVtO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgZ2V0SXRlbXNGcm9tT2JzZXJ2YWJsZVxuICAgKiBAcGFyYW0gdGV4dFxuICAgKi9cbiAgcHJpdmF0ZSBnZXRJdGVtc0Zyb21PYnNlcnZhYmxlID0gKHRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICAgIHRoaXMuc2V0TG9hZGluZ1N0YXRlKHRydWUpO1xuXG4gICAgY29uc3Qgc3Vic2NyaWJlRm4gPSAoZGF0YTogYW55W10pID0+IHtcbiAgICAgIC8vIGhpZGUgbG9hZGluZyBhbmltYXRpb25cbiAgICAgIHRoaXMuc2V0TG9hZGluZ1N0YXRlKGZhbHNlKVxuICAgICAgICAvLyBhZGQgaXRlbXNcbiAgICAgICAgLnBvcHVsYXRlSXRlbXMoZGF0YSk7XG5cbiAgICAgIHRoaXMuc2V0SXRlbXModGhpcy5nZXRNYXRjaGluZ0l0ZW1zKHRleHQpKTtcblxuICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZHJvcGRvd24uc2hvdyh0aGlzLmNhbGN1bGF0ZVBvc2l0aW9uKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcm9wZG93bi5oaWRlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuYXV0b2NvbXBsZXRlT2JzZXJ2YWJsZSh0ZXh0KVxuICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgIC5zdWJzY3JpYmUoc3Vic2NyaWJlRm4sICgpID0+IHRoaXMuc2V0TG9hZGluZ1N0YXRlKGZhbHNlKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuYW1lIHNldExvYWRpbmdTdGF0ZVxuICAgKiBAcGFyYW0gc3RhdGVcbiAgICovXG4gIHByaXZhdGUgc2V0TG9hZGluZ1N0YXRlKHN0YXRlOiBib29sZWFuKTogVGFnSW5wdXREcm9wZG93biB7XG4gICAgdGhpcy50YWdJbnB1dC5pc0xvYWRpbmcgPSBzdGF0ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iXX0=
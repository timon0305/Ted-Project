import * as tslib_1 from "tslib";
import { Component, ContentChildren, HostListener, Injector, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { filter, first, debounceTime } from 'rxjs/operators';
import { Ng2Dropdown } from 'ng2-material-dropdown';
import { defaults } from '../../defaults';
import { TagInputComponent } from '../tag-input/tag-input';
var TagInputDropdown = /** @class */ (function () {
    function TagInputDropdown(injector) {
        var _this = this;
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
        this.show = function () {
            var maxItemsReached = _this.tagInput.items.length === _this.tagInput.maxItems;
            var value = _this.getFormValue();
            var hasMinimumText = value.trim().length >= _this.minimumTextLength;
            var position = _this.calculatePosition();
            var items = _this.getMatchingItems(value);
            var hasItems = items.length > 0;
            var isHidden = _this.isVisible === false;
            var showDropdownIfEmpty = _this.showDropdownIfEmpty && hasItems && !value;
            var isDisabled = _this.tagInput.disable;
            var shouldShow = isHidden && ((hasItems && hasMinimumText) || showDropdownIfEmpty);
            var shouldHide = _this.isVisible && !hasItems;
            if (_this.autocompleteObservable && hasMinimumText) {
                return _this.getItemsFromObservable(value);
            }
            if ((!_this.showDropdownIfEmpty && !value) ||
                maxItemsReached ||
                isDisabled) {
                return _this.dropdown.hide();
            }
            _this.setItems(items);
            if (shouldShow) {
                _this.dropdown.show(position);
            }
            else if (shouldHide) {
                _this.hide();
            }
        };
        /**
         * @name requestAdding
         * @param item {Ng2MenuItem}
         */
        this.requestAdding = function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var tag;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = this.createTagModel(item);
                        return [4 /*yield*/, this.tagInput.onAddingRequested(true, tag).catch(function () { })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * @name resetItems
         */
        this.resetItems = function () {
            _this.items = [];
        };
        /**
         * @name getItemsFromObservable
         * @param text
         */
        this.getItemsFromObservable = function (text) {
            _this.setLoadingState(true);
            var subscribeFn = function (data) {
                // hide loading animation
                _this.setLoadingState(false)
                    // add items
                    .populateItems(data);
                _this.setItems(_this.getMatchingItems(text));
                if (_this.items.length) {
                    _this.dropdown.show(_this.calculatePosition());
                }
                else {
                    _this.dropdown.hide();
                }
            };
            _this.autocompleteObservable(text)
                .pipe(first())
                .subscribe(subscribeFn, function () { return _this.setLoadingState(false); });
        };
    }
    Object.defineProperty(TagInputDropdown.prototype, "autocompleteItems", {
        /**
         * @name autocompleteItems
         * @desc array of items that will populate the autocomplete
         */
        get: function () {
            var _this = this;
            var items = this._autocompleteItems;
            if (!items) {
                return [];
            }
            return items.map(function (item) {
                var _a;
                return typeof item === 'string'
                    ? (_a = {},
                        _a[_this.displayBy] = item,
                        _a[_this.identifyBy] = item,
                        _a) : item;
            });
        },
        /**
         * @name autocompleteItems
         * @param items
         */
        set: function (items) {
            this._autocompleteItems = items;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @name ngAfterviewInit
     */
    TagInputDropdown.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.onItemClicked().subscribe(function (item) {
            _this.requestAdding(item);
        });
        // reset itemsMatching array when the dropdown is hidden
        this.onHide().subscribe(this.resetItems);
        var DEBOUNCE_TIME = 200;
        var KEEP_OPEN = this.keepOpen;
        this.tagInput.onTextChange
            .asObservable()
            .pipe(debounceTime(DEBOUNCE_TIME), filter(function (value) {
            if (KEEP_OPEN === false) {
                return value.length > 0;
            }
            return true;
        }))
            .subscribe(this.show);
    };
    /**
     * @name updatePosition
     */
    TagInputDropdown.prototype.updatePosition = function () {
        var position = this.tagInput.inputForm.getElementPosition();
        this.dropdown.menu.updatePosition(position, this.dynamicUpdate);
    };
    Object.defineProperty(TagInputDropdown.prototype, "isVisible", {
        /**
         * @name isVisible
         */
        get: function () {
            return this.dropdown.menu.dropdownState.menuState.isVisible;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @name onHide
     */
    TagInputDropdown.prototype.onHide = function () {
        return this.dropdown.onHide;
    };
    /**
     * @name onItemClicked
     */
    TagInputDropdown.prototype.onItemClicked = function () {
        return this.dropdown.onItemClicked;
    };
    Object.defineProperty(TagInputDropdown.prototype, "selectedItem", {
        /**
         * @name selectedItem
         */
        get: function () {
            return this.dropdown.menu.dropdownState.dropdownState.selectedItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagInputDropdown.prototype, "state", {
        /**
         * @name state
         */
        get: function () {
            return this.dropdown.menu.dropdownState;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @name hide
     */
    TagInputDropdown.prototype.hide = function () {
        this.resetItems();
        this.dropdown.hide();
    };
    /**
     * @name scrollListener
     */
    TagInputDropdown.prototype.scrollListener = function () {
        if (!this.isVisible || !this.dynamicUpdate) {
            return;
        }
        this.updatePosition();
    };
    /**
     * @name onWindowBlur
     */
    TagInputDropdown.prototype.onWindowBlur = function () {
        this.dropdown.hide();
    };
    /**
     * @name getFormValue
     */
    TagInputDropdown.prototype.getFormValue = function () {
        var formValue = this.tagInput.formValue;
        return formValue ? formValue.toString().trim() : '';
    };
    /**
     * @name calculatePosition
     */
    TagInputDropdown.prototype.calculatePosition = function () {
        return this.tagInput.inputForm.getElementPosition();
    };
    /**
     * @name createTagModel
     * @param item
     */
    TagInputDropdown.prototype.createTagModel = function (item) {
        var _a;
        var display = typeof item.value === 'string' ? item.value : item.value[this.displayBy];
        var value = typeof item.value === 'string' ? item.value : item.value[this.identifyBy];
        return tslib_1.__assign({}, item.value, (_a = {}, _a[this.tagInput.displayBy] = display, _a[this.tagInput.identifyBy] = value, _a));
    };
    /**
     *
     * @param value {string}
     */
    TagInputDropdown.prototype.getMatchingItems = function (value) {
        var _this = this;
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }
        var dupesAllowed = this.tagInput.allowDupes;
        return this.autocompleteItems.filter(function (item) {
            var hasValue = dupesAllowed
                ? false
                : _this.tagInput.tags.some(function (tag) {
                    var identifyBy = _this.tagInput.identifyBy;
                    var model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];
                    return model === item[_this.identifyBy];
                });
            return _this.matchingFn(value, item) && hasValue === false;
        });
    };
    /**
     * @name setItems
     */
    TagInputDropdown.prototype.setItems = function (items) {
        this.items = items.slice(0, this.limitItemsTo || items.length);
    };
    /**
     * @name populateItems
     * @param data
     */
    TagInputDropdown.prototype.populateItems = function (data) {
        var _this = this;
        this.autocompleteItems = data.map(function (item) {
            var _a;
            return typeof item === 'string'
                ? (_a = {},
                    _a[_this.displayBy] = item,
                    _a[_this.identifyBy] = item,
                    _a) : item;
        });
        return this;
    };
    /**
     * @name setLoadingState
     * @param state
     */
    TagInputDropdown.prototype.setLoadingState = function (state) {
        this.tagInput.isLoading = state;
        return this;
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
    return TagInputDropdown;
}());
export { TagInputDropdown };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0LWRyb3Bkb3duLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jaGlwcy8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZHJvcGRvd24vdGFnLWlucHV0LWRyb3Bkb3duLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxlQUFlLEVBRWYsWUFBWSxFQUNaLFFBQVEsRUFDUixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBRVYsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0QsT0FBTyxFQUFFLFdBQVcsRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQU0zRDtJQWlJRSwwQkFBNkIsUUFBa0I7UUFBL0MsaUJBQW1EO1FBQXRCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFySC9DOztXQUVHO1FBQ2EsV0FBTSxHQUFXLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBRTFEOztXQUVHO1FBQ2Esc0JBQWlCLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztRQUV4RTs7O1dBR0c7UUFDYSx3QkFBbUIsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO1FBUTVFOzs7V0FHRztRQUNhLHNCQUFpQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUM7UUFFeEU7OztXQUdHO1FBQ2EsaUJBQVksR0FBVyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUV0RTs7V0FFRztRQUNhLGNBQVMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FB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SUFrSUQ7UUFEQyxZQUFZLENBQUMsZUFBZSxDQUFDOzs7OzBEQU83QjtJQU1EO1FBREMsWUFBWSxDQUFDLGFBQWEsQ0FBQzs7Ozt3REFHM0I7SUEvUVUsZ0JBQWdCO1FBSjVCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsNDVCQUFpRDtTQUNsRCxDQUFDO2lEQWtJdUMsUUFBUTtPQWpJcEMsZ0JBQWdCLENBdVo1QjtJQUFELHVCQUFDO0NBQUEsQUF2WkQsSUF1WkM7U0F2WlksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLy8gcnhcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgZmlyc3QsIGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTmcyRHJvcGRvd24sIE5nMk1lbnVJdGVtIH0gZnJvbSAnbmcyLW1hdGVyaWFsLWRyb3Bkb3duJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vZGVmYXVsdHMnO1xuaW1wb3J0IHsgVGFnTW9kZWwgfSBmcm9tICcuLi8uLi9jb3JlL2FjY2Vzc29yJztcbmltcG9ydCB7IFRhZ0lucHV0Q29tcG9uZW50IH0gZnJvbSAnLi4vdGFnLWlucHV0L3RhZy1pbnB1dCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3RhZy1pbnB1dC1kcm9wZG93bicsXG4gIHRlbXBsYXRlVXJsOiAnLi90YWctaW5wdXQtZHJvcGRvd24udGVtcGxhdGUuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgVGFnSW5wdXREcm9wZG93biBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICAvKipcbiAgICogQG5hbWUgZHJvcGRvd25cbiAgICovXG4gIEBWaWV3Q2hpbGQoTmcyRHJvcGRvd24sIHsgc3RhdGljOiBmYWxzZSB9KSBwdWJsaWMgZHJvcGRvd246IE5nMkRyb3Bkb3duO1xuXG4gIC8qKlxuICAgKiBAbmFtZSBtZW51VGVtcGxhdGVcbiAgICogQGRlc2MgcmVmZXJlbmNlIHRvIHRoZSB0ZW1wbGF0ZSBpZiBwcm92aWRlZCBieSB0aGUgdXNlclxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihUZW1wbGF0ZVJlZikgcHVibGljIHRlbXBsYXRlczogUXVlcnlMaXN0PFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gIC8qKlxuICAgKiBAbmFtZSBvZmZzZXRcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBvZmZzZXQ6IHN0cmluZyA9IGRlZmF1bHRzLmRyb3Bkb3duLm9mZnNldDtcblxuICAvKipcbiAgICogQG5hbWUgZm9jdXNGaXJzdEVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBmb2N1c0ZpcnN0RWxlbWVudCA9IGRlZmF1bHRzLmRyb3Bkb3duLmZvY3VzRmlyc3RFbGVtZW50O1xuXG4gIC8qKlxuICAgKiAtIHNob3cgYXV0b2NvbXBsZXRlIGRyb3Bkb3duIGlmIHRoZSB2YWx1ZSBvZiBpbnB1dCBpcyBlbXB0eVxuICAgKiBAbmFtZSBzaG93RHJvcGRvd25JZkVtcHR5XG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgc2hvd0Ryb3Bkb3duSWZFbXB0eSA9IGRlZmF1bHRzLmRyb3Bkb3duLnNob3dEcm9wZG93bklmRW1wdHk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBvYnNlcnZhYmxlIHBhc3NlZCBhcyBpbnB1dCB3aGljaCBwb3B1bGF0ZXMgdGhlIGF1dG9jb21wbGV0ZSBpdGVtc1xuICAgKiBAbmFtZSBhdXRvY29tcGxldGVPYnNlcnZhYmxlXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgYXV0b2NvbXBsZXRlT2JzZXJ2YWJsZTogKHRleHQ6IHN0cmluZykgPT4gT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIC8qKlxuICAgKiAtIGRlc2MgbWluaW11bSB0ZXh0IGxlbmd0aCBpbiBvcmRlciB0byBkaXNwbGF5IHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd25cbiAgICogQG5hbWUgbWluaW11bVRleHRMZW5ndGhcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBtaW5pbXVtVGV4dExlbmd0aCA9IGRlZmF1bHRzLmRyb3Bkb3duLm1pbmltdW1UZXh0TGVuZ3RoO1xuXG4gIC8qKlxuICAgKiAtIG51bWJlciBvZiBpdGVtcyB0byBkaXNwbGF5IGluIHRoZSBhdXRvY29tcGxldGUgZHJvcGRvd25cbiAgICogQG5hbWUgbGltaXRJdGVtc1RvXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgbGltaXRJdGVtc1RvOiBudW1iZXIgPSBkZWZhdWx0cy5kcm9wZG93bi5saW1pdEl0ZW1zVG87XG5cbiAgLyoqXG4gICAqIEBuYW1lIGRpc3BsYXlCeVxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGRpc3BsYXlCeSA9IGRlZmF1bHRzLmRyb3Bkb3duLmRpc3BsYXlCeTtcblxuICAvKipcbiAgICogQG5hbWUgaWRlbnRpZnlCeVxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGlkZW50aWZ5QnkgPSBkZWZhdWx0cy5kcm9wZG93bi5pZGVudGlmeUJ5O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gYSBmdW5jdGlvbiBhIGRldmVsb3BlciBjYW4gdXNlIHRvIGltcGxlbWVudCBjdXN0b20gbWF0Y2hpbmcgZm9yIHRoZSBhdXRvY29tcGxldGVcbiAgICogQG5hbWUgbWF0Y2hpbmdGblxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIG1hdGNoaW5nRm46ICh2YWx1ZTogc3RyaW5nLCB0YXJnZXQ6IFRhZ01vZGVsKSA9PiBib29sZWFuID1cbiAgICBkZWZhdWx0cy5kcm9wZG93bi5tYXRjaGluZ0ZuO1xuXG4gIC8qKlxuICAgKiBAbmFtZSBhcHBlbmRUb0JvZHlcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBhcHBlbmRUb0JvZHkgPSBkZWZhdWx0cy5kcm9wZG93bi5hcHBlbmRUb0JvZHk7XG5cbiAgLyoqXG4gICAqIEBuYW1lIGtlZXBPcGVuXG4gICAqIEBkZXNjcmlwdGlvbiBvcHRpb24gdG8gbGVhdmUgZHJvcGRvd24gb3BlbiB3aGVuIGFkZGluZyBhIG5ldyBpdGVtXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMga2VlcE9wZW4gPSBkZWZhdWx0cy5kcm9wZG93bi5rZWVwT3BlbjtcblxuICAvKipcbiAgICogQG5hbWUgZHluYW1pY1VwZGF0ZVxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGR5bmFtaWNVcGRhdGUgPSBkZWZhdWx0cy5kcm9wZG93bi5keW5hbWljVXBkYXRlO1xuXG4gIC8qKlxuICAgKiBAbmFtZSB6SW5kZXhcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyB6SW5kZXggPSBkZWZhdWx0cy5kcm9wZG93bi56SW5kZXg7XG5cbiAgLyoqXG4gICAqIGxpc3Qgb2YgaXRlbXMgdGhhdCBtYXRjaCB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgaW5wdXQgKGZvciBhdXRvY29tcGxldGUpXG4gICAqIEBuYW1lIGl0ZW1zXG4gICAqL1xuICBwdWJsaWMgaXRlbXM6IFRhZ01vZGVsW10gPSBbXTtcblxuICAvKipcbiAgICogQG5hbWUgdGFnSW5wdXRcbiAgICovXG4gIHB1YmxpYyB0YWdJbnB1dDogVGFnSW5wdXRDb21wb25lbnQgPSB0aGlzLmluamVjdG9yLmdldChUYWdJbnB1dENvbXBvbmVudCk7XG5cbiAgLyoqXG4gICAqIEBuYW1lIF9hdXRvY29tcGxldGVJdGVtc1xuICAgKi9cbiAgcHJpdmF0ZSBfYXV0b2NvbXBsZXRlSXRlbXM6IFRhZ01vZGVsW10gPSBbXTtcblxuICAvKipcbiAgICogQG5hbWUgYXV0b2NvbXBsZXRlSXRlbXNcbiAgICogQHBhcmFtIGl0ZW1zXG4gICAqL1xuICBwdWJsaWMgc2V0IGF1dG9jb21wbGV0ZUl0ZW1zKGl0ZW1zOiBUYWdNb2RlbFtdKSB7XG4gICAgdGhpcy5fYXV0b2NvbXBsZXRlSXRlbXMgPSBpdGVtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBhdXRvY29tcGxldGVJdGVtc1xuICAgKiBAZGVzYyBhcnJheSBvZiBpdGVtcyB0aGF0IHdpbGwgcG9wdWxhdGUgdGhlIGF1dG9jb21wbGV0ZVxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGdldCBhdXRvY29tcGxldGVJdGVtcygpOiBUYWdNb2RlbFtdIHtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2F1dG9jb21wbGV0ZUl0ZW1zO1xuXG4gICAgaWYgKCFpdGVtcykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVtcy5tYXAoKGl0ZW06IFRhZ01vZGVsKSA9PiB7XG4gICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgW3RoaXMuZGlzcGxheUJ5XTogaXRlbSxcbiAgICAgICAgICAgIFt0aGlzLmlkZW50aWZ5QnldOiBpdGVtXG4gICAgICAgICAgfVxuICAgICAgICA6IGl0ZW07XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGluamVjdG9yOiBJbmplY3Rvcikge31cblxuICAvKipcbiAgICogQG5hbWUgbmdBZnRlcnZpZXdJbml0XG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5vbkl0ZW1DbGlja2VkKCkuc3Vic2NyaWJlKChpdGVtOiBOZzJNZW51SXRlbSkgPT4ge1xuICAgICAgdGhpcy5yZXF1ZXN0QWRkaW5nKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgLy8gcmVzZXQgaXRlbXNNYXRjaGluZyBhcnJheSB3aGVuIHRoZSBkcm9wZG93biBpcyBoaWRkZW5cbiAgICB0aGlzLm9uSGlkZSgpLnN1YnNjcmliZSh0aGlzLnJlc2V0SXRlbXMpO1xuXG4gICAgY29uc3QgREVCT1VOQ0VfVElNRSA9IDIwMDtcbiAgICBjb25zdCBLRUVQX09QRU4gPSB0aGlzLmtlZXBPcGVuO1xuXG4gICAgdGhpcy50YWdJbnB1dC5vblRleHRDaGFuZ2VcbiAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZShERUJPVU5DRV9USU1FKSxcbiAgICAgICAgZmlsdGVyKCh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgaWYgKEtFRVBfT1BFTiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPiAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSh0aGlzLnNob3cpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIHVwZGF0ZVBvc2l0aW9uXG4gICAqL1xuICBwdWJsaWMgdXBkYXRlUG9zaXRpb24oKTogdm9pZCB7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnRhZ0lucHV0LmlucHV0Rm9ybS5nZXRFbGVtZW50UG9zaXRpb24oKTtcblxuICAgIHRoaXMuZHJvcGRvd24ubWVudS51cGRhdGVQb3NpdGlvbihwb3NpdGlvbiwgdGhpcy5keW5hbWljVXBkYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBpc1Zpc2libGVcbiAgICovXG4gIHB1YmxpYyBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRyb3Bkb3duLm1lbnUuZHJvcGRvd25TdGF0ZS5tZW51U3RhdGUuaXNWaXNpYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIG9uSGlkZVxuICAgKi9cbiAgcHVibGljIG9uSGlkZSgpOiBFdmVudEVtaXR0ZXI8TmcyRHJvcGRvd24+IHtcbiAgICByZXR1cm4gdGhpcy5kcm9wZG93bi5vbkhpZGU7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgb25JdGVtQ2xpY2tlZFxuICAgKi9cbiAgcHVibGljIG9uSXRlbUNsaWNrZWQoKTogRXZlbnRFbWl0dGVyPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmRyb3Bkb3duLm9uSXRlbUNsaWNrZWQ7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgc2VsZWN0ZWRJdGVtXG4gICAqL1xuICBwdWJsaWMgZ2V0IHNlbGVjdGVkSXRlbSgpOiBOZzJNZW51SXRlbSB7XG4gICAgcmV0dXJuIHRoaXMuZHJvcGRvd24ubWVudS5kcm9wZG93blN0YXRlLmRyb3Bkb3duU3RhdGUuc2VsZWN0ZWRJdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIHN0YXRlXG4gICAqL1xuICBwdWJsaWMgZ2V0IHN0YXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZHJvcGRvd24ubWVudS5kcm9wZG93blN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBuYW1lIHNob3dcbiAgICovXG4gIHB1YmxpYyBzaG93ID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG1heEl0ZW1zUmVhY2hlZCA9XG4gICAgICB0aGlzLnRhZ0lucHV0Lml0ZW1zLmxlbmd0aCA9PT0gdGhpcy50YWdJbnB1dC5tYXhJdGVtcztcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0Rm9ybVZhbHVlKCk7XG4gICAgY29uc3QgaGFzTWluaW11bVRleHQgPSB2YWx1ZS50cmltKCkubGVuZ3RoID49IHRoaXMubWluaW11bVRleHRMZW5ndGg7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNhbGN1bGF0ZVBvc2l0aW9uKCk7XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLmdldE1hdGNoaW5nSXRlbXModmFsdWUpO1xuICAgIGNvbnN0IGhhc0l0ZW1zID0gaXRlbXMubGVuZ3RoID4gMDtcbiAgICBjb25zdCBpc0hpZGRlbiA9IHRoaXMuaXNWaXNpYmxlID09PSBmYWxzZTtcbiAgICBjb25zdCBzaG93RHJvcGRvd25JZkVtcHR5ID0gdGhpcy5zaG93RHJvcGRvd25JZkVtcHR5ICYmIGhhc0l0ZW1zICYmICF2YWx1ZTtcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gdGhpcy50YWdJbnB1dC5kaXNhYmxlO1xuXG4gICAgY29uc3Qgc2hvdWxkU2hvdyA9XG4gICAgICBpc0hpZGRlbiAmJiAoKGhhc0l0ZW1zICYmIGhhc01pbmltdW1UZXh0KSB8fCBzaG93RHJvcGRvd25JZkVtcHR5KTtcbiAgICBjb25zdCBzaG91bGRIaWRlID0gdGhpcy5pc1Zpc2libGUgJiYgIWhhc0l0ZW1zO1xuXG4gICAgaWYgKHRoaXMuYXV0b2NvbXBsZXRlT2JzZXJ2YWJsZSAmJiBoYXNNaW5pbXVtVGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbXNGcm9tT2JzZXJ2YWJsZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgKCF0aGlzLnNob3dEcm9wZG93bklmRW1wdHkgJiYgIXZhbHVlKSB8fFxuICAgICAgbWF4SXRlbXNSZWFjaGVkIHx8XG4gICAgICBpc0Rpc2FibGVkXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kcm9wZG93bi5oaWRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRJdGVtcyhpdGVtcyk7XG5cbiAgICBpZiAoc2hvdWxkU2hvdykge1xuICAgICAgdGhpcy5kcm9wZG93bi5zaG93KHBvc2l0aW9uKTtcbiAgICB9IGVsc2UgaWYgKHNob3VsZEhpZGUpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQG5hbWUgaGlkZVxuICAgKi9cbiAgcHVibGljIGhpZGUoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldEl0ZW1zKCk7XG4gICAgdGhpcy5kcm9wZG93bi5oaWRlKCk7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgc2Nyb2xsTGlzdGVuZXJcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpzY3JvbGwnKVxuICBwdWJsaWMgc2Nyb2xsTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzVmlzaWJsZSB8fCAhdGhpcy5keW5hbWljVXBkYXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVQb3NpdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIG9uV2luZG93Qmx1clxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmJsdXInKVxuICBwdWJsaWMgb25XaW5kb3dCbHVyKCk6IHZvaWQge1xuICAgIHRoaXMuZHJvcGRvd24uaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIGdldEZvcm1WYWx1ZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRGb3JtVmFsdWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCBmb3JtVmFsdWUgPSB0aGlzLnRhZ0lucHV0LmZvcm1WYWx1ZTtcbiAgICByZXR1cm4gZm9ybVZhbHVlID8gZm9ybVZhbHVlLnRvU3RyaW5nKCkudHJpbSgpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgY2FsY3VsYXRlUG9zaXRpb25cbiAgICovXG4gIHByaXZhdGUgY2FsY3VsYXRlUG9zaXRpb24oKTogQ2xpZW50UmVjdCB7XG4gICAgcmV0dXJuIHRoaXMudGFnSW5wdXQuaW5wdXRGb3JtLmdldEVsZW1lbnRQb3NpdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIHJlcXVlc3RBZGRpbmdcbiAgICogQHBhcmFtIGl0ZW0ge05nMk1lbnVJdGVtfVxuICAgKi9cbiAgcHJpdmF0ZSByZXF1ZXN0QWRkaW5nID0gYXN5bmMgKGl0ZW06IE5nMk1lbnVJdGVtKSA9PiB7XG4gICAgY29uc3QgdGFnID0gdGhpcy5jcmVhdGVUYWdNb2RlbChpdGVtKTtcbiAgICBhd2FpdCB0aGlzLnRhZ0lucHV0Lm9uQWRkaW5nUmVxdWVzdGVkKHRydWUsIHRhZykuY2F0Y2goKCkgPT4ge30pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmFtZSBjcmVhdGVUYWdNb2RlbFxuICAgKiBAcGFyYW0gaXRlbVxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVUYWdNb2RlbChpdGVtOiBOZzJNZW51SXRlbSk6IFRhZ01vZGVsIHtcbiAgICBjb25zdCBkaXNwbGF5ID1cbiAgICAgIHR5cGVvZiBpdGVtLnZhbHVlID09PSAnc3RyaW5nJyA/IGl0ZW0udmFsdWUgOiBpdGVtLnZhbHVlW3RoaXMuZGlzcGxheUJ5XTtcbiAgICBjb25zdCB2YWx1ZSA9XG4gICAgICB0eXBlb2YgaXRlbS52YWx1ZSA9PT0gJ3N0cmluZycgPyBpdGVtLnZhbHVlIDogaXRlbS52YWx1ZVt0aGlzLmlkZW50aWZ5QnldO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLml0ZW0udmFsdWUsXG4gICAgICBbdGhpcy50YWdJbnB1dC5kaXNwbGF5QnldOiBkaXNwbGF5LFxuICAgICAgW3RoaXMudGFnSW5wdXQuaWRlbnRpZnlCeV06IHZhbHVlXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cbiAgICovXG4gIHByaXZhdGUgZ2V0TWF0Y2hpbmdJdGVtcyh2YWx1ZTogc3RyaW5nKTogVGFnTW9kZWxbXSB7XG4gICAgaWYgKCF2YWx1ZSAmJiAhdGhpcy5zaG93RHJvcGRvd25JZkVtcHR5KSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgZHVwZXNBbGxvd2VkID0gdGhpcy50YWdJbnB1dC5hbGxvd0R1cGVzO1xuXG4gICAgcmV0dXJuIHRoaXMuYXV0b2NvbXBsZXRlSXRlbXMuZmlsdGVyKChpdGVtOiBUYWdNb2RlbCkgPT4ge1xuICAgICAgY29uc3QgaGFzVmFsdWUgPSBkdXBlc0FsbG93ZWRcbiAgICAgICAgPyBmYWxzZVxuICAgICAgICA6IHRoaXMudGFnSW5wdXQudGFncy5zb21lKHRhZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmeUJ5ID0gdGhpcy50YWdJbnB1dC5pZGVudGlmeUJ5O1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPVxuICAgICAgICAgICAgICB0eXBlb2YgdGFnLm1vZGVsID09PSAnc3RyaW5nJyA/IHRhZy5tb2RlbCA6IHRhZy5tb2RlbFtpZGVudGlmeUJ5XTtcblxuICAgICAgICAgICAgcmV0dXJuIG1vZGVsID09PSBpdGVtW3RoaXMuaWRlbnRpZnlCeV07XG4gICAgICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzLm1hdGNoaW5nRm4odmFsdWUsIGl0ZW0pICYmIGhhc1ZhbHVlID09PSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBzZXRJdGVtc1xuICAgKi9cbiAgcHJpdmF0ZSBzZXRJdGVtcyhpdGVtczogVGFnTW9kZWxbXSk6IHZvaWQge1xuICAgIHRoaXMuaXRlbXMgPSBpdGVtcy5zbGljZSgwLCB0aGlzLmxpbWl0SXRlbXNUbyB8fCBpdGVtcy5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIHJlc2V0SXRlbXNcbiAgICovXG4gIHByaXZhdGUgcmVzZXRJdGVtcyA9ICgpOiB2b2lkID0+IHtcbiAgICB0aGlzLml0ZW1zID0gW107XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuYW1lIHBvcHVsYXRlSXRlbXNcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIHByaXZhdGUgcG9wdWxhdGVJdGVtcyhkYXRhOiBhbnkpOiBUYWdJbnB1dERyb3Bkb3duIHtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZUl0ZW1zID0gZGF0YS5tYXAoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgW3RoaXMuZGlzcGxheUJ5XTogaXRlbSxcbiAgICAgICAgICAgIFt0aGlzLmlkZW50aWZ5QnldOiBpdGVtXG4gICAgICAgICAgfVxuICAgICAgICA6IGl0ZW07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBnZXRJdGVtc0Zyb21PYnNlcnZhYmxlXG4gICAqIEBwYXJhbSB0ZXh0XG4gICAqL1xuICBwcml2YXRlIGdldEl0ZW1zRnJvbU9ic2VydmFibGUgPSAodGV4dDogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgdGhpcy5zZXRMb2FkaW5nU3RhdGUodHJ1ZSk7XG5cbiAgICBjb25zdCBzdWJzY3JpYmVGbiA9IChkYXRhOiBhbnlbXSkgPT4ge1xuICAgICAgLy8gaGlkZSBsb2FkaW5nIGFuaW1hdGlvblxuICAgICAgdGhpcy5zZXRMb2FkaW5nU3RhdGUoZmFsc2UpXG4gICAgICAgIC8vIGFkZCBpdGVtc1xuICAgICAgICAucG9wdWxhdGVJdGVtcyhkYXRhKTtcblxuICAgICAgdGhpcy5zZXRJdGVtcyh0aGlzLmdldE1hdGNoaW5nSXRlbXModGV4dCkpO1xuXG4gICAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5kcm9wZG93bi5zaG93KHRoaXMuY2FsY3VsYXRlUG9zaXRpb24oKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyb3Bkb3duLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5hdXRvY29tcGxldGVPYnNlcnZhYmxlKHRleHQpXG4gICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgLnN1YnNjcmliZShzdWJzY3JpYmVGbiwgKCkgPT4gdGhpcy5zZXRMb2FkaW5nU3RhdGUoZmFsc2UpKTtcbiAgfTtcblxuICAvKipcbiAgICogQG5hbWUgc2V0TG9hZGluZ1N0YXRlXG4gICAqIEBwYXJhbSBzdGF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBzZXRMb2FkaW5nU3RhdGUoc3RhdGU6IGJvb2xlYW4pOiBUYWdJbnB1dERyb3Bkb3duIHtcbiAgICB0aGlzLnRhZ0lucHV0LmlzTG9hZGluZyA9IHN0YXRlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiJdfQ==
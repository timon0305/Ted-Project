/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, HostListener, NgModule, ChangeDetectorRef, ViewEncapsulation, ContentChild, ViewChild, forwardRef, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyException } from './multiselect.model';
import { ClickOutsideDirective, ScrollDirective, styleDirective, setPosition } from './clickOutside';
import { ListFilterPipe } from './list-filter';
import { Item, Badge, Search, TemplateRenderer, CIcon } from './menu-item';
import { DataService } from './multiselect.service';
import { Subject } from 'rxjs';
import { VirtualScrollerModule, VirtualScrollerComponent } from './virtual-scroll/virtual-scroll';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
/** @type {?} */
export const DROPDOWN_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => AngularMultiSelect)),
    multi: true
};
/** @type {?} */
export const DROPDOWN_CONTROL_VALIDATION = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => AngularMultiSelect)),
    multi: true,
};
/** @type {?} */
const noop = (/**
 * @return {?}
 */
() => {
});
const ɵ0 = noop;
export class AngularMultiSelect {
    /**
     * @param {?} _elementRef
     * @param {?} cdr
     * @param {?} ds
     */
    constructor(_elementRef, cdr, ds) {
        this._elementRef = _elementRef;
        this.cdr = cdr;
        this.ds = ds;
        this.onSelect = new EventEmitter();
        this.onDeSelect = new EventEmitter();
        this.onSelectAll = new EventEmitter();
        this.onDeSelectAll = new EventEmitter();
        this.onOpen = new EventEmitter();
        this.onClose = new EventEmitter();
        this.onScrollToEnd = new EventEmitter();
        this.onFilterSelectAll = new EventEmitter();
        this.onFilterDeSelectAll = new EventEmitter();
        this.onAddFilterNewItem = new EventEmitter();
        this.onGroupSelect = new EventEmitter();
        this.onGroupDeSelect = new EventEmitter();
        this.virtualdata = [];
        this.searchTerm$ = new Subject();
        this.isActive = false;
        this.isSelectAll = false;
        this.isFilterSelectAll = false;
        this.isInfiniteFilterSelectAll = false;
        this.chunkIndex = [];
        this.cachedItems = [];
        this.groupCachedItems = [];
        this.itemHeight = 41.6;
        this.filterLength = 0;
        this.infiniteFilterLength = 0;
        this.dropdownListYOffset = 0;
        this.defaultSettings = {
            singleSelection: false,
            text: 'Select',
            enableCheckAll: true,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            filterSelectAllText: 'Select all filtered results',
            filterUnSelectAllText: 'UnSelect all filtered results',
            enableSearchFilter: false,
            searchBy: [],
            maxHeight: 300,
            badgeShowLimit: 999999999999,
            classes: '',
            disabled: false,
            searchPlaceholderText: 'Search',
            showCheckbox: true,
            noDataLabel: 'No Data Available',
            searchAutofocus: true,
            lazyLoading: false,
            labelKey: 'itemName',
            primaryKey: 'id',
            position: 'bottom',
            autoPosition: true,
            enableFilterSelectAll: true,
            selectGroup: false,
            addNewItemOnFilter: false,
            addNewButtonText: "Add",
            escapeToClose: true,
            clearAll: true
        };
        this.randomSize = true;
        this.filteredList = [];
        this.virtualScroollInit = false;
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
        this.searchTerm$.asObservable().pipe(debounceTime(1000), distinctUntilChanged(), tap((/**
         * @param {?} term
         * @return {?}
         */
        term => term))).subscribe((/**
         * @param {?} val
         * @return {?}
         */
        val => {
            this.filterInfiniteList(val);
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onEscapeDown(event) {
        if (this.settings.escapeToClose) {
            this.closeDropdown();
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        this.cachedItems = this.cloneArray(this.data);
        if (this.settings.position == 'top') {
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.selectedListHeight = { val: 0 };
                this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            }));
        }
        this.subscription = this.ds.getData().subscribe((/**
         * @param {?} data
         * @return {?}
         */
        data => {
            if (data) {
                /** @type {?} */
                let len = 0;
                data.forEach((/**
                 * @param {?} obj
                 * @param {?} i
                 * @return {?}
                 */
                (obj, i) => {
                    if (!obj.hasOwnProperty('grpTitle')) {
                        len++;
                    }
                }));
                this.filterLength = len;
                this.onFilterChange(data);
            }
        }));
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.calculateDropdownDirection();
        }));
        this.virtualScroollInit = false;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            if (this.settings.groupBy) {
                this.groupedData = this.transformData(this.data, this.settings.groupBy);
                if (this.data.length == 0) {
                    this.selectedItems = [];
                }
                this.groupCachedItems = this.cloneArray(this.groupedData);
            }
            this.cachedItems = this.cloneArray(this.data);
        }
        if (changes.settings && !changes.settings.firstChange) {
            this.settings = Object.assign(this.defaultSettings, this.settings);
        }
        if (changes.loading) {
        }
        if (this.settings.lazyLoading && this.virtualScroollInit && changes.data) {
            this.virtualdata = changes.data.currentValue;
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.selectedItems) {
            if (this.selectedItems.length == 0 || this.data.length == 0 || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.settings.lazyLoading) {
            // this._elementRef.nativeElement.getElementsByClassName("lazyContainer")[0].addEventListener('scroll', this.onScroll.bind(this));
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewChecked() {
        if (this.selectedListElem.nativeElement.clientHeight && this.settings.position == 'top' && this.selectedListHeight) {
            this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            this.cdr.detectChanges();
        }
    }
    /**
     * @param {?} item
     * @param {?} index
     * @param {?} evt
     * @return {?}
     */
    onItemClick(item, index, evt) {
        if (this.settings.disabled) {
            return false;
        }
        /** @type {?} */
        let found = this.isSelected(item);
        /** @type {?} */
        let limit = this.selectedItems.length < this.settings.limitSelection ? true : false;
        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item);
                    this.onSelect.emit(item);
                }
            }
            else {
                this.addSelected(item);
                this.onSelect.emit(item);
            }
        }
        else {
            this.removeSelected(item);
            this.onDeSelect.emit(item);
        }
        if (this.isSelectAll || this.data.length > this.selectedItems.length) {
            this.isSelectAll = false;
        }
        if (this.data.length == this.selectedItems.length) {
            this.isSelectAll = true;
        }
        if (this.settings.groupBy) {
            this.updateGroupInfo(item);
        }
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return null;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (value !== undefined && value !== null && value !== '') {
            if (this.settings.singleSelection) {
                if (this.settings.groupBy) {
                    this.groupedData = this.transformData(this.data, this.settings.groupBy);
                    this.groupCachedItems = this.cloneArray(this.groupedData);
                    this.selectedItems = [value[0]];
                }
                else {
                    try {
                        if (value.length > 1) {
                            this.selectedItems = [value[0]];
                            throw new MyException(404, { "msg": "Single Selection Mode, Selected Items cannot have more than one item." });
                        }
                        else {
                            this.selectedItems = value;
                        }
                    }
                    catch (e) {
                        console.error(e.body.msg);
                    }
                }
            }
            else {
                if (this.settings.limitSelection) {
                    this.selectedItems = value.slice(0, this.settings.limitSelection);
                }
                else {
                    this.selectedItems = value;
                }
                if (this.selectedItems.length === this.data.length && this.data.length > 0) {
                    this.isSelectAll = true;
                }
                if (this.settings.groupBy) {
                    this.groupedData = this.transformData(this.data, this.settings.groupBy);
                    this.groupCachedItems = this.cloneArray(this.groupedData);
                }
            }
        }
        else {
            this.selectedItems = [];
        }
    }
    //From ControlValueAccessor interface
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    //From ControlValueAccessor interface
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    trackByFn(index, item) {
        return item[this.settings.primaryKey];
    }
    /**
     * @param {?} clickedItem
     * @return {?}
     */
    isSelected(clickedItem) {
        /** @type {?} */
        let found = false;
        this.selectedItems && this.selectedItems.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                found = true;
            }
        }));
        return found;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    addSelected(item) {
        if (this.settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
            this.closeDropdown();
        }
        else
            this.selectedItems.push(item);
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }
    /**
     * @param {?} clickedItem
     * @return {?}
     */
    removeSelected(clickedItem) {
        this.selectedItems && this.selectedItems.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
            }
        }));
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    toggleDropdown(evt) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            if (this.settings.searchAutofocus && this.searchInput && this.settings.enableSearchFilter && !this.searchTempl) {
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    this.searchInput.nativeElement.focus();
                }), 0);
            }
            this.onOpen.emit(true);
        }
        else {
            this.onClose.emit(false);
        }
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.calculateDropdownDirection();
        }), 0);
        if (this.settings.lazyLoading) {
            this.virtualdata = this.data;
            this.virtualScroollInit = true;
        }
        evt.preventDefault();
    }
    /**
     * @return {?}
     */
    openDropdown() {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = true;
        if (this.settings.searchAutofocus && this.searchInput && this.settings.enableSearchFilter && !this.searchTempl) {
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.searchInput.nativeElement.focus();
            }), 0);
        }
        this.onOpen.emit(true);
    }
    /**
     * @return {?}
     */
    closeDropdown() {
        if (this.searchInput && this.settings.lazyLoading) {
            this.searchInput.nativeElement.value = "";
        }
        if (this.searchInput) {
            this.searchInput.nativeElement.value = "";
        }
        this.filter = "";
        this.isActive = false;
        this.onClose.emit(false);
    }
    /**
     * @return {?}
     */
    closeDropdownOnClickOut() {
        if (this.isActive) {
            if (this.searchInput && this.settings.lazyLoading) {
                this.searchInput.nativeElement.value = "";
            }
            if (this.searchInput) {
                this.searchInput.nativeElement.value = "";
            }
            this.filter = "";
            this.isActive = false;
            this.clearSearch();
            this.onClose.emit(false);
        }
    }
    /**
     * @return {?}
     */
    toggleSelectAll() {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            if (this.settings.groupBy) {
                this.groupedData.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    obj.selected = true;
                }));
                this.groupCachedItems.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    obj.selected = true;
                }));
            }
            this.selectedItems = this.data.slice();
            this.isSelectAll = true;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);
            this.onSelectAll.emit(this.selectedItems);
        }
        else {
            if (this.settings.groupBy) {
                this.groupedData.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    obj.selected = false;
                }));
                this.groupCachedItems.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    obj.selected = false;
                }));
            }
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);
            this.onDeSelectAll.emit(this.selectedItems);
        }
    }
    /**
     * @return {?}
     */
    filterGroupedList() {
        if (this.filter == "" || this.filter == null) {
            this.clearSearch();
            return;
        }
        this.groupedData = this.cloneArray(this.groupCachedItems);
        this.groupedData = this.groupedData.filter((/**
         * @param {?} obj
         * @return {?}
         */
        obj => {
            /** @type {?} */
            let arr = [];
            if (obj[this.settings.labelKey].toLowerCase().indexOf(this.filter.toLowerCase()) > -1) {
                arr = obj.list;
            }
            else {
                arr = obj.list.filter((/**
                 * @param {?} t
                 * @return {?}
                 */
                t => {
                    return t[this.settings.labelKey].toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
                }));
            }
            obj.list = arr;
            if (obj[this.settings.labelKey].toLowerCase().indexOf(this.filter.toLowerCase()) > -1) {
                return arr;
            }
            else {
                return arr.some((/**
                 * @param {?} cat
                 * @return {?}
                 */
                cat => {
                    return cat[this.settings.labelKey].toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
                }));
            }
        }));
    }
    /**
     * @return {?}
     */
    toggleFilterSelectAll() {
        if (!this.isFilterSelectAll) {
            /** @type {?} */
            let added = [];
            if (this.settings.groupBy) {
                /*                 this.groupedData.forEach((item: any) => {
                                    if (item.list) {
                                        item.list.forEach((el: any) => {
                                            if (!this.isSelected(el)) {
                                                this.addSelected(el);
                                                added.push(el);
                                            }
                                        });
                                    }
                                    this.updateGroupInfo(item);
                
                                }); */
                this.ds.getFilteredData().forEach((/**
                 * @param {?} el
                 * @return {?}
                 */
                (el) => {
                    if (!this.isSelected(el) && !el.hasOwnProperty('grpTitle')) {
                        this.addSelected(el);
                        added.push(el);
                    }
                }));
            }
            else {
                this.ds.getFilteredData().forEach((/**
                 * @param {?} item
                 * @return {?}
                 */
                (item) => {
                    if (!this.isSelected(item)) {
                        this.addSelected(item);
                        added.push(item);
                    }
                }));
            }
            this.isFilterSelectAll = true;
            this.onFilterSelectAll.emit(added);
        }
        else {
            /** @type {?} */
            let removed = [];
            if (this.settings.groupBy) {
                /*                 this.groupedData.forEach((item: any) => {
                                    if (item.list) {
                                        item.list.forEach((el: any) => {
                                            if (this.isSelected(el)) {
                                                this.removeSelected(el);
                                                removed.push(el);
                                            }
                                        });
                                    }
                                }); */
                this.ds.getFilteredData().forEach((/**
                 * @param {?} el
                 * @return {?}
                 */
                (el) => {
                    if (this.isSelected(el)) {
                        this.removeSelected(el);
                        removed.push(el);
                    }
                }));
            }
            else {
                this.ds.getFilteredData().forEach((/**
                 * @param {?} item
                 * @return {?}
                 */
                (item) => {
                    if (this.isSelected(item)) {
                        this.removeSelected(item);
                        removed.push(item);
                    }
                }));
            }
            this.isFilterSelectAll = false;
            this.onFilterDeSelectAll.emit(removed);
        }
    }
    /**
     * @return {?}
     */
    toggleInfiniteFilterSelectAll() {
        if (!this.isInfiniteFilterSelectAll) {
            this.virtualdata.forEach((/**
             * @param {?} item
             * @return {?}
             */
            (item) => {
                if (!this.isSelected(item)) {
                    this.addSelected(item);
                }
            }));
            this.isInfiniteFilterSelectAll = true;
        }
        else {
            this.virtualdata.forEach((/**
             * @param {?} item
             * @return {?}
             */
            (item) => {
                if (this.isSelected(item)) {
                    this.removeSelected(item);
                }
            }));
            this.isInfiniteFilterSelectAll = false;
        }
    }
    /**
     * @return {?}
     */
    clearSearch() {
        if (this.settings.groupBy) {
            this.groupedData = [];
            this.groupedData = this.cloneArray(this.groupCachedItems);
        }
        this.filter = "";
        this.isFilterSelectAll = false;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    onFilterChange(data) {
        if (this.filter && this.filter == "" || data.length == 0) {
            this.isFilterSelectAll = false;
        }
        /** @type {?} */
        let cnt = 0;
        data.forEach((/**
         * @param {?} item
         * @return {?}
         */
        (item) => {
            if (!item.hasOwnProperty('grpTitle') && this.isSelected(item)) {
                cnt++;
            }
        }));
        if (cnt > 0 && this.filterLength == cnt) {
            this.isFilterSelectAll = true;
        }
        else if (cnt > 0 && this.filterLength != cnt) {
            this.isFilterSelectAll = false;
        }
        this.cdr.detectChanges();
    }
    /**
     * @param {?} arr
     * @return {?}
     */
    cloneArray(arr) {
        /** @type {?} */
        let i;
        /** @type {?} */
        let copy;
        if (Array.isArray(arr)) {
            return JSON.parse(JSON.stringify(arr));
        }
        else if (typeof arr === 'object') {
            throw 'Cannot clone array containing an object!';
        }
        else {
            return arr;
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    updateGroupInfo(item) {
        /** @type {?} */
        let key = this.settings.groupBy;
        this.groupedData.forEach((/**
         * @param {?} obj
         * @return {?}
         */
        (obj) => {
            /** @type {?} */
            let cnt = 0;
            if (obj.grpTitle && (item[key] == obj[key])) {
                if (obj.list) {
                    obj.list.forEach((/**
                     * @param {?} el
                     * @return {?}
                     */
                    (el) => {
                        if (this.isSelected(el)) {
                            cnt++;
                        }
                    }));
                }
            }
            if (obj.list && (cnt === obj.list.length) && (item[key] == obj[key])) {
                obj.selected = true;
            }
            else if (obj.list && (cnt != obj.list.length) && (item[key] == obj[key])) {
                obj.selected = false;
            }
        }));
        this.groupCachedItems.forEach((/**
         * @param {?} obj
         * @return {?}
         */
        (obj) => {
            /** @type {?} */
            let cnt = 0;
            if (obj.grpTitle && (item[key] == obj[key])) {
                if (obj.list) {
                    obj.list.forEach((/**
                     * @param {?} el
                     * @return {?}
                     */
                    (el) => {
                        if (this.isSelected(el)) {
                            cnt++;
                        }
                    }));
                }
            }
            if (obj.list && (cnt === obj.list.length) && (item[key] == obj[key])) {
                obj.selected = true;
            }
            else if (obj.list && (cnt != obj.list.length) && (item[key] == obj[key])) {
                obj.selected = false;
            }
        }));
    }
    /**
     * @param {?} arr
     * @param {?} field
     * @return {?}
     */
    transformData(arr, field) {
        /** @type {?} */
        const groupedObj = arr.reduce((/**
         * @param {?} prev
         * @param {?} cur
         * @return {?}
         */
        (prev, cur) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            }
            else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }), {});
        /** @type {?} */
        const tempArr = [];
        Object.keys(groupedObj).map((/**
         * @param {?} x
         * @return {?}
         */
        (x) => {
            /** @type {?} */
            let obj = {};
            obj["grpTitle"] = true;
            obj[this.settings.labelKey] = x;
            obj[this.settings.groupBy] = x;
            obj['selected'] = false;
            obj['list'] = [];
            /** @type {?} */
            let cnt = 0;
            groupedObj[x].forEach((/**
             * @param {?} item
             * @return {?}
             */
            (item) => {
                item['list'] = [];
                obj.list.push(item);
                if (this.isSelected(item)) {
                    cnt++;
                }
            }));
            if (cnt == obj.list.length) {
                obj.selected = true;
            }
            else {
                obj.selected = false;
            }
            tempArr.push(obj);
            // obj.list.forEach((item: any) => {
            //     tempArr.push(item);
            // });
        }));
        return tempArr;
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    filterInfiniteList(evt) {
        /** @type {?} */
        let filteredElems = [];
        if (this.settings.groupBy) {
            this.groupedData = this.groupCachedItems.slice();
        }
        else {
            this.data = this.cachedItems.slice();
            this.virtualdata = this.cachedItems.slice();
        }
        if ((evt != null || evt != '') && !this.settings.groupBy) {
            if (this.settings.searchBy.length > 0) {
                for (let t = 0; t < this.settings.searchBy.length; t++) {
                    this.virtualdata.filter((/**
                     * @param {?} el
                     * @return {?}
                     */
                    (el) => {
                        if (el[this.settings.searchBy[t].toString()].toString().toLowerCase().indexOf(evt.toString().toLowerCase()) >= 0) {
                            filteredElems.push(el);
                        }
                    }));
                }
            }
            else {
                this.virtualdata.filter((/**
                 * @param {?} el
                 * @return {?}
                 */
                function (el) {
                    for (let prop in el) {
                        if (el[prop].toString().toLowerCase().indexOf(evt.toString().toLowerCase()) >= 0) {
                            filteredElems.push(el);
                            break;
                        }
                    }
                }));
            }
            this.virtualdata = [];
            this.virtualdata = filteredElems;
            this.infiniteFilterLength = this.virtualdata.length;
        }
        if (evt.toString() != '' && this.settings.groupBy) {
            this.groupedData.filter((/**
             * @param {?} el
             * @return {?}
             */
            function (el) {
                if (el.hasOwnProperty('grpTitle')) {
                    filteredElems.push(el);
                }
                else {
                    for (let prop in el) {
                        if (el[prop].toString().toLowerCase().indexOf(evt.toString().toLowerCase()) >= 0) {
                            filteredElems.push(el);
                            break;
                        }
                    }
                }
            }));
            this.groupedData = [];
            this.groupedData = filteredElems;
            this.infiniteFilterLength = this.groupedData.length;
        }
        else if (evt.toString() == '' && this.cachedItems.length > 0) {
            this.virtualdata = [];
            this.virtualdata = this.cachedItems;
            this.infiniteFilterLength = 0;
        }
        this.virtualScroller.refresh();
    }
    /**
     * @return {?}
     */
    resetInfiniteSearch() {
        this.filter = "";
        this.isInfiniteFilterSelectAll = false;
        this.virtualdata = [];
        this.virtualdata = this.cachedItems;
        this.groupedData = this.groupCachedItems;
        this.infiniteFilterLength = 0;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onScrollEnd(e) {
        if (e.endIndex === this.data.length - 1 || e.startIndex === 0) {
        }
        this.onScrollToEnd.emit(e);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    selectGroup(item) {
        if (item.selected) {
            item.selected = false;
            item.list.forEach((/**
             * @param {?} obj
             * @return {?}
             */
            (obj) => {
                this.removeSelected(obj);
            }));
            this.updateGroupInfo(item);
            this.onGroupSelect.emit(item);
        }
        else {
            item.selected = true;
            item.list.forEach((/**
             * @param {?} obj
             * @return {?}
             */
            (obj) => {
                if (!this.isSelected(obj)) {
                    this.addSelected(obj);
                }
            }));
            this.updateGroupInfo(item);
            this.onGroupDeSelect.emit(item);
        }
    }
    /**
     * @return {?}
     */
    addFilterNewItem() {
        this.onAddFilterNewItem.emit(this.filter);
        this.filterPipe = new ListFilterPipe(this.ds);
        this.filterPipe.transform(this.data, this.filter, this.settings.searchBy);
    }
    /**
     * @return {?}
     */
    calculateDropdownDirection() {
        /** @type {?} */
        let shouldOpenTowardsTop = this.settings.position == 'top';
        if (this.settings.autoPosition) {
            /** @type {?} */
            const dropdownHeight = this.dropdownListElem.nativeElement.clientHeight;
            /** @type {?} */
            const viewportHeight = document.documentElement.clientHeight;
            /** @type {?} */
            const selectedListBounds = this.selectedListElem.nativeElement.getBoundingClientRect();
            /** @type {?} */
            const spaceOnTop = selectedListBounds.top;
            /** @type {?} */
            const spaceOnBottom = viewportHeight - selectedListBounds.top;
            if (spaceOnBottom < spaceOnTop && dropdownHeight < spaceOnTop) {
                this.openTowardsTop(true);
            }
            else {
                this.openTowardsTop(false);
            }
            // Keep preference if there is not enough space on either the top or bottom
            /* 			if (spaceOnTop || spaceOnBottom) {
                            if (shouldOpenTowardsTop) {
                                shouldOpenTowardsTop = spaceOnTop;
                            } else {
                                shouldOpenTowardsTop = !spaceOnBottom;
                            }
                        } */
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    openTowardsTop(value) {
        if (value && this.selectedListElem.nativeElement.clientHeight) {
            this.dropdownListYOffset = 15 + this.selectedListElem.nativeElement.clientHeight;
        }
        else {
            this.dropdownListYOffset = 0;
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    clearSelection(e) {
        if (this.settings.groupBy) {
            this.groupCachedItems.forEach((/**
             * @param {?} obj
             * @return {?}
             */
            (obj) => {
                obj.selected = false;
            }));
        }
        this.clearSearch();
        this.selectedItems = [];
        this.onDeSelectAll.emit(this.selectedItems);
    }
}
AngularMultiSelect.decorators = [
    { type: Component, args: [{
                selector: 'angular2-multiselect',
                template: "<div class=\"cuppa-dropdown\" (clickOutside)=\"closeDropdownOnClickOut()\">\n    <div class=\"selected-list\" #selectedList>\n        <div class=\"c-btn\" (click)=\"toggleDropdown($event)\" [ngClass]=\"{'disabled': settings.disabled}\" [attr.tabindex]=\"0\">\n\n            <span *ngIf=\"selectedItems?.length == 0\">{{settings.text}}</span>\n            <span *ngIf=\"settings.singleSelection && !badgeTempl\">\n                <span *ngFor=\"let item of selectedItems;trackBy: trackByFn.bind(this);\">\n                    {{item[settings.labelKey]}}\n                </span>\n            </span>\n            <span class=\"c-list\" *ngIf=\"selectedItems?.length > 0 && settings.singleSelection && badgeTempl \">\n                <div class=\"c-token\" *ngFor=\"let item of selectedItems;trackBy: trackByFn.bind(this);let k = index\">\n                <span *ngIf=\"!badgeTempl\" class=\"c-label\">{{item[settings.labelKey]}}</span>\n\n            <span *ngIf=\"badgeTempl\" class=\"c-label\">\n                            <c-templateRenderer [data]=\"badgeTempl\" [item]=\"item\"></c-templateRenderer>\n                        </span>\n            <span class=\"c-remove\" (click)=\"onItemClick(item,k,$event);$event.stopPropagation()\">\n                <c-icon [name]=\"'remove'\"></c-icon>\n            </span>\n        </div>\n        </span>\n        <div class=\"c-list\" *ngIf=\"selectedItems?.length > 0 && !settings.singleSelection\">\n            <div class=\"c-token\" *ngFor=\"let item of selectedItems;trackBy: trackByFn.bind(this);let k = index\" [hidden]=\"k > settings.badgeShowLimit-1\">\n                <span *ngIf=\"!badgeTempl\" class=\"c-label\">{{item[settings.labelKey]}}</span>\n                <span *ngIf=\"badgeTempl\" class=\"c-label\">\n                    <c-templateRenderer [data]=\"badgeTempl\" [item]=\"item\"></c-templateRenderer>\n                </span>\n                <span class=\"c-remove\" (click)=\"onItemClick(item,k,$event);$event.stopPropagation()\">\n                    <c-icon [name]=\"'remove'\"></c-icon>\n                </span>\n            </div>\n        </div>\n        <span class=\"countplaceholder\" *ngIf=\"selectedItems?.length > settings.badgeShowLimit\">+{{selectedItems?.length - settings.badgeShowLimit }}</span>\n        <span class=\"c-remove clear-all\" *ngIf=\"settings.clearAll && selectedItems?.length > 0 && !settings.disabled\" (click)=\"clearSelection($event);$event.stopPropagation()\">\n            <c-icon [name]=\"'remove'\"></c-icon>\n        </span>\n        <span *ngIf=\"!isActive\" class=\"c-angle-down\">\n    <c-icon [name]=\"'angle-down'\"></c-icon>\n            </span>\n        <span *ngIf=\"isActive\" class=\"c-angle-up\">\n            <c-icon [name]=\"'angle-up'\"></c-icon>\n\n            </span>\n    </div>\n</div>\n<div #dropdownList class=\"dropdown-list animated fadeIn\"\n[ngClass]=\"{'dropdown-list-top': dropdownListYOffset}\"\n[style.bottom.px]=\"dropdownListYOffset ? dropdownListYOffset : null\"\n[hidden]=\"!isActive\">\n    <div [ngClass]=\"{'arrow-up': !dropdownListYOffset, 'arrow-down': dropdownListYOffset}\" class=\"arrow-2\"></div>\n    <div [ngClass]=\"{'arrow-up': !dropdownListYOffset, 'arrow-down': dropdownListYOffset}\"></div>\n<div class=\"list-area\" [ngClass]=\"{'single-select-mode': settings.singleSelection }\">\n        <div class=\"pure-checkbox select-all\" *ngIf=\"settings.enableCheckAll && !settings.singleSelection && !settings.limitSelection && data?.length > 0\"\n            (click)=\"toggleSelectAll()\">\n            <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelectAll\" [disabled]=\"settings.limitSelection == selectedItems?.length\"\n            />\n            <label>\n                <span [hidden]=\"isSelectAll\">{{settings.selectAllText}}</span>\n                <span [hidden]=\"!isSelectAll\">{{settings.unSelectAllText}}</span>\n            </label>\n        </div>\n        <img class=\"loading-icon\" *ngIf=\"loading\" src=\"assets/img/loading.gif\"/>\n        <div class=\"list-filter\" *ngIf=\"settings.enableSearchFilter\">\n            <span class=\"c-search\">\n                <c-icon [name]=\"'search'\"></c-icon>\n                </span>\n            <span *ngIf=\"!settings.lazyLoading\" [hidden]=\"filter == undefined || filter?.length == 0\" class=\"c-clear\" (click)=\"clearSearch()\">\n                <c-icon [name]=\"'clear'\"></c-icon>\n                </span>\n            <span *ngIf=\"settings.lazyLoading\" [hidden]=\"filter == undefined || filter?.length == 0\" class=\"c-clear\" (click)=\"resetInfiniteSearch()\">\n                <c-icon [name]=\"'clear'\"></c-icon>\n                </span>\n\n            <input class=\"c-input\" *ngIf=\"settings.groupBy && !settings.lazyLoading && !searchTempl\" #searchInput type=\"text\" [placeholder]=\"settings.searchPlaceholderText\"\n                [(ngModel)]=\"filter\" (keyup)=\"filterGroupedList()\">\n                <input class=\"c-input\" *ngIf=\"!settings.groupBy && !settings.lazyLoading && !searchTempl\" #searchInput type=\"text\" [placeholder]=\"settings.searchPlaceholderText\"\n                [(ngModel)]=\"filter\" >\n            <input class=\"c-input\" *ngIf=\"settings.lazyLoading && !searchTempl\" #searchInput type=\"text\" [placeholder]=\"settings.searchPlaceholderText\"\n                [(ngModel)]=\"filter\" (keyup)=\"searchTerm$.next($event.target.value)\">\n            <!--            <input class=\"c-input\" *ngIf=\"!settings.lazyLoading && !searchTempl && settings.groupBy\" #searchInput type=\"text\" [placeholder]=\"settings.searchPlaceholderText\"\n                [(ngModel)]=\"filter\" (keyup)=\"filterGroupList($event)\">-->\n            <c-templateRenderer *ngIf=\"searchTempl\" [data]=\"searchTempl\" [item]=\"item\"></c-templateRenderer>\n        </div>\n        <div class=\"filter-select-all\" *ngIf=\"!settings.lazyLoading && settings.enableFilterSelectAll\">\n            <div class=\"pure-checkbox select-all\" *ngIf=\"!settings.groupBy && filter?.length > 0 && filterLength > 0\" (click)=\"toggleFilterSelectAll()\">\n                <input type=\"checkbox\" [checked]=\"isFilterSelectAll\" [disabled]=\"settings.limitSelection == selectedItems?.length\" />\n                <label>\n                <span [hidden]=\"isFilterSelectAll\">{{settings.filterSelectAllText}}</span>\n                <span [hidden]=\"!isFilterSelectAll\">{{settings.filterUnSelectAllText}}</span>\n            </label>\n            </div>\n            <div class=\"pure-checkbox select-all\" *ngIf=\"settings.groupBy && filter?.length > 0 && groupedData?.length > 0\" (click)=\"toggleFilterSelectAll()\">\n                    <input type=\"checkbox\" [checked]=\"isFilterSelectAll && filter?.length > 0\" [disabled]=\"settings.limitSelection == selectedItems?.length\" />\n                    <label>\n                    <span [hidden]=\"isFilterSelectAll\">{{settings.filterSelectAllText}}</span>\n                    <span [hidden]=\"!isFilterSelectAll\">{{settings.filterUnSelectAllText}}</span>\n                </label>\n                </div>\n            <label class=\"nodata-label\" *ngIf=\"!settings.groupBy && filterLength == 0\" [hidden]=\"filter == undefined || filter?.length == 0\">{{settings.noDataLabel}}</label>\n            <label class=\"nodata-label\" *ngIf=\"settings.groupBy && groupedData?.length == 0\" [hidden]=\"filter == undefined || filter?.length == 0\">{{settings.noDataLabel}}</label>\n\n            <div class=\"btn-container\" *ngIf=\"settings.addNewItemOnFilter && filterLength == 0\" [hidden]=\"filter == undefined || filter?.length == 0\">\n            <button class=\"c-btn btn-iceblue\" (click)=\"addFilterNewItem()\">{{settings.addNewButtonText}}</button>\n            </div>\n        </div>\n        <div class=\"filter-select-all\" *ngIf=\"settings.lazyLoading && settings.enableFilterSelectAll\">\n            <div class=\"pure-checkbox select-all\" *ngIf=\"filter?.length > 0 && infiniteFilterLength > 0\" (click)=\"toggleInfiniteFilterSelectAll()\">\n                <input type=\"checkbox\" [checked]=\"isInfiniteFilterSelectAll\" [disabled]=\"settings.limitSelection == selectedItems?.length\"\n                />\n                <label>\n                <span [hidden]=\"isInfiniteFilterSelectAll\">{{settings.filterSelectAllText}}</span>\n                <span [hidden]=\"!isInfiniteFilterSelectAll\">{{settings.filterUnSelectAllText}}</span>\n            </label>\n            </div>\n        </div>\n\n        <div *ngIf=\"!settings.groupBy && !settings.lazyLoading && itemTempl == undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\" style=\"overflow: auto;\">\n            <ul class=\"lazyContainer\">\n                <li *ngFor=\"let item of data | listFilter:filter : settings.searchBy; let i = index;\" (click)=\"onItemClick(item,i,$event)\"\n                    class=\"pure-checkbox\" [ngClass]=\"{'selected-item': isSelected(item) == true }\">\n                    <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label>{{item[settings.labelKey]}}</label>\n                </li>\n            </ul>\n        </div>\n        <div *ngIf=\"!settings.groupBy && settings.lazyLoading && itemTempl == undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\" style=\"overflow: auto;\">\n                <ul virtualScroller #scroll [enableUnequalChildrenSizes]=\"randomSize\" [items]=\"virtualdata\" (vsStart)=\"onScrollEnd($event)\"\n                (vsEnd)=\"onScrollEnd($event)\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\" class=\"lazyContainer\">\n                    <li *ngFor=\"let item of scroll.viewPortItems; let i = index;\" (click)=\"onItemClick(item,i,$event)\"\n                        class=\"pure-checkbox\" [ngClass]=\"{'selected-item': isSelected(item) == true }\">\n                        <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                        />\n                        <label>{{item[settings.labelKey]}}</label>\n                    </li>\n                </ul>\n        </div>\n        <div *ngIf=\"!settings.groupBy && !settings.lazyLoading && itemTempl != undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\" style=\"overflow: auto;\">\n            <ul class=\"lazyContainer\">\n                <li *ngFor=\"let item of data | listFilter:filter : settings.searchBy; let i = index;\" (click)=\"onItemClick(item,i,$event)\"\n                    class=\"pure-checkbox\" [ngClass]=\"{'selected-item': isSelected(item) == true }\">\n                    <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label></label>\n                    <c-templateRenderer [data]=\"itemTempl\" [item]=\"item\"></c-templateRenderer>\n                </li>\n            </ul>\n        </div>\n        <div *ngIf=\"!settings.groupBy && settings.lazyLoading && itemTempl != undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\" style=\"overflow: auto;\">\n                <ul virtualScroller #scroll2 [enableUnequalChildrenSizes]=\"randomSize\" [items]=\"virtualdata\" (vsStart)=\"onScrollEnd($event)\"\n                (vsEnd)=\"onScrollEnd($event)\" class=\"lazyContainer\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\">\n                    <li *ngFor=\"let item of scroll2.viewPortItems; let i = index;\" (click)=\"onItemClick(item,i,$event)\"\n                        class=\"pure-checkbox\" [ngClass]=\"{'selected-item': isSelected(item) == true }\">\n                        <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                        />\n                        <label></label>\n                        <c-templateRenderer [data]=\"itemTempl\" [item]=\"item\"></c-templateRenderer>\n                    </li>\n                </ul>\n        </div>\n        <div *ngIf=\"settings.groupBy && settings.lazyLoading && itemTempl != undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\" style=\"overflow: auto;\">\n            <ul virtualScroller #scroll3 [enableUnequalChildrenSizes]=\"randomSize\" [items]=\"virtualdata\" (vsStart)=\"onScrollEnd($event)\"\n            (vsEnd)=\"onScrollEnd($event)\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\" class=\"lazyContainer\">\n                <span *ngFor=\"let item of scroll3.viewPortItems; let i = index;\">\n                <li (click)=\"onItemClick(item,i,$event)\" *ngIf=\"!item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection}\" class=\"pure-checkbox\">\n                    <input *ngIf=\"settings.showCheckbox && !settings.singleSelection\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label></label>\n                    <c-templateRenderer [data]=\"itemTempl\" [item]=\"item\"></c-templateRenderer>\n                </li>\n                <li *ngIf=\"item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection}\" class=\"pure-checkbox\">\n                    <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label></label>\n                    <c-templateRenderer [data]=\"itemTempl\" [item]=\"item\"></c-templateRenderer>\n                </li>\n                </span>\n            </ul>\n        </div>\n        <div *ngIf=\"settings.groupBy && !settings.lazyLoading && itemTempl != undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\" style=\"overflow: auto;\">\n            <ul class=\"lazyContainer\">\n                <span *ngFor=\"let item of groupedData; let i = index;\">\n                    <li (click)=\"selectGroup(item)\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection}\" class=\"pure-checkbox\">\n                    <input *ngIf=\"settings.showCheckbox && !settings.singleSelection\" type=\"checkbox\" [checked]=\"item.selected\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label>{{item[settings.labelKey]}}</label>\n                    <ul class=\"lazyContainer\">\n                        <span *ngFor=\"let val of item.list ; let j = index;\">\n                        <li (click)=\"onItemClick(val,j,$event); $event.stopPropagation()\" [ngClass]=\"{'grp-title': val.grpTitle,'grp-item': !val.grpTitle && !settings.singleSelection}\" class=\"pure-checkbox\">\n                                <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(val)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(val)\"\n                                />\n                                <label></label>\n                                <c-templateRenderer [data]=\"itemTempl\" [item]=\"val\"></c-templateRenderer>\n                            </li>\n                            </span>\n                </ul>\n                    \n                </li>\n                </span>\n            </ul>\n        </div>\n        <div *ngIf=\"settings.groupBy && settings.lazyLoading && itemTempl == undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\" style=\"overflow: auto;\">\n            <virtual-scroller [items]=\"groupedData\" (vsUpdate)=\"viewPortItems = $event\" (vsEnd)=\"onScrollEnd($event)\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\">\n                <ul virtualScroller #scroll4 [enableUnequalChildrenSizes]=\"randomSize\" [items]=\"virtualdata\" (vsStart)=\"onScrollEnd($event)\"\n                (vsEnd)=\"onScrollEnd($event)\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\" class=\"lazyContainer\">\n                    <span *ngFor=\"let item of scroll4.viewPortItems; let i = index;\">\n                <li  *ngIf=\"item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection, 'selected-item': isSelected(item) == true }\" class=\"pure-checkbox\">\n                    <input *ngIf=\"settings.showCheckbox && !item.grpTitle && !settings.singleSelection\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label>{{item[settings.labelKey]}}</label>\n                </li>\n                <li (click)=\"onItemClick(item,i,$event)\" *ngIf=\"!item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection, 'selected-item': isSelected(item) == true }\" class=\"pure-checkbox\">\n                    <input *ngIf=\"settings.showCheckbox && !item.grpTitle\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label>{{item[settings.labelKey]}}</label>\n                </li>\n                </span>\n                </ul>\n            </virtual-scroller>\n        </div>\n        <div *ngIf=\"settings.groupBy && !settings.lazyLoading && itemTempl == undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\" style=\"overflow: auto;\">\n            <ul class=\"lazyContainer\">\n                    <span *ngFor=\"let item of groupedData ; let i = index;\">\n                            <li (click)=\"selectGroup(item)\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection}\" class=\"pure-checkbox\">\n                                    <input  *ngIf=\"settings.showCheckbox && !settings.singleSelection\" type=\"checkbox\" [checked]=\"item.selected\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                                    />\n                                    <label>{{item[settings.labelKey]}}</label>\n                                    <ul class=\"lazyContainer\">\n                                            <span *ngFor=\"let val of item.list ; let j = index;\">\n                                            <li (click)=\"onItemClick(val,j,$event); $event.stopPropagation()\" [ngClass]=\"{'selected-item': isSelected(val) == true,'grp-title': val.grpTitle,'grp-item': !val.grpTitle && !settings.singleSelection}\" class=\"pure-checkbox\">\n                                                    <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(val)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(val)\"\n                                                    />\n                                                    <label>{{val[settings.labelKey]}}</label>\n                                                </li>\n                                                </span>\n                                    </ul>\n                                </li>\n                    </span>\n                <!-- <span *ngFor=\"let item of groupedData ; let i = index;\">\n                    <li (click)=\"onItemClick(item,i,$event)\" *ngIf=\"!item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle}\" class=\"pure-checkbox\">\n                    <input *ngIf=\"settings.showCheckbox && !item.grpTitle\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label>{{item[settings.labelKey]}}</label>\n                </li>\n                <li *ngIf=\"item.grpTitle && !settings.selectGroup\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle}\" class=\"pure-checkbox\">\n                    <input *ngIf=\"settings.showCheckbox && settings.selectGroup\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label>{{item[settings.labelKey]}}</label>\n                </li>\n                 <li  (click)=\"selectGroup(item)\" *ngIf=\"item.grpTitle && settings.selectGroup\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle}\" class=\"pure-checkbox\">\n                    <input *ngIf=\"settings.showCheckbox && settings.selectGroup\" type=\"checkbox\" [checked]=\"item.selected\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\n                    />\n                    <label>{{item[settings.labelKey]}}</label>\n                </li>\n                </span> -->\n            </ul>\n        </div>\n        <h5 class=\"list-message\" *ngIf=\"data?.length == 0\">{{settings.noDataLabel}}</h5>\n    </div>\n</div>\n</div>",
                host: { '[class]': 'defaultSettings.classes' },
                providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR, DROPDOWN_CONTROL_VALIDATION],
                encapsulation: ViewEncapsulation.None,
                styles: ["virtual-scroll{display:block;width:100%}.cuppa-dropdown{position:relative}.c-btn{display:inline-block;border-width:1px;line-height:1.25;border-radius:3px;font-size:.85rem;padding:5px 10px;cursor:pointer;align-items:center;min-height:38px}.c-btn.disabled{background:#ccc}.selected-list .c-list{float:left;padding:0;margin:0;width:calc(100% - 20px)}.selected-list .c-list .c-token{list-style:none;padding:4px 22px 4px 8px;border-radius:2px;margin-right:4px;margin-top:2px;float:left;position:relative}.selected-list .c-list .c-token .c-label{display:block;float:left}.selected-list .c-list .c-token .c-remove{position:absolute;right:8px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);width:8px}.selected-list .c-list .c-token .c-remove svg{fill:#fff}.selected-list .fa-angle-down,.selected-list .fa-angle-up{font-size:15pt;position:absolute;right:10px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.selected-list .c-angle-down,.selected-list .c-angle-up{width:12px;height:12px;position:absolute;right:10px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);pointer-events:none}.selected-list .c-angle-down svg,.selected-list .c-angle-up svg{fill:#333}.selected-list .countplaceholder{position:absolute;right:45px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.selected-list .c-btn{width:100%;padding:5px 10px;cursor:pointer;display:flex;position:relative}.selected-list .c-btn .c-icon{position:absolute;right:5px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.dropdown-list{position:absolute;padding-top:14px;width:100%;z-index:99999}.dropdown-list ul{padding:0;list-style:none;overflow:auto;margin:0}.dropdown-list ul li{padding:10px;cursor:pointer;text-align:left}.dropdown-list ul li:first-child{padding-top:10px}.dropdown-list ul li:last-child{padding-bottom:10px}.dropdown-list ::-webkit-scrollbar{width:8px}.dropdown-list ::-webkit-scrollbar-thumb{background:#ccc;border-radius:5px}.dropdown-list ::-webkit-scrollbar-track{background:#f2f2f2}.arrow-down,.arrow-up{width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-bottom:15px solid #fff;margin-left:15px;position:absolute;top:0}.arrow-down{bottom:-14px;top:unset;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.arrow-2{border-bottom:15px solid #ccc;top:-1px}.arrow-down.arrow-2{top:unset;bottom:-16px}.list-area{border:1px solid #ccc;border-radius:3px;background:#fff;margin:0}.select-all{padding:10px;border-bottom:1px solid #ccc;text-align:left}.list-filter{border-bottom:1px solid #ccc;position:relative;padding-left:35px;height:35px}.list-filter input{border:0;width:100%;height:100%;padding:0}.list-filter input:focus{outline:0}.list-filter .c-search{position:absolute;top:9px;left:10px;width:15px;height:15px}.list-filter .c-search svg{fill:#888}.list-filter .c-clear{position:absolute;top:10px;right:10px;width:15px;height:15px}.list-filter .c-clear svg{fill:#888}.pure-checkbox input[type=checkbox]{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.pure-checkbox input[type=checkbox]:focus+label:before,.pure-checkbox input[type=checkbox]:hover+label:before{background-color:#f2f2f2}.pure-checkbox input[type=checkbox]:active+label:before{transition-duration:0s}.pure-checkbox input[type=checkbox]+label{position:relative;padding-left:2em;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;margin:0;font-weight:300}.pure-checkbox input[type=checkbox]+label:before{box-sizing:content-box;content:'';position:absolute;top:50%;left:0;width:15px;height:15px;margin-top:-9px;text-align:center;transition:.4s;border-radius:3px}.pure-checkbox input[type=checkbox]+label:after{box-sizing:content-box;content:'';position:absolute;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:50%;transform-origin:50%;transition:transform .2s ease-out,-webkit-transform .2s ease-out;background-color:transparent;top:50%;left:3px;width:9px;height:4px;margin-top:-5px;border-style:solid;border-width:0 0 2px 2px;-o-border-image:none;border-image:none;-webkit-transform:rotate(-45deg) scale(0);transform:rotate(-45deg) scale(0)}.pure-checkbox input[type=checkbox]:disabled+label:before{border-color:#ccc}.pure-checkbox input[type=checkbox]:disabled:focus+label:before .pure-checkbox input[type=checkbox]:disabled:hover+label:before{background-color:inherit}.pure-checkbox input[type=checkbox]:disabled:checked+label:before{background-color:#ccc}.pure-checkbox input[type=radio]:checked+label:before{background-color:#fff}.pure-checkbox input[type=radio]:checked+label:after{-webkit-transform:scale(1);transform:scale(1)}.pure-checkbox input[type=radio]+label:before{border-radius:50%}.pure-checkbox input[type=checkbox]:checked+label:after{content:'';transition:transform .2s ease-out,-webkit-transform .2s ease-out;-webkit-transform:rotate(-45deg) scale(1);transform:rotate(-45deg) scale(1)}.list-message{text-align:center;margin:0;padding:15px 0;font-size:initial}.list-grp{padding:0 15px!important}.list-grp h4{text-transform:capitalize;margin:15px 0 0;font-size:14px;font-weight:700}.list-grp>li{padding-left:15px!important}.grp-item{padding-left:30px!important}.grp-title{padding-bottom:0!important}.grp-title label{margin-bottom:0!important;font-weight:800;text-transform:capitalize}.grp-title:hover{background:0 0!important}.loading-icon{width:20px;position:absolute;right:10px;top:23px;z-index:1}.nodata-label{width:100%;text-align:center;padding:10px 0 0}.btn-container{text-align:center;padding:0 5px 10px}.clear-all{width:8px;position:absolute;top:50%;right:30px;-webkit-transform:translateY(-50%);transform:translateY(-50%)}"]
            }] }
];
/** @nocollapse */
AngularMultiSelect.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: DataService }
];
AngularMultiSelect.propDecorators = {
    data: [{ type: Input }],
    settings: [{ type: Input }],
    loading: [{ type: Input }],
    onSelect: [{ type: Output, args: ['onSelect',] }],
    onDeSelect: [{ type: Output, args: ['onDeSelect',] }],
    onSelectAll: [{ type: Output, args: ['onSelectAll',] }],
    onDeSelectAll: [{ type: Output, args: ['onDeSelectAll',] }],
    onOpen: [{ type: Output, args: ['onOpen',] }],
    onClose: [{ type: Output, args: ['onClose',] }],
    onScrollToEnd: [{ type: Output, args: ['onScrollToEnd',] }],
    onFilterSelectAll: [{ type: Output, args: ['onFilterSelectAll',] }],
    onFilterDeSelectAll: [{ type: Output, args: ['onFilterDeSelectAll',] }],
    onAddFilterNewItem: [{ type: Output, args: ['onAddFilterNewItem',] }],
    onGroupSelect: [{ type: Output, args: ['onGroupSelect',] }],
    onGroupDeSelect: [{ type: Output, args: ['onGroupDeSelect',] }],
    itemTempl: [{ type: ContentChild, args: [Item, { static: false },] }],
    badgeTempl: [{ type: ContentChild, args: [Badge, { static: false },] }],
    searchTempl: [{ type: ContentChild, args: [Search, { static: false },] }],
    searchInput: [{ type: ViewChild, args: ['searchInput', { static: false },] }],
    selectedListElem: [{ type: ViewChild, args: ['selectedList', { static: false },] }],
    dropdownListElem: [{ type: ViewChild, args: ['dropdownList', { static: false },] }],
    onEscapeDown: [{ type: HostListener, args: ['document:keyup.escape', ['$event'],] }],
    virtualScroller: [{ type: ViewChild, args: [VirtualScrollerComponent, { static: false },] }]
};
if (false) {
    /** @type {?} */
    AngularMultiSelect.prototype.data;
    /** @type {?} */
    AngularMultiSelect.prototype.settings;
    /** @type {?} */
    AngularMultiSelect.prototype.loading;
    /** @type {?} */
    AngularMultiSelect.prototype.onSelect;
    /** @type {?} */
    AngularMultiSelect.prototype.onDeSelect;
    /** @type {?} */
    AngularMultiSelect.prototype.onSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.onDeSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.onOpen;
    /** @type {?} */
    AngularMultiSelect.prototype.onClose;
    /** @type {?} */
    AngularMultiSelect.prototype.onScrollToEnd;
    /** @type {?} */
    AngularMultiSelect.prototype.onFilterSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.onFilterDeSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.onAddFilterNewItem;
    /** @type {?} */
    AngularMultiSelect.prototype.onGroupSelect;
    /** @type {?} */
    AngularMultiSelect.prototype.onGroupDeSelect;
    /** @type {?} */
    AngularMultiSelect.prototype.itemTempl;
    /** @type {?} */
    AngularMultiSelect.prototype.badgeTempl;
    /** @type {?} */
    AngularMultiSelect.prototype.searchTempl;
    /** @type {?} */
    AngularMultiSelect.prototype.searchInput;
    /** @type {?} */
    AngularMultiSelect.prototype.selectedListElem;
    /** @type {?} */
    AngularMultiSelect.prototype.dropdownListElem;
    /** @type {?} */
    AngularMultiSelect.prototype.virtualdata;
    /** @type {?} */
    AngularMultiSelect.prototype.searchTerm$;
    /** @type {?} */
    AngularMultiSelect.prototype.filterPipe;
    /** @type {?} */
    AngularMultiSelect.prototype.selectedItems;
    /** @type {?} */
    AngularMultiSelect.prototype.isActive;
    /** @type {?} */
    AngularMultiSelect.prototype.isSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.isFilterSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.isInfiniteFilterSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.groupedData;
    /** @type {?} */
    AngularMultiSelect.prototype.filter;
    /** @type {?} */
    AngularMultiSelect.prototype.chunkArray;
    /** @type {?} */
    AngularMultiSelect.prototype.scrollTop;
    /** @type {?} */
    AngularMultiSelect.prototype.chunkIndex;
    /** @type {?} */
    AngularMultiSelect.prototype.cachedItems;
    /** @type {?} */
    AngularMultiSelect.prototype.groupCachedItems;
    /** @type {?} */
    AngularMultiSelect.prototype.totalRows;
    /** @type {?} */
    AngularMultiSelect.prototype.itemHeight;
    /** @type {?} */
    AngularMultiSelect.prototype.screenItemsLen;
    /** @type {?} */
    AngularMultiSelect.prototype.cachedItemsLen;
    /** @type {?} */
    AngularMultiSelect.prototype.totalHeight;
    /** @type {?} */
    AngularMultiSelect.prototype.scroller;
    /** @type {?} */
    AngularMultiSelect.prototype.maxBuffer;
    /** @type {?} */
    AngularMultiSelect.prototype.lastScrolled;
    /** @type {?} */
    AngularMultiSelect.prototype.lastRepaintY;
    /** @type {?} */
    AngularMultiSelect.prototype.selectedListHeight;
    /** @type {?} */
    AngularMultiSelect.prototype.filterLength;
    /** @type {?} */
    AngularMultiSelect.prototype.infiniteFilterLength;
    /** @type {?} */
    AngularMultiSelect.prototype.viewPortItems;
    /** @type {?} */
    AngularMultiSelect.prototype.item;
    /** @type {?} */
    AngularMultiSelect.prototype.dropdownListYOffset;
    /** @type {?} */
    AngularMultiSelect.prototype.subscription;
    /** @type {?} */
    AngularMultiSelect.prototype.defaultSettings;
    /** @type {?} */
    AngularMultiSelect.prototype.randomSize;
    /** @type {?} */
    AngularMultiSelect.prototype.parseError;
    /** @type {?} */
    AngularMultiSelect.prototype.filteredList;
    /** @type {?} */
    AngularMultiSelect.prototype.virtualScroollInit;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.virtualScroller;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.onTouchedCallback;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.onChangeCallback;
    /** @type {?} */
    AngularMultiSelect.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.cdr;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.ds;
}
export class AngularMultiSelectModule {
}
AngularMultiSelectModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, VirtualScrollerModule],
                declarations: [AngularMultiSelect, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition, CIcon],
                exports: [AngularMultiSelect, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition, CIcon],
                providers: [DataService]
            },] }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlzZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24vIiwic291cmNlcyI6WyJsaWIvbXVsdGlzZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLFlBQVksRUFBcUMsUUFBUSxFQUE0QixpQkFBaUIsRUFBb0IsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFzQyxNQUFNLGVBQWUsQ0FBQztBQUNqVCxPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUF3QixhQUFhLEVBQTBCLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0gsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVsRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDM0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBZ0IsT0FBTyxFQUFHLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2xHLE9BQU8sRUFBTyxZQUFZLEVBQUUsb0JBQW9CLEVBQWEsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBR3pGLE1BQU0sT0FBTywrQkFBK0IsR0FBUTtJQUNoRCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVOzs7SUFBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsRUFBQztJQUNqRCxLQUFLLEVBQUUsSUFBSTtDQUNkOztBQUNELE1BQU0sT0FBTywyQkFBMkIsR0FBUTtJQUM1QyxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVTs7O0lBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLEVBQUM7SUFDakQsS0FBSyxFQUFFLElBQUk7Q0FDZDs7TUFDSyxJQUFJOzs7QUFBRyxHQUFHLEVBQUU7QUFDbEIsQ0FBQyxDQUFBOztBQVdELE1BQU0sT0FBTyxrQkFBa0I7Ozs7OztJQWtJM0IsWUFBbUIsV0FBdUIsRUFBVSxHQUFzQixFQUFVLEVBQWU7UUFBaEYsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQWE7UUF0SG5HLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUd0RCxlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFHeEQsZ0JBQVcsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUd2RSxrQkFBYSxHQUE2QixJQUFJLFlBQVksRUFBYyxDQUFDO1FBR3pFLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUdwRCxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFHckQsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUczRCxzQkFBaUIsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUc3RSx3QkFBbUIsR0FBNkIsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUcvRSx1QkFBa0IsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUdoRSxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBRzNELG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFpQjdELGdCQUFXLEdBQVEsRUFBRSxDQUFDO1FBQ3RCLGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUk3QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUNuQyw4QkFBeUIsR0FBWSxLQUFLLENBQUM7UUFLM0MsZUFBVSxHQUFVLEVBQUUsQ0FBQztRQUN2QixnQkFBVyxHQUFVLEVBQUUsQ0FBQztRQUN4QixxQkFBZ0IsR0FBVSxFQUFFLENBQUM7UUFFN0IsZUFBVSxHQUFRLElBQUksQ0FBQztRQVN2QixpQkFBWSxHQUFRLENBQUMsQ0FBQztRQUN0Qix5QkFBb0IsR0FBUSxDQUFDLENBQUM7UUFHOUIsd0JBQW1CLEdBQVcsQ0FBQyxDQUFDO1FBRXZDLG9CQUFlLEdBQXFCO1lBQ2hDLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLElBQUksRUFBRSxRQUFRO1lBQ2QsY0FBYyxFQUFFLElBQUk7WUFDcEIsYUFBYSxFQUFFLFlBQVk7WUFDM0IsZUFBZSxFQUFFLGNBQWM7WUFDL0IsbUJBQW1CLEVBQUUsNkJBQTZCO1lBQ2xELHFCQUFxQixFQUFFLCtCQUErQjtZQUN0RCxrQkFBa0IsRUFBRSxLQUFLO1lBQ3pCLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFLEdBQUc7WUFDZCxjQUFjLEVBQUUsWUFBWTtZQUM1QixPQUFPLEVBQUUsRUFBRTtZQUNYLFFBQVEsRUFBRSxLQUFLO1lBQ2YscUJBQXFCLEVBQUUsUUFBUTtZQUMvQixZQUFZLEVBQUUsSUFBSTtZQUNsQixXQUFXLEVBQUUsbUJBQW1CO1lBQ2hDLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLHFCQUFxQixFQUFFLElBQUk7WUFDM0IsV0FBVyxFQUFFLEtBQUs7WUFDbEIsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFFBQVEsRUFBRSxJQUFJO1NBQ2pCLENBQUE7UUFDRCxlQUFVLEdBQVcsSUFBSSxDQUFDO1FBRW5CLGlCQUFZLEdBQVEsRUFBRSxDQUFDO1FBQzlCLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQW9INUIsc0JBQWlCLEdBQXFCLElBQUksQ0FBQztRQUMzQyxxQkFBZ0IsR0FBcUIsSUFBSSxDQUFDO1FBakg5QyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FDcEMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUNsQixvQkFBb0IsRUFBRSxFQUN0QixHQUFHOzs7O1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUMsQ0FDaEIsQ0FBQyxTQUFTOzs7O1FBQUMsR0FBRyxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7OztJQWpGRCxZQUFZLENBQUMsS0FBb0I7UUFDN0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRTtZQUM3QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7SUFDTCxDQUFDOzs7O0lBOEVELFFBQVE7UUFDSixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLEtBQUssRUFBRTtZQUNqQyxVQUFVOzs7WUFBQyxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO1lBQ25GLENBQUMsRUFBQyxDQUFDO1NBQ047UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUzs7OztRQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25ELElBQUksSUFBSSxFQUFFOztvQkFDRixHQUFHLEdBQUcsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTzs7Ozs7Z0JBQUMsQ0FBQyxHQUFRLEVBQUUsQ0FBTSxFQUFFLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO3dCQUNqQyxHQUFHLEVBQUUsQ0FBQztxQkFDVDtnQkFDTCxDQUFDLEVBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QjtRQUVMLENBQUMsRUFBQyxDQUFDO1FBQ0gsVUFBVTs7O1FBQUMsR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDdEMsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBQ3BDLENBQUM7Ozs7O0lBQ0QsV0FBVyxDQUFDLE9BQXNCO1FBQzlCLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzNDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO29CQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztpQkFDM0I7Z0JBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqRDtRQUNELElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0RTtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtTQUNwQjtRQUNELElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUM7WUFDcEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUNoRDtJQUNMLENBQUM7Ozs7SUFDRCxTQUFTO1FBQ0wsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDekcsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7YUFDNUI7U0FDSjtJQUNMLENBQUM7Ozs7SUFDRCxlQUFlO1FBQ1gsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUMzQixrSUFBa0k7U0FDckk7SUFDTCxDQUFDOzs7O0lBQ0Qsa0JBQWtCO1FBQ2QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ2hILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7WUFDL0UsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUM1QjtJQUNMLENBQUM7Ozs7Ozs7SUFDRCxXQUFXLENBQUMsSUFBUyxFQUFFLEtBQWEsRUFBRSxHQUFVO1FBQzVDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7WUFDeEIsT0FBTyxLQUFLLENBQUM7U0FDaEI7O1lBRUcsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDOztZQUM3QixLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSztRQUVuRixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRTtnQkFDOUIsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzVCO2FBQ0o7aUJBQ0k7Z0JBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDNUI7U0FFSjthQUNJO1lBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtRQUNELElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNsRSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUM1QjtRQUNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDM0I7UUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUI7SUFDTCxDQUFDOzs7OztJQUNNLFFBQVEsQ0FBQyxDQUFjO1FBQzFCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Ozs7O0lBSUQsVUFBVSxDQUFDLEtBQVU7UUFDakIsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUN2RCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFO2dCQUMvQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO29CQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN4RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQzFELElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbkM7cUJBQU07b0JBQ0gsSUFBSTt3QkFFQSxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzRCQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2hDLE1BQU0sSUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLHVFQUF1RSxFQUFFLENBQUMsQ0FBQzt5QkFDbEg7NkJBQ0k7NEJBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7eUJBQzlCO3FCQUNKO29CQUNELE9BQU8sQ0FBQyxFQUFFO3dCQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDN0I7aUJBQ0o7YUFFSjtpQkFDSTtnQkFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFO29CQUM5QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7aUJBQ3JFO3FCQUNJO29CQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO2lCQUM5QjtnQkFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDeEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7aUJBQzNCO2dCQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3hFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDN0Q7YUFDSjtTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztTQUMzQjtJQUNMLENBQUM7Ozs7OztJQUdELGdCQUFnQixDQUFDLEVBQU87UUFDcEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUMvQixDQUFDOzs7Ozs7SUFHRCxpQkFBaUIsQ0FBQyxFQUFPO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7SUFDaEMsQ0FBQzs7Ozs7O0lBQ0QsU0FBUyxDQUFDLEtBQWEsRUFBRSxJQUFTO1FBQzlCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7Ozs7SUFDRCxVQUFVLENBQUMsV0FBZ0I7O1lBQ25CLEtBQUssR0FBRyxLQUFLO1FBQ2pCLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPOzs7O1FBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEQsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDMUUsS0FBSyxHQUFHLElBQUksQ0FBQzthQUNoQjtRQUNMLENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7Ozs7SUFDRCxXQUFXLENBQUMsSUFBUztRQUNqQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFO1lBQy9CLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN4Qjs7WUFFRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7Ozs7SUFDRCxjQUFjLENBQUMsV0FBZ0I7UUFDM0IsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU87Ozs7UUFBQyxJQUFJLENBQUMsRUFBRTtZQUNwRCxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUMxRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNsRTtRQUNMLENBQUMsRUFBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Ozs7O0lBQ0QsY0FBYyxDQUFDLEdBQVE7UUFDbkIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUN4QixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDNUcsVUFBVTs7O2dCQUFDLEdBQUcsRUFBRTtvQkFDWixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0MsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ1Q7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjthQUNJO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7UUFDRCxVQUFVOzs7UUFBQyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUN0QyxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFDTixJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFDO1lBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM3QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1NBQ2xDO1FBQ0QsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pCLENBQUM7Ozs7SUFDTSxZQUFZO1FBQ2YsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUN4QixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUM1RyxVQUFVOzs7WUFBQyxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDM0MsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ1Q7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDOzs7O0lBQ00sYUFBYTtRQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUM3QztRQUNELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1NBQzdDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7OztJQUNNLHVCQUF1QjtRQUMxQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7YUFDN0M7WUFDRCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7YUFDN0M7WUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7SUFDTCxDQUFDOzs7O0lBQ0QsZUFBZTtRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTzs7OztnQkFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUM3QixHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDeEIsQ0FBQyxFQUFDLENBQUE7Z0JBQ0YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU87Ozs7Z0JBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDbEMsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLENBQUMsRUFBQyxDQUFBO2FBQ0w7WUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTNDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUM3QzthQUNJO1lBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPOzs7O2dCQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQzdCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUN6QixDQUFDLEVBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTzs7OztnQkFBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUNsQyxHQUFHLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDekIsQ0FBQyxFQUFDLENBQUE7YUFDTDtZQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUUzQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDL0M7SUFDTCxDQUFDOzs7O0lBQ0QsaUJBQWlCO1FBQ2IsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtZQUMxQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNOzs7O1FBQUMsR0FBRyxDQUFDLEVBQUU7O2dCQUN6QyxHQUFHLEdBQUcsRUFBRTtZQUNaLElBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQztnQkFDakYsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7YUFDbEI7aUJBQ0k7Z0JBQ0QsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTTs7OztnQkFBQyxDQUFDLENBQUMsRUFBRTtvQkFDdEIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMzRixDQUFDLEVBQUMsQ0FBQzthQUNOO1lBRUQsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFDZixJQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUM7Z0JBQ2pGLE9BQU8sR0FBRyxDQUFDO2FBQ2Q7aUJBQ0k7Z0JBQ0QsT0FBTyxHQUFHLENBQUMsSUFBSTs7OztnQkFBQyxHQUFHLENBQUMsRUFBRTtvQkFDbEIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM3RixDQUFDLEVBQ0EsQ0FBQTthQUNKO1FBRUwsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7O0lBQ0QscUJBQXFCO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7O2dCQUNyQixLQUFLLEdBQUcsRUFBRTtZQUNkLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3ZDOzs7Ozs7Ozs7OztzQ0FXc0I7Z0JBRU4sSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPOzs7O2dCQUFDLENBQUMsRUFBTyxFQUFFLEVBQUU7b0JBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRTt3QkFDeEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDbEI7Z0JBQ0wsQ0FBQyxFQUFDLENBQUM7YUFFTjtpQkFDSTtnQkFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLE9BQU87Ozs7Z0JBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtvQkFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3BCO2dCQUVMLENBQUMsRUFBQyxDQUFDO2FBQ047WUFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1lBQzlCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEM7YUFDSTs7Z0JBQ0csT0FBTyxHQUFHLEVBQUU7WUFDaEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDdkM7Ozs7Ozs7OztzQ0FTc0I7Z0JBQ04sSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPOzs7O2dCQUFDLENBQUMsRUFBTyxFQUFFLEVBQUU7b0JBQzFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTt3QkFDckIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDcEI7Z0JBQ0wsQ0FBQyxFQUFDLENBQUM7YUFDTjtpQkFDSTtnQkFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLE9BQU87Ozs7Z0JBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtvQkFDNUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN0QjtnQkFFTCxDQUFDLEVBQUMsQ0FBQzthQUNOO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztZQUMvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFDO0lBQ0wsQ0FBQzs7OztJQUNELDZCQUE2QjtRQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFO1lBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTzs7OztZQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUMxQjtZQUNMLENBQUMsRUFBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQztTQUN6QzthQUNJO1lBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPOzs7O1lBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM3QjtZQUVMLENBQUMsRUFBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQztTQUMxQztJQUNMLENBQUM7Ozs7SUFDRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDN0Q7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBRW5DLENBQUM7Ozs7O0lBQ0QsY0FBYyxDQUFDLElBQVM7UUFDcEIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3RELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7U0FDbEM7O1lBQ0csR0FBRyxHQUFHLENBQUM7UUFDWCxJQUFJLENBQUMsT0FBTzs7OztRQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFFdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDM0QsR0FBRyxFQUFFLENBQUM7YUFDVDtRQUNMLENBQUMsRUFBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksR0FBRyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7U0FDakM7YUFDSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxHQUFHLEVBQUU7WUFDMUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztTQUNsQztRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0IsQ0FBQzs7Ozs7SUFDRCxVQUFVLENBQUMsR0FBUTs7WUFDWCxDQUFDOztZQUFFLElBQUk7UUFFWCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMxQzthQUFNLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ2hDLE1BQU0sMENBQTBDLENBQUM7U0FDcEQ7YUFBTTtZQUNILE9BQU8sR0FBRyxDQUFDO1NBQ2Q7SUFDTCxDQUFDOzs7OztJQUNELGVBQWUsQ0FBQyxJQUFTOztZQUNqQixHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPO1FBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTzs7OztRQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7O2dCQUM5QixHQUFHLEdBQUcsQ0FBQztZQUNYLElBQUksR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDekMsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO29CQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTzs7OztvQkFBQyxDQUFDLEVBQU8sRUFBRSxFQUFFO3dCQUN6QixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7NEJBQ3JCLEdBQUcsRUFBRSxDQUFDO3lCQUNUO29CQUNMLENBQUMsRUFBQyxDQUFDO2lCQUNOO2FBQ0o7WUFDRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDbEUsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDdkI7aUJBQ0ksSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3RFLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2FBQ3hCO1FBQ0wsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTzs7OztRQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7O2dCQUNuQyxHQUFHLEdBQUcsQ0FBQztZQUNYLElBQUksR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDekMsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO29CQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTzs7OztvQkFBQyxDQUFDLEVBQU8sRUFBRSxFQUFFO3dCQUN6QixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7NEJBQ3JCLEdBQUcsRUFBRSxDQUFDO3lCQUNUO29CQUNMLENBQUMsRUFBQyxDQUFDO2lCQUNOO2FBQ0o7WUFDRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDbEUsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDdkI7aUJBQ0ksSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3RFLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2FBQ3hCO1FBQ0wsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7Ozs7SUFDRCxhQUFhLENBQUMsR0FBZSxFQUFFLEtBQVU7O2NBQy9CLFVBQVUsR0FBUSxHQUFHLENBQUMsTUFBTTs7Ozs7UUFBQyxDQUFDLElBQVMsRUFBRSxHQUFRLEVBQUUsRUFBRTtZQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM1QjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzlCO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxHQUFFLEVBQUUsQ0FBQzs7Y0FDQSxPQUFPLEdBQVEsRUFBRTtRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLENBQU0sRUFBRSxFQUFFOztnQkFDL0IsR0FBRyxHQUFRLEVBQUU7WUFDakIsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7Z0JBQ2IsR0FBRyxHQUFHLENBQUM7WUFDWCxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzs7OztZQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2xCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3ZCLEdBQUcsRUFBRSxDQUFDO2lCQUNUO1lBQ0wsQ0FBQyxFQUFDLENBQUM7WUFDSCxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDeEIsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDdkI7aUJBQ0k7Z0JBQ0QsR0FBRyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7YUFDeEI7WUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLG9DQUFvQztZQUNwQywwQkFBMEI7WUFDMUIsTUFBTTtRQUNWLENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQzs7Ozs7SUFDTSxrQkFBa0IsQ0FBQyxHQUFROztZQUMxQixhQUFhLEdBQWUsRUFBRTtRQUNsQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3BEO2FBQ0k7WUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQy9DO1FBRUQsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDdEQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUVwRCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU07Ozs7b0JBQUMsQ0FBQyxFQUFPLEVBQUUsRUFBRTt3QkFDaEMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFOzRCQUM5RyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUMxQjtvQkFDTCxDQUFDLEVBQUMsQ0FBQztpQkFDTjthQUVKO2lCQUNJO2dCQUNELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTTs7OztnQkFBQyxVQUFVLEVBQU87b0JBQ3JDLEtBQUssSUFBSSxJQUFJLElBQUksRUFBRSxFQUFFO3dCQUNqQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFOzRCQUM5RSxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUN2QixNQUFNO3lCQUNUO3FCQUNKO2dCQUNMLENBQUMsRUFBQyxDQUFDO2FBQ047WUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQztZQUNqQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7U0FDdkQ7UUFDRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNOzs7O1lBQUMsVUFBVSxFQUFPO2dCQUNyQyxJQUFJLEVBQUUsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQy9CLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQzFCO3FCQUNJO29CQUNELEtBQUssSUFBSSxJQUFJLElBQUksRUFBRSxFQUFFO3dCQUNqQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFOzRCQUM5RSxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUN2QixNQUFNO3lCQUNUO3FCQUNKO2lCQUNKO1lBQ0wsQ0FBQyxFQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQztZQUNqQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7U0FDdkQ7YUFDSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNwQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQyxDQUFDOzs7O0lBQ0QsbUJBQW1CO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQztRQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7OztJQUNELFdBQVcsQ0FBQyxDQUFNO1FBQ2QsSUFBRyxDQUFDLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBQztTQUU1RDtRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9CLENBQUM7Ozs7SUFDRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkM7SUFFTCxDQUFDOzs7OztJQUNELFdBQVcsQ0FBQyxJQUFTO1FBQ2pCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTzs7OztZQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxFQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO2FBQ0k7WUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87Ozs7WUFBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO2dCQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDekI7WUFFTCxDQUFDLEVBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbkM7SUFHTCxDQUFDOzs7O0lBQ0QsZ0JBQWdCO1FBQ1osSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUUsQ0FBQzs7OztJQUNELDBCQUEwQjs7WUFDbEIsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksS0FBSztRQUMxRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFOztrQkFDdEIsY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsWUFBWTs7a0JBQ2pFLGNBQWMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVk7O2tCQUN0RCxrQkFBa0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFOztrQkFFaEYsVUFBVSxHQUFXLGtCQUFrQixDQUFDLEdBQUc7O2tCQUMzQyxhQUFhLEdBQVcsY0FBYyxHQUFHLGtCQUFrQixDQUFDLEdBQUc7WUFDckUsSUFBSSxhQUFhLEdBQUcsVUFBVSxJQUFJLGNBQWMsR0FBRyxVQUFVLEVBQUU7Z0JBQzNELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0I7aUJBQ0k7Z0JBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM5QjtZQUNELDJFQUEyRTtZQUMzRTs7Ozs7OzRCQU1nQjtTQUNuQjtJQUVMLENBQUM7Ozs7O0lBQ0QsY0FBYyxDQUFDLEtBQWM7UUFDekIsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUU7WUFDM0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztTQUNwRjthQUFNO1lBQ0gsSUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7Ozs7O0lBQ0QsY0FBYyxDQUFDLENBQU07UUFDakIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtZQUN2QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTzs7OztZQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2xDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLENBQUMsRUFBQyxDQUFBO1NBQ0w7UUFDRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7OztZQTF6QkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLG81cEJBQTJDO2dCQUMzQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUseUJBQXlCLEVBQUU7Z0JBRTlDLFNBQVMsRUFBRSxDQUFDLCtCQUErQixFQUFFLDJCQUEyQixDQUFDO2dCQUN6RSxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDeEM7Ozs7WUFsQzBPLFVBQVU7WUFBcEksaUJBQWlCO1lBUXpILFdBQVc7OzttQkE4QmYsS0FBSzt1QkFHTCxLQUFLO3NCQUdMLEtBQUs7dUJBR0wsTUFBTSxTQUFDLFVBQVU7eUJBR2pCLE1BQU0sU0FBQyxZQUFZOzBCQUduQixNQUFNLFNBQUMsYUFBYTs0QkFHcEIsTUFBTSxTQUFDLGVBQWU7cUJBR3RCLE1BQU0sU0FBQyxRQUFRO3NCQUdmLE1BQU0sU0FBQyxTQUFTOzRCQUdoQixNQUFNLFNBQUMsZUFBZTtnQ0FHdEIsTUFBTSxTQUFDLG1CQUFtQjtrQ0FHMUIsTUFBTSxTQUFDLHFCQUFxQjtpQ0FHNUIsTUFBTSxTQUFDLG9CQUFvQjs0QkFHM0IsTUFBTSxTQUFDLGVBQWU7OEJBR3RCLE1BQU0sU0FBQyxpQkFBaUI7d0JBR3hCLFlBQVksU0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO3lCQUNwQyxZQUFZLFNBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTswQkFDckMsWUFBWSxTQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7MEJBR3RDLFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOytCQUMxQyxTQUFTLFNBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTsrQkFDM0MsU0FBUyxTQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7MkJBRTNDLFlBQVksU0FBQyx1QkFBdUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs4QkF3RWhELFNBQVMsU0FBQyx3QkFBd0IsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7Ozs7SUE5SHBELGtDQUNpQjs7SUFFakIsc0NBQzJCOztJQUUzQixxQ0FDaUI7O0lBRWpCLHNDQUNzRDs7SUFFdEQsd0NBQ3dEOztJQUV4RCx5Q0FDdUU7O0lBRXZFLDJDQUN5RTs7SUFFekUsb0NBQ29EOztJQUVwRCxxQ0FDcUQ7O0lBRXJELDJDQUMyRDs7SUFFM0QsK0NBQzZFOztJQUU3RSxpREFDK0U7O0lBRS9FLGdEQUNnRTs7SUFFaEUsMkNBQzJEOztJQUUzRCw2Q0FDNkQ7O0lBRTdELHVDQUF1RDs7SUFDdkQsd0NBQTBEOztJQUMxRCx5Q0FBNkQ7O0lBRzdELHlDQUFxRTs7SUFDckUsOENBQTJFOztJQUMzRSw4Q0FBMkU7O0lBUTNFLHlDQUFzQjs7SUFDdEIseUNBQW9DOztJQUVwQyx3Q0FBMkI7O0lBQzNCLDJDQUFpQzs7SUFDakMsc0NBQWlDOztJQUNqQyx5Q0FBb0M7O0lBQ3BDLCtDQUEwQzs7SUFDMUMsdURBQWtEOztJQUNsRCx5Q0FBK0I7O0lBQy9CLG9DQUFZOztJQUNaLHdDQUF5Qjs7SUFDekIsdUNBQXNCOztJQUN0Qix3Q0FBOEI7O0lBQzlCLHlDQUErQjs7SUFDL0IsOENBQW9DOztJQUNwQyx1Q0FBc0I7O0lBQ3RCLHdDQUE4Qjs7SUFDOUIsNENBQTJCOztJQUMzQiw0Q0FBMkI7O0lBQzNCLHlDQUF3Qjs7SUFDeEIsc0NBQXFCOztJQUNyQix1Q0FBc0I7O0lBQ3RCLDBDQUF5Qjs7SUFDekIsMENBQXlCOztJQUN6QixnREFBK0I7O0lBQy9CLDBDQUE2Qjs7SUFDN0Isa0RBQXFDOztJQUNyQywyQ0FBMEI7O0lBQzFCLGtDQUFpQjs7SUFDakIsaURBQXVDOztJQUN2QywwQ0FBMkI7O0lBQzNCLDZDQTZCQzs7SUFDRCx3Q0FBMEI7O0lBQzFCLHdDQUEyQjs7SUFDM0IsMENBQThCOztJQUM5QixnREFBb0M7Ozs7O0lBQ3BDLDZDQUNrRDs7Ozs7SUFrSGxELCtDQUFtRDs7Ozs7SUFDbkQsOENBQWtEOztJQWxIdEMseUNBQThCOzs7OztJQUFFLGlDQUE4Qjs7Ozs7SUFBRSxnQ0FBdUI7O0FBd3JCdkcsTUFBTSxPQUFPLHdCQUF3Qjs7O1lBTnBDLFFBQVEsU0FBQztnQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLHFCQUFxQixDQUFDO2dCQUMzRCxZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDO2dCQUNySyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDO2dCQUNoSyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7YUFDM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSG9zdExpc3RlbmVyLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxPbkRlc3Ryb3ksIE5nTW9kdWxlLCBTaW1wbGVDaGFuZ2VzLCBPbkNoYW5nZXMsIENoYW5nZURldGVjdG9yUmVmLCBBZnRlclZpZXdDaGVja2VkLCBWaWV3RW5jYXBzdWxhdGlvbiwgQ29udGVudENoaWxkLCBWaWV3Q2hpbGQsIGZvcndhcmRSZWYsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMSURBVE9SUywgVmFsaWRhdG9yLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBNeUV4Y2VwdGlvbiB9IGZyb20gJy4vbXVsdGlzZWxlY3QubW9kZWwnO1xuaW1wb3J0IHsgRHJvcGRvd25TZXR0aW5ncyB9IGZyb20gJy4vbXVsdGlzZWxlY3QuaW50ZXJmYWNlJztcbmltcG9ydCB7IENsaWNrT3V0c2lkZURpcmVjdGl2ZSwgU2Nyb2xsRGlyZWN0aXZlLCBzdHlsZURpcmVjdGl2ZSwgc2V0UG9zaXRpb24gfSBmcm9tICcuL2NsaWNrT3V0c2lkZSc7XG5pbXBvcnQgeyBMaXN0RmlsdGVyUGlwZSB9IGZyb20gJy4vbGlzdC1maWx0ZXInO1xuaW1wb3J0IHsgSXRlbSwgQmFkZ2UsIFNlYXJjaCwgVGVtcGxhdGVSZW5kZXJlciwgQ0ljb24gfSBmcm9tICcuL21lbnUtaXRlbSc7XG5pbXBvcnQgeyBEYXRhU2VydmljZSB9IGZyb20gJy4vbXVsdGlzZWxlY3Quc2VydmljZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIFN1YmplY3QgIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBWaXJ0dWFsU2Nyb2xsZXJNb2R1bGUsIFZpcnR1YWxTY3JvbGxlckNvbXBvbmVudCB9IGZyb20gJy4vdmlydHVhbC1zY3JvbGwvdmlydHVhbC1zY3JvbGwnO1xuaW1wb3J0IHsgbWFwLCBkZWJvdW5jZVRpbWUsIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBzd2l0Y2hNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJzsgXG5pbXBvcnQgeyBUaHJvd1N0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XG5cbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQW5ndWxhck11bHRpU2VsZWN0KSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9DT05UUk9MX1ZBTElEQVRJT046IGFueSA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFuZ3VsYXJNdWx0aVNlbGVjdCksXG4gICAgbXVsdGk6IHRydWUsXG59XG5jb25zdCBub29wID0gKCkgPT4ge1xufTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhbmd1bGFyMi1tdWx0aXNlbGVjdCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL211bHRpc2VsZWN0LmNvbXBvbmVudC5odG1sJyxcbiAgICBob3N0OiB7ICdbY2xhc3NdJzogJ2RlZmF1bHRTZXR0aW5ncy5jbGFzc2VzJyB9LFxuICAgIHN0eWxlVXJsczogWycuL211bHRpc2VsZWN0LmNvbXBvbmVudC5zY3NzJ10sXG4gICAgcHJvdmlkZXJzOiBbRFJPUERPV05fQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUiwgRFJPUERPV05fQ09OVFJPTF9WQUxJREFUSU9OXSxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcblxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJNdWx0aVNlbGVjdCBpbXBsZW1lbnRzIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgVmFsaWRhdG9yLCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KClcbiAgICBkYXRhOiBBcnJheTxhbnk+O1xuXG4gICAgQElucHV0KClcbiAgICBzZXR0aW5nczogRHJvcGRvd25TZXR0aW5ncztcblxuICAgIEBJbnB1dCgpXG4gICAgbG9hZGluZzogYm9vbGVhbjtcblxuICAgIEBPdXRwdXQoJ29uU2VsZWN0JylcbiAgICBvblNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIEBPdXRwdXQoJ29uRGVTZWxlY3QnKVxuICAgIG9uRGVTZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBAT3V0cHV0KCdvblNlbGVjdEFsbCcpXG4gICAgb25TZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcblxuICAgIEBPdXRwdXQoJ29uRGVTZWxlY3RBbGwnKVxuICAgIG9uRGVTZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcblxuICAgIEBPdXRwdXQoJ29uT3BlbicpXG4gICAgb25PcGVuOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgQE91dHB1dCgnb25DbG9zZScpXG4gICAgb25DbG9zZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIEBPdXRwdXQoJ29uU2Nyb2xsVG9FbmQnKVxuICAgIG9uU2Nyb2xsVG9FbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBAT3V0cHV0KCdvbkZpbHRlclNlbGVjdEFsbCcpXG4gICAgb25GaWx0ZXJTZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcblxuICAgIEBPdXRwdXQoJ29uRmlsdGVyRGVTZWxlY3RBbGwnKVxuICAgIG9uRmlsdGVyRGVTZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcblxuICAgIEBPdXRwdXQoJ29uQWRkRmlsdGVyTmV3SXRlbScpXG4gICAgb25BZGRGaWx0ZXJOZXdJdGVtOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgQE91dHB1dCgnb25Hcm91cFNlbGVjdCcpXG4gICAgb25Hcm91cFNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIEBPdXRwdXQoJ29uR3JvdXBEZVNlbGVjdCcpXG4gICAgb25Hcm91cERlU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgQENvbnRlbnRDaGlsZChJdGVtLCB7IHN0YXRpYzogZmFsc2UgfSkgaXRlbVRlbXBsOiBJdGVtO1xuICAgIEBDb250ZW50Q2hpbGQoQmFkZ2UsIHsgc3RhdGljOiBmYWxzZSB9KSBiYWRnZVRlbXBsOiBCYWRnZTtcbiAgICBAQ29udGVudENoaWxkKFNlYXJjaCwgeyBzdGF0aWM6IGZhbHNlIH0pIHNlYXJjaFRlbXBsOiBTZWFyY2g7XG5cblxuICAgIEBWaWV3Q2hpbGQoJ3NlYXJjaElucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pIHNlYXJjaElucHV0OiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ3NlbGVjdGVkTGlzdCcsIHsgc3RhdGljOiBmYWxzZSB9KSBzZWxlY3RlZExpc3RFbGVtOiBFbGVtZW50UmVmO1xuICAgIEBWaWV3Q2hpbGQoJ2Ryb3Bkb3duTGlzdCcsIHsgc3RhdGljOiBmYWxzZSB9KSBkcm9wZG93bkxpc3RFbGVtOiBFbGVtZW50UmVmO1xuXG4gICAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5dXAuZXNjYXBlJywgWyckZXZlbnQnXSlcbiAgICBvbkVzY2FwZURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZXNjYXBlVG9DbG9zZSkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmlydHVhbGRhdGE6IGFueSA9IFtdO1xuICAgIHNlYXJjaFRlcm0kID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gICAgZmlsdGVyUGlwZTogTGlzdEZpbHRlclBpcGU7XG4gICAgcHVibGljIHNlbGVjdGVkSXRlbXM6IEFycmF5PGFueT47XG4gICAgcHVibGljIGlzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzU2VsZWN0QWxsOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzRmlsdGVyU2VsZWN0QWxsOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIGlzSW5maW5pdGVGaWx0ZXJTZWxlY3RBbGw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgZ3JvdXBlZERhdGE6IEFycmF5PGFueT47XG4gICAgZmlsdGVyOiBhbnk7XG4gICAgcHVibGljIGNodW5rQXJyYXk6IGFueVtdO1xuICAgIHB1YmxpYyBzY3JvbGxUb3A6IGFueTtcbiAgICBwdWJsaWMgY2h1bmtJbmRleDogYW55W10gPSBbXTtcbiAgICBwdWJsaWMgY2FjaGVkSXRlbXM6IGFueVtdID0gW107XG4gICAgcHVibGljIGdyb3VwQ2FjaGVkSXRlbXM6IGFueVtdID0gW107XG4gICAgcHVibGljIHRvdGFsUm93czogYW55O1xuICAgIHB1YmxpYyBpdGVtSGVpZ2h0OiBhbnkgPSA0MS42O1xuICAgIHB1YmxpYyBzY3JlZW5JdGVtc0xlbjogYW55O1xuICAgIHB1YmxpYyBjYWNoZWRJdGVtc0xlbjogYW55O1xuICAgIHB1YmxpYyB0b3RhbEhlaWdodDogYW55O1xuICAgIHB1YmxpYyBzY3JvbGxlcjogYW55O1xuICAgIHB1YmxpYyBtYXhCdWZmZXI6IGFueTtcbiAgICBwdWJsaWMgbGFzdFNjcm9sbGVkOiBhbnk7XG4gICAgcHVibGljIGxhc3RSZXBhaW50WTogYW55O1xuICAgIHB1YmxpYyBzZWxlY3RlZExpc3RIZWlnaHQ6IGFueTtcbiAgICBwdWJsaWMgZmlsdGVyTGVuZ3RoOiBhbnkgPSAwO1xuICAgIHB1YmxpYyBpbmZpbml0ZUZpbHRlckxlbmd0aDogYW55ID0gMDtcbiAgICBwdWJsaWMgdmlld1BvcnRJdGVtczogYW55O1xuICAgIHB1YmxpYyBpdGVtOiBhbnk7XG4gICAgcHVibGljIGRyb3Bkb3duTGlzdFlPZmZzZXQ6IG51bWJlciA9IDA7XG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgZGVmYXVsdFNldHRpbmdzOiBEcm9wZG93blNldHRpbmdzID0ge1xuICAgICAgICBzaW5nbGVTZWxlY3Rpb246IGZhbHNlLFxuICAgICAgICB0ZXh0OiAnU2VsZWN0JyxcbiAgICAgICAgZW5hYmxlQ2hlY2tBbGw6IHRydWUsXG4gICAgICAgIHNlbGVjdEFsbFRleHQ6ICdTZWxlY3QgQWxsJyxcbiAgICAgICAgdW5TZWxlY3RBbGxUZXh0OiAnVW5TZWxlY3QgQWxsJyxcbiAgICAgICAgZmlsdGVyU2VsZWN0QWxsVGV4dDogJ1NlbGVjdCBhbGwgZmlsdGVyZWQgcmVzdWx0cycsXG4gICAgICAgIGZpbHRlclVuU2VsZWN0QWxsVGV4dDogJ1VuU2VsZWN0IGFsbCBmaWx0ZXJlZCByZXN1bHRzJyxcbiAgICAgICAgZW5hYmxlU2VhcmNoRmlsdGVyOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoQnk6IFtdLFxuICAgICAgICBtYXhIZWlnaHQ6IDMwMCxcbiAgICAgICAgYmFkZ2VTaG93TGltaXQ6IDk5OTk5OTk5OTk5OSxcbiAgICAgICAgY2xhc3NlczogJycsXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXJUZXh0OiAnU2VhcmNoJyxcbiAgICAgICAgc2hvd0NoZWNrYm94OiB0cnVlLFxuICAgICAgICBub0RhdGFMYWJlbDogJ05vIERhdGEgQXZhaWxhYmxlJyxcbiAgICAgICAgc2VhcmNoQXV0b2ZvY3VzOiB0cnVlLFxuICAgICAgICBsYXp5TG9hZGluZzogZmFsc2UsXG4gICAgICAgIGxhYmVsS2V5OiAnaXRlbU5hbWUnLFxuICAgICAgICBwcmltYXJ5S2V5OiAnaWQnLFxuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbScsXG4gICAgICAgIGF1dG9Qb3NpdGlvbjogdHJ1ZSxcbiAgICAgICAgZW5hYmxlRmlsdGVyU2VsZWN0QWxsOiB0cnVlLFxuICAgICAgICBzZWxlY3RHcm91cDogZmFsc2UsXG4gICAgICAgIGFkZE5ld0l0ZW1PbkZpbHRlcjogZmFsc2UsXG4gICAgICAgIGFkZE5ld0J1dHRvblRleHQ6IFwiQWRkXCIsXG4gICAgICAgIGVzY2FwZVRvQ2xvc2U6IHRydWUsXG4gICAgICAgIGNsZWFyQWxsOiB0cnVlXG4gICAgfVxuICAgIHJhbmRvbVNpemU6Ym9vbGVhbiA9IHRydWU7XG4gICAgcHVibGljIHBhcnNlRXJyb3I6IGJvb2xlYW47XG4gICAgcHVibGljIGZpbHRlcmVkTGlzdDogYW55ID0gW107XG4gICAgdmlydHVhbFNjcm9vbGxJbml0OiBib29sZWFuID0gZmFsc2U7XG4gICAgQFZpZXdDaGlsZChWaXJ0dWFsU2Nyb2xsZXJDb21wb25lbnQsIHtzdGF0aWM6IGZhbHNlfSlcbiAgICBwcml2YXRlIHZpcnR1YWxTY3JvbGxlcjogVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50O1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIGRzOiBEYXRhU2VydmljZSkge1xuICAgICAgICB0aGlzLnNlYXJjaFRlcm0kLmFzT2JzZXJ2YWJsZSgpLnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZSgxMDAwKSxcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICAgICAgdGFwKHRlcm0gPT4gdGVybSlcbiAgICAgICAgKS5zdWJzY3JpYmUodmFsID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVySW5maW5pdGVMaXN0KHZhbCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24odGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuXG4gICAgICAgIHRoaXMuY2FjaGVkSXRlbXMgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5kYXRhKTtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MucG9zaXRpb24gPT0gJ3RvcCcpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRMaXN0SGVpZ2h0ID0geyB2YWw6IDAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGlzdEhlaWdodC52YWwgPSB0aGlzLnNlbGVjdGVkTGlzdEVsZW0ubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHMuZ2V0RGF0YSgpLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IDA7XG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChvYmo6IGFueSwgaTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KCdncnBUaXRsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZW4rKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyTGVuZ3RoID0gbGVuO1xuICAgICAgICAgICAgICAgIHRoaXMub25GaWx0ZXJDaGFuZ2UoZGF0YSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVEcm9wZG93bkRpcmVjdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb29sbEluaXQgPSBmYWxzZTtcbiAgICB9XG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy50cmFuc2Zvcm1EYXRhKHRoaXMuZGF0YSwgdGhpcy5zZXR0aW5ncy5ncm91cEJ5KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5ncm91cGVkRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNhY2hlZEl0ZW1zID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoYW5nZXMuc2V0dGluZ3MgJiYgIWNoYW5nZXMuc2V0dGluZ3MuZmlyc3RDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlcy5sb2FkaW5nKSB7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5zZXR0aW5ncy5sYXp5TG9hZGluZyAmJiB0aGlzLnZpcnR1YWxTY3Jvb2xsSW5pdCAmJiBjaGFuZ2VzLmRhdGEpe1xuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IGNoYW5nZXMuZGF0YS5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmdEb0NoZWNrKCkge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW1zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA9PSAwIHx8IHRoaXMuZGF0YS5sZW5ndGggPT0gMCB8fCB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIDwgdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmxhenlMb2FkaW5nKSB7XG4gICAgICAgICAgICAvLyB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxhenlDb250YWluZXJcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5vblNjcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkTGlzdEVsZW0ubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQgJiYgdGhpcy5zZXR0aW5ncy5wb3NpdGlvbiA9PSAndG9wJyAmJiB0aGlzLnNlbGVjdGVkTGlzdEhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZExpc3RIZWlnaHQudmFsID0gdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9uSXRlbUNsaWNrKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlciwgZXZ0OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZvdW5kID0gdGhpcy5pc1NlbGVjdGVkKGl0ZW0pO1xuICAgICAgICBsZXQgbGltaXQgPSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIDwgdGhpcy5zZXR0aW5ncy5saW1pdFNlbGVjdGlvbiA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5saW1pdFNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGlmIChsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0LmVtaXQoaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3RlZChpdGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0LmVtaXQoaXRlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoaXRlbSk7XG4gICAgICAgICAgICB0aGlzLm9uRGVTZWxlY3QuZW1pdChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc1NlbGVjdEFsbCB8fCB0aGlzLmRhdGEubGVuZ3RoID4gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5pc1NlbGVjdEFsbCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID09IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR3JvdXBJbmZvKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyB2YWxpZGF0ZShjOiBGb3JtQ29udHJvbCk6IGFueSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBwcml2YXRlIG9uVG91Y2hlZENhbGxiYWNrOiAoXzogYW55KSA9PiB2b2lkID0gbm9vcDtcbiAgICBwcml2YXRlIG9uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xuXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2luZ2xlU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy50cmFuc2Zvcm1EYXRhKHRoaXMuZGF0YSwgdGhpcy5zZXR0aW5ncy5ncm91cEJ5KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZ3JvdXBlZERhdGEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbdmFsdWVbMF1dO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW3ZhbHVlWzBdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTXlFeGNlcHRpb24oNDA0LCB7IFwibXNnXCI6IFwiU2luZ2xlIFNlbGVjdGlvbiBNb2RlLCBTZWxlY3RlZCBJdGVtcyBjYW5ub3QgaGF2ZSBtb3JlIHRoYW4gb25lIGl0ZW0uXCIgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLmJvZHkubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubGltaXRTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gdmFsdWUuc2xpY2UoMCwgdGhpcy5zZXR0aW5ncy5saW1pdFNlbGVjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IHRoaXMuZGF0YS5sZW5ndGggJiYgdGhpcy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1NlbGVjdEFsbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMudHJhbnNmb3JtRGF0YSh0aGlzLmRhdGEsIHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcyA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmdyb3VwZWREYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vRnJvbSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gZm47XG4gICAgfVxuXG4gICAgLy9Gcm9tIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayA9IGZuO1xuICAgIH1cbiAgICB0cmFja0J5Rm4oaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XG4gICAgICAgIHJldHVybiBpdGVtW3RoaXMuc2V0dGluZ3MucHJpbWFyeUtleV07XG4gICAgfVxuICAgIGlzU2VsZWN0ZWQoY2xpY2tlZEl0ZW06IGFueSkge1xuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zICYmIHRoaXMuc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGNsaWNrZWRJdGVtW3RoaXMuc2V0dGluZ3MucHJpbWFyeUtleV0gPT09IGl0ZW1bdGhpcy5zZXR0aW5ncy5wcmltYXJ5S2V5XSkge1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9XG4gICAgYWRkU2VsZWN0ZWQoaXRlbTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNpbmdsZVNlbGVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcbiAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuICAgIH1cbiAgICByZW1vdmVTZWxlY3RlZChjbGlja2VkSXRlbTogYW55KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyAmJiB0aGlzLnNlbGVjdGVkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChjbGlja2VkSXRlbVt0aGlzLnNldHRpbmdzLnByaW1hcnlLZXldID09PSBpdGVtW3RoaXMuc2V0dGluZ3MucHJpbWFyeUtleV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMuc3BsaWNlKHRoaXMuc2VsZWN0ZWRJdGVtcy5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XG4gICAgfVxuICAgIHRvZ2dsZURyb3Bkb3duKGV2dDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9ICF0aGlzLmlzQWN0aXZlO1xuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2VhcmNoQXV0b2ZvY3VzICYmIHRoaXMuc2VhcmNoSW5wdXQgJiYgdGhpcy5zZXR0aW5ncy5lbmFibGVTZWFyY2hGaWx0ZXIgJiYgIXRoaXMuc2VhcmNoVGVtcGwpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9uT3Blbi5lbWl0KHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlLmVtaXQoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVEcm9wZG93bkRpcmVjdGlvbigpO1xuICAgICAgICB9LCAwKTtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5ncy5sYXp5TG9hZGluZyl7XG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb29sbEluaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBwdWJsaWMgb3BlbkRyb3Bkb3duKCkge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zZWFyY2hBdXRvZm9jdXMgJiYgdGhpcy5zZWFyY2hJbnB1dCAmJiB0aGlzLnNldHRpbmdzLmVuYWJsZVNlYXJjaEZpbHRlciAmJiAhdGhpcy5zZWFyY2hUZW1wbCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uT3Blbi5lbWl0KHRydWUpO1xuICAgIH1cbiAgICBwdWJsaWMgY2xvc2VEcm9wZG93bigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoSW5wdXQgJiYgdGhpcy5zZXR0aW5ncy5sYXp5TG9hZGluZykge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zZWFyY2hJbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbHRlciA9IFwiXCI7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbkNsb3NlLmVtaXQoZmFsc2UpO1xuICAgIH1cbiAgICBwdWJsaWMgY2xvc2VEcm9wZG93bk9uQ2xpY2tPdXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hJbnB1dCAmJiB0aGlzLnNldHRpbmdzLmxhenlMb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnNlYXJjaElucHV0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTZWFyY2goKTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZS5lbWl0KGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2dnbGVTZWxlY3RBbGwoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1NlbGVjdEFsbCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5mb3JFYWNoKChvYmopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcy5mb3JFYWNoKChvYmopID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gdGhpcy5kYXRhLnNsaWNlKCk7XG4gICAgICAgICAgICB0aGlzLmlzU2VsZWN0QWxsID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuICAgICAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuXG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0QWxsLmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMuZm9yRWFjaCgob2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuICAgICAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuXG4gICAgICAgICAgICB0aGlzLm9uRGVTZWxlY3RBbGwuZW1pdCh0aGlzLnNlbGVjdGVkSXRlbXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpbHRlckdyb3VwZWRMaXN0KCkge1xuICAgICAgICBpZiAodGhpcy5maWx0ZXIgPT0gXCJcIiB8fCB0aGlzLmZpbHRlciA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyU2VhcmNoKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmdyb3VwQ2FjaGVkSXRlbXMpO1xuICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy5ncm91cGVkRGF0YS5maWx0ZXIob2JqID0+IHtcbiAgICAgICAgICAgIGxldCBhcnIgPSBbXTtcbiAgICAgICAgICAgIGlmKG9ialt0aGlzLnNldHRpbmdzLmxhYmVsS2V5XS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5maWx0ZXIudG9Mb3dlckNhc2UoKSkgPiAtMSl7XG4gICAgICAgICAgICAgICAgYXJyID0gb2JqLmxpc3Q7XG4gICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnIgPSBvYmoubGlzdC5maWx0ZXIodCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0W3RoaXMuc2V0dGluZ3MubGFiZWxLZXldLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLmZpbHRlci50b0xvd2VyQ2FzZSgpKSA+IC0xO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBvYmoubGlzdCA9IGFycjtcbiAgICAgICAgICAgIGlmKG9ialt0aGlzLnNldHRpbmdzLmxhYmVsS2V5XS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5maWx0ZXIudG9Mb3dlckNhc2UoKSkgPiAtMSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnIuc29tZShjYXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2F0W3RoaXMuc2V0dGluZ3MubGFiZWxLZXldLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLmZpbHRlci50b0xvd2VyQ2FzZSgpKSA+IC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHRvZ2dsZUZpbHRlclNlbGVjdEFsbCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRmlsdGVyU2VsZWN0QWxsKSB7XG4gICAgICAgICAgICBsZXQgYWRkZWQgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcbi8qICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5saXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmxpc3QuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKGVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQucHVzaChlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVHcm91cEluZm8oaXRlbSk7XG5cbiAgICAgICAgICAgICAgICB9KTsgKi9cblxuICAgICAgICAgICAgICAgIHRoaXMuZHMuZ2V0RmlsdGVyZWREYXRhKCkuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChlbCkgJiYgIWVsLmhhc093blByb3BlcnR5KCdncnBUaXRsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkLnB1c2goZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZHMuZ2V0RmlsdGVyZWREYXRhKCkuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vbkZpbHRlclNlbGVjdEFsbC5lbWl0KGFkZGVkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZW1vdmVkID0gW107XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XG4vKiAgICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ubGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5saXN0LmZvckVhY2goKGVsOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pOyAqL1xuICAgICAgICAgICAgICAgIHRoaXMuZHMuZ2V0RmlsdGVyZWREYXRhKCkuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkLnB1c2goZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRzLmdldEZpbHRlcmVkRGF0YSgpLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMub25GaWx0ZXJEZVNlbGVjdEFsbC5lbWl0KHJlbW92ZWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZ2dsZUluZmluaXRlRmlsdGVyU2VsZWN0QWxsKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNJbmZpbml0ZUZpbHRlclNlbGVjdEFsbCkge1xuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5pc0luZmluaXRlRmlsdGVyU2VsZWN0QWxsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmlzSW5maW5pdGVGaWx0ZXJTZWxlY3RBbGwgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbGVhclNlYXJjaCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xuICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmdyb3VwQ2FjaGVkSXRlbXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsdGVyID0gXCJcIjtcbiAgICAgICAgdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCA9IGZhbHNlO1xuXG4gICAgfVxuICAgIG9uRmlsdGVyQ2hhbmdlKGRhdGE6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5maWx0ZXIgJiYgdGhpcy5maWx0ZXIgPT0gXCJcIiB8fCBkYXRhLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmlzRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNudCA9IDA7XG4gICAgICAgIGRhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICghaXRlbS5oYXNPd25Qcm9wZXJ0eSgnZ3JwVGl0bGUnKSAmJiB0aGlzLmlzU2VsZWN0ZWQoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNudCA+IDAgJiYgdGhpcy5maWx0ZXJMZW5ndGggPT0gY250KSB7XG4gICAgICAgICAgICB0aGlzLmlzRmlsdGVyU2VsZWN0QWxsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjbnQgPiAwICYmIHRoaXMuZmlsdGVyTGVuZ3RoICE9IGNudCkge1xuICAgICAgICAgICAgdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gICAgY2xvbmVBcnJheShhcnI6IGFueSkge1xuICAgICAgICBsZXQgaSwgY29weTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcnIpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJyID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjbG9uZSBhcnJheSBjb250YWluaW5nIGFuIG9iamVjdCEnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1cGRhdGVHcm91cEluZm8oaXRlbTogYW55KSB7XG4gICAgICAgIGxldCBrZXkgPSB0aGlzLnNldHRpbmdzLmdyb3VwQnk7XG4gICAgICAgIHRoaXMuZ3JvdXBlZERhdGEuZm9yRWFjaCgob2JqOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCBjbnQgPSAwO1xuICAgICAgICAgICAgaWYgKG9iai5ncnBUaXRsZSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xuICAgICAgICAgICAgICAgIGlmIChvYmoubGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBvYmoubGlzdC5mb3JFYWNoKChlbDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGVsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2JqLmxpc3QgJiYgKGNudCA9PT0gb2JqLmxpc3QubGVuZ3RoKSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChvYmoubGlzdCAmJiAoY250ICE9IG9iai5saXN0Lmxlbmd0aCkgJiYgKGl0ZW1ba2V5XSA9PSBvYmpba2V5XSkpIHtcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcy5mb3JFYWNoKChvYmo6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IGNudCA9IDA7XG4gICAgICAgICAgICBpZiAob2JqLmdycFRpdGxlICYmIChpdGVtW2tleV0gPT0gb2JqW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5saXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5saXN0LmZvckVhY2goKGVsOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY250Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvYmoubGlzdCAmJiAoY250ID09PSBvYmoubGlzdC5sZW5ndGgpICYmIChpdGVtW2tleV0gPT0gb2JqW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG9iai5saXN0ICYmIChjbnQgIT0gb2JqLmxpc3QubGVuZ3RoKSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgdHJhbnNmb3JtRGF0YShhcnI6IEFycmF5PGFueT4sIGZpZWxkOiBhbnkpOiBBcnJheTxhbnk+IHtcbiAgICAgICAgY29uc3QgZ3JvdXBlZE9iajogYW55ID0gYXJyLnJlZHVjZSgocHJldjogYW55LCBjdXI6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFwcmV2W2N1cltmaWVsZF1dKSB7XG4gICAgICAgICAgICAgICAgcHJldltjdXJbZmllbGRdXSA9IFtjdXJdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmV2W2N1cltmaWVsZF1dLnB1c2goY3VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIGNvbnN0IHRlbXBBcnI6IGFueSA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyhncm91cGVkT2JqKS5tYXAoKHg6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IG9iajogYW55ID0ge307XG4gICAgICAgICAgICBvYmpbXCJncnBUaXRsZVwiXSA9IHRydWU7XG4gICAgICAgICAgICBvYmpbdGhpcy5zZXR0aW5ncy5sYWJlbEtleV0gPSB4O1xuICAgICAgICAgICAgb2JqW3RoaXMuc2V0dGluZ3MuZ3JvdXBCeV0gPSB4O1xuICAgICAgICAgICAgb2JqWydzZWxlY3RlZCddID0gZmFsc2U7XG4gICAgICAgICAgICBvYmpbJ2xpc3QnXSA9IFtdO1xuICAgICAgICAgICAgbGV0IGNudCA9IDA7XG4gICAgICAgICAgICBncm91cGVkT2JqW3hdLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGl0ZW1bJ2xpc3QnXSA9IFtdO1xuICAgICAgICAgICAgICAgIG9iai5saXN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xuICAgICAgICAgICAgICAgICAgICBjbnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChjbnQgPT0gb2JqLmxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcEFyci5wdXNoKG9iaik7XG4gICAgICAgICAgICAvLyBvYmoubGlzdC5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgIC8vICAgICB0ZW1wQXJyLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xuICAgIH1cbiAgICBwdWJsaWMgZmlsdGVySW5maW5pdGVMaXN0KGV2dDogYW55KSB7XG4gICAgICAgIGxldCBmaWx0ZXJlZEVsZW1zOiBBcnJheTxhbnk+ID0gW107XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMuc2xpY2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuY2FjaGVkSXRlbXMuc2xpY2UoKTtcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSB0aGlzLmNhY2hlZEl0ZW1zLnNsaWNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKGV2dCAhPSBudWxsIHx8IGV2dCAhPSAnJykgJiYgIXRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2VhcmNoQnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgdGhpcy5zZXR0aW5ncy5zZWFyY2hCeS5sZW5ndGg7IHQrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEuZmlsdGVyKChlbDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxbdGhpcy5zZXR0aW5ncy5zZWFyY2hCeVt0XS50b1N0cmluZygpXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihldnQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFbGVtcy5wdXNoKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhLmZpbHRlcihmdW5jdGlvbiAoZWw6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxbcHJvcF0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZXZ0LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWxlbXMucHVzaChlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSBmaWx0ZXJlZEVsZW1zO1xuICAgICAgICAgICAgdGhpcy5pbmZpbml0ZUZpbHRlckxlbmd0aCA9IHRoaXMudmlydHVhbGRhdGEubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldnQudG9TdHJpbmcoKSAhPSAnJyAmJiB0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEuZmlsdGVyKGZ1bmN0aW9uIChlbDogYW55KSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsLmhhc093blByb3BlcnR5KCdncnBUaXRsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWxlbXMucHVzaChlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxbcHJvcF0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZXZ0LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWxlbXMucHVzaChlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSBmaWx0ZXJlZEVsZW1zO1xuICAgICAgICAgICAgdGhpcy5pbmZpbml0ZUZpbHRlckxlbmd0aCA9IHRoaXMuZ3JvdXBlZERhdGEubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2dC50b1N0cmluZygpID09ICcnICYmIHRoaXMuY2FjaGVkSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IFtdO1xuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IHRoaXMuY2FjaGVkSXRlbXM7XG4gICAgICAgICAgICB0aGlzLmluZmluaXRlRmlsdGVyTGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZpcnR1YWxTY3JvbGxlci5yZWZyZXNoKCk7XG4gICAgfVxuICAgIHJlc2V0SW5maW5pdGVTZWFyY2goKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyID0gXCJcIjtcbiAgICAgICAgdGhpcy5pc0luZmluaXRlRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XG4gICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSBbXTtcbiAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IHRoaXMuY2FjaGVkSXRlbXM7XG4gICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmdyb3VwQ2FjaGVkSXRlbXM7XG4gICAgICAgIHRoaXMuaW5maW5pdGVGaWx0ZXJMZW5ndGggPSAwO1xuICAgIH1cbiAgICBvblNjcm9sbEVuZChlOiBhbnkpIHtcbiAgICAgICAgaWYoZS5lbmRJbmRleCA9PT0gdGhpcy5kYXRhLmxlbmd0aCAtIDEgfHwgZS5zdGFydEluZGV4ID09PSAwKXtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMub25TY3JvbGxUb0VuZC5lbWl0KGUpO1xuICAgICAgICBcbiAgICB9XG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHNlbGVjdEdyb3VwKGl0ZW06IGFueSkge1xuICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaXRlbS5saXN0LmZvckVhY2goKG9iajogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChvYmopO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdyb3VwSW5mbyhpdGVtKTtcbiAgICAgICAgICAgIHRoaXMub25Hcm91cFNlbGVjdC5lbWl0KGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICBpdGVtLmxpc3QuZm9yRWFjaCgob2JqOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQob2JqKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVHcm91cEluZm8oaXRlbSk7XG4gICAgICAgICAgICB0aGlzLm9uR3JvdXBEZVNlbGVjdC5lbWl0KGl0ZW0pO1xuICAgICAgICB9XG5cblxuICAgIH1cbiAgICBhZGRGaWx0ZXJOZXdJdGVtKCkge1xuICAgICAgICB0aGlzLm9uQWRkRmlsdGVyTmV3SXRlbS5lbWl0KHRoaXMuZmlsdGVyKTtcbiAgICAgICAgdGhpcy5maWx0ZXJQaXBlID0gbmV3IExpc3RGaWx0ZXJQaXBlKHRoaXMuZHMpO1xuICAgICAgICB0aGlzLmZpbHRlclBpcGUudHJhbnNmb3JtKHRoaXMuZGF0YSwgdGhpcy5maWx0ZXIsIHRoaXMuc2V0dGluZ3Muc2VhcmNoQnkpO1xuICAgIH1cbiAgICBjYWxjdWxhdGVEcm9wZG93bkRpcmVjdGlvbigpIHtcbiAgICAgICAgbGV0IHNob3VsZE9wZW5Ub3dhcmRzVG9wID0gdGhpcy5zZXR0aW5ncy5wb3NpdGlvbiA9PSAndG9wJztcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b1Bvc2l0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBkcm9wZG93bkhlaWdodCA9IHRoaXMuZHJvcGRvd25MaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkTGlzdEJvdW5kcyA9IHRoaXMuc2VsZWN0ZWRMaXN0RWxlbS5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBzcGFjZU9uVG9wOiBudW1iZXIgPSBzZWxlY3RlZExpc3RCb3VuZHMudG9wO1xuICAgICAgICAgICAgY29uc3Qgc3BhY2VPbkJvdHRvbTogbnVtYmVyID0gdmlld3BvcnRIZWlnaHQgLSBzZWxlY3RlZExpc3RCb3VuZHMudG9wO1xuICAgICAgICAgICAgaWYgKHNwYWNlT25Cb3R0b20gPCBzcGFjZU9uVG9wICYmIGRyb3Bkb3duSGVpZ2h0IDwgc3BhY2VPblRvcCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlblRvd2FyZHNUb3AodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ub3dhcmRzVG9wKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEtlZXAgcHJlZmVyZW5jZSBpZiB0aGVyZSBpcyBub3QgZW5vdWdoIHNwYWNlIG9uIGVpdGhlciB0aGUgdG9wIG9yIGJvdHRvbVxuICAgICAgICAgICAgLyogXHRcdFx0aWYgKHNwYWNlT25Ub3AgfHwgc3BhY2VPbkJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaG91bGRPcGVuVG93YXJkc1RvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRPcGVuVG93YXJkc1RvcCA9IHNwYWNlT25Ub3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkT3BlblRvd2FyZHNUb3AgPSAhc3BhY2VPbkJvdHRvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICovXG4gICAgICAgIH1cblxuICAgIH1cbiAgICBvcGVuVG93YXJkc1RvcCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICBpZiAodmFsdWUgJiYgdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duTGlzdFlPZmZzZXQgPSAxNSArIHRoaXMuc2VsZWN0ZWRMaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25MaXN0WU9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xlYXJTZWxlY3Rpb24oZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcy5mb3JFYWNoKChvYmopID0+IHtcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhclNlYXJjaCgpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcbiAgICAgICAgdGhpcy5vbkRlU2VsZWN0QWxsLmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1zKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFZpcnR1YWxTY3JvbGxlck1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbQW5ndWxhck11bHRpU2VsZWN0LCBDbGlja091dHNpZGVEaXJlY3RpdmUsIFNjcm9sbERpcmVjdGl2ZSwgc3R5bGVEaXJlY3RpdmUsIExpc3RGaWx0ZXJQaXBlLCBJdGVtLCBUZW1wbGF0ZVJlbmRlcmVyLCBCYWRnZSwgU2VhcmNoLCBzZXRQb3NpdGlvbiwgQ0ljb25dLFxuICAgIGV4cG9ydHM6IFtBbmd1bGFyTXVsdGlTZWxlY3QsIENsaWNrT3V0c2lkZURpcmVjdGl2ZSwgU2Nyb2xsRGlyZWN0aXZlLCBzdHlsZURpcmVjdGl2ZSwgTGlzdEZpbHRlclBpcGUsIEl0ZW0sIFRlbXBsYXRlUmVuZGVyZXIsIEJhZGdlLCBTZWFyY2gsIHNldFBvc2l0aW9uLCBDSWNvbl0sXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJNdWx0aVNlbGVjdE1vZHVsZSB7IH1cbiJdfQ==
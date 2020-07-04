import * as tslib_1 from "tslib";
// angular
import { Component, forwardRef, HostBinding, Input, Output, EventEmitter, Renderer2, ViewChild, ViewChildren, ContentChildren, ContentChild, TemplateRef, QueryList } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, filter, map, first } from 'rxjs/operators';
// ng2-tag-input
import { TagInputAccessor } from '../../core/accessor';
import { listen } from '../../core/helpers/listen';
import * as constants from '../../core/constants';
import { DragProvider } from '../../core/providers/drag-provider';
import { TagInputForm } from '../tag-input-form/tag-input-form.component';
import { TagComponent } from '../tag/tag.component';
import { animations } from './animations';
import { defaults } from '../../defaults';
import { TagInputDropdown } from '../dropdown/tag-input-dropdown.component';
// angular universal hacks
/* tslint:disable-next-line */
const DragEvent = window.DragEvent;
const CUSTOM_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagInputComponent),
    multi: true
};
let TagInputComponent = class TagInputComponent extends TagInputAccessor {
    constructor(renderer, dragProvider) {
        super();
        this.renderer = renderer;
        this.dragProvider = dragProvider;
        /**
         * @name separatorKeys
         * @desc keyboard keys with which a user can separate items
         */
        this.separatorKeys = defaults.tagInput.separatorKeys;
        /**
         * @name separatorKeyCodes
         * @desc keyboard key codes with which a user can separate items
         */
        this.separatorKeyCodes = defaults.tagInput.separatorKeyCodes;
        /**
         * @name placeholder
         * @desc the placeholder of the input text
         */
        this.placeholder = defaults.tagInput.placeholder;
        /**
         * @name secondaryPlaceholder
         * @desc placeholder to appear when the input is empty
         */
        this.secondaryPlaceholder = defaults.tagInput.secondaryPlaceholder;
        /**
         * @name maxItems
         * @desc maximum number of items that can be added
         */
        this.maxItems = defaults.tagInput.maxItems;
        /**
         * @name validators
         * @desc array of Validators that are used to validate the tag before it gets appended to the list
         */
        this.validators = defaults.tagInput.validators;
        /**
         * @name asyncValidators
         * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
         */
        this.asyncValidators = defaults.tagInput.asyncValidators;
        /**
        * - if set to true, it will only possible to add items from the autocomplete
        * @name onlyFromAutocomplete
        */
        this.onlyFromAutocomplete = defaults.tagInput.onlyFromAutocomplete;
        /**
         * @name errorMessages
         */
        this.errorMessages = defaults.tagInput.errorMessages;
        /**
         * @name theme
         */
        this.theme = defaults.tagInput.theme;
        /**
         * @name onTextChangeDebounce
         */
        this.onTextChangeDebounce = defaults.tagInput.onTextChangeDebounce;
        /**
         * - custom id assigned to the input
         * @name id
         */
        this.inputId = defaults.tagInput.inputId;
        /**
         * - custom class assigned to the input
         */
        this.inputClass = defaults.tagInput.inputClass;
        /**
         * - option to clear text input when the form is blurred
         * @name clearOnBlur
         */
        this.clearOnBlur = defaults.tagInput.clearOnBlur;
        /**
         * - hideForm
         * @name clearOnBlur
         */
        this.hideForm = defaults.tagInput.hideForm;
        /**
         * @name addOnBlur
         */
        this.addOnBlur = defaults.tagInput.addOnBlur;
        /**
         * @name addOnPaste
         */
        this.addOnPaste = defaults.tagInput.addOnPaste;
        /**
         * - pattern used with the native method split() to separate patterns in the string pasted
         * @name pasteSplitPattern
         */
        this.pasteSplitPattern = defaults.tagInput.pasteSplitPattern;
        /**
         * @name blinkIfDupe
         */
        this.blinkIfDupe = defaults.tagInput.blinkIfDupe;
        /**
         * @name removable
         */
        this.removable = defaults.tagInput.removable;
        /**
         * @name editable
         */
        this.editable = defaults.tagInput.editable;
        /**
         * @name allowDupes
         */
        this.allowDupes = defaults.tagInput.allowDupes;
        /**
         * @description if set to true, the newly added tags will be added as strings, and not objects
         * @name modelAsStrings
         */
        this.modelAsStrings = defaults.tagInput.modelAsStrings;
        /**
         * @name trimTags
         */
        this.trimTags = defaults.tagInput.trimTags;
        /**
         * @name ripple
         */
        this.ripple = defaults.tagInput.ripple;
        /**
         * @name tabindex
         * @desc pass through the specified tabindex to the input
         */
        this.tabindex = defaults.tagInput.tabIndex;
        /**
         * @name disable
         */
        this.disable = defaults.tagInput.disable;
        /**
         * @name dragZone
         */
        this.dragZone = defaults.tagInput.dragZone;
        /**
         * @name onRemoving
         */
        this.onRemoving = defaults.tagInput.onRemoving;
        /**
         * @name onAdding
         */
        this.onAdding = defaults.tagInput.onAdding;
        /**
         * @name animationDuration
         */
        this.animationDuration = defaults.tagInput.animationDuration;
        /**
         * @name onAdd
         * @desc event emitted when adding a new item
         */
        this.onAdd = new EventEmitter();
        /**
         * @name onRemove
         * @desc event emitted when removing an existing item
         */
        this.onRemove = new EventEmitter();
        /**
         * @name onSelect
         * @desc event emitted when selecting an item
         */
        this.onSelect = new EventEmitter();
        /**
         * @name onFocus
         * @desc event emitted when the input is focused
         */
        this.onFocus = new EventEmitter();
        /**
         * @name onFocus
         * @desc event emitted when the input is blurred
         */
        this.onBlur = new EventEmitter();
        /**
         * @name onTextChange
         * @desc event emitted when the input value changes
         */
        this.onTextChange = new EventEmitter();
        /**
         * - output triggered when text is pasted in the form
         * @name onPaste
         */
        this.onPaste = new EventEmitter();
        /**
         * - output triggered when tag entered is not valid
         * @name onValidationError
         */
        this.onValidationError = new EventEmitter();
        /**
         * - output triggered when tag is edited
         * @name onTagEdited
         */
        this.onTagEdited = new EventEmitter();
        /**
         * @name isLoading
         */
        this.isLoading = false;
        /**
         * @name listeners
         * @desc array of events that get fired using @fireEvents
         */
        this.listeners = {
            [constants.KEYDOWN]: [],
            [constants.KEYUP]: []
        };
        /**
         * @description emitter for the 2-way data binding inputText value
         * @name inputTextChange
         */
        this.inputTextChange = new EventEmitter();
        /**
         * @description private variable to bind get/set
         * @name inputTextValue
         */
        this.inputTextValue = '';
        this.errors = [];
        /**
         * @name appendTag
         * @param tag {TagModel}
         */
        this.appendTag = (tag, index = this.items.length) => {
            const items = this.items;
            const model = this.modelAsStrings ? tag[this.identifyBy] : tag;
            this.items = [
                ...items.slice(0, index),
                model,
                ...items.slice(index, items.length)
            ];
        };
        /**
         * @name createTag
         * @param model
         */
        this.createTag = (model) => {
            const trim = (val, key) => {
                return typeof val === 'string' ? val.trim() : val[key];
            };
            return Object.assign({}, typeof model !== 'string' ? model : {}, { [this.displayBy]: this.trimTags ? trim(model, this.displayBy) : model, [this.identifyBy]: this.trimTags ? trim(model, this.identifyBy) : model });
        };
        /**
         *
         * @param tag
         * @param isFromAutocomplete
         */
        this.isTagValid = (tag, fromAutocomplete = false) => {
            const selectedItem = this.dropdown ? this.dropdown.selectedItem : undefined;
            const value = this.getItemDisplay(tag).trim();
            if (selectedItem && !fromAutocomplete || !value) {
                return false;
            }
            const dupe = this.findDupe(tag, fromAutocomplete);
            // if so, give a visual cue and return false
            if (!this.allowDupes && dupe && this.blinkIfDupe) {
                const model = this.tags.find(item => {
                    return this.getItemValue(item.model) === this.getItemValue(dupe);
                });
                if (model) {
                    model.blink();
                }
            }
            const isFromAutocomplete = fromAutocomplete && this.onlyFromAutocomplete;
            const assertions = [
                // 1. there must be no dupe OR dupes are allowed
                !dupe || this.allowDupes,
                // 2. check max items has not been reached
                !this.maxItemsReached,
                // 3. check item comes from autocomplete or onlyFromAutocomplete is false
                ((isFromAutocomplete) || !this.onlyFromAutocomplete)
            ];
            return assertions.filter(Boolean).length === assertions.length;
        };
        /**
         * @name onPasteCallback
         * @param data
         */
        this.onPasteCallback = (data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const getText = () => {
                const isIE = Boolean(window.clipboardData);
                const clipboardData = isIE ? (window.clipboardData) : data.clipboardData;
                const type = isIE ? 'Text' : 'text/plain';
                return clipboardData === null ? '' : clipboardData.getData(type) || '';
            };
            const text = getText();
            const requests = text
                .split(this.pasteSplitPattern)
                .map(item => {
                const tag = this.createTag(item);
                this.setInputValue(tag[this.displayBy]);
                return this.onAddingRequested(false, tag);
            });
            const resetInput = () => setTimeout(() => this.setInputValue(''), 50);
            Promise.all(requests).then(() => {
                this.onPaste.emit(text);
                resetInput();
            })
                .catch(resetInput);
        });
    }
    /**
     * @name inputText
     */
    get inputText() {
        return this.inputTextValue;
    }
    /**
     * @name inputText
     * @param text
     */
    set inputText(text) {
        this.inputTextValue = text;
        this.inputTextChange.emit(text);
    }
    /**
     * @desc removes the tab index if it is set - it will be passed through to the input
     * @name tabindexAttr
     */
    get tabindexAttr() {
        return this.tabindex !== '' ? '-1' : '';
    }
    /**
     * @name ngAfterViewInit
     */
    ngAfterViewInit() {
        // set up listeners
        this.setUpKeypressListeners();
        this.setupSeparatorKeysListener();
        this.setUpInputKeydownListeners();
        if (this.onTextChange.observers.length) {
            this.setUpTextChangeSubscriber();
        }
        // if clear on blur is set to true, subscribe to the event and clear the text's form
        if (this.clearOnBlur || this.addOnBlur) {
            this.setUpOnBlurSubscriber();
        }
        // if addOnPaste is set to true, register the handler and add items
        if (this.addOnPaste) {
            this.setUpOnPasteListener();
        }
        const statusChanges$ = this.inputForm.form.statusChanges;
        statusChanges$.pipe(filter((status) => status !== 'PENDING')).subscribe(() => {
            this.errors = this.inputForm.getErrorMessages(this.errorMessages);
        });
        this.isProgressBarVisible$ = statusChanges$.pipe(map((status) => {
            return status === 'PENDING' || this.isLoading;
        }));
        // if hideForm is set to true, remove the input
        if (this.hideForm) {
            this.inputForm.destroy();
        }
    }
    /**
     * @name ngOnInit
     */
    ngOnInit() {
        // if the number of items specified in the model is > of the value of maxItems
        // degrade gracefully and let the max number of items to be the number of items in the model
        // though, warn the user.
        const hasReachedMaxItems = this.maxItems !== undefined &&
            this.items &&
            this.items.length > this.maxItems;
        if (hasReachedMaxItems) {
            this.maxItems = this.items.length;
            console.warn(constants.MAX_ITEMS_WARNING);
        }
        // Setting editable to false to fix problem with tags in IE still being editable when
        // onlyFromAutocomplete is true
        this.editable = this.onlyFromAutocomplete ? false : this.editable;
        this.setAnimationMetadata();
    }
    /**
     * @name onRemoveRequested
     * @param tag
     * @param index
     */
    onRemoveRequested(tag, index) {
        return new Promise(resolve => {
            const subscribeFn = (model) => {
                this.removeItem(model, index);
                resolve(tag);
            };
            this.onRemoving ?
                this.onRemoving(tag)
                    .pipe(first())
                    .subscribe(subscribeFn) : subscribeFn(tag);
        });
    }
    /**
     * @name onAddingRequested
     * @param fromAutocomplete {boolean}
     * @param tag {TagModel}
     * @param index? {number}
     * @param giveupFocus? {boolean}
     */
    onAddingRequested(fromAutocomplete, tag, index, giveupFocus) {
        return new Promise((resolve, reject) => {
            const subscribeFn = (model) => {
                return this
                    .addItem(fromAutocomplete, model, index, giveupFocus)
                    .then(resolve)
                    .catch(reject);
            };
            return this.onAdding ?
                this.onAdding(tag)
                    .pipe(first())
                    .subscribe(subscribeFn, reject) : subscribeFn(tag);
        });
    }
    /**
     * @name selectItem
     * @desc selects item passed as parameter as the selected tag
     * @param item
     * @param emit
     */
    selectItem(item, emit = true) {
        const isReadonly = item && typeof item !== 'string' && item.readonly;
        if (isReadonly || this.selectedTag === item) {
            return;
        }
        this.selectedTag = item;
        if (emit) {
            this.onSelect.emit(item);
        }
    }
    /**
     * @name fireEvents
     * @desc goes through the list of the events for a given eventName, and fires each of them
     * @param eventName
     * @param $event
     */
    fireEvents(eventName, $event) {
        this.listeners[eventName].forEach(listener => listener.call(this, $event));
    }
    /**
     * @name handleKeydown
     * @desc handles action when the user hits a keyboard key
     * @param data
     */
    handleKeydown(data) {
        const event = data.event;
        const key = event.keyCode || event.which;
        const shiftKey = event.shiftKey || false;
        switch (constants.KEY_PRESS_ACTIONS[key]) {
            case constants.ACTIONS_KEYS.DELETE:
                if (this.selectedTag && this.removable) {
                    const index = this.items.indexOf(this.selectedTag);
                    this.onRemoveRequested(this.selectedTag, index);
                }
                break;
            case constants.ACTIONS_KEYS.SWITCH_PREV:
                this.moveToTag(data.model, constants.PREV);
                break;
            case constants.ACTIONS_KEYS.SWITCH_NEXT:
                this.moveToTag(data.model, constants.NEXT);
                break;
            case constants.ACTIONS_KEYS.TAB:
                if (shiftKey) {
                    if (this.isFirstTag(data.model)) {
                        return;
                    }
                    this.moveToTag(data.model, constants.PREV);
                }
                else {
                    if (this.isLastTag(data.model) && (this.disable || this.maxItemsReached)) {
                        return;
                    }
                    this.moveToTag(data.model, constants.NEXT);
                }
                break;
            default:
                return;
        }
        // prevent default behaviour
        event.preventDefault();
    }
    onFormSubmit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.onAddingRequested(false, this.formValue);
            }
            catch (_a) {
                return;
            }
        });
    }
    /**
     * @name setInputValue
     * @param value
     */
    setInputValue(value, emitEvent = true) {
        const control = this.getControl();
        // update form value with the transformed item
        control.setValue(value, { emitEvent });
    }
    /**
     * @name getControl
     */
    getControl() {
        return this.inputForm.value;
    }
    /**
     * @name focus
     * @param applyFocus
     * @param displayAutocomplete
     */
    focus(applyFocus = false, displayAutocomplete = false) {
        if (this.dragProvider.getState('dragging')) {
            return;
        }
        this.selectItem(undefined, false);
        if (applyFocus) {
            this.inputForm.focus();
            this.onFocus.emit(this.formValue);
        }
    }
    /**
     * @name blur
     */
    blur() {
        this.onTouched();
        this.onBlur.emit(this.formValue);
    }
    /**
     * @name hasErrors
     */
    hasErrors() {
        return !!this.inputForm && this.inputForm.hasErrors();
    }
    /**
     * @name isInputFocused
     */
    isInputFocused() {
        return !!this.inputForm && this.inputForm.isInputFocused();
    }
    /**
     * - this is the one way I found to tell if the template has been passed and it is not
     * the template for the menu item
     * @name hasCustomTemplate
     */
    hasCustomTemplate() {
        const template = this.templates ? this.templates.first : undefined;
        const menuTemplate = this.dropdown && this.dropdown.templates ?
            this.dropdown.templates.first : undefined;
        return Boolean(template && template !== menuTemplate);
    }
    /**
     * @name maxItemsReached
     */
    get maxItemsReached() {
        return this.maxItems !== undefined &&
            this.items.length >= this.maxItems;
    }
    /**
     * @name formValue
     */
    get formValue() {
        const form = this.inputForm.value;
        return form ? form.value : '';
    }
    /**3
     * @name onDragStarted
     * @param event
     * @param index
     */
    onDragStarted(event, tag, index) {
        event.stopPropagation();
        const item = { zone: this.dragZone, tag, index };
        this.dragProvider.setSender(this);
        this.dragProvider.setDraggedItem(event, item);
        this.dragProvider.setState({ dragging: true, index });
    }
    /**
     * @name onDragOver
     * @param event
     */
    onDragOver(event, index) {
        this.dragProvider.setState({ dropping: true });
        this.dragProvider.setReceiver(this);
        event.preventDefault();
    }
    /**
     * @name onTagDropped
     * @param event
     * @param index
     */
    onTagDropped(event, index) {
        const item = this.dragProvider.getDraggedItem(event);
        if (!item || item.zone !== this.dragZone) {
            return;
        }
        this.dragProvider.onTagDropped(item.tag, item.index, index);
        event.preventDefault();
        event.stopPropagation();
    }
    /**
     * @name isDropping
     */
    isDropping() {
        const isReceiver = this.dragProvider.receiver === this;
        const isDropping = this.dragProvider.getState('dropping');
        return Boolean(isReceiver && isDropping);
    }
    /**
     * @name onTagBlurred
     * @param changedElement {TagModel}
     * @param index {number}
     */
    onTagBlurred(changedElement, index) {
        this.items[index] = changedElement;
        this.blur();
    }
    /**
     * @name trackBy
     * @param items
     */
    trackBy(index, item) {
        return item[this.identifyBy];
    }
    /**
     * @name updateEditedTag
     * @param tag
     */
    updateEditedTag({ tag, index }) {
        this.onTagEdited.emit(tag);
    }
    /**
     * @name moveToTag
     * @param item
     * @param direction
     */
    moveToTag(item, direction) {
        const isLast = this.isLastTag(item);
        const isFirst = this.isFirstTag(item);
        const stopSwitch = (direction === constants.NEXT && isLast) ||
            (direction === constants.PREV && isFirst);
        if (stopSwitch) {
            this.focus(true);
            return;
        }
        const offset = direction === constants.NEXT ? 1 : -1;
        const index = this.getTagIndex(item) + offset;
        const tag = this.getTagAtIndex(index);
        return tag.select.call(tag);
    }
    /**
     * @name isFirstTag
     * @param item {TagModel}
     */
    isFirstTag(item) {
        return this.tags.first.model === item;
    }
    /**
     * @name isLastTag
     * @param item {TagModel}
     */
    isLastTag(item) {
        return this.tags.last.model === item;
    }
    /**
     * @name getTagIndex
     * @param item
     */
    getTagIndex(item) {
        const tags = this.tags.toArray();
        return tags.findIndex(tag => tag.model === item);
    }
    /**
     * @name getTagAtIndex
     * @param index
     */
    getTagAtIndex(index) {
        const tags = this.tags.toArray();
        return tags[index];
    }
    /**
     * @name removeItem
     * @desc removes an item from the array of the model
     * @param tag {TagModel}
     * @param index {number}
     */
    removeItem(tag, index) {
        this.items = this.getItemsWithout(index);
        // if the removed tag was selected, set it as undefined
        if (this.selectedTag === tag) {
            this.selectItem(undefined, false);
        }
        // focus input
        this.focus(true, false);
        // emit remove event
        this.onRemove.emit(tag);
    }
    /**
     * @name addItem
     * @desc adds the current text model to the items array
     * @param fromAutocomplete {boolean}
     * @param item {TagModel}
     * @param index? {number}
     * @param giveupFocus? {boolean}
     */
    addItem(fromAutocomplete = false, item, index, giveupFocus) {
        const display = this.getItemDisplay(item);
        const tag = this.createTag(item);
        if (fromAutocomplete) {
            this.setInputValue(this.getItemValue(item, true));
        }
        return new Promise((resolve, reject) => {
            /**
             * @name reset
             */
            const reset = () => {
                // reset control and focus input
                this.setInputValue('');
                if (giveupFocus) {
                    this.focus(false, false);
                }
                else {
                    // focus input
                    this.focus(true, false);
                }
                resolve(display);
            };
            const appendItem = () => {
                this.appendTag(tag, index);
                // emit event
                this.onAdd.emit(tag);
                if (!this.dropdown) {
                    return;
                }
                this.dropdown.hide();
                if (this.dropdown.showDropdownIfEmpty) {
                    this.dropdown.show();
                }
            };
            const status = this.inputForm.form.status;
            const isTagValid = this.isTagValid(tag, fromAutocomplete);
            const onValidationError = () => {
                this.onValidationError.emit(tag);
                return reject();
            };
            if (status === 'VALID' && isTagValid) {
                appendItem();
                return reset();
            }
            if (status === 'INVALID' || !isTagValid) {
                reset();
                return onValidationError();
            }
            if (status === 'PENDING') {
                const statusUpdate$ = this.inputForm.form.statusChanges;
                return statusUpdate$
                    .pipe(filter(statusUpdate => statusUpdate !== 'PENDING'), first())
                    .subscribe((statusUpdate) => {
                    if (statusUpdate === 'VALID' && isTagValid) {
                        appendItem();
                        return reset();
                    }
                    else {
                        reset();
                        return onValidationError();
                    }
                });
            }
        });
    }
    /**
     * @name setupSeparatorKeysListener
     */
    setupSeparatorKeysListener() {
        const useSeparatorKeys = this.separatorKeyCodes.length > 0 || this.separatorKeys.length > 0;
        const listener = ($event) => {
            const hasKeyCode = this.separatorKeyCodes.indexOf($event.keyCode) >= 0;
            const hasKey = this.separatorKeys.indexOf($event.key) >= 0;
            // the keyCode of keydown event is 229 when IME is processing the key event.
            const isIMEProcessing = $event.keyCode === 229;
            if (hasKeyCode || (hasKey && !isIMEProcessing)) {
                $event.preventDefault();
                this.onAddingRequested(false, this.formValue)
                    .catch(() => { });
            }
        };
        listen.call(this, constants.KEYDOWN, listener, useSeparatorKeys);
    }
    /**
     * @name setUpKeypressListeners
     */
    setUpKeypressListeners() {
        const listener = ($event) => {
            const isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;
            if (isCorrectKey &&
                !this.formValue &&
                this.items.length) {
                this.tags.last.select.call(this.tags.last);
            }
        };
        // setting up the keypress listeners
        listen.call(this, constants.KEYDOWN, listener);
    }
    /**
     * @name setUpKeydownListeners
     */
    setUpInputKeydownListeners() {
        this.inputForm.onKeydown.subscribe(event => {
            if (event.key === 'Backspace' && this.formValue.trim() === '') {
                event.preventDefault();
            }
        });
    }
    /**
     * @name setUpOnPasteListener
     */
    setUpOnPasteListener() {
        const input = this.inputForm.input.nativeElement;
        // attach listener to input
        this.renderer.listen(input, 'paste', (event) => {
            this.onPasteCallback(event);
            event.preventDefault();
            return true;
        });
    }
    /**
     * @name setUpTextChangeSubscriber
     */
    setUpTextChangeSubscriber() {
        this.inputForm.form
            .valueChanges
            .pipe(debounceTime(this.onTextChangeDebounce))
            .subscribe((value) => {
            this.onTextChange.emit(value.item);
        });
    }
    /**
     * @name setUpOnBlurSubscriber
     */
    setUpOnBlurSubscriber() {
        const filterFn = () => {
            const isVisible = this.dropdown && this.dropdown.isVisible;
            return !isVisible && !!this.formValue;
        };
        this.inputForm
            .onBlur
            .pipe(debounceTime(100), filter(filterFn))
            .subscribe(() => {
            const reset = () => this.setInputValue('');
            if (this.addOnBlur) {
                return this
                    .onAddingRequested(false, this.formValue, undefined, true)
                    .then(reset)
                    .catch(reset);
            }
            reset();
        });
    }
    /**
     * @name findDupe
     * @param tag
     * @param isFromAutocomplete
     */
    findDupe(tag, isFromAutocomplete) {
        const identifyBy = isFromAutocomplete ? this.dropdown.identifyBy : this.identifyBy;
        const id = tag[identifyBy];
        return this.items.find(item => this.getItemValue(item) === id);
    }
    /**
     * @name setAnimationMetadata
     */
    setAnimationMetadata() {
        this.animationMetadata = {
            value: 'in',
            params: Object.assign({}, this.animationDuration)
        };
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], TagInputComponent.prototype, "separatorKeys", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], TagInputComponent.prototype, "separatorKeyCodes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputComponent.prototype, "placeholder", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputComponent.prototype, "secondaryPlaceholder", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], TagInputComponent.prototype, "maxItems", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], TagInputComponent.prototype, "validators", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], TagInputComponent.prototype, "asyncValidators", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onlyFromAutocomplete", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "errorMessages", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputComponent.prototype, "theme", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onTextChangeDebounce", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "inputId", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputComponent.prototype, "inputClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TagInputComponent.prototype, "clearOnBlur", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TagInputComponent.prototype, "hideForm", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TagInputComponent.prototype, "addOnBlur", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TagInputComponent.prototype, "addOnPaste", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "pasteSplitPattern", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "blinkIfDupe", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "removable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TagInputComponent.prototype, "editable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "allowDupes", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "modelAsStrings", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "trimTags", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], TagInputComponent.prototype, "inputText", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TagInputComponent.prototype, "ripple", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputComponent.prototype, "tabindex", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], TagInputComponent.prototype, "disable", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], TagInputComponent.prototype, "dragZone", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onRemoving", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onAdding", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "animationDuration", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onAdd", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onRemove", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onSelect", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onFocus", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onBlur", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onTextChange", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onPaste", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onValidationError", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], TagInputComponent.prototype, "onTagEdited", void 0);
tslib_1.__decorate([
    ContentChild(TagInputDropdown, { static: false }),
    tslib_1.__metadata("design:type", TagInputDropdown)
], TagInputComponent.prototype, "dropdown", void 0);
tslib_1.__decorate([
    ContentChildren(TemplateRef, { descendants: false }),
    tslib_1.__metadata("design:type", QueryList)
], TagInputComponent.prototype, "templates", void 0);
tslib_1.__decorate([
    ViewChild(TagInputForm, { static: false }),
    tslib_1.__metadata("design:type", TagInputForm)
], TagInputComponent.prototype, "inputForm", void 0);
tslib_1.__decorate([
    ViewChildren(TagComponent),
    tslib_1.__metadata("design:type", QueryList)
], TagInputComponent.prototype, "tags", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], TagInputComponent.prototype, "inputTextChange", void 0);
tslib_1.__decorate([
    HostBinding('attr.tabindex'),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [])
], TagInputComponent.prototype, "tabindexAttr", null);
TagInputComponent = tslib_1.__decorate([
    Component({
        selector: 'tag-input',
        providers: [CUSTOM_ACCESSOR],
        template: "<div\n    [ngClass]=\"theme\"\n    class=\"ng2-tag-input\"\n    (click)=\"focus(true, false)\"\n    [attr.tabindex]=\"-1\"\n    (drop)=\"dragZone ? onTagDropped($event, undefined) : undefined\"\n    (dragenter)=\"dragZone ? onDragOver($event) : undefined\"\n    (dragover)=\"dragZone ? onDragOver($event) : undefined\"\n    (dragend)=\"dragZone ? dragProvider.onDragEnd() : undefined\"\n    [class.ng2-tag-input--dropping]=\"isDropping()\"\n    [class.ng2-tag-input--disabled]=\"disable\"\n    [class.ng2-tag-input--loading]=\"isLoading\"\n    [class.ng2-tag-input--invalid]=\"hasErrors()\"\n    [class.ng2-tag-input--focused]=\"isInputFocused()\"\n>\n\n    <!-- TAGS -->\n    <div class=\"ng2-tags-container\">\n        <tag\n            *ngFor=\"let item of items; let i = index; trackBy: trackBy\"\n            (onSelect)=\"selectItem(item)\"\n            (onRemove)=\"onRemoveRequested(item, i)\"\n            (onKeyDown)=\"handleKeydown($event)\"\n            (onTagEdited)=\"updateEditedTag($event)\"\n            (onBlur)=\"onTagBlurred($event, i)\"\n            draggable=\"{{ editable }}\"\n            (dragstart)=\"dragZone ? onDragStarted($event, item, i) : undefined\"\n            (drop)=\"dragZone ? onTagDropped($event, i) : undefined\"\n            (dragenter)=\"dragZone ? onDragOver($event) : undefined\"\n            (dragover)=\"dragZone ? onDragOver($event, i) : undefined\"\n            (dragleave)=\"dragZone ? dragProvider.onDragEnd() : undefined\"\n            [canAddTag]=\"isTagValid\"\n            [attr.tabindex]=\"0\"\n            [disabled]=\"disable\"\n            [@animation]=\"animationMetadata\"\n            [hasRipple]=\"ripple\"\n            [index]=\"i\"\n            [removable]=\"removable\"\n            [editable]=\"editable\"\n            [displayBy]=\"displayBy\"\n            [identifyBy]=\"identifyBy\"\n            [template]=\"!!hasCustomTemplate() ? templates.first : undefined\"\n            [draggable]=\"dragZone\"\n            [model]=\"item\"\n        >\n        </tag>\n\n        <tag-input-form\n            (onSubmit)=\"onFormSubmit()\"\n            (onBlur)=\"blur()\"\n            (click)=\"dropdown ? dropdown.show() : undefined\"\n            (onKeydown)=\"fireEvents('keydown', $event)\"\n            (onKeyup)=\"fireEvents('keyup', $event)\"\n            [(inputText)]=\"inputText\"\n            [disabled]=\"disable\"\n            [validators]=\"validators\"\n            [asyncValidators]=\"asyncValidators\"\n            [hidden]=\"maxItemsReached\"\n            [placeholder]=\"items.length ? placeholder : secondaryPlaceholder\"\n            [inputClass]=\"inputClass\"\n            [inputId]=\"inputId\"\n            [tabindex]=\"tabindex\"\n        >\n        </tag-input-form>\n    </div>\n\n    <div\n        class=\"progress-bar\"\n        *ngIf=\"isProgressBarVisible$ | async\"\n    ></div>\n</div>\n\n<!-- ERRORS -->\n<div\n    *ngIf=\"hasErrors()\"\n    [ngClass]=\"theme\"\n    class=\"error-messages\"\n>\n    <p\n        *ngFor=\"let error of errors\"\n        class=\"error-message\"\n    >\n        <span>{{ error }}</span>\n    </p>\n</div>\n<ng-content></ng-content>",
        animations,
        styles: [".dark tag:focus{box-shadow:0 0 0 1px #323232}.ng2-tag-input.bootstrap3-info{background-color:#fff;display:inline-block;color:#555;vertical-align:middle;max-width:100%;height:42px;line-height:44px}.ng2-tag-input.bootstrap3-info input{border:none;box-shadow:none;outline:0;background-color:transparent;padding:0 6px;margin:0;width:auto;max-width:inherit}.ng2-tag-input.bootstrap3-info .form-control input::-moz-placeholder{color:#777;opacity:1}.ng2-tag-input.bootstrap3-info .form-control input:-ms-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info .form-control input::-webkit-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info input:focus{border:none;box-shadow:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--focused{box-shadow:inset 0 1px 1px rgba(0,0,0,.4);border:1px solid #ccc}.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;transition:.25s;padding:.25rem 0;min-height:32px;cursor:text;border-bottom:2px solid #efefef}.ng2-tag-input:focus{outline:0}.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #2196f3}.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #f44336}.ng2-tag-input.ng2-tag-input--loading{border:none}.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.ng2-tag-input form{margin:.1em 0}.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.minimal.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:1px solid transparent}.minimal.ng2-tag-input:focus{outline:0}.minimal.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.minimal.ng2-tag-input.ng2-tag-input--loading{border:none}.minimal.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.minimal.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.dark.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:2px solid #444}.dark.ng2-tag-input:focus{outline:0}.dark.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.dark.ng2-tag-input.ng2-tag-input--loading{border:none}.dark.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.dark.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.bootstrap.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:2px solid #efefef}.bootstrap.ng2-tag-input:focus{outline:0}.bootstrap.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #0275d8}.bootstrap.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #d9534f}.bootstrap.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.bootstrap.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.bootstrap3-info.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;padding:4px;cursor:text;box-shadow:inset 0 1px 1px rgba(0,0,0,.075);border-radius:4px}.bootstrap3-info.ng2-tag-input:focus{outline:0}.bootstrap3-info.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap3-info.ng2-tag-input.ng2-tag-input--invalid{box-shadow:inset 0 1px 1px #d9534f;border-bottom:1px solid #d9534f}.bootstrap3-info.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.bootstrap3-info.ng2-tag-input form{margin:.1em 0}.bootstrap3-info.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.error-message{font-size:.8em;color:#f44336;margin:.5em 0 0}.bootstrap .error-message{color:#d9534f}.progress-bar,.progress-bar:before{height:2px;width:100%;margin:0}.progress-bar{background-color:#2196f3;display:flex;position:absolute;bottom:0}.progress-bar:before{background-color:#82c4f8;content:\"\";-webkit-animation:2s cubic-bezier(.4,0,.2,1) infinite running-progress;animation:2s cubic-bezier(.4,0,.2,1) infinite running-progress}@-webkit-keyframes running-progress{0%{margin-left:0;margin-right:100%}50%{margin-left:25%;margin-right:0}100%{margin-left:100%;margin-right:0}}@keyframes running-progress{0%{margin-left:0;margin-right:100%}50%{margin-left:25%;margin-right:0}100%{margin-left:100%;margin-right:0}}tag{display:flex;flex-direction:row;flex-wrap:wrap;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:400;font-size:1em;letter-spacing:.05rem;color:#444;border-radius:16px;transition:.3s;margin:.1rem .3rem .1rem 0;padding:.08rem .45rem;height:32px;line-height:34px;background:#efefef;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative}tag:not(.readonly):not(.tag--editing):focus{background:#2196f3;color:#fff;box-shadow:0 2px 3px 1px #d4d1d1}tag:not(.readonly):not(.tag--editing):active{background:#0d8aee;color:#fff;box-shadow:0 2px 3px 1px #d4d1d1}tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#e2e2e2;color:initial;box-shadow:0 2px 3px 1px #d4d1d1}tag.readonly{cursor:default}tag.readonly:focus,tag:focus{outline:0}tag.tag--editing{background-color:#fff;border:1px solid #ccc;cursor:text}.minimal tag{display:flex;flex-direction:row;flex-wrap:wrap;border-radius:0;background:#f9f9f9;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative}.minimal tag:not(.readonly):not(.tag--editing):active,.minimal tag:not(.readonly):not(.tag--editing):focus{background:#d0d0d0;color:initial}.minimal tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#ececec}.minimal tag.readonly{cursor:default}.minimal tag.readonly:focus,.minimal tag:focus{outline:0}.minimal tag.tag--editing{cursor:text}.dark tag{display:flex;flex-direction:row;flex-wrap:wrap;color:#f9f9f9;border-radius:3px;background:#444;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative}.dark tag:not(.readonly):not(.tag--editing):focus{background:#efefef;color:#444}.dark tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#2b2b2b;color:#f9f9f9}.dark tag.readonly{cursor:default}.dark tag.readonly:focus,.dark tag:focus{outline:0}.dark tag.tag--editing{cursor:text}.bootstrap tag{display:flex;flex-direction:row;flex-wrap:wrap;color:#f9f9f9;border-radius:.25rem;background:#0275d8;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative}.bootstrap tag:not(.readonly):not(.tag--editing):active,.bootstrap tag:not(.readonly):not(.tag--editing):focus{background:#025aa5}.bootstrap tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#0267bf;color:#f9f9f9}.bootstrap tag.readonly{cursor:default}.bootstrap tag.readonly:focus,.bootstrap tag:focus{outline:0}.bootstrap tag.tag--editing{cursor:text}.bootstrap3-info tag{display:flex;flex-direction:row;flex-wrap:wrap;font-family:inherit;font-weight:400;font-size:95%;color:#fff;border-radius:.25em;background:#5bc0de;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative;padding:.25em .6em;text-align:center;white-space:nowrap}.bootstrap3-info tag:not(.readonly):not(.tag--editing):active,.bootstrap3-info tag:not(.readonly):not(.tag--editing):focus{background:#28a1c5}.bootstrap3-info tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#46b8da;color:#fff}.bootstrap3-info tag.readonly{cursor:default}.bootstrap3-info tag.readonly:focus,.bootstrap3-info tag:focus{outline:0}.bootstrap3-info tag.tag--editing{cursor:text}:host{display:block}"]
    }),
    tslib_1.__metadata("design:paramtypes", [Renderer2,
        DragProvider])
], TagInputComponent);
export { TagInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWNoaXBzLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy90YWctaW5wdXQvdGFnLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUNILFNBQVMsRUFDVCxVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixZQUFZLEVBRVosV0FBVyxFQUNYLFNBQVMsRUFFWixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBR0gsaUJBQWlCLEVBRXBCLE1BQU0sZ0JBQWdCLENBQUM7QUFJeEIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxFLGdCQUFnQjtBQUNoQixPQUFPLEVBQUUsZ0JBQWdCLEVBQVksTUFBTSxxQkFBcUIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbkQsT0FBTyxLQUFLLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsWUFBWSxFQUFjLE1BQU0sb0NBQW9DLENBQUM7QUFFOUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUU1RSwwQkFBMEI7QUFDMUIsOEJBQThCO0FBQzlCLE1BQU0sU0FBUyxHQUFJLE1BQWMsQ0FBQyxTQUFTLENBQUM7QUFFNUMsTUFB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QUN4QyxVQUFVOztLQUNiLENBQUM7NkNBeVR5QyxTQUFTO1FBQ2QsWUFBWTtHQXpUckMsaUJBQWlCLENBc2tDN0I7U0F0a0NZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFuZ3VsYXJcbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIGZvcndhcmRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBSZW5kZXJlcjIsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgQ29udGVudENoaWxkLFxuICAgIE9uSW5pdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBRdWVyeUxpc3QsXG4gICAgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgICBBc3luY1ZhbGlkYXRvckZuLFxuICAgIEZvcm1Db250cm9sLFxuICAgIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIFZhbGlkYXRvckZuXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLy8gcnhcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZmlsdGVyLCBtYXAsIGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vLyBuZzItdGFnLWlucHV0XG5pbXBvcnQgeyBUYWdJbnB1dEFjY2Vzc29yLCBUYWdNb2RlbCB9IGZyb20gJy4uLy4uL2NvcmUvYWNjZXNzb3InO1xuaW1wb3J0IHsgbGlzdGVuIH0gZnJvbSAnLi4vLi4vY29yZS9oZWxwZXJzL2xpc3Rlbic7XG5pbXBvcnQgKiBhcyBjb25zdGFudHMgZnJvbSAnLi4vLi4vY29yZS9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBEcmFnUHJvdmlkZXIsIERyYWdnZWRUYWcgfSBmcm9tICcuLi8uLi9jb3JlL3Byb3ZpZGVycy9kcmFnLXByb3ZpZGVyJztcblxuaW1wb3J0IHsgVGFnSW5wdXRGb3JtIH0gZnJvbSAnLi4vdGFnLWlucHV0LWZvcm0vdGFnLWlucHV0LWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4uL3RhZy90YWcuY29tcG9uZW50JztcblxuaW1wb3J0IHsgYW5pbWF0aW9ucyB9IGZyb20gJy4vYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uLy4uL2RlZmF1bHRzJztcbmltcG9ydCB7IFRhZ0lucHV0RHJvcGRvd24gfSBmcm9tICcuLi9kcm9wZG93bi90YWctaW5wdXQtZHJvcGRvd24uY29tcG9uZW50JztcblxuLy8gYW5ndWxhciB1bml2ZXJzYWwgaGFja3Ncbi8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSAqL1xuY29uc3QgRHJhZ0V2ZW50ID0gKHdpbmRvdyBhcyBhbnkpLkRyYWdFdmVudDtcblxuY29uc3QgQ1VTVE9NX0FDQ0VTU09SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFRhZ0lucHV0Q29tcG9uZW50KSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGFnLWlucHV0JyxcbiAgICBwcm92aWRlcnM6IFtDVVNUT01fQUNDRVNTT1JdLFxuICAgIHN0eWxlVXJsczogWycuL3RhZy1pbnB1dC5zdHlsZS5zY3NzJ10sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3RhZy1pbnB1dC50ZW1wbGF0ZS5odG1sJyxcbiAgICBhbmltYXRpb25zXG59KVxuZXhwb3J0IGNsYXNzIFRhZ0lucHV0Q29tcG9uZW50IGV4dGVuZHMgVGFnSW5wdXRBY2Nlc3NvciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgLyoqXG4gICAgICogQG5hbWUgc2VwYXJhdG9yS2V5c1xuICAgICAqIEBkZXNjIGtleWJvYXJkIGtleXMgd2l0aCB3aGljaCBhIHVzZXIgY2FuIHNlcGFyYXRlIGl0ZW1zXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHNlcGFyYXRvcktleXM6IHN0cmluZ1tdID0gZGVmYXVsdHMudGFnSW5wdXQuc2VwYXJhdG9yS2V5cztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlcGFyYXRvcktleUNvZGVzXG4gICAgICogQGRlc2Mga2V5Ym9hcmQga2V5IGNvZGVzIHdpdGggd2hpY2ggYSB1c2VyIGNhbiBzZXBhcmF0ZSBpdGVtc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBzZXBhcmF0b3JLZXlDb2RlczogbnVtYmVyW10gPSBkZWZhdWx0cy50YWdJbnB1dC5zZXBhcmF0b3JLZXlDb2RlcztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHBsYWNlaG9sZGVyXG4gICAgICogQGRlc2MgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dCB0ZXh0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5wbGFjZWhvbGRlcjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlY29uZGFyeVBsYWNlaG9sZGVyXG4gICAgICogQGRlc2MgcGxhY2Vob2xkZXIgdG8gYXBwZWFyIHdoZW4gdGhlIGlucHV0IGlzIGVtcHR5XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHNlY29uZGFyeVBsYWNlaG9sZGVyOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5zZWNvbmRhcnlQbGFjZWhvbGRlcjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG1heEl0ZW1zXG4gICAgICogQGRlc2MgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdGhhdCBjYW4gYmUgYWRkZWRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgbWF4SXRlbXM6IG51bWJlciA9IGRlZmF1bHRzLnRhZ0lucHV0Lm1heEl0ZW1zO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdmFsaWRhdG9yc1xuICAgICAqIEBkZXNjIGFycmF5IG9mIFZhbGlkYXRvcnMgdGhhdCBhcmUgdXNlZCB0byB2YWxpZGF0ZSB0aGUgdGFnIGJlZm9yZSBpdCBnZXRzIGFwcGVuZGVkIHRvIHRoZSBsaXN0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBkZWZhdWx0cy50YWdJbnB1dC52YWxpZGF0b3JzO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYXN5bmNWYWxpZGF0b3JzXG4gICAgICogQGRlc2MgYXJyYXkgb2YgQXN5bmNWYWxpZGF0b3IgdGhhdCBhcmUgdXNlZCB0byB2YWxpZGF0ZSB0aGUgdGFnIGJlZm9yZSBpdCBnZXRzIGFwcGVuZGVkIHRvIHRoZSBsaXN0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGFzeW5jVmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbltdID0gZGVmYXVsdHMudGFnSW5wdXQuYXN5bmNWYWxpZGF0b3JzO1xuXG4gICAgLyoqXG4gICAgKiAtIGlmIHNldCB0byB0cnVlLCBpdCB3aWxsIG9ubHkgcG9zc2libGUgdG8gYWRkIGl0ZW1zIGZyb20gdGhlIGF1dG9jb21wbGV0ZVxuICAgICogQG5hbWUgb25seUZyb21BdXRvY29tcGxldGVcbiAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBvbmx5RnJvbUF1dG9jb21wbGV0ZSA9IGRlZmF1bHRzLnRhZ0lucHV0Lm9ubHlGcm9tQXV0b2NvbXBsZXRlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZXJyb3JNZXNzYWdlc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBlcnJvck1lc3NhZ2VzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0gZGVmYXVsdHMudGFnSW5wdXQuZXJyb3JNZXNzYWdlcztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRoZW1lXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHRoZW1lOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC50aGVtZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uVGV4dENoYW5nZURlYm91bmNlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIG9uVGV4dENoYW5nZURlYm91bmNlID0gZGVmYXVsdHMudGFnSW5wdXQub25UZXh0Q2hhbmdlRGVib3VuY2U7XG5cbiAgICAvKipcbiAgICAgKiAtIGN1c3RvbSBpZCBhc3NpZ25lZCB0byB0aGUgaW5wdXRcbiAgICAgKiBAbmFtZSBpZFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBpbnB1dElkID0gZGVmYXVsdHMudGFnSW5wdXQuaW5wdXRJZDtcblxuICAgIC8qKlxuICAgICAqIC0gY3VzdG9tIGNsYXNzIGFzc2lnbmVkIHRvIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBpbnB1dENsYXNzOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5pbnB1dENsYXNzO1xuXG4gICAgLyoqXG4gICAgICogLSBvcHRpb24gdG8gY2xlYXIgdGV4dCBpbnB1dCB3aGVuIHRoZSBmb3JtIGlzIGJsdXJyZWRcbiAgICAgKiBAbmFtZSBjbGVhck9uQmx1clxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBjbGVhck9uQmx1cjogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmNsZWFyT25CbHVyO1xuXG4gICAgLyoqXG4gICAgICogLSBoaWRlRm9ybVxuICAgICAqIEBuYW1lIGNsZWFyT25CbHVyXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGhpZGVGb3JtOiBib29sZWFuID0gZGVmYXVsdHMudGFnSW5wdXQuaGlkZUZvcm07XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhZGRPbkJsdXJcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgYWRkT25CbHVyOiBib29sZWFuID0gZGVmYXVsdHMudGFnSW5wdXQuYWRkT25CbHVyO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYWRkT25QYXN0ZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBhZGRPblBhc3RlOiBib29sZWFuID0gZGVmYXVsdHMudGFnSW5wdXQuYWRkT25QYXN0ZTtcblxuICAgIC8qKlxuICAgICAqIC0gcGF0dGVybiB1c2VkIHdpdGggdGhlIG5hdGl2ZSBtZXRob2Qgc3BsaXQoKSB0byBzZXBhcmF0ZSBwYXR0ZXJucyBpbiB0aGUgc3RyaW5nIHBhc3RlZFxuICAgICAqIEBuYW1lIHBhc3RlU3BsaXRQYXR0ZXJuXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHBhc3RlU3BsaXRQYXR0ZXJuID0gZGVmYXVsdHMudGFnSW5wdXQucGFzdGVTcGxpdFBhdHRlcm47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBibGlua0lmRHVwZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBibGlua0lmRHVwZSA9IGRlZmF1bHRzLnRhZ0lucHV0LmJsaW5rSWZEdXBlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmVtb3ZhYmxlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHJlbW92YWJsZSA9IGRlZmF1bHRzLnRhZ0lucHV0LnJlbW92YWJsZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGVkaXRhYmxlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGVkaXRhYmxlOiBib29sZWFuID0gZGVmYXVsdHMudGFnSW5wdXQuZWRpdGFibGU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbGxvd0R1cGVzXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGFsbG93RHVwZXMgPSBkZWZhdWx0cy50YWdJbnB1dC5hbGxvd0R1cGVzO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIGlmIHNldCB0byB0cnVlLCB0aGUgbmV3bHkgYWRkZWQgdGFncyB3aWxsIGJlIGFkZGVkIGFzIHN0cmluZ3MsIGFuZCBub3Qgb2JqZWN0c1xuICAgICAqIEBuYW1lIG1vZGVsQXNTdHJpbmdzXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIG1vZGVsQXNTdHJpbmdzID0gZGVmYXVsdHMudGFnSW5wdXQubW9kZWxBc1N0cmluZ3M7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB0cmltVGFnc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyB0cmltVGFncyA9IGRlZmF1bHRzLnRhZ0lucHV0LnRyaW1UYWdzO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaW5wdXRUZXh0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGdldCBpbnB1dFRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRUZXh0VmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmlwcGxlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHJpcHBsZTogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LnJpcHBsZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRhYmluZGV4XG4gICAgICogQGRlc2MgcGFzcyB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgdGFiaW5kZXggdG8gdGhlIGlucHV0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHRhYmluZGV4OiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC50YWJJbmRleDtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRpc2FibGVcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgZGlzYWJsZTogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmRpc2FibGU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkcmFnWm9uZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBkcmFnWm9uZTogc3RyaW5nID0gZGVmYXVsdHMudGFnSW5wdXQuZHJhZ1pvbmU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblJlbW92aW5nXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIG9uUmVtb3ZpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5vblJlbW92aW5nO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25BZGRpbmdcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgb25BZGRpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5vbkFkZGluZztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFuaW1hdGlvbkR1cmF0aW9uXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGFuaW1hdGlvbkR1cmF0aW9uID0gZGVmYXVsdHMudGFnSW5wdXQuYW5pbWF0aW9uRHVyYXRpb247XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbkFkZFxuICAgICAqIEBkZXNjIGV2ZW50IGVtaXR0ZWQgd2hlbiBhZGRpbmcgYSBuZXcgaXRlbVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25BZGQgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25SZW1vdmVcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gcmVtb3ZpbmcgYW4gZXhpc3RpbmcgaXRlbVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25SZW1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25TZWxlY3RcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gc2VsZWN0aW5nIGFuIGl0ZW1cbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uRm9jdXNcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGlucHV0IGlzIGZvY3VzZWRcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uRm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uRm9jdXNcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGlucHV0IGlzIGJsdXJyZWRcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uQmx1ciA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25UZXh0Q2hhbmdlXG4gICAgICogQGRlc2MgZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBpbnB1dCB2YWx1ZSBjaGFuZ2VzXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblRleHRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogLSBvdXRwdXQgdHJpZ2dlcmVkIHdoZW4gdGV4dCBpcyBwYXN0ZWQgaW4gdGhlIGZvcm1cbiAgICAgKiBAbmFtZSBvblBhc3RlXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblBhc3RlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICAvKipcbiAgICAgKiAtIG91dHB1dCB0cmlnZ2VyZWQgd2hlbiB0YWcgZW50ZXJlZCBpcyBub3QgdmFsaWRcbiAgICAgKiBAbmFtZSBvblZhbGlkYXRpb25FcnJvclxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25WYWxpZGF0aW9uRXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogLSBvdXRwdXQgdHJpZ2dlcmVkIHdoZW4gdGFnIGlzIGVkaXRlZFxuICAgICAqIEBuYW1lIG9uVGFnRWRpdGVkXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblRhZ0VkaXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkcm9wZG93blxuICAgICAqL1xuICAgIC8vIEBDb250ZW50Q2hpbGQoZm9yd2FyZFJlZigoKSA9PiBUYWdJbnB1dERyb3Bkb3duKSwge3N0YXRpYzogdHJ1ZX0pIGRyb3Bkb3duOiBUYWdJbnB1dERyb3Bkb3duO1xuICAgIEBDb250ZW50Q2hpbGQoVGFnSW5wdXREcm9wZG93biwgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyBkcm9wZG93bjogVGFnSW5wdXREcm9wZG93bjtcbiAgICAvKipcbiAgICAgKiBAbmFtZSB0ZW1wbGF0ZVxuICAgICAqIEBkZXNjIHJlZmVyZW5jZSB0byB0aGUgdGVtcGxhdGUgaWYgcHJvdmlkZWQgYnkgdGhlIHVzZXJcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKFRlbXBsYXRlUmVmLCB7IGRlc2NlbmRhbnRzOiBmYWxzZSB9KSBwdWJsaWMgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dEZvcm1cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKFRhZ0lucHV0Rm9ybSwgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyBpbnB1dEZvcm06IFRhZ0lucHV0Rm9ybTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlbGVjdGVkVGFnXG4gICAgICogQGRlc2MgcmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IHNlbGVjdGVkIHRhZ1xuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RlZFRhZzogVGFnTW9kZWwgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpc0xvYWRpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNMb2FkaW5nID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dFRleHRcbiAgICAgKiBAcGFyYW0gdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgaW5wdXRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmlucHV0VGV4dFZhbHVlID0gdGV4dDtcbiAgICAgICAgdGhpcy5pbnB1dFRleHRDaGFuZ2UuZW1pdCh0ZXh0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB0YWdzXG4gICAgICogQGRlc2MgbGlzdCBvZiBFbGVtZW50IGl0ZW1zXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbihUYWdDb21wb25lbnQpIHB1YmxpYyB0YWdzOiBRdWVyeUxpc3Q8VGFnQ29tcG9uZW50PjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGxpc3RlbmVyc1xuICAgICAqIEBkZXNjIGFycmF5IG9mIGV2ZW50cyB0aGF0IGdldCBmaXJlZCB1c2luZyBAZmlyZUV2ZW50c1xuICAgICAqL1xuICAgIHByaXZhdGUgbGlzdGVuZXJzID0ge1xuICAgICAgICBbY29uc3RhbnRzLktFWURPV05dOiA8eyAoZnVuKTogYW55IH1bXT5bXSxcbiAgICAgICAgW2NvbnN0YW50cy5LRVlVUF06IDx7IChmdW4pOiBhbnkgfVtdPltdXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBlbWl0dGVyIGZvciB0aGUgMi13YXkgZGF0YSBiaW5kaW5nIGlucHV0VGV4dCB2YWx1ZVxuICAgICAqIEBuYW1lIGlucHV0VGV4dENoYW5nZVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgaW5wdXRUZXh0Q2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBwcml2YXRlIHZhcmlhYmxlIHRvIGJpbmQgZ2V0L3NldFxuICAgICAqIEBuYW1lIGlucHV0VGV4dFZhbHVlXG4gICAgICovXG4gICAgcHVibGljIGlucHV0VGV4dFZhbHVlID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzYyByZW1vdmVzIHRoZSB0YWIgaW5kZXggaWYgaXQgaXMgc2V0IC0gaXQgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaCB0byB0aGUgaW5wdXRcbiAgICAgKiBAbmFtZSB0YWJpbmRleEF0dHJcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIudGFiaW5kZXgnKVxuICAgIHB1YmxpYyBnZXQgdGFiaW5kZXhBdHRyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhYmluZGV4ICE9PSAnJyA/ICctMScgOiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbmltYXRpb25NZXRhZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBhbmltYXRpb25NZXRhZGF0YTogeyB2YWx1ZTogc3RyaW5nLCBwYXJhbXM6IG9iamVjdCB9O1xuXG4gICAgcHVibGljIGVycm9yczogc3RyaW5nW10gPSBbXTtcblxuICAgIHB1YmxpYyBpc1Byb2dyZXNzQmFyVmlzaWJsZSQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBkcmFnUHJvdmlkZXI6IERyYWdQcm92aWRlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG5nQWZ0ZXJWaWV3SW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIHNldCB1cCBsaXN0ZW5lcnNcblxuICAgICAgICB0aGlzLnNldFVwS2V5cHJlc3NMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5zZXR1cFNlcGFyYXRvcktleXNMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnNldFVwSW5wdXRLZXlkb3duTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub25UZXh0Q2hhbmdlLm9ic2VydmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VXBUZXh0Q2hhbmdlU3Vic2NyaWJlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgY2xlYXIgb24gYmx1ciBpcyBzZXQgdG8gdHJ1ZSwgc3Vic2NyaWJlIHRvIHRoZSBldmVudCBhbmQgY2xlYXIgdGhlIHRleHQncyBmb3JtXG4gICAgICAgIGlmICh0aGlzLmNsZWFyT25CbHVyIHx8IHRoaXMuYWRkT25CbHVyKSB7XG4gICAgICAgICAgICB0aGlzLnNldFVwT25CbHVyU3Vic2NyaWJlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYWRkT25QYXN0ZSBpcyBzZXQgdG8gdHJ1ZSwgcmVnaXN0ZXIgdGhlIGhhbmRsZXIgYW5kIGFkZCBpdGVtc1xuICAgICAgICBpZiAodGhpcy5hZGRPblBhc3RlKSB7XG4gICAgICAgICAgICB0aGlzLnNldFVwT25QYXN0ZUxpc3RlbmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0dXNDaGFuZ2VzJCA9IHRoaXMuaW5wdXRGb3JtLmZvcm0uc3RhdHVzQ2hhbmdlcztcblxuICAgICAgICBzdGF0dXNDaGFuZ2VzJC5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKChzdGF0dXM6IHN0cmluZykgPT4gc3RhdHVzICE9PSAnUEVORElORycpXG4gICAgICAgICkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gdGhpcy5pbnB1dEZvcm0uZ2V0RXJyb3JNZXNzYWdlcyh0aGlzLmVycm9yTWVzc2FnZXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlzUHJvZ3Jlc3NCYXJWaXNpYmxlJCA9IHN0YXR1c0NoYW5nZXMkLnBpcGUoXG4gICAgICAgICAgICBtYXAoKHN0YXR1czogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXR1cyA9PT0gJ1BFTkRJTkcnIHx8IHRoaXMuaXNMb2FkaW5nO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBpZiBoaWRlRm9ybSBpcyBzZXQgdG8gdHJ1ZSwgcmVtb3ZlIHRoZSBpbnB1dFxuICAgICAgICBpZiAodGhpcy5oaWRlRm9ybSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEZvcm0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgbmdPbkluaXRcbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIGlmIHRoZSBudW1iZXIgb2YgaXRlbXMgc3BlY2lmaWVkIGluIHRoZSBtb2RlbCBpcyA+IG9mIHRoZSB2YWx1ZSBvZiBtYXhJdGVtc1xuICAgICAgICAvLyBkZWdyYWRlIGdyYWNlZnVsbHkgYW5kIGxldCB0aGUgbWF4IG51bWJlciBvZiBpdGVtcyB0byBiZSB0aGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBtb2RlbFxuICAgICAgICAvLyB0aG91Z2gsIHdhcm4gdGhlIHVzZXIuXG4gICAgICAgIGNvbnN0IGhhc1JlYWNoZWRNYXhJdGVtcyA9IHRoaXMubWF4SXRlbXMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdGhpcy5pdGVtcyAmJlxuICAgICAgICAgICAgdGhpcy5pdGVtcy5sZW5ndGggPiB0aGlzLm1heEl0ZW1zO1xuXG4gICAgICAgIGlmIChoYXNSZWFjaGVkTWF4SXRlbXMpIHtcbiAgICAgICAgICAgIHRoaXMubWF4SXRlbXMgPSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybihjb25zdGFudHMuTUFYX0lURU1TX1dBUk5JTkcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0dGluZyBlZGl0YWJsZSB0byBmYWxzZSB0byBmaXggcHJvYmxlbSB3aXRoIHRhZ3MgaW4gSUUgc3RpbGwgYmVpbmcgZWRpdGFibGUgd2hlblxuICAgICAgICAvLyBvbmx5RnJvbUF1dG9jb21wbGV0ZSBpcyB0cnVlXG4gICAgICAgIHRoaXMuZWRpdGFibGUgPSB0aGlzLm9ubHlGcm9tQXV0b2NvbXBsZXRlID8gZmFsc2UgOiB0aGlzLmVkaXRhYmxlO1xuXG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uTWV0YWRhdGEoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblJlbW92ZVJlcXVlc3RlZFxuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwdWJsaWMgb25SZW1vdmVSZXF1ZXN0ZWQodGFnOiBUYWdNb2RlbCwgaW5kZXg6IG51bWJlcik6IFByb21pc2U8VGFnTW9kZWw+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaWJlRm4gPSAobW9kZWw6IFRhZ01vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtKG1vZGVsLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0YWcpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5vblJlbW92aW5nID9cbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3ZpbmcodGFnKVxuICAgICAgICAgICAgICAgICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHN1YnNjcmliZUZuKSA6IHN1YnNjcmliZUZuKHRhZyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uQWRkaW5nUmVxdWVzdGVkXG4gICAgICogQHBhcmFtIGZyb21BdXRvY29tcGxldGUge2Jvb2xlYW59XG4gICAgICogQHBhcmFtIHRhZyB7VGFnTW9kZWx9XG4gICAgICogQHBhcmFtIGluZGV4PyB7bnVtYmVyfVxuICAgICAqIEBwYXJhbSBnaXZldXBGb2N1cz8ge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHVibGljIG9uQWRkaW5nUmVxdWVzdGVkKGZyb21BdXRvY29tcGxldGU6IGJvb2xlYW4sIHRhZzogVGFnTW9kZWwsXG4gICAgICAgIGluZGV4PzogbnVtYmVyLCBnaXZldXBGb2N1cz86IGJvb2xlYW4pOiBQcm9taXNlPFRhZ01vZGVsPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVGbiA9IChtb2RlbDogVGFnTW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgICAgICAuYWRkSXRlbShmcm9tQXV0b2NvbXBsZXRlLCBtb2RlbCwgaW5kZXgsIGdpdmV1cEZvY3VzKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uQWRkaW5nID9cbiAgICAgICAgICAgICAgICB0aGlzLm9uQWRkaW5nKHRhZylcbiAgICAgICAgICAgICAgICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShzdWJzY3JpYmVGbiwgcmVqZWN0KSA6IHN1YnNjcmliZUZuKHRhZyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFwcGVuZFRhZ1xuICAgICAqIEBwYXJhbSB0YWcge1RhZ01vZGVsfVxuICAgICAqL1xuICAgIHB1YmxpYyBhcHBlbmRUYWcgPSAodGFnOiBUYWdNb2RlbCwgaW5kZXggPSB0aGlzLml0ZW1zLmxlbmd0aCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy5tb2RlbEFzU3RyaW5ncyA/IHRhZ1t0aGlzLmlkZW50aWZ5QnldIDogdGFnO1xuXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXG4gICAgICAgICAgICAuLi5pdGVtcy5zbGljZSgwLCBpbmRleCksXG4gICAgICAgICAgICBtb2RlbCxcbiAgICAgICAgICAgIC4uLml0ZW1zLnNsaWNlKGluZGV4LCBpdGVtcy5sZW5ndGgpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgY3JlYXRlVGFnXG4gICAgICogQHBhcmFtIG1vZGVsXG4gICAgICovXG4gICAgcHVibGljIGNyZWF0ZVRhZyA9IChtb2RlbDogVGFnTW9kZWwpOiBUYWdNb2RlbCA9PiB7XG4gICAgICAgIGNvbnN0IHRyaW0gPSAodmFsOiBUYWdNb2RlbCwga2V5OiBzdHJpbmcpOiBUYWdNb2RlbCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyB2YWwudHJpbSgpIDogdmFsW2tleV07XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnR5cGVvZiBtb2RlbCAhPT0gJ3N0cmluZycgPyBtb2RlbCA6IHt9LFxuICAgICAgICAgICAgW3RoaXMuZGlzcGxheUJ5XTogdGhpcy50cmltVGFncyA/IHRyaW0obW9kZWwsIHRoaXMuZGlzcGxheUJ5KSA6IG1vZGVsLFxuICAgICAgICAgICAgW3RoaXMuaWRlbnRpZnlCeV06IHRoaXMudHJpbVRhZ3MgPyB0cmltKG1vZGVsLCB0aGlzLmlkZW50aWZ5QnkpIDogbW9kZWxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZWxlY3RJdGVtXG4gICAgICogQGRlc2Mgc2VsZWN0cyBpdGVtIHBhc3NlZCBhcyBwYXJhbWV0ZXIgYXMgdGhlIHNlbGVjdGVkIHRhZ1xuICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICogQHBhcmFtIGVtaXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2VsZWN0SXRlbShpdGVtOiBUYWdNb2RlbCB8IHVuZGVmaW5lZCwgZW1pdCA9IHRydWUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaXNSZWFkb25seSA9IGl0ZW0gJiYgdHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnICYmIGl0ZW0ucmVhZG9ubHk7XG5cbiAgICAgICAgaWYgKGlzUmVhZG9ubHkgfHwgdGhpcy5zZWxlY3RlZFRhZyA9PT0gaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhZyA9IGl0ZW07XG5cbiAgICAgICAgaWYgKGVtaXQpIHtcbiAgICAgICAgICAgIHRoaXMub25TZWxlY3QuZW1pdChpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGZpcmVFdmVudHNcbiAgICAgKiBAZGVzYyBnb2VzIHRocm91Z2ggdGhlIGxpc3Qgb2YgdGhlIGV2ZW50cyBmb3IgYSBnaXZlbiBldmVudE5hbWUsIGFuZCBmaXJlcyBlYWNoIG9mIHRoZW1cbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lXG4gICAgICogQHBhcmFtICRldmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBmaXJlRXZlbnRzKGV2ZW50TmFtZTogc3RyaW5nLCAkZXZlbnQ/KTogdm9pZCB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0uZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lci5jYWxsKHRoaXMsICRldmVudCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGhhbmRsZUtleWRvd25cbiAgICAgKiBAZGVzYyBoYW5kbGVzIGFjdGlvbiB3aGVuIHRoZSB1c2VyIGhpdHMgYSBrZXlib2FyZCBrZXlcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVLZXlkb3duKGRhdGE6IGFueSk6IHZvaWQge1xuICAgICAgICBjb25zdCBldmVudCA9IGRhdGEuZXZlbnQ7XG4gICAgICAgIGNvbnN0IGtleSA9IGV2ZW50LmtleUNvZGUgfHwgZXZlbnQud2hpY2g7XG4gICAgICAgIGNvbnN0IHNoaWZ0S2V5ID0gZXZlbnQuc2hpZnRLZXkgfHwgZmFsc2U7XG5cbiAgICAgICAgc3dpdGNoIChjb25zdGFudHMuS0VZX1BSRVNTX0FDVElPTlNba2V5XSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuQUNUSU9OU19LRVlTLkRFTEVURTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFRhZyAmJiB0aGlzLnJlbW92YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZih0aGlzLnNlbGVjdGVkVGFnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJlbW92ZVJlcXVlc3RlZCh0aGlzLnNlbGVjdGVkVGFnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5BQ1RJT05TX0tFWVMuU1dJVENIX1BSRVY6XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlVG9UYWcoZGF0YS5tb2RlbCwgY29uc3RhbnRzLlBSRVYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5BQ1RJT05TX0tFWVMuU1dJVENIX05FWFQ6XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlVG9UYWcoZGF0YS5tb2RlbCwgY29uc3RhbnRzLk5FWFQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5BQ1RJT05TX0tFWVMuVEFCOlxuICAgICAgICAgICAgICAgIGlmIChzaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ZpcnN0VGFnKGRhdGEubW9kZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1RhZyhkYXRhLm1vZGVsLCBjb25zdGFudHMuUFJFVik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMYXN0VGFnKGRhdGEubW9kZWwpICYmICh0aGlzLmRpc2FibGUgfHwgdGhpcy5tYXhJdGVtc1JlYWNoZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1RhZyhkYXRhLm1vZGVsLCBjb25zdGFudHMuTkVYVCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvdXJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgb25Gb3JtU3VibWl0KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5vbkFkZGluZ1JlcXVlc3RlZChmYWxzZSwgdGhpcy5mb3JtVmFsdWUpO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNldElucHV0VmFsdWVcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0SW5wdXRWYWx1ZSh2YWx1ZTogc3RyaW5nLCBlbWl0RXZlbnQgPSB0cnVlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmdldENvbnRyb2woKTtcblxuICAgICAgICAvLyB1cGRhdGUgZm9ybSB2YWx1ZSB3aXRoIHRoZSB0cmFuc2Zvcm1lZCBpdGVtXG4gICAgICAgIGNvbnRyb2wuc2V0VmFsdWUodmFsdWUsIHsgZW1pdEV2ZW50IH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldENvbnRyb2xcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldENvbnRyb2woKTogRm9ybUNvbnRyb2wge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dEZvcm0udmFsdWUgYXMgRm9ybUNvbnRyb2w7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZm9jdXNcbiAgICAgKiBAcGFyYW0gYXBwbHlGb2N1c1xuICAgICAqIEBwYXJhbSBkaXNwbGF5QXV0b2NvbXBsZXRlXG4gICAgICovXG4gICAgcHVibGljIGZvY3VzKGFwcGx5Rm9jdXMgPSBmYWxzZSwgZGlzcGxheUF1dG9jb21wbGV0ZSA9IGZhbHNlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdQcm92aWRlci5nZXRTdGF0ZSgnZHJhZ2dpbmcnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RJdGVtKHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgIGlmIChhcHBseUZvY3VzKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Rm9ybS5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQodGhpcy5mb3JtVmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYmx1clxuICAgICAqL1xuICAgIHB1YmxpYyBibHVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuXG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQodGhpcy5mb3JtVmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGhhc0Vycm9yc1xuICAgICAqL1xuICAgIHB1YmxpYyBoYXNFcnJvcnMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuaW5wdXRGb3JtICYmIHRoaXMuaW5wdXRGb3JtLmhhc0Vycm9ycygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlzSW5wdXRGb2N1c2VkXG4gICAgICovXG4gICAgcHVibGljIGlzSW5wdXRGb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmlucHV0Rm9ybSAmJiB0aGlzLmlucHV0Rm9ybS5pc0lucHV0Rm9jdXNlZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIC0gdGhpcyBpcyB0aGUgb25lIHdheSBJIGZvdW5kIHRvIHRlbGwgaWYgdGhlIHRlbXBsYXRlIGhhcyBiZWVuIHBhc3NlZCBhbmQgaXQgaXMgbm90XG4gICAgICogdGhlIHRlbXBsYXRlIGZvciB0aGUgbWVudSBpdGVtXG4gICAgICogQG5hbWUgaGFzQ3VzdG9tVGVtcGxhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzQ3VzdG9tVGVtcGxhdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZXMgPyB0aGlzLnRlbXBsYXRlcy5maXJzdCA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbWVudVRlbXBsYXRlID0gdGhpcy5kcm9wZG93biAmJiB0aGlzLmRyb3Bkb3duLnRlbXBsYXRlcyA/XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duLnRlbXBsYXRlcy5maXJzdCA6IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gQm9vbGVhbih0ZW1wbGF0ZSAmJiB0ZW1wbGF0ZSAhPT0gbWVudVRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBtYXhJdGVtc1JlYWNoZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG1heEl0ZW1zUmVhY2hlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF4SXRlbXMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdGhpcy5pdGVtcy5sZW5ndGggPj0gdGhpcy5tYXhJdGVtcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBmb3JtVmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGZvcm1WYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBmb3JtID0gdGhpcy5pbnB1dEZvcm0udmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIGZvcm0gPyBmb3JtLnZhbHVlIDogJyc7XG4gICAgfVxuXG4gICAgLyoqM1xuICAgICAqIEBuYW1lIG9uRHJhZ1N0YXJ0ZWRcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EcmFnU3RhcnRlZChldmVudDogRHJhZ0V2ZW50LCB0YWc6IFRhZ01vZGVsLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB7IHpvbmU6IHRoaXMuZHJhZ1pvbmUsIHRhZywgaW5kZXggfSBhcyBEcmFnZ2VkVGFnO1xuXG4gICAgICAgIHRoaXMuZHJhZ1Byb3ZpZGVyLnNldFNlbmRlcih0aGlzKTtcbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIuc2V0RHJhZ2dlZEl0ZW0oZXZlbnQsIGl0ZW0pO1xuICAgICAgICB0aGlzLmRyYWdQcm92aWRlci5zZXRTdGF0ZSh7IGRyYWdnaW5nOiB0cnVlLCBpbmRleCB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbkRyYWdPdmVyXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIG9uRHJhZ092ZXIoZXZlbnQ6IERyYWdFdmVudCwgaW5kZXg/OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIuc2V0U3RhdGUoeyBkcm9wcGluZzogdHJ1ZSB9KTtcbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIuc2V0UmVjZWl2ZXIodGhpcyk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblRhZ0Ryb3BwZWRcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwdWJsaWMgb25UYWdEcm9wcGVkKGV2ZW50OiBEcmFnRXZlbnQsIGluZGV4PzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmRyYWdQcm92aWRlci5nZXREcmFnZ2VkSXRlbShldmVudCk7XG5cbiAgICAgICAgaWYgKCFpdGVtIHx8IGl0ZW0uem9uZSAhPT0gdGhpcy5kcmFnWm9uZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIub25UYWdEcm9wcGVkKGl0ZW0udGFnLCBpdGVtLmluZGV4LCBpbmRleCk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNEcm9wcGluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBpc0Ryb3BwaW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBpc1JlY2VpdmVyID0gdGhpcy5kcmFnUHJvdmlkZXIucmVjZWl2ZXIgPT09IHRoaXM7XG4gICAgICAgIGNvbnN0IGlzRHJvcHBpbmcgPSB0aGlzLmRyYWdQcm92aWRlci5nZXRTdGF0ZSgnZHJvcHBpbmcnKTtcblxuICAgICAgICByZXR1cm4gQm9vbGVhbihpc1JlY2VpdmVyICYmIGlzRHJvcHBpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uVGFnQmx1cnJlZFxuICAgICAqIEBwYXJhbSBjaGFuZ2VkRWxlbWVudCB7VGFnTW9kZWx9XG4gICAgICogQHBhcmFtIGluZGV4IHtudW1iZXJ9XG4gICAgICovXG4gICAgcHVibGljIG9uVGFnQmx1cnJlZChjaGFuZ2VkRWxlbWVudDogVGFnTW9kZWwsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pdGVtc1tpbmRleF0gPSBjaGFuZ2VkRWxlbWVudDtcbiAgICAgICAgdGhpcy5ibHVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdHJhY2tCeVxuICAgICAqIEBwYXJhbSBpdGVtc1xuICAgICAqL1xuICAgIHB1YmxpYyB0cmFja0J5KGluZGV4OiBudW1iZXIsIGl0ZW06IFRhZ01vZGVsKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1bdGhpcy5pZGVudGlmeUJ5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB1cGRhdGVFZGl0ZWRUYWdcbiAgICAgKiBAcGFyYW0gdGFnXG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZUVkaXRlZFRhZyh7IHRhZywgaW5kZXggfTogeyB0YWc6IFRhZ01vZGVsLCBpbmRleDogbnVtYmVyIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vblRhZ0VkaXRlZC5lbWl0KHRhZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGFnXG4gICAgICogQHBhcmFtIGlzRnJvbUF1dG9jb21wbGV0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBpc1RhZ1ZhbGlkID0gKHRhZzogVGFnTW9kZWwsIGZyb21BdXRvY29tcGxldGUgPSBmYWxzZSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLmRyb3Bkb3duID8gdGhpcy5kcm9wZG93bi5zZWxlY3RlZEl0ZW0gOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRJdGVtRGlzcGxheSh0YWcpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtICYmICFmcm9tQXV0b2NvbXBsZXRlIHx8ICF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHVwZSA9IHRoaXMuZmluZER1cGUodGFnLCBmcm9tQXV0b2NvbXBsZXRlKTtcblxuICAgICAgICAvLyBpZiBzbywgZ2l2ZSBhIHZpc3VhbCBjdWUgYW5kIHJldHVybiBmYWxzZVxuICAgICAgICBpZiAoIXRoaXMuYWxsb3dEdXBlcyAmJiBkdXBlICYmIHRoaXMuYmxpbmtJZkR1cGUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy50YWdzLmZpbmQoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbVZhbHVlKGl0ZW0ubW9kZWwpID09PSB0aGlzLmdldEl0ZW1WYWx1ZShkdXBlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5ibGluaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNGcm9tQXV0b2NvbXBsZXRlID0gZnJvbUF1dG9jb21wbGV0ZSAmJiB0aGlzLm9ubHlGcm9tQXV0b2NvbXBsZXRlO1xuXG4gICAgICAgIGNvbnN0IGFzc2VydGlvbnMgPSBbXG4gICAgICAgICAgICAvLyAxLiB0aGVyZSBtdXN0IGJlIG5vIGR1cGUgT1IgZHVwZXMgYXJlIGFsbG93ZWRcbiAgICAgICAgICAgICFkdXBlIHx8IHRoaXMuYWxsb3dEdXBlcyxcblxuICAgICAgICAgICAgLy8gMi4gY2hlY2sgbWF4IGl0ZW1zIGhhcyBub3QgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICAhdGhpcy5tYXhJdGVtc1JlYWNoZWQsXG5cbiAgICAgICAgICAgIC8vIDMuIGNoZWNrIGl0ZW0gY29tZXMgZnJvbSBhdXRvY29tcGxldGUgb3Igb25seUZyb21BdXRvY29tcGxldGUgaXMgZmFsc2VcbiAgICAgICAgICAgICgoaXNGcm9tQXV0b2NvbXBsZXRlKSB8fCAhdGhpcy5vbmx5RnJvbUF1dG9jb21wbGV0ZSlcbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4gYXNzZXJ0aW9ucy5maWx0ZXIoQm9vbGVhbikubGVuZ3RoID09PSBhc3NlcnRpb25zLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBtb3ZlVG9UYWdcbiAgICAgKiBAcGFyYW0gaXRlbVxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgKi9cbiAgICBwcml2YXRlIG1vdmVUb1RhZyhpdGVtOiBUYWdNb2RlbCwgZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaXNMYXN0ID0gdGhpcy5pc0xhc3RUYWcoaXRlbSk7XG4gICAgICAgIGNvbnN0IGlzRmlyc3QgPSB0aGlzLmlzRmlyc3RUYWcoaXRlbSk7XG4gICAgICAgIGNvbnN0IHN0b3BTd2l0Y2ggPSAoZGlyZWN0aW9uID09PSBjb25zdGFudHMuTkVYVCAmJiBpc0xhc3QpIHx8XG4gICAgICAgICAgICAoZGlyZWN0aW9uID09PSBjb25zdGFudHMuUFJFViAmJiBpc0ZpcnN0KTtcblxuICAgICAgICBpZiAoc3RvcFN3aXRjaCkge1xuICAgICAgICAgICAgdGhpcy5mb2N1cyh0cnVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGRpcmVjdGlvbiA9PT0gY29uc3RhbnRzLk5FWFQgPyAxIDogLTE7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRUYWdJbmRleChpdGVtKSArIG9mZnNldDtcbiAgICAgICAgY29uc3QgdGFnID0gdGhpcy5nZXRUYWdBdEluZGV4KGluZGV4KTtcblxuICAgICAgICByZXR1cm4gdGFnLnNlbGVjdC5jYWxsKHRhZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNGaXJzdFRhZ1xuICAgICAqIEBwYXJhbSBpdGVtIHtUYWdNb2RlbH1cbiAgICAgKi9cbiAgICBwcml2YXRlIGlzRmlyc3RUYWcoaXRlbTogVGFnTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFncy5maXJzdC5tb2RlbCA9PT0gaXRlbTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpc0xhc3RUYWdcbiAgICAgKiBAcGFyYW0gaXRlbSB7VGFnTW9kZWx9XG4gICAgICovXG4gICAgcHJpdmF0ZSBpc0xhc3RUYWcoaXRlbTogVGFnTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFncy5sYXN0Lm1vZGVsID09PSBpdGVtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldFRhZ0luZGV4XG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFRhZ0luZGV4KGl0ZW06IFRhZ01vZGVsKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgdGFncyA9IHRoaXMudGFncy50b0FycmF5KCk7XG5cbiAgICAgICAgcmV0dXJuIHRhZ3MuZmluZEluZGV4KHRhZyA9PiB0YWcubW9kZWwgPT09IGl0ZW0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldFRhZ0F0SW5kZXhcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFRhZ0F0SW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBjb25zdCB0YWdzID0gdGhpcy50YWdzLnRvQXJyYXkoKTtcblxuICAgICAgICByZXR1cm4gdGFnc1tpbmRleF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmVtb3ZlSXRlbVxuICAgICAqIEBkZXNjIHJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBhcnJheSBvZiB0aGUgbW9kZWxcbiAgICAgKiBAcGFyYW0gdGFnIHtUYWdNb2RlbH1cbiAgICAgKiBAcGFyYW0gaW5kZXgge251bWJlcn1cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlSXRlbSh0YWc6IFRhZ01vZGVsLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLmdldEl0ZW1zV2l0aG91dChpbmRleCk7XG5cbiAgICAgICAgLy8gaWYgdGhlIHJlbW92ZWQgdGFnIHdhcyBzZWxlY3RlZCwgc2V0IGl0IGFzIHVuZGVmaW5lZFxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFRhZyA9PT0gdGFnKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0odW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb2N1cyBpbnB1dFxuICAgICAgICB0aGlzLmZvY3VzKHRydWUsIGZhbHNlKTtcblxuICAgICAgICAvLyBlbWl0IHJlbW92ZSBldmVudFxuICAgICAgICB0aGlzLm9uUmVtb3ZlLmVtaXQodGFnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhZGRJdGVtXG4gICAgICogQGRlc2MgYWRkcyB0aGUgY3VycmVudCB0ZXh0IG1vZGVsIHRvIHRoZSBpdGVtcyBhcnJheVxuICAgICAqIEBwYXJhbSBmcm9tQXV0b2NvbXBsZXRlIHtib29sZWFufVxuICAgICAqIEBwYXJhbSBpdGVtIHtUYWdNb2RlbH1cbiAgICAgKiBAcGFyYW0gaW5kZXg/IHtudW1iZXJ9XG4gICAgICogQHBhcmFtIGdpdmV1cEZvY3VzPyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZEl0ZW0oZnJvbUF1dG9jb21wbGV0ZSA9IGZhbHNlLCBpdGVtOiBUYWdNb2RlbCwgaW5kZXg/OiBudW1iZXIsIGdpdmV1cEZvY3VzPzogYm9vbGVhbik6XG4gICAgICAgIFByb21pc2U8VGFnTW9kZWw+IHtcbiAgICAgICAgY29uc3QgZGlzcGxheSA9IHRoaXMuZ2V0SXRlbURpc3BsYXkoaXRlbSk7XG4gICAgICAgIGNvbnN0IHRhZyA9IHRoaXMuY3JlYXRlVGFnKGl0ZW0pO1xuXG4gICAgICAgIGlmIChmcm9tQXV0b2NvbXBsZXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsdWUodGhpcy5nZXRJdGVtVmFsdWUoaXRlbSwgdHJ1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgcmVzZXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgcmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgY29udHJvbCBhbmQgZm9jdXMgaW5wdXRcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsdWUoJycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGdpdmV1cEZvY3VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXMoZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBmb2N1cyBpbnB1dFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvY3VzKHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKGRpc3BsYXkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgYXBwZW5kSXRlbSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZFRhZyh0YWcsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIC8vIGVtaXQgZXZlbnRcbiAgICAgICAgICAgICAgICB0aGlzLm9uQWRkLmVtaXQodGFnKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kcm9wZG93bikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcm9wZG93bi5zaG93RHJvcGRvd25JZkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMuaW5wdXRGb3JtLmZvcm0uc3RhdHVzO1xuICAgICAgICAgICAgY29uc3QgaXNUYWdWYWxpZCA9IHRoaXMuaXNUYWdWYWxpZCh0YWcsIGZyb21BdXRvY29tcGxldGUpO1xuXG4gICAgICAgICAgICBjb25zdCBvblZhbGlkYXRpb25FcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVmFsaWRhdGlvbkVycm9yLmVtaXQodGFnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnVkFMSUQnICYmIGlzVGFnVmFsaWQpIHtcbiAgICAgICAgICAgICAgICBhcHBlbmRJdGVtKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdJTlZBTElEJyB8fCAhaXNUYWdWYWxpZCkge1xuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9uVmFsaWRhdGlvbkVycm9yKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdQRU5ESU5HJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1VwZGF0ZSQgPSB0aGlzLmlucHV0Rm9ybS5mb3JtLnN0YXR1c0NoYW5nZXM7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzVXBkYXRlJFxuICAgICAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcihzdGF0dXNVcGRhdGUgPT4gc3RhdHVzVXBkYXRlICE9PSAnUEVORElORycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3QoKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXR1c1VwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c1VwZGF0ZSA9PT0gJ1ZBTElEJyAmJiBpc1RhZ1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwZW5kSXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvblZhbGlkYXRpb25FcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0dXBTZXBhcmF0b3JLZXlzTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldHVwU2VwYXJhdG9yS2V5c0xpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBjb25zdCB1c2VTZXBhcmF0b3JLZXlzID0gdGhpcy5zZXBhcmF0b3JLZXlDb2Rlcy5sZW5ndGggPiAwIHx8IHRoaXMuc2VwYXJhdG9yS2V5cy5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9ICgkZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0tleUNvZGUgPSB0aGlzLnNlcGFyYXRvcktleUNvZGVzLmluZGV4T2YoJGV2ZW50LmtleUNvZGUpID49IDA7XG4gICAgICAgICAgICBjb25zdCBoYXNLZXkgPSB0aGlzLnNlcGFyYXRvcktleXMuaW5kZXhPZigkZXZlbnQua2V5KSA+PSAwO1xuICAgICAgICAgICAgLy8gdGhlIGtleUNvZGUgb2Yga2V5ZG93biBldmVudCBpcyAyMjkgd2hlbiBJTUUgaXMgcHJvY2Vzc2luZyB0aGUga2V5IGV2ZW50LlxuICAgICAgICAgICAgY29uc3QgaXNJTUVQcm9jZXNzaW5nID0gJGV2ZW50LmtleUNvZGUgPT09IDIyOTtcblxuICAgICAgICAgICAgaWYgKGhhc0tleUNvZGUgfHwgKGhhc0tleSAmJiAhaXNJTUVQcm9jZXNzaW5nKSkge1xuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMub25BZGRpbmdSZXF1ZXN0ZWQoZmFsc2UsIHRoaXMuZm9ybVZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsaXN0ZW4uY2FsbCh0aGlzLCBjb25zdGFudHMuS0VZRE9XTiwgbGlzdGVuZXIsIHVzZVNlcGFyYXRvcktleXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNldFVwS2V5cHJlc3NMaXN0ZW5lcnNcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFVwS2V5cHJlc3NMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCRldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNDb3JyZWN0S2V5ID0gJGV2ZW50LmtleUNvZGUgPT09IDM3IHx8ICRldmVudC5rZXlDb2RlID09PSA4O1xuXG4gICAgICAgICAgICBpZiAoaXNDb3JyZWN0S2V5ICYmXG4gICAgICAgICAgICAgICAgIXRoaXMuZm9ybVZhbHVlICYmXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhZ3MubGFzdC5zZWxlY3QuY2FsbCh0aGlzLnRhZ3MubGFzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gc2V0dGluZyB1cCB0aGUga2V5cHJlc3MgbGlzdGVuZXJzXG4gICAgICAgIGxpc3Rlbi5jYWxsKHRoaXMsIGNvbnN0YW50cy5LRVlET1dOLCBsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0VXBLZXlkb3duTGlzdGVuZXJzXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRVcElucHV0S2V5ZG93bkxpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnB1dEZvcm0ub25LZXlkb3duLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnQmFja3NwYWNlJyAmJiB0aGlzLmZvcm1WYWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0VXBPblBhc3RlTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFVwT25QYXN0ZUxpc3RlbmVyKCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuaW5wdXRGb3JtLmlucHV0Lm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgLy8gYXR0YWNoIGxpc3RlbmVyIHRvIGlucHV0XG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGlucHV0LCAncGFzdGUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25QYXN0ZUNhbGxiYWNrKGV2ZW50KTtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZXRVcFRleHRDaGFuZ2VTdWJzY3JpYmVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRVcFRleHRDaGFuZ2VTdWJzY3JpYmVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0Rm9ybS5mb3JtXG4gICAgICAgICAgICAudmFsdWVDaGFuZ2VzXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBkZWJvdW5jZVRpbWUodGhpcy5vblRleHRDaGFuZ2VEZWJvdW5jZSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHZhbHVlOiB7IGl0ZW06IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblRleHRDaGFuZ2UuZW1pdCh2YWx1ZS5pdGVtKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNldFVwT25CbHVyU3Vic2NyaWJlclxuICAgICAqL1xuICAgIHByaXZhdGUgc2V0VXBPbkJsdXJTdWJzY3JpYmVyKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBmaWx0ZXJGbiA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHRoaXMuZHJvcGRvd24gJiYgdGhpcy5kcm9wZG93bi5pc1Zpc2libGU7XG4gICAgICAgICAgICByZXR1cm4gIWlzVmlzaWJsZSAmJiAhIXRoaXMuZm9ybVZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5wdXRGb3JtXG4gICAgICAgICAgICAub25CbHVyXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBkZWJvdW5jZVRpbWUoMTAwKSxcbiAgICAgICAgICAgICAgICBmaWx0ZXIoZmlsdGVyRm4pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNldCA9ICgpID0+IHRoaXMuc2V0SW5wdXRWYWx1ZSgnJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hZGRPbkJsdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkFkZGluZ1JlcXVlc3RlZChmYWxzZSwgdGhpcy5mb3JtVmFsdWUsIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHJlc2V0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZmluZER1cGVcbiAgICAgKiBAcGFyYW0gdGFnXG4gICAgICogQHBhcmFtIGlzRnJvbUF1dG9jb21wbGV0ZVxuICAgICAqL1xuICAgIHByaXZhdGUgZmluZER1cGUodGFnOiBUYWdNb2RlbCwgaXNGcm9tQXV0b2NvbXBsZXRlOiBib29sZWFuKTogVGFnTW9kZWwgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBpZGVudGlmeUJ5ID0gaXNGcm9tQXV0b2NvbXBsZXRlID8gdGhpcy5kcm9wZG93bi5pZGVudGlmeUJ5IDogdGhpcy5pZGVudGlmeUJ5O1xuICAgICAgICBjb25zdCBpZCA9IHRhZ1tpZGVudGlmeUJ5XTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kKGl0ZW0gPT4gdGhpcy5nZXRJdGVtVmFsdWUoaXRlbSkgPT09IGlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblBhc3RlQ2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHByaXZhdGUgb25QYXN0ZUNhbGxiYWNrID0gYXN5bmMgKGRhdGE6IENsaXBib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGludGVyZmFjZSBJRVdpbmRvdyBleHRlbmRzIFdpbmRvdyB7XG4gICAgICAgICAgICBjbGlwYm9hcmREYXRhOiBEYXRhVHJhbnNmZXI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBnZXRUZXh0ID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0lFID0gQm9vbGVhbigod2luZG93IGFzIElFV2luZG93KS5jbGlwYm9hcmREYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaXBib2FyZERhdGEgPSBpc0lFID8gKFxuICAgICAgICAgICAgICAgICh3aW5kb3cgYXMgSUVXaW5kb3cpLmNsaXBib2FyZERhdGFcbiAgICAgICAgICAgICkgOiBkYXRhLmNsaXBib2FyZERhdGE7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gaXNJRSA/ICdUZXh0JyA6ICd0ZXh0L3BsYWluJztcbiAgICAgICAgICAgIHJldHVybiBjbGlwYm9hcmREYXRhID09PSBudWxsID8gJycgOiBjbGlwYm9hcmREYXRhLmdldERhdGEodHlwZSkgfHwgJyc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGdldFRleHQoKTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0cyA9IHRleHRcbiAgICAgICAgICAgIC5zcGxpdCh0aGlzLnBhc3RlU3BsaXRQYXR0ZXJuKVxuICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWcgPSB0aGlzLmNyZWF0ZVRhZyhpdGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsdWUodGFnW3RoaXMuZGlzcGxheUJ5XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub25BZGRpbmdSZXF1ZXN0ZWQoZmFsc2UsIHRhZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXNldElucHV0ID0gKCkgPT4gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldElucHV0VmFsdWUoJycpLCA1MCk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocmVxdWVzdHMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblBhc3RlLmVtaXQodGV4dCk7XG4gICAgICAgICAgICByZXNldElucHV0KCk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2gocmVzZXRJbnB1dCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0QW5pbWF0aW9uTWV0YWRhdGFcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldEFuaW1hdGlvbk1ldGFkYXRhKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbk1ldGFkYXRhID0ge1xuICAgICAgICAgICAgdmFsdWU6ICdpbicsXG4gICAgICAgICAgICBwYXJhbXM6IHsgLi4udGhpcy5hbmltYXRpb25EdXJhdGlvbiB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIl19
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
var DragEvent = window.DragEvent;
var CUSTOM_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return TagInputComponent; }),
    multi: true
};
var TagInputComponent = /** @class */ (function (_super) {
    tslib_1.__extends(TagInputComponent, _super);
    function TagInputComponent(renderer, dragProvider) {
        var _a;
        var _this = _super.call(this) || this;
        _this.renderer = renderer;
        _this.dragProvider = dragProvider;
        /**
         * @name separatorKeys
         * @desc keyboard keys with which a user can separate items
         */
        _this.separatorKeys = defaults.tagInput.separatorKeys;
        /**
         * @name separatorKeyCodes
         * @desc keyboard key codes with which a user can separate items
         */
        _this.separatorKeyCodes = defaults.tagInput.separatorKeyCodes;
        /**
         * @name placeholder
         * @desc the placeholder of the input text
         */
        _this.placeholder = defaults.tagInput.placeholder;
        /**
         * @name secondaryPlaceholder
         * @desc placeholder to appear when the input is empty
         */
        _this.secondaryPlaceholder = defaults.tagInput.secondaryPlaceholder;
        /**
         * @name maxItems
         * @desc maximum number of items that can be added
         */
        _this.maxItems = defaults.tagInput.maxItems;
        /**
         * @name validators
         * @desc array of Validators that are used to validate the tag before it gets appended to the list
         */
        _this.validators = defaults.tagInput.validators;
        /**
         * @name asyncValidators
         * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
         */
        _this.asyncValidators = defaults.tagInput.asyncValidators;
        /**
        * - if set to true, it will only possible to add items from the autocomplete
        * @name onlyFromAutocomplete
        */
        _this.onlyFromAutocomplete = defaults.tagInput.onlyFromAutocomplete;
        /**
         * @name errorMessages
         */
        _this.errorMessages = defaults.tagInput.errorMessages;
        /**
         * @name theme
         */
        _this.theme = defaults.tagInput.theme;
        /**
         * @name onTextChangeDebounce
         */
        _this.onTextChangeDebounce = defaults.tagInput.onTextChangeDebounce;
        /**
         * - custom id assigned to the input
         * @name id
         */
        _this.inputId = defaults.tagInput.inputId;
        /**
         * - custom class assigned to the input
         */
        _this.inputClass = defaults.tagInput.inputClass;
        /**
         * - option to clear text input when the form is blurred
         * @name clearOnBlur
         */
        _this.clearOnBlur = defaults.tagInput.clearOnBlur;
        /**
         * - hideForm
         * @name clearOnBlur
         */
        _this.hideForm = defaults.tagInput.hideForm;
        /**
         * @name addOnBlur
         */
        _this.addOnBlur = defaults.tagInput.addOnBlur;
        /**
         * @name addOnPaste
         */
        _this.addOnPaste = defaults.tagInput.addOnPaste;
        /**
         * - pattern used with the native method split() to separate patterns in the string pasted
         * @name pasteSplitPattern
         */
        _this.pasteSplitPattern = defaults.tagInput.pasteSplitPattern;
        /**
         * @name blinkIfDupe
         */
        _this.blinkIfDupe = defaults.tagInput.blinkIfDupe;
        /**
         * @name removable
         */
        _this.removable = defaults.tagInput.removable;
        /**
         * @name editable
         */
        _this.editable = defaults.tagInput.editable;
        /**
         * @name allowDupes
         */
        _this.allowDupes = defaults.tagInput.allowDupes;
        /**
         * @description if set to true, the newly added tags will be added as strings, and not objects
         * @name modelAsStrings
         */
        _this.modelAsStrings = defaults.tagInput.modelAsStrings;
        /**
         * @name trimTags
         */
        _this.trimTags = defaults.tagInput.trimTags;
        /**
         * @name ripple
         */
        _this.ripple = defaults.tagInput.ripple;
        /**
         * @name tabindex
         * @desc pass through the specified tabindex to the input
         */
        _this.tabindex = defaults.tagInput.tabIndex;
        /**
         * @name disable
         */
        _this.disable = defaults.tagInput.disable;
        /**
         * @name dragZone
         */
        _this.dragZone = defaults.tagInput.dragZone;
        /**
         * @name onRemoving
         */
        _this.onRemoving = defaults.tagInput.onRemoving;
        /**
         * @name onAdding
         */
        _this.onAdding = defaults.tagInput.onAdding;
        /**
         * @name animationDuration
         */
        _this.animationDuration = defaults.tagInput.animationDuration;
        /**
         * @name onAdd
         * @desc event emitted when adding a new item
         */
        _this.onAdd = new EventEmitter();
        /**
         * @name onRemove
         * @desc event emitted when removing an existing item
         */
        _this.onRemove = new EventEmitter();
        /**
         * @name onSelect
         * @desc event emitted when selecting an item
         */
        _this.onSelect = new EventEmitter();
        /**
         * @name onFocus
         * @desc event emitted when the input is focused
         */
        _this.onFocus = new EventEmitter();
        /**
         * @name onFocus
         * @desc event emitted when the input is blurred
         */
        _this.onBlur = new EventEmitter();
        /**
         * @name onTextChange
         * @desc event emitted when the input value changes
         */
        _this.onTextChange = new EventEmitter();
        /**
         * - output triggered when text is pasted in the form
         * @name onPaste
         */
        _this.onPaste = new EventEmitter();
        /**
         * - output triggered when tag entered is not valid
         * @name onValidationError
         */
        _this.onValidationError = new EventEmitter();
        /**
         * - output triggered when tag is edited
         * @name onTagEdited
         */
        _this.onTagEdited = new EventEmitter();
        /**
         * @name isLoading
         */
        _this.isLoading = false;
        /**
         * @name listeners
         * @desc array of events that get fired using @fireEvents
         */
        _this.listeners = (_a = {},
            _a[constants.KEYDOWN] = [],
            _a[constants.KEYUP] = [],
            _a);
        /**
         * @description emitter for the 2-way data binding inputText value
         * @name inputTextChange
         */
        _this.inputTextChange = new EventEmitter();
        /**
         * @description private variable to bind get/set
         * @name inputTextValue
         */
        _this.inputTextValue = '';
        _this.errors = [];
        /**
         * @name appendTag
         * @param tag {TagModel}
         */
        _this.appendTag = function (tag, index) {
            if (index === void 0) { index = _this.items.length; }
            var items = _this.items;
            var model = _this.modelAsStrings ? tag[_this.identifyBy] : tag;
            _this.items = tslib_1.__spread(items.slice(0, index), [
                model
            ], items.slice(index, items.length));
        };
        /**
         * @name createTag
         * @param model
         */
        _this.createTag = function (model) {
            var _a;
            var trim = function (val, key) {
                return typeof val === 'string' ? val.trim() : val[key];
            };
            return tslib_1.__assign({}, typeof model !== 'string' ? model : {}, (_a = {}, _a[_this.displayBy] = _this.trimTags ? trim(model, _this.displayBy) : model, _a[_this.identifyBy] = _this.trimTags ? trim(model, _this.identifyBy) : model, _a));
        };
        /**
         *
         * @param tag
         * @param isFromAutocomplete
         */
        _this.isTagValid = function (tag, fromAutocomplete) {
            if (fromAutocomplete === void 0) { fromAutocomplete = false; }
            var selectedItem = _this.dropdown ? _this.dropdown.selectedItem : undefined;
            var value = _this.getItemDisplay(tag).trim();
            if (selectedItem && !fromAutocomplete || !value) {
                return false;
            }
            var dupe = _this.findDupe(tag, fromAutocomplete);
            // if so, give a visual cue and return false
            if (!_this.allowDupes && dupe && _this.blinkIfDupe) {
                var model = _this.tags.find(function (item) {
                    return _this.getItemValue(item.model) === _this.getItemValue(dupe);
                });
                if (model) {
                    model.blink();
                }
            }
            var isFromAutocomplete = fromAutocomplete && _this.onlyFromAutocomplete;
            var assertions = [
                // 1. there must be no dupe OR dupes are allowed
                !dupe || _this.allowDupes,
                // 2. check max items has not been reached
                !_this.maxItemsReached,
                // 3. check item comes from autocomplete or onlyFromAutocomplete is false
                ((isFromAutocomplete) || !_this.onlyFromAutocomplete)
            ];
            return assertions.filter(Boolean).length === assertions.length;
        };
        /**
         * @name onPasteCallback
         * @param data
         */
        _this.onPasteCallback = function (data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getText, text, requests, resetInput;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                getText = function () {
                    var isIE = Boolean(window.clipboardData);
                    var clipboardData = isIE ? (window.clipboardData) : data.clipboardData;
                    var type = isIE ? 'Text' : 'text/plain';
                    return clipboardData === null ? '' : clipboardData.getData(type) || '';
                };
                text = getText();
                requests = text
                    .split(this.pasteSplitPattern)
                    .map(function (item) {
                    var tag = _this.createTag(item);
                    _this.setInputValue(tag[_this.displayBy]);
                    return _this.onAddingRequested(false, tag);
                });
                resetInput = function () { return setTimeout(function () { return _this.setInputValue(''); }, 50); };
                Promise.all(requests).then(function () {
                    _this.onPaste.emit(text);
                    resetInput();
                })
                    .catch(resetInput);
                return [2 /*return*/];
            });
        }); };
        return _this;
    }
    Object.defineProperty(TagInputComponent.prototype, "inputText", {
        /**
         * @name inputText
         */
        get: function () {
            return this.inputTextValue;
        },
        /**
         * @name inputText
         * @param text
         */
        set: function (text) {
            this.inputTextValue = text;
            this.inputTextChange.emit(text);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagInputComponent.prototype, "tabindexAttr", {
        /**
         * @desc removes the tab index if it is set - it will be passed through to the input
         * @name tabindexAttr
         */
        get: function () {
            return this.tabindex !== '' ? '-1' : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @name ngAfterViewInit
     */
    TagInputComponent.prototype.ngAfterViewInit = function () {
        // set up listeners
        var _this = this;
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
        var statusChanges$ = this.inputForm.form.statusChanges;
        statusChanges$.pipe(filter(function (status) { return status !== 'PENDING'; })).subscribe(function () {
            _this.errors = _this.inputForm.getErrorMessages(_this.errorMessages);
        });
        this.isProgressBarVisible$ = statusChanges$.pipe(map(function (status) {
            return status === 'PENDING' || _this.isLoading;
        }));
        // if hideForm is set to true, remove the input
        if (this.hideForm) {
            this.inputForm.destroy();
        }
    };
    /**
     * @name ngOnInit
     */
    TagInputComponent.prototype.ngOnInit = function () {
        // if the number of items specified in the model is > of the value of maxItems
        // degrade gracefully and let the max number of items to be the number of items in the model
        // though, warn the user.
        var hasReachedMaxItems = this.maxItems !== undefined &&
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
    };
    /**
     * @name onRemoveRequested
     * @param tag
     * @param index
     */
    TagInputComponent.prototype.onRemoveRequested = function (tag, index) {
        var _this = this;
        return new Promise(function (resolve) {
            var subscribeFn = function (model) {
                _this.removeItem(model, index);
                resolve(tag);
            };
            _this.onRemoving ?
                _this.onRemoving(tag)
                    .pipe(first())
                    .subscribe(subscribeFn) : subscribeFn(tag);
        });
    };
    /**
     * @name onAddingRequested
     * @param fromAutocomplete {boolean}
     * @param tag {TagModel}
     * @param index? {number}
     * @param giveupFocus? {boolean}
     */
    TagInputComponent.prototype.onAddingRequested = function (fromAutocomplete, tag, index, giveupFocus) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var subscribeFn = function (model) {
                return _this
                    .addItem(fromAutocomplete, model, index, giveupFocus)
                    .then(resolve)
                    .catch(reject);
            };
            return _this.onAdding ?
                _this.onAdding(tag)
                    .pipe(first())
                    .subscribe(subscribeFn, reject) : subscribeFn(tag);
        });
    };
    /**
     * @name selectItem
     * @desc selects item passed as parameter as the selected tag
     * @param item
     * @param emit
     */
    TagInputComponent.prototype.selectItem = function (item, emit) {
        if (emit === void 0) { emit = true; }
        var isReadonly = item && typeof item !== 'string' && item.readonly;
        if (isReadonly || this.selectedTag === item) {
            return;
        }
        this.selectedTag = item;
        if (emit) {
            this.onSelect.emit(item);
        }
    };
    /**
     * @name fireEvents
     * @desc goes through the list of the events for a given eventName, and fires each of them
     * @param eventName
     * @param $event
     */
    TagInputComponent.prototype.fireEvents = function (eventName, $event) {
        var _this = this;
        this.listeners[eventName].forEach(function (listener) { return listener.call(_this, $event); });
    };
    /**
     * @name handleKeydown
     * @desc handles action when the user hits a keyboard key
     * @param data
     */
    TagInputComponent.prototype.handleKeydown = function (data) {
        var event = data.event;
        var key = event.keyCode || event.which;
        var shiftKey = event.shiftKey || false;
        switch (constants.KEY_PRESS_ACTIONS[key]) {
            case constants.ACTIONS_KEYS.DELETE:
                if (this.selectedTag && this.removable) {
                    var index = this.items.indexOf(this.selectedTag);
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
    };
    TagInputComponent.prototype.onFormSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.onAddingRequested(false, this.formValue)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @name setInputValue
     * @param value
     */
    TagInputComponent.prototype.setInputValue = function (value, emitEvent) {
        if (emitEvent === void 0) { emitEvent = true; }
        var control = this.getControl();
        // update form value with the transformed item
        control.setValue(value, { emitEvent: emitEvent });
    };
    /**
     * @name getControl
     */
    TagInputComponent.prototype.getControl = function () {
        return this.inputForm.value;
    };
    /**
     * @name focus
     * @param applyFocus
     * @param displayAutocomplete
     */
    TagInputComponent.prototype.focus = function (applyFocus, displayAutocomplete) {
        if (applyFocus === void 0) { applyFocus = false; }
        if (displayAutocomplete === void 0) { displayAutocomplete = false; }
        if (this.dragProvider.getState('dragging')) {
            return;
        }
        this.selectItem(undefined, false);
        if (applyFocus) {
            this.inputForm.focus();
            this.onFocus.emit(this.formValue);
        }
    };
    /**
     * @name blur
     */
    TagInputComponent.prototype.blur = function () {
        this.onTouched();
        this.onBlur.emit(this.formValue);
    };
    /**
     * @name hasErrors
     */
    TagInputComponent.prototype.hasErrors = function () {
        return !!this.inputForm && this.inputForm.hasErrors();
    };
    /**
     * @name isInputFocused
     */
    TagInputComponent.prototype.isInputFocused = function () {
        return !!this.inputForm && this.inputForm.isInputFocused();
    };
    /**
     * - this is the one way I found to tell if the template has been passed and it is not
     * the template for the menu item
     * @name hasCustomTemplate
     */
    TagInputComponent.prototype.hasCustomTemplate = function () {
        var template = this.templates ? this.templates.first : undefined;
        var menuTemplate = this.dropdown && this.dropdown.templates ?
            this.dropdown.templates.first : undefined;
        return Boolean(template && template !== menuTemplate);
    };
    Object.defineProperty(TagInputComponent.prototype, "maxItemsReached", {
        /**
         * @name maxItemsReached
         */
        get: function () {
            return this.maxItems !== undefined &&
                this.items.length >= this.maxItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagInputComponent.prototype, "formValue", {
        /**
         * @name formValue
         */
        get: function () {
            var form = this.inputForm.value;
            return form ? form.value : '';
        },
        enumerable: true,
        configurable: true
    });
    /**3
     * @name onDragStarted
     * @param event
     * @param index
     */
    TagInputComponent.prototype.onDragStarted = function (event, tag, index) {
        event.stopPropagation();
        var item = { zone: this.dragZone, tag: tag, index: index };
        this.dragProvider.setSender(this);
        this.dragProvider.setDraggedItem(event, item);
        this.dragProvider.setState({ dragging: true, index: index });
    };
    /**
     * @name onDragOver
     * @param event
     */
    TagInputComponent.prototype.onDragOver = function (event, index) {
        this.dragProvider.setState({ dropping: true });
        this.dragProvider.setReceiver(this);
        event.preventDefault();
    };
    /**
     * @name onTagDropped
     * @param event
     * @param index
     */
    TagInputComponent.prototype.onTagDropped = function (event, index) {
        var item = this.dragProvider.getDraggedItem(event);
        if (!item || item.zone !== this.dragZone) {
            return;
        }
        this.dragProvider.onTagDropped(item.tag, item.index, index);
        event.preventDefault();
        event.stopPropagation();
    };
    /**
     * @name isDropping
     */
    TagInputComponent.prototype.isDropping = function () {
        var isReceiver = this.dragProvider.receiver === this;
        var isDropping = this.dragProvider.getState('dropping');
        return Boolean(isReceiver && isDropping);
    };
    /**
     * @name onTagBlurred
     * @param changedElement {TagModel}
     * @param index {number}
     */
    TagInputComponent.prototype.onTagBlurred = function (changedElement, index) {
        this.items[index] = changedElement;
        this.blur();
    };
    /**
     * @name trackBy
     * @param items
     */
    TagInputComponent.prototype.trackBy = function (index, item) {
        return item[this.identifyBy];
    };
    /**
     * @name updateEditedTag
     * @param tag
     */
    TagInputComponent.prototype.updateEditedTag = function (_a) {
        var tag = _a.tag, index = _a.index;
        this.onTagEdited.emit(tag);
    };
    /**
     * @name moveToTag
     * @param item
     * @param direction
     */
    TagInputComponent.prototype.moveToTag = function (item, direction) {
        var isLast = this.isLastTag(item);
        var isFirst = this.isFirstTag(item);
        var stopSwitch = (direction === constants.NEXT && isLast) ||
            (direction === constants.PREV && isFirst);
        if (stopSwitch) {
            this.focus(true);
            return;
        }
        var offset = direction === constants.NEXT ? 1 : -1;
        var index = this.getTagIndex(item) + offset;
        var tag = this.getTagAtIndex(index);
        return tag.select.call(tag);
    };
    /**
     * @name isFirstTag
     * @param item {TagModel}
     */
    TagInputComponent.prototype.isFirstTag = function (item) {
        return this.tags.first.model === item;
    };
    /**
     * @name isLastTag
     * @param item {TagModel}
     */
    TagInputComponent.prototype.isLastTag = function (item) {
        return this.tags.last.model === item;
    };
    /**
     * @name getTagIndex
     * @param item
     */
    TagInputComponent.prototype.getTagIndex = function (item) {
        var tags = this.tags.toArray();
        return tags.findIndex(function (tag) { return tag.model === item; });
    };
    /**
     * @name getTagAtIndex
     * @param index
     */
    TagInputComponent.prototype.getTagAtIndex = function (index) {
        var tags = this.tags.toArray();
        return tags[index];
    };
    /**
     * @name removeItem
     * @desc removes an item from the array of the model
     * @param tag {TagModel}
     * @param index {number}
     */
    TagInputComponent.prototype.removeItem = function (tag, index) {
        this.items = this.getItemsWithout(index);
        // if the removed tag was selected, set it as undefined
        if (this.selectedTag === tag) {
            this.selectItem(undefined, false);
        }
        // focus input
        this.focus(true, false);
        // emit remove event
        this.onRemove.emit(tag);
    };
    /**
     * @name addItem
     * @desc adds the current text model to the items array
     * @param fromAutocomplete {boolean}
     * @param item {TagModel}
     * @param index? {number}
     * @param giveupFocus? {boolean}
     */
    TagInputComponent.prototype.addItem = function (fromAutocomplete, item, index, giveupFocus) {
        var _this = this;
        if (fromAutocomplete === void 0) { fromAutocomplete = false; }
        var display = this.getItemDisplay(item);
        var tag = this.createTag(item);
        if (fromAutocomplete) {
            this.setInputValue(this.getItemValue(item, true));
        }
        return new Promise(function (resolve, reject) {
            /**
             * @name reset
             */
            var reset = function () {
                // reset control and focus input
                _this.setInputValue('');
                if (giveupFocus) {
                    _this.focus(false, false);
                }
                else {
                    // focus input
                    _this.focus(true, false);
                }
                resolve(display);
            };
            var appendItem = function () {
                _this.appendTag(tag, index);
                // emit event
                _this.onAdd.emit(tag);
                if (!_this.dropdown) {
                    return;
                }
                _this.dropdown.hide();
                if (_this.dropdown.showDropdownIfEmpty) {
                    _this.dropdown.show();
                }
            };
            var status = _this.inputForm.form.status;
            var isTagValid = _this.isTagValid(tag, fromAutocomplete);
            var onValidationError = function () {
                _this.onValidationError.emit(tag);
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
                var statusUpdate$ = _this.inputForm.form.statusChanges;
                return statusUpdate$
                    .pipe(filter(function (statusUpdate) { return statusUpdate !== 'PENDING'; }), first())
                    .subscribe(function (statusUpdate) {
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
    };
    /**
     * @name setupSeparatorKeysListener
     */
    TagInputComponent.prototype.setupSeparatorKeysListener = function () {
        var _this = this;
        var useSeparatorKeys = this.separatorKeyCodes.length > 0 || this.separatorKeys.length > 0;
        var listener = function ($event) {
            var hasKeyCode = _this.separatorKeyCodes.indexOf($event.keyCode) >= 0;
            var hasKey = _this.separatorKeys.indexOf($event.key) >= 0;
            // the keyCode of keydown event is 229 when IME is processing the key event.
            var isIMEProcessing = $event.keyCode === 229;
            if (hasKeyCode || (hasKey && !isIMEProcessing)) {
                $event.preventDefault();
                _this.onAddingRequested(false, _this.formValue)
                    .catch(function () { });
            }
        };
        listen.call(this, constants.KEYDOWN, listener, useSeparatorKeys);
    };
    /**
     * @name setUpKeypressListeners
     */
    TagInputComponent.prototype.setUpKeypressListeners = function () {
        var _this = this;
        var listener = function ($event) {
            var isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;
            if (isCorrectKey &&
                !_this.formValue &&
                _this.items.length) {
                _this.tags.last.select.call(_this.tags.last);
            }
        };
        // setting up the keypress listeners
        listen.call(this, constants.KEYDOWN, listener);
    };
    /**
     * @name setUpKeydownListeners
     */
    TagInputComponent.prototype.setUpInputKeydownListeners = function () {
        var _this = this;
        this.inputForm.onKeydown.subscribe(function (event) {
            if (event.key === 'Backspace' && _this.formValue.trim() === '') {
                event.preventDefault();
            }
        });
    };
    /**
     * @name setUpOnPasteListener
     */
    TagInputComponent.prototype.setUpOnPasteListener = function () {
        var _this = this;
        var input = this.inputForm.input.nativeElement;
        // attach listener to input
        this.renderer.listen(input, 'paste', function (event) {
            _this.onPasteCallback(event);
            event.preventDefault();
            return true;
        });
    };
    /**
     * @name setUpTextChangeSubscriber
     */
    TagInputComponent.prototype.setUpTextChangeSubscriber = function () {
        var _this = this;
        this.inputForm.form
            .valueChanges
            .pipe(debounceTime(this.onTextChangeDebounce))
            .subscribe(function (value) {
            _this.onTextChange.emit(value.item);
        });
    };
    /**
     * @name setUpOnBlurSubscriber
     */
    TagInputComponent.prototype.setUpOnBlurSubscriber = function () {
        var _this = this;
        var filterFn = function () {
            var isVisible = _this.dropdown && _this.dropdown.isVisible;
            return !isVisible && !!_this.formValue;
        };
        this.inputForm
            .onBlur
            .pipe(debounceTime(100), filter(filterFn))
            .subscribe(function () {
            var reset = function () { return _this.setInputValue(''); };
            if (_this.addOnBlur) {
                return _this
                    .onAddingRequested(false, _this.formValue, undefined, true)
                    .then(reset)
                    .catch(reset);
            }
            reset();
        });
    };
    /**
     * @name findDupe
     * @param tag
     * @param isFromAutocomplete
     */
    TagInputComponent.prototype.findDupe = function (tag, isFromAutocomplete) {
        var _this = this;
        var identifyBy = isFromAutocomplete ? this.dropdown.identifyBy : this.identifyBy;
        var id = tag[identifyBy];
        return this.items.find(function (item) { return _this.getItemValue(item) === id; });
    };
    /**
     * @name setAnimationMetadata
     */
    TagInputComponent.prototype.setAnimationMetadata = function () {
        this.animationMetadata = {
            value: 'in',
            params: tslib_1.__assign({}, this.animationDuration)
        };
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
            animations: animations,
            styles: [".dark tag:focus{box-shadow:0 0 0 1px #323232}.ng2-tag-input.bootstrap3-info{background-color:#fff;display:inline-block;color:#555;vertical-align:middle;max-width:100%;height:42px;line-height:44px}.ng2-tag-input.bootstrap3-info input{border:none;box-shadow:none;outline:0;background-color:transparent;padding:0 6px;margin:0;width:auto;max-width:inherit}.ng2-tag-input.bootstrap3-info .form-control input::-moz-placeholder{color:#777;opacity:1}.ng2-tag-input.bootstrap3-info .form-control input:-ms-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info .form-control input::-webkit-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info input:focus{border:none;box-shadow:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--focused{box-shadow:inset 0 1px 1px rgba(0,0,0,.4);border:1px solid #ccc}.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;transition:.25s;padding:.25rem 0;min-height:32px;cursor:text;border-bottom:2px solid #efefef}.ng2-tag-input:focus{outline:0}.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #2196f3}.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #f44336}.ng2-tag-input.ng2-tag-input--loading{border:none}.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.ng2-tag-input form{margin:.1em 0}.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.minimal.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:1px solid transparent}.minimal.ng2-tag-input:focus{outline:0}.minimal.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.minimal.ng2-tag-input.ng2-tag-input--loading{border:none}.minimal.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.minimal.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.dark.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:2px solid #444}.dark.ng2-tag-input:focus{outline:0}.dark.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.dark.ng2-tag-input.ng2-tag-input--loading{border:none}.dark.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.dark.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.bootstrap.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;cursor:text;border-bottom:2px solid #efefef}.bootstrap.ng2-tag-input:focus{outline:0}.bootstrap.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #0275d8}.bootstrap.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #d9534f}.bootstrap.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.bootstrap.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.bootstrap3-info.ng2-tag-input{display:block;flex-direction:row;flex-wrap:wrap;position:relative;padding:4px;cursor:text;box-shadow:inset 0 1px 1px rgba(0,0,0,.075);border-radius:4px}.bootstrap3-info.ng2-tag-input:focus{outline:0}.bootstrap3-info.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap3-info.ng2-tag-input.ng2-tag-input--invalid{box-shadow:inset 0 1px 1px #d9534f;border-bottom:1px solid #d9534f}.bootstrap3-info.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--disabled{opacity:.5;cursor:not-allowed}.bootstrap3-info.ng2-tag-input form{margin:.1em 0}.bootstrap3-info.ng2-tag-input .ng2-tags-container{flex-wrap:wrap;display:flex}.error-message{font-size:.8em;color:#f44336;margin:.5em 0 0}.bootstrap .error-message{color:#d9534f}.progress-bar,.progress-bar:before{height:2px;width:100%;margin:0}.progress-bar{background-color:#2196f3;display:flex;position:absolute;bottom:0}.progress-bar:before{background-color:#82c4f8;content:\"\";-webkit-animation:2s cubic-bezier(.4,0,.2,1) infinite running-progress;animation:2s cubic-bezier(.4,0,.2,1) infinite running-progress}@-webkit-keyframes running-progress{0%{margin-left:0;margin-right:100%}50%{margin-left:25%;margin-right:0}100%{margin-left:100%;margin-right:0}}@keyframes running-progress{0%{margin-left:0;margin-right:100%}50%{margin-left:25%;margin-right:0}100%{margin-left:100%;margin-right:0}}tag{display:flex;flex-direction:row;flex-wrap:wrap;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:400;font-size:1em;letter-spacing:.05rem;color:#444;border-radius:16px;transition:.3s;margin:.1rem .3rem .1rem 0;padding:.08rem .45rem;height:32px;line-height:34px;background:#efefef;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative}tag:not(.readonly):not(.tag--editing):focus{background:#2196f3;color:#fff;box-shadow:0 2px 3px 1px #d4d1d1}tag:not(.readonly):not(.tag--editing):active{background:#0d8aee;color:#fff;box-shadow:0 2px 3px 1px #d4d1d1}tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#e2e2e2;color:initial;box-shadow:0 2px 3px 1px #d4d1d1}tag.readonly{cursor:default}tag.readonly:focus,tag:focus{outline:0}tag.tag--editing{background-color:#fff;border:1px solid #ccc;cursor:text}.minimal tag{display:flex;flex-direction:row;flex-wrap:wrap;border-radius:0;background:#f9f9f9;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative}.minimal tag:not(.readonly):not(.tag--editing):active,.minimal tag:not(.readonly):not(.tag--editing):focus{background:#d0d0d0;color:initial}.minimal tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#ececec}.minimal tag.readonly{cursor:default}.minimal tag.readonly:focus,.minimal tag:focus{outline:0}.minimal tag.tag--editing{cursor:text}.dark tag{display:flex;flex-direction:row;flex-wrap:wrap;color:#f9f9f9;border-radius:3px;background:#444;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative}.dark tag:not(.readonly):not(.tag--editing):focus{background:#efefef;color:#444}.dark tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#2b2b2b;color:#f9f9f9}.dark tag.readonly{cursor:default}.dark tag.readonly:focus,.dark tag:focus{outline:0}.dark tag.tag--editing{cursor:text}.bootstrap tag{display:flex;flex-direction:row;flex-wrap:wrap;color:#f9f9f9;border-radius:.25rem;background:#0275d8;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative}.bootstrap tag:not(.readonly):not(.tag--editing):active,.bootstrap tag:not(.readonly):not(.tag--editing):focus{background:#025aa5}.bootstrap tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#0267bf;color:#f9f9f9}.bootstrap tag.readonly{cursor:default}.bootstrap tag.readonly:focus,.bootstrap tag:focus{outline:0}.bootstrap tag.tag--editing{cursor:text}.bootstrap3-info tag{display:flex;flex-direction:row;flex-wrap:wrap;font-family:inherit;font-weight:400;font-size:95%;color:#fff;border-radius:.25em;background:#5bc0de;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;outline:0;cursor:pointer;position:relative;padding:.25em .6em;text-align:center;white-space:nowrap}.bootstrap3-info tag:not(.readonly):not(.tag--editing):active,.bootstrap3-info tag:not(.readonly):not(.tag--editing):focus{background:#28a1c5}.bootstrap3-info tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#46b8da;color:#fff}.bootstrap3-info tag.readonly{cursor:default}.bootstrap3-info tag.readonly:focus,.bootstrap3-info tag:focus{outline:0}.bootstrap3-info tag.tag--editing{cursor:text}:host{display:block}"]
        }),
        tslib_1.__metadata("design:paramtypes", [Renderer2,
            DragProvider])
    ], TagInputComponent);
    return TagInputComponent;
}(TagInputAccessor));
export { TagInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWNoaXBzLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy90YWctaW5wdXQvdGFnLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxVQUFVO0FBQ1YsT0FBTyxFQUNILFNBQVMsRUFDVCxVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixZQUFZLEVBRVosV0FBVyxFQUNYLFNBQVMsRUFFWixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBR0gsaUJBQWlCLEVBRXBCLE1BQU0sZ0JBQWdCLENBQUM7QUFJeEIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxFLGdCQUFnQjtBQUNoQixPQUFPLEVBQUUsZ0JBQWdCLEVBQVksTUFBTSxxQkFBcUIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbkQsT0FBTyxLQUFLLFNBQVMsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsWUFBWSxFQUFjLE1BQU0sb0NBQW9DLENBQUM7QUFFOUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVwRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUU1RSwwQkFBMEI7QUFDMUIsOEJBQThCO0FBQzlCLElBQU0sU0FBUyxHQUFJLE1BQWMsQ0FBQyxTQUFTLENBQUM7QUFFNUMsSUFB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QUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQzswQ0FBbUIsWUFBWTt3REFBQztJQTBCL0M7UUFBM0IsWUFBWSxDQUFDLFlBQVksQ0FBQzswQ0FBYyxTQUFTO21EQUFlO0lBZXZEO1FBQVQsTUFBTSxFQUFFOzBDQUF5QixZQUFZOzhEQUE4QjtJQWE1RTtRQURDLFdBQVcsQ0FBQyxlQUFlLENBQUM7Ozt5REFHNUI7SUE3U1EsaUJBQWlCO1FBUDdCLFNBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFNBQVMsRUFBRSxDQUFDLGVBQWUsQ0FBQztZQUU1Qiw2bEdBQXdDO1lBQ3hDLFVBQVUsWUFBQTs7U0FDYixDQUFDO2lEQXlUeUMsU0FBUztZQUNkLFlBQVk7T0F6VHJDLGlCQUFpQixDQXNrQzdCO0lBQUQsd0JBQUM7Q0FBQSxBQXRrQ0QsQ0FBdUMsZ0JBQWdCLEdBc2tDdEQ7U0F0a0NZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGFuZ3VsYXJcbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIGZvcndhcmRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBSZW5kZXJlcjIsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgQ29udGVudENoaWxkLFxuICAgIE9uSW5pdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBRdWVyeUxpc3QsXG4gICAgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgICBBc3luY1ZhbGlkYXRvckZuLFxuICAgIEZvcm1Db250cm9sLFxuICAgIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIFZhbGlkYXRvckZuXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLy8gcnhcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZmlsdGVyLCBtYXAsIGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vLyBuZzItdGFnLWlucHV0XG5pbXBvcnQgeyBUYWdJbnB1dEFjY2Vzc29yLCBUYWdNb2RlbCB9IGZyb20gJy4uLy4uL2NvcmUvYWNjZXNzb3InO1xuaW1wb3J0IHsgbGlzdGVuIH0gZnJvbSAnLi4vLi4vY29yZS9oZWxwZXJzL2xpc3Rlbic7XG5pbXBvcnQgKiBhcyBjb25zdGFudHMgZnJvbSAnLi4vLi4vY29yZS9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBEcmFnUHJvdmlkZXIsIERyYWdnZWRUYWcgfSBmcm9tICcuLi8uLi9jb3JlL3Byb3ZpZGVycy9kcmFnLXByb3ZpZGVyJztcblxuaW1wb3J0IHsgVGFnSW5wdXRGb3JtIH0gZnJvbSAnLi4vdGFnLWlucHV0LWZvcm0vdGFnLWlucHV0LWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4uL3RhZy90YWcuY29tcG9uZW50JztcblxuaW1wb3J0IHsgYW5pbWF0aW9ucyB9IGZyb20gJy4vYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uLy4uL2RlZmF1bHRzJztcbmltcG9ydCB7IFRhZ0lucHV0RHJvcGRvd24gfSBmcm9tICcuLi9kcm9wZG93bi90YWctaW5wdXQtZHJvcGRvd24uY29tcG9uZW50JztcblxuLy8gYW5ndWxhciB1bml2ZXJzYWwgaGFja3Ncbi8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSAqL1xuY29uc3QgRHJhZ0V2ZW50ID0gKHdpbmRvdyBhcyBhbnkpLkRyYWdFdmVudDtcblxuY29uc3QgQ1VTVE9NX0FDQ0VTU09SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFRhZ0lucHV0Q29tcG9uZW50KSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGFnLWlucHV0JyxcbiAgICBwcm92aWRlcnM6IFtDVVNUT01fQUNDRVNTT1JdLFxuICAgIHN0eWxlVXJsczogWycuL3RhZy1pbnB1dC5zdHlsZS5zY3NzJ10sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3RhZy1pbnB1dC50ZW1wbGF0ZS5odG1sJyxcbiAgICBhbmltYXRpb25zXG59KVxuZXhwb3J0IGNsYXNzIFRhZ0lucHV0Q29tcG9uZW50IGV4dGVuZHMgVGFnSW5wdXRBY2Nlc3NvciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgLyoqXG4gICAgICogQG5hbWUgc2VwYXJhdG9yS2V5c1xuICAgICAqIEBkZXNjIGtleWJvYXJkIGtleXMgd2l0aCB3aGljaCBhIHVzZXIgY2FuIHNlcGFyYXRlIGl0ZW1zXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHNlcGFyYXRvcktleXM6IHN0cmluZ1tdID0gZGVmYXVsdHMudGFnSW5wdXQuc2VwYXJhdG9yS2V5cztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlcGFyYXRvcktleUNvZGVzXG4gICAgICogQGRlc2Mga2V5Ym9hcmQga2V5IGNvZGVzIHdpdGggd2hpY2ggYSB1c2VyIGNhbiBzZXBhcmF0ZSBpdGVtc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBzZXBhcmF0b3JLZXlDb2RlczogbnVtYmVyW10gPSBkZWZhdWx0cy50YWdJbnB1dC5zZXBhcmF0b3JLZXlDb2RlcztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHBsYWNlaG9sZGVyXG4gICAgICogQGRlc2MgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dCB0ZXh0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5wbGFjZWhvbGRlcjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlY29uZGFyeVBsYWNlaG9sZGVyXG4gICAgICogQGRlc2MgcGxhY2Vob2xkZXIgdG8gYXBwZWFyIHdoZW4gdGhlIGlucHV0IGlzIGVtcHR5XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHNlY29uZGFyeVBsYWNlaG9sZGVyOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5zZWNvbmRhcnlQbGFjZWhvbGRlcjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG1heEl0ZW1zXG4gICAgICogQGRlc2MgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdGhhdCBjYW4gYmUgYWRkZWRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgbWF4SXRlbXM6IG51bWJlciA9IGRlZmF1bHRzLnRhZ0lucHV0Lm1heEl0ZW1zO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdmFsaWRhdG9yc1xuICAgICAqIEBkZXNjIGFycmF5IG9mIFZhbGlkYXRvcnMgdGhhdCBhcmUgdXNlZCB0byB2YWxpZGF0ZSB0aGUgdGFnIGJlZm9yZSBpdCBnZXRzIGFwcGVuZGVkIHRvIHRoZSBsaXN0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBkZWZhdWx0cy50YWdJbnB1dC52YWxpZGF0b3JzO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYXN5bmNWYWxpZGF0b3JzXG4gICAgICogQGRlc2MgYXJyYXkgb2YgQXN5bmNWYWxpZGF0b3IgdGhhdCBhcmUgdXNlZCB0byB2YWxpZGF0ZSB0aGUgdGFnIGJlZm9yZSBpdCBnZXRzIGFwcGVuZGVkIHRvIHRoZSBsaXN0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGFzeW5jVmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbltdID0gZGVmYXVsdHMudGFnSW5wdXQuYXN5bmNWYWxpZGF0b3JzO1xuXG4gICAgLyoqXG4gICAgKiAtIGlmIHNldCB0byB0cnVlLCBpdCB3aWxsIG9ubHkgcG9zc2libGUgdG8gYWRkIGl0ZW1zIGZyb20gdGhlIGF1dG9jb21wbGV0ZVxuICAgICogQG5hbWUgb25seUZyb21BdXRvY29tcGxldGVcbiAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBvbmx5RnJvbUF1dG9jb21wbGV0ZSA9IGRlZmF1bHRzLnRhZ0lucHV0Lm9ubHlGcm9tQXV0b2NvbXBsZXRlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZXJyb3JNZXNzYWdlc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBlcnJvck1lc3NhZ2VzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0gZGVmYXVsdHMudGFnSW5wdXQuZXJyb3JNZXNzYWdlcztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRoZW1lXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHRoZW1lOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC50aGVtZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uVGV4dENoYW5nZURlYm91bmNlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIG9uVGV4dENoYW5nZURlYm91bmNlID0gZGVmYXVsdHMudGFnSW5wdXQub25UZXh0Q2hhbmdlRGVib3VuY2U7XG5cbiAgICAvKipcbiAgICAgKiAtIGN1c3RvbSBpZCBhc3NpZ25lZCB0byB0aGUgaW5wdXRcbiAgICAgKiBAbmFtZSBpZFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBpbnB1dElkID0gZGVmYXVsdHMudGFnSW5wdXQuaW5wdXRJZDtcblxuICAgIC8qKlxuICAgICAqIC0gY3VzdG9tIGNsYXNzIGFzc2lnbmVkIHRvIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBpbnB1dENsYXNzOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5pbnB1dENsYXNzO1xuXG4gICAgLyoqXG4gICAgICogLSBvcHRpb24gdG8gY2xlYXIgdGV4dCBpbnB1dCB3aGVuIHRoZSBmb3JtIGlzIGJsdXJyZWRcbiAgICAgKiBAbmFtZSBjbGVhck9uQmx1clxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBjbGVhck9uQmx1cjogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmNsZWFyT25CbHVyO1xuXG4gICAgLyoqXG4gICAgICogLSBoaWRlRm9ybVxuICAgICAqIEBuYW1lIGNsZWFyT25CbHVyXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGhpZGVGb3JtOiBib29sZWFuID0gZGVmYXVsdHMudGFnSW5wdXQuaGlkZUZvcm07XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhZGRPbkJsdXJcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgYWRkT25CbHVyOiBib29sZWFuID0gZGVmYXVsdHMudGFnSW5wdXQuYWRkT25CbHVyO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYWRkT25QYXN0ZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBhZGRPblBhc3RlOiBib29sZWFuID0gZGVmYXVsdHMudGFnSW5wdXQuYWRkT25QYXN0ZTtcblxuICAgIC8qKlxuICAgICAqIC0gcGF0dGVybiB1c2VkIHdpdGggdGhlIG5hdGl2ZSBtZXRob2Qgc3BsaXQoKSB0byBzZXBhcmF0ZSBwYXR0ZXJucyBpbiB0aGUgc3RyaW5nIHBhc3RlZFxuICAgICAqIEBuYW1lIHBhc3RlU3BsaXRQYXR0ZXJuXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHBhc3RlU3BsaXRQYXR0ZXJuID0gZGVmYXVsdHMudGFnSW5wdXQucGFzdGVTcGxpdFBhdHRlcm47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBibGlua0lmRHVwZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBibGlua0lmRHVwZSA9IGRlZmF1bHRzLnRhZ0lucHV0LmJsaW5rSWZEdXBlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmVtb3ZhYmxlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHJlbW92YWJsZSA9IGRlZmF1bHRzLnRhZ0lucHV0LnJlbW92YWJsZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGVkaXRhYmxlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGVkaXRhYmxlOiBib29sZWFuID0gZGVmYXVsdHMudGFnSW5wdXQuZWRpdGFibGU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbGxvd0R1cGVzXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGFsbG93RHVwZXMgPSBkZWZhdWx0cy50YWdJbnB1dC5hbGxvd0R1cGVzO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIGlmIHNldCB0byB0cnVlLCB0aGUgbmV3bHkgYWRkZWQgdGFncyB3aWxsIGJlIGFkZGVkIGFzIHN0cmluZ3MsIGFuZCBub3Qgb2JqZWN0c1xuICAgICAqIEBuYW1lIG1vZGVsQXNTdHJpbmdzXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIG1vZGVsQXNTdHJpbmdzID0gZGVmYXVsdHMudGFnSW5wdXQubW9kZWxBc1N0cmluZ3M7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB0cmltVGFnc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyB0cmltVGFncyA9IGRlZmF1bHRzLnRhZ0lucHV0LnRyaW1UYWdzO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaW5wdXRUZXh0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGdldCBpbnB1dFRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRUZXh0VmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmlwcGxlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHJpcHBsZTogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LnJpcHBsZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRhYmluZGV4XG4gICAgICogQGRlc2MgcGFzcyB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgdGFiaW5kZXggdG8gdGhlIGlucHV0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHRhYmluZGV4OiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC50YWJJbmRleDtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRpc2FibGVcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgZGlzYWJsZTogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmRpc2FibGU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkcmFnWm9uZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBkcmFnWm9uZTogc3RyaW5nID0gZGVmYXVsdHMudGFnSW5wdXQuZHJhZ1pvbmU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblJlbW92aW5nXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIG9uUmVtb3ZpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5vblJlbW92aW5nO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25BZGRpbmdcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgb25BZGRpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5vbkFkZGluZztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFuaW1hdGlvbkR1cmF0aW9uXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGFuaW1hdGlvbkR1cmF0aW9uID0gZGVmYXVsdHMudGFnSW5wdXQuYW5pbWF0aW9uRHVyYXRpb247XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbkFkZFxuICAgICAqIEBkZXNjIGV2ZW50IGVtaXR0ZWQgd2hlbiBhZGRpbmcgYSBuZXcgaXRlbVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25BZGQgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25SZW1vdmVcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gcmVtb3ZpbmcgYW4gZXhpc3RpbmcgaXRlbVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25SZW1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25TZWxlY3RcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gc2VsZWN0aW5nIGFuIGl0ZW1cbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uRm9jdXNcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGlucHV0IGlzIGZvY3VzZWRcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uRm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uRm9jdXNcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGlucHV0IGlzIGJsdXJyZWRcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uQmx1ciA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25UZXh0Q2hhbmdlXG4gICAgICogQGRlc2MgZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBpbnB1dCB2YWx1ZSBjaGFuZ2VzXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblRleHRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogLSBvdXRwdXQgdHJpZ2dlcmVkIHdoZW4gdGV4dCBpcyBwYXN0ZWQgaW4gdGhlIGZvcm1cbiAgICAgKiBAbmFtZSBvblBhc3RlXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblBhc3RlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICAvKipcbiAgICAgKiAtIG91dHB1dCB0cmlnZ2VyZWQgd2hlbiB0YWcgZW50ZXJlZCBpcyBub3QgdmFsaWRcbiAgICAgKiBAbmFtZSBvblZhbGlkYXRpb25FcnJvclxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25WYWxpZGF0aW9uRXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogLSBvdXRwdXQgdHJpZ2dlcmVkIHdoZW4gdGFnIGlzIGVkaXRlZFxuICAgICAqIEBuYW1lIG9uVGFnRWRpdGVkXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblRhZ0VkaXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkcm9wZG93blxuICAgICAqL1xuICAgIC8vIEBDb250ZW50Q2hpbGQoZm9yd2FyZFJlZigoKSA9PiBUYWdJbnB1dERyb3Bkb3duKSwge3N0YXRpYzogdHJ1ZX0pIGRyb3Bkb3duOiBUYWdJbnB1dERyb3Bkb3duO1xuICAgIEBDb250ZW50Q2hpbGQoVGFnSW5wdXREcm9wZG93biwgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyBkcm9wZG93bjogVGFnSW5wdXREcm9wZG93bjtcbiAgICAvKipcbiAgICAgKiBAbmFtZSB0ZW1wbGF0ZVxuICAgICAqIEBkZXNjIHJlZmVyZW5jZSB0byB0aGUgdGVtcGxhdGUgaWYgcHJvdmlkZWQgYnkgdGhlIHVzZXJcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKFRlbXBsYXRlUmVmLCB7IGRlc2NlbmRhbnRzOiBmYWxzZSB9KSBwdWJsaWMgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dEZvcm1cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKFRhZ0lucHV0Rm9ybSwgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyBpbnB1dEZvcm06IFRhZ0lucHV0Rm9ybTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlbGVjdGVkVGFnXG4gICAgICogQGRlc2MgcmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IHNlbGVjdGVkIHRhZ1xuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RlZFRhZzogVGFnTW9kZWwgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpc0xvYWRpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNMb2FkaW5nID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dFRleHRcbiAgICAgKiBAcGFyYW0gdGV4dFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgaW5wdXRUZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmlucHV0VGV4dFZhbHVlID0gdGV4dDtcbiAgICAgICAgdGhpcy5pbnB1dFRleHRDaGFuZ2UuZW1pdCh0ZXh0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB0YWdzXG4gICAgICogQGRlc2MgbGlzdCBvZiBFbGVtZW50IGl0ZW1zXG4gICAgICovXG4gICAgQFZpZXdDaGlsZHJlbihUYWdDb21wb25lbnQpIHB1YmxpYyB0YWdzOiBRdWVyeUxpc3Q8VGFnQ29tcG9uZW50PjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGxpc3RlbmVyc1xuICAgICAqIEBkZXNjIGFycmF5IG9mIGV2ZW50cyB0aGF0IGdldCBmaXJlZCB1c2luZyBAZmlyZUV2ZW50c1xuICAgICAqL1xuICAgIHByaXZhdGUgbGlzdGVuZXJzID0ge1xuICAgICAgICBbY29uc3RhbnRzLktFWURPV05dOiA8eyAoZnVuKTogYW55IH1bXT5bXSxcbiAgICAgICAgW2NvbnN0YW50cy5LRVlVUF06IDx7IChmdW4pOiBhbnkgfVtdPltdXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBlbWl0dGVyIGZvciB0aGUgMi13YXkgZGF0YSBiaW5kaW5nIGlucHV0VGV4dCB2YWx1ZVxuICAgICAqIEBuYW1lIGlucHV0VGV4dENoYW5nZVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgaW5wdXRUZXh0Q2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBwcml2YXRlIHZhcmlhYmxlIHRvIGJpbmQgZ2V0L3NldFxuICAgICAqIEBuYW1lIGlucHV0VGV4dFZhbHVlXG4gICAgICovXG4gICAgcHVibGljIGlucHV0VGV4dFZhbHVlID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBAZGVzYyByZW1vdmVzIHRoZSB0YWIgaW5kZXggaWYgaXQgaXMgc2V0IC0gaXQgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaCB0byB0aGUgaW5wdXRcbiAgICAgKiBAbmFtZSB0YWJpbmRleEF0dHJcbiAgICAgKi9cbiAgICBASG9zdEJpbmRpbmcoJ2F0dHIudGFiaW5kZXgnKVxuICAgIHB1YmxpYyBnZXQgdGFiaW5kZXhBdHRyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhYmluZGV4ICE9PSAnJyA/ICctMScgOiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbmltYXRpb25NZXRhZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBhbmltYXRpb25NZXRhZGF0YTogeyB2YWx1ZTogc3RyaW5nLCBwYXJhbXM6IG9iamVjdCB9O1xuXG4gICAgcHVibGljIGVycm9yczogc3RyaW5nW10gPSBbXTtcblxuICAgIHB1YmxpYyBpc1Byb2dyZXNzQmFyVmlzaWJsZSQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBkcmFnUHJvdmlkZXI6IERyYWdQcm92aWRlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG5nQWZ0ZXJWaWV3SW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIHNldCB1cCBsaXN0ZW5lcnNcblxuICAgICAgICB0aGlzLnNldFVwS2V5cHJlc3NMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5zZXR1cFNlcGFyYXRvcktleXNMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnNldFVwSW5wdXRLZXlkb3duTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub25UZXh0Q2hhbmdlLm9ic2VydmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VXBUZXh0Q2hhbmdlU3Vic2NyaWJlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgY2xlYXIgb24gYmx1ciBpcyBzZXQgdG8gdHJ1ZSwgc3Vic2NyaWJlIHRvIHRoZSBldmVudCBhbmQgY2xlYXIgdGhlIHRleHQncyBmb3JtXG4gICAgICAgIGlmICh0aGlzLmNsZWFyT25CbHVyIHx8IHRoaXMuYWRkT25CbHVyKSB7XG4gICAgICAgICAgICB0aGlzLnNldFVwT25CbHVyU3Vic2NyaWJlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYWRkT25QYXN0ZSBpcyBzZXQgdG8gdHJ1ZSwgcmVnaXN0ZXIgdGhlIGhhbmRsZXIgYW5kIGFkZCBpdGVtc1xuICAgICAgICBpZiAodGhpcy5hZGRPblBhc3RlKSB7XG4gICAgICAgICAgICB0aGlzLnNldFVwT25QYXN0ZUxpc3RlbmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0dXNDaGFuZ2VzJCA9IHRoaXMuaW5wdXRGb3JtLmZvcm0uc3RhdHVzQ2hhbmdlcztcblxuICAgICAgICBzdGF0dXNDaGFuZ2VzJC5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKChzdGF0dXM6IHN0cmluZykgPT4gc3RhdHVzICE9PSAnUEVORElORycpXG4gICAgICAgICkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gdGhpcy5pbnB1dEZvcm0uZ2V0RXJyb3JNZXNzYWdlcyh0aGlzLmVycm9yTWVzc2FnZXMpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmlzUHJvZ3Jlc3NCYXJWaXNpYmxlJCA9IHN0YXR1c0NoYW5nZXMkLnBpcGUoXG4gICAgICAgICAgICBtYXAoKHN0YXR1czogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXR1cyA9PT0gJ1BFTkRJTkcnIHx8IHRoaXMuaXNMb2FkaW5nO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBpZiBoaWRlRm9ybSBpcyBzZXQgdG8gdHJ1ZSwgcmVtb3ZlIHRoZSBpbnB1dFxuICAgICAgICBpZiAodGhpcy5oaWRlRm9ybSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEZvcm0uZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgbmdPbkluaXRcbiAgICAgKi9cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIGlmIHRoZSBudW1iZXIgb2YgaXRlbXMgc3BlY2lmaWVkIGluIHRoZSBtb2RlbCBpcyA+IG9mIHRoZSB2YWx1ZSBvZiBtYXhJdGVtc1xuICAgICAgICAvLyBkZWdyYWRlIGdyYWNlZnVsbHkgYW5kIGxldCB0aGUgbWF4IG51bWJlciBvZiBpdGVtcyB0byBiZSB0aGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBtb2RlbFxuICAgICAgICAvLyB0aG91Z2gsIHdhcm4gdGhlIHVzZXIuXG4gICAgICAgIGNvbnN0IGhhc1JlYWNoZWRNYXhJdGVtcyA9IHRoaXMubWF4SXRlbXMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdGhpcy5pdGVtcyAmJlxuICAgICAgICAgICAgdGhpcy5pdGVtcy5sZW5ndGggPiB0aGlzLm1heEl0ZW1zO1xuXG4gICAgICAgIGlmIChoYXNSZWFjaGVkTWF4SXRlbXMpIHtcbiAgICAgICAgICAgIHRoaXMubWF4SXRlbXMgPSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybihjb25zdGFudHMuTUFYX0lURU1TX1dBUk5JTkcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0dGluZyBlZGl0YWJsZSB0byBmYWxzZSB0byBmaXggcHJvYmxlbSB3aXRoIHRhZ3MgaW4gSUUgc3RpbGwgYmVpbmcgZWRpdGFibGUgd2hlblxuICAgICAgICAvLyBvbmx5RnJvbUF1dG9jb21wbGV0ZSBpcyB0cnVlXG4gICAgICAgIHRoaXMuZWRpdGFibGUgPSB0aGlzLm9ubHlGcm9tQXV0b2NvbXBsZXRlID8gZmFsc2UgOiB0aGlzLmVkaXRhYmxlO1xuXG4gICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uTWV0YWRhdGEoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblJlbW92ZVJlcXVlc3RlZFxuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwdWJsaWMgb25SZW1vdmVSZXF1ZXN0ZWQodGFnOiBUYWdNb2RlbCwgaW5kZXg6IG51bWJlcik6IFByb21pc2U8VGFnTW9kZWw+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaWJlRm4gPSAobW9kZWw6IFRhZ01vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtKG1vZGVsLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0YWcpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5vblJlbW92aW5nID9cbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3ZpbmcodGFnKVxuICAgICAgICAgICAgICAgICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHN1YnNjcmliZUZuKSA6IHN1YnNjcmliZUZuKHRhZyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uQWRkaW5nUmVxdWVzdGVkXG4gICAgICogQHBhcmFtIGZyb21BdXRvY29tcGxldGUge2Jvb2xlYW59XG4gICAgICogQHBhcmFtIHRhZyB7VGFnTW9kZWx9XG4gICAgICogQHBhcmFtIGluZGV4PyB7bnVtYmVyfVxuICAgICAqIEBwYXJhbSBnaXZldXBGb2N1cz8ge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHVibGljIG9uQWRkaW5nUmVxdWVzdGVkKGZyb21BdXRvY29tcGxldGU6IGJvb2xlYW4sIHRhZzogVGFnTW9kZWwsXG4gICAgICAgIGluZGV4PzogbnVtYmVyLCBnaXZldXBGb2N1cz86IGJvb2xlYW4pOiBQcm9taXNlPFRhZ01vZGVsPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVGbiA9IChtb2RlbDogVGFnTW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgICAgICAuYWRkSXRlbShmcm9tQXV0b2NvbXBsZXRlLCBtb2RlbCwgaW5kZXgsIGdpdmV1cEZvY3VzKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9uQWRkaW5nID9cbiAgICAgICAgICAgICAgICB0aGlzLm9uQWRkaW5nKHRhZylcbiAgICAgICAgICAgICAgICAgICAgLnBpcGUoZmlyc3QoKSlcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShzdWJzY3JpYmVGbiwgcmVqZWN0KSA6IHN1YnNjcmliZUZuKHRhZyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFwcGVuZFRhZ1xuICAgICAqIEBwYXJhbSB0YWcge1RhZ01vZGVsfVxuICAgICAqL1xuICAgIHB1YmxpYyBhcHBlbmRUYWcgPSAodGFnOiBUYWdNb2RlbCwgaW5kZXggPSB0aGlzLml0ZW1zLmxlbmd0aCk6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy5tb2RlbEFzU3RyaW5ncyA/IHRhZ1t0aGlzLmlkZW50aWZ5QnldIDogdGFnO1xuXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXG4gICAgICAgICAgICAuLi5pdGVtcy5zbGljZSgwLCBpbmRleCksXG4gICAgICAgICAgICBtb2RlbCxcbiAgICAgICAgICAgIC4uLml0ZW1zLnNsaWNlKGluZGV4LCBpdGVtcy5sZW5ndGgpXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgY3JlYXRlVGFnXG4gICAgICogQHBhcmFtIG1vZGVsXG4gICAgICovXG4gICAgcHVibGljIGNyZWF0ZVRhZyA9IChtb2RlbDogVGFnTW9kZWwpOiBUYWdNb2RlbCA9PiB7XG4gICAgICAgIGNvbnN0IHRyaW0gPSAodmFsOiBUYWdNb2RlbCwga2V5OiBzdHJpbmcpOiBUYWdNb2RlbCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyB2YWwudHJpbSgpIDogdmFsW2tleV07XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnR5cGVvZiBtb2RlbCAhPT0gJ3N0cmluZycgPyBtb2RlbCA6IHt9LFxuICAgICAgICAgICAgW3RoaXMuZGlzcGxheUJ5XTogdGhpcy50cmltVGFncyA/IHRyaW0obW9kZWwsIHRoaXMuZGlzcGxheUJ5KSA6IG1vZGVsLFxuICAgICAgICAgICAgW3RoaXMuaWRlbnRpZnlCeV06IHRoaXMudHJpbVRhZ3MgPyB0cmltKG1vZGVsLCB0aGlzLmlkZW50aWZ5QnkpIDogbW9kZWxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZWxlY3RJdGVtXG4gICAgICogQGRlc2Mgc2VsZWN0cyBpdGVtIHBhc3NlZCBhcyBwYXJhbWV0ZXIgYXMgdGhlIHNlbGVjdGVkIHRhZ1xuICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICogQHBhcmFtIGVtaXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc2VsZWN0SXRlbShpdGVtOiBUYWdNb2RlbCB8IHVuZGVmaW5lZCwgZW1pdCA9IHRydWUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaXNSZWFkb25seSA9IGl0ZW0gJiYgdHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnICYmIGl0ZW0ucmVhZG9ubHk7XG5cbiAgICAgICAgaWYgKGlzUmVhZG9ubHkgfHwgdGhpcy5zZWxlY3RlZFRhZyA9PT0gaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFRhZyA9IGl0ZW07XG5cbiAgICAgICAgaWYgKGVtaXQpIHtcbiAgICAgICAgICAgIHRoaXMub25TZWxlY3QuZW1pdChpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGZpcmVFdmVudHNcbiAgICAgKiBAZGVzYyBnb2VzIHRocm91Z2ggdGhlIGxpc3Qgb2YgdGhlIGV2ZW50cyBmb3IgYSBnaXZlbiBldmVudE5hbWUsIGFuZCBmaXJlcyBlYWNoIG9mIHRoZW1cbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lXG4gICAgICogQHBhcmFtICRldmVudFxuICAgICAqL1xuICAgIHB1YmxpYyBmaXJlRXZlbnRzKGV2ZW50TmFtZTogc3RyaW5nLCAkZXZlbnQ/KTogdm9pZCB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50TmFtZV0uZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lci5jYWxsKHRoaXMsICRldmVudCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGhhbmRsZUtleWRvd25cbiAgICAgKiBAZGVzYyBoYW5kbGVzIGFjdGlvbiB3aGVuIHRoZSB1c2VyIGhpdHMgYSBrZXlib2FyZCBrZXlcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBoYW5kbGVLZXlkb3duKGRhdGE6IGFueSk6IHZvaWQge1xuICAgICAgICBjb25zdCBldmVudCA9IGRhdGEuZXZlbnQ7XG4gICAgICAgIGNvbnN0IGtleSA9IGV2ZW50LmtleUNvZGUgfHwgZXZlbnQud2hpY2g7XG4gICAgICAgIGNvbnN0IHNoaWZ0S2V5ID0gZXZlbnQuc2hpZnRLZXkgfHwgZmFsc2U7XG5cbiAgICAgICAgc3dpdGNoIChjb25zdGFudHMuS0VZX1BSRVNTX0FDVElPTlNba2V5XSkge1xuICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuQUNUSU9OU19LRVlTLkRFTEVURTpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFRhZyAmJiB0aGlzLnJlbW92YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZih0aGlzLnNlbGVjdGVkVGFnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblJlbW92ZVJlcXVlc3RlZCh0aGlzLnNlbGVjdGVkVGFnLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5BQ1RJT05TX0tFWVMuU1dJVENIX1BSRVY6XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlVG9UYWcoZGF0YS5tb2RlbCwgY29uc3RhbnRzLlBSRVYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5BQ1RJT05TX0tFWVMuU1dJVENIX05FWFQ6XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlVG9UYWcoZGF0YS5tb2RlbCwgY29uc3RhbnRzLk5FWFQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5BQ1RJT05TX0tFWVMuVEFCOlxuICAgICAgICAgICAgICAgIGlmIChzaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ZpcnN0VGFnKGRhdGEubW9kZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1RhZyhkYXRhLm1vZGVsLCBjb25zdGFudHMuUFJFVik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNMYXN0VGFnKGRhdGEubW9kZWwpICYmICh0aGlzLmRpc2FibGUgfHwgdGhpcy5tYXhJdGVtc1JlYWNoZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1RhZyhkYXRhLm1vZGVsLCBjb25zdGFudHMuTkVYVCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvdXJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgb25Gb3JtU3VibWl0KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5vbkFkZGluZ1JlcXVlc3RlZChmYWxzZSwgdGhpcy5mb3JtVmFsdWUpO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNldElucHV0VmFsdWVcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0SW5wdXRWYWx1ZSh2YWx1ZTogc3RyaW5nLCBlbWl0RXZlbnQgPSB0cnVlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmdldENvbnRyb2woKTtcblxuICAgICAgICAvLyB1cGRhdGUgZm9ybSB2YWx1ZSB3aXRoIHRoZSB0cmFuc2Zvcm1lZCBpdGVtXG4gICAgICAgIGNvbnRyb2wuc2V0VmFsdWUodmFsdWUsIHsgZW1pdEV2ZW50IH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldENvbnRyb2xcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldENvbnRyb2woKTogRm9ybUNvbnRyb2wge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dEZvcm0udmFsdWUgYXMgRm9ybUNvbnRyb2w7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZm9jdXNcbiAgICAgKiBAcGFyYW0gYXBwbHlGb2N1c1xuICAgICAqIEBwYXJhbSBkaXNwbGF5QXV0b2NvbXBsZXRlXG4gICAgICovXG4gICAgcHVibGljIGZvY3VzKGFwcGx5Rm9jdXMgPSBmYWxzZSwgZGlzcGxheUF1dG9jb21wbGV0ZSA9IGZhbHNlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdQcm92aWRlci5nZXRTdGF0ZSgnZHJhZ2dpbmcnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RJdGVtKHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgIGlmIChhcHBseUZvY3VzKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Rm9ybS5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQodGhpcy5mb3JtVmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYmx1clxuICAgICAqL1xuICAgIHB1YmxpYyBibHVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuXG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQodGhpcy5mb3JtVmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGhhc0Vycm9yc1xuICAgICAqL1xuICAgIHB1YmxpYyBoYXNFcnJvcnMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuaW5wdXRGb3JtICYmIHRoaXMuaW5wdXRGb3JtLmhhc0Vycm9ycygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlzSW5wdXRGb2N1c2VkXG4gICAgICovXG4gICAgcHVibGljIGlzSW5wdXRGb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISF0aGlzLmlucHV0Rm9ybSAmJiB0aGlzLmlucHV0Rm9ybS5pc0lucHV0Rm9jdXNlZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIC0gdGhpcyBpcyB0aGUgb25lIHdheSBJIGZvdW5kIHRvIHRlbGwgaWYgdGhlIHRlbXBsYXRlIGhhcyBiZWVuIHBhc3NlZCBhbmQgaXQgaXMgbm90XG4gICAgICogdGhlIHRlbXBsYXRlIGZvciB0aGUgbWVudSBpdGVtXG4gICAgICogQG5hbWUgaGFzQ3VzdG9tVGVtcGxhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzQ3VzdG9tVGVtcGxhdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZXMgPyB0aGlzLnRlbXBsYXRlcy5maXJzdCA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbWVudVRlbXBsYXRlID0gdGhpcy5kcm9wZG93biAmJiB0aGlzLmRyb3Bkb3duLnRlbXBsYXRlcyA/XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duLnRlbXBsYXRlcy5maXJzdCA6IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gQm9vbGVhbih0ZW1wbGF0ZSAmJiB0ZW1wbGF0ZSAhPT0gbWVudVRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBtYXhJdGVtc1JlYWNoZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IG1heEl0ZW1zUmVhY2hlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF4SXRlbXMgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdGhpcy5pdGVtcy5sZW5ndGggPj0gdGhpcy5tYXhJdGVtcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBmb3JtVmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IGZvcm1WYWx1ZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBmb3JtID0gdGhpcy5pbnB1dEZvcm0udmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIGZvcm0gPyBmb3JtLnZhbHVlIDogJyc7XG4gICAgfVxuXG4gICAgLyoqM1xuICAgICAqIEBuYW1lIG9uRHJhZ1N0YXJ0ZWRcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EcmFnU3RhcnRlZChldmVudDogRHJhZ0V2ZW50LCB0YWc6IFRhZ01vZGVsLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB7IHpvbmU6IHRoaXMuZHJhZ1pvbmUsIHRhZywgaW5kZXggfSBhcyBEcmFnZ2VkVGFnO1xuXG4gICAgICAgIHRoaXMuZHJhZ1Byb3ZpZGVyLnNldFNlbmRlcih0aGlzKTtcbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIuc2V0RHJhZ2dlZEl0ZW0oZXZlbnQsIGl0ZW0pO1xuICAgICAgICB0aGlzLmRyYWdQcm92aWRlci5zZXRTdGF0ZSh7IGRyYWdnaW5nOiB0cnVlLCBpbmRleCB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbkRyYWdPdmVyXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIG9uRHJhZ092ZXIoZXZlbnQ6IERyYWdFdmVudCwgaW5kZXg/OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIuc2V0U3RhdGUoeyBkcm9wcGluZzogdHJ1ZSB9KTtcbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIuc2V0UmVjZWl2ZXIodGhpcyk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblRhZ0Ryb3BwZWRcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwdWJsaWMgb25UYWdEcm9wcGVkKGV2ZW50OiBEcmFnRXZlbnQsIGluZGV4PzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmRyYWdQcm92aWRlci5nZXREcmFnZ2VkSXRlbShldmVudCk7XG5cbiAgICAgICAgaWYgKCFpdGVtIHx8IGl0ZW0uem9uZSAhPT0gdGhpcy5kcmFnWm9uZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIub25UYWdEcm9wcGVkKGl0ZW0udGFnLCBpdGVtLmluZGV4LCBpbmRleCk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNEcm9wcGluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBpc0Ryb3BwaW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBpc1JlY2VpdmVyID0gdGhpcy5kcmFnUHJvdmlkZXIucmVjZWl2ZXIgPT09IHRoaXM7XG4gICAgICAgIGNvbnN0IGlzRHJvcHBpbmcgPSB0aGlzLmRyYWdQcm92aWRlci5nZXRTdGF0ZSgnZHJvcHBpbmcnKTtcblxuICAgICAgICByZXR1cm4gQm9vbGVhbihpc1JlY2VpdmVyICYmIGlzRHJvcHBpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uVGFnQmx1cnJlZFxuICAgICAqIEBwYXJhbSBjaGFuZ2VkRWxlbWVudCB7VGFnTW9kZWx9XG4gICAgICogQHBhcmFtIGluZGV4IHtudW1iZXJ9XG4gICAgICovXG4gICAgcHVibGljIG9uVGFnQmx1cnJlZChjaGFuZ2VkRWxlbWVudDogVGFnTW9kZWwsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pdGVtc1tpbmRleF0gPSBjaGFuZ2VkRWxlbWVudDtcbiAgICAgICAgdGhpcy5ibHVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdHJhY2tCeVxuICAgICAqIEBwYXJhbSBpdGVtc1xuICAgICAqL1xuICAgIHB1YmxpYyB0cmFja0J5KGluZGV4OiBudW1iZXIsIGl0ZW06IFRhZ01vZGVsKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1bdGhpcy5pZGVudGlmeUJ5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB1cGRhdGVFZGl0ZWRUYWdcbiAgICAgKiBAcGFyYW0gdGFnXG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZUVkaXRlZFRhZyh7IHRhZywgaW5kZXggfTogeyB0YWc6IFRhZ01vZGVsLCBpbmRleDogbnVtYmVyIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vblRhZ0VkaXRlZC5lbWl0KHRhZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGFnXG4gICAgICogQHBhcmFtIGlzRnJvbUF1dG9jb21wbGV0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBpc1RhZ1ZhbGlkID0gKHRhZzogVGFnTW9kZWwsIGZyb21BdXRvY29tcGxldGUgPSBmYWxzZSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLmRyb3Bkb3duID8gdGhpcy5kcm9wZG93bi5zZWxlY3RlZEl0ZW0gOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRJdGVtRGlzcGxheSh0YWcpLnRyaW0oKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtICYmICFmcm9tQXV0b2NvbXBsZXRlIHx8ICF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHVwZSA9IHRoaXMuZmluZER1cGUodGFnLCBmcm9tQXV0b2NvbXBsZXRlKTtcblxuICAgICAgICAvLyBpZiBzbywgZ2l2ZSBhIHZpc3VhbCBjdWUgYW5kIHJldHVybiBmYWxzZVxuICAgICAgICBpZiAoIXRoaXMuYWxsb3dEdXBlcyAmJiBkdXBlICYmIHRoaXMuYmxpbmtJZkR1cGUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy50YWdzLmZpbmQoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbVZhbHVlKGl0ZW0ubW9kZWwpID09PSB0aGlzLmdldEl0ZW1WYWx1ZShkdXBlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5ibGluaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNGcm9tQXV0b2NvbXBsZXRlID0gZnJvbUF1dG9jb21wbGV0ZSAmJiB0aGlzLm9ubHlGcm9tQXV0b2NvbXBsZXRlO1xuXG4gICAgICAgIGNvbnN0IGFzc2VydGlvbnMgPSBbXG4gICAgICAgICAgICAvLyAxLiB0aGVyZSBtdXN0IGJlIG5vIGR1cGUgT1IgZHVwZXMgYXJlIGFsbG93ZWRcbiAgICAgICAgICAgICFkdXBlIHx8IHRoaXMuYWxsb3dEdXBlcyxcblxuICAgICAgICAgICAgLy8gMi4gY2hlY2sgbWF4IGl0ZW1zIGhhcyBub3QgYmVlbiByZWFjaGVkXG4gICAgICAgICAgICAhdGhpcy5tYXhJdGVtc1JlYWNoZWQsXG5cbiAgICAgICAgICAgIC8vIDMuIGNoZWNrIGl0ZW0gY29tZXMgZnJvbSBhdXRvY29tcGxldGUgb3Igb25seUZyb21BdXRvY29tcGxldGUgaXMgZmFsc2VcbiAgICAgICAgICAgICgoaXNGcm9tQXV0b2NvbXBsZXRlKSB8fCAhdGhpcy5vbmx5RnJvbUF1dG9jb21wbGV0ZSlcbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4gYXNzZXJ0aW9ucy5maWx0ZXIoQm9vbGVhbikubGVuZ3RoID09PSBhc3NlcnRpb25zLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBtb3ZlVG9UYWdcbiAgICAgKiBAcGFyYW0gaXRlbVxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25cbiAgICAgKi9cbiAgICBwcml2YXRlIG1vdmVUb1RhZyhpdGVtOiBUYWdNb2RlbCwgZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaXNMYXN0ID0gdGhpcy5pc0xhc3RUYWcoaXRlbSk7XG4gICAgICAgIGNvbnN0IGlzRmlyc3QgPSB0aGlzLmlzRmlyc3RUYWcoaXRlbSk7XG4gICAgICAgIGNvbnN0IHN0b3BTd2l0Y2ggPSAoZGlyZWN0aW9uID09PSBjb25zdGFudHMuTkVYVCAmJiBpc0xhc3QpIHx8XG4gICAgICAgICAgICAoZGlyZWN0aW9uID09PSBjb25zdGFudHMuUFJFViAmJiBpc0ZpcnN0KTtcblxuICAgICAgICBpZiAoc3RvcFN3aXRjaCkge1xuICAgICAgICAgICAgdGhpcy5mb2N1cyh0cnVlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGRpcmVjdGlvbiA9PT0gY29uc3RhbnRzLk5FWFQgPyAxIDogLTE7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5nZXRUYWdJbmRleChpdGVtKSArIG9mZnNldDtcbiAgICAgICAgY29uc3QgdGFnID0gdGhpcy5nZXRUYWdBdEluZGV4KGluZGV4KTtcblxuICAgICAgICByZXR1cm4gdGFnLnNlbGVjdC5jYWxsKHRhZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNGaXJzdFRhZ1xuICAgICAqIEBwYXJhbSBpdGVtIHtUYWdNb2RlbH1cbiAgICAgKi9cbiAgICBwcml2YXRlIGlzRmlyc3RUYWcoaXRlbTogVGFnTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFncy5maXJzdC5tb2RlbCA9PT0gaXRlbTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpc0xhc3RUYWdcbiAgICAgKiBAcGFyYW0gaXRlbSB7VGFnTW9kZWx9XG4gICAgICovXG4gICAgcHJpdmF0ZSBpc0xhc3RUYWcoaXRlbTogVGFnTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFncy5sYXN0Lm1vZGVsID09PSBpdGVtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldFRhZ0luZGV4XG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFRhZ0luZGV4KGl0ZW06IFRhZ01vZGVsKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgdGFncyA9IHRoaXMudGFncy50b0FycmF5KCk7XG5cbiAgICAgICAgcmV0dXJuIHRhZ3MuZmluZEluZGV4KHRhZyA9PiB0YWcubW9kZWwgPT09IGl0ZW0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldFRhZ0F0SW5kZXhcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFRhZ0F0SW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBjb25zdCB0YWdzID0gdGhpcy50YWdzLnRvQXJyYXkoKTtcblxuICAgICAgICByZXR1cm4gdGFnc1tpbmRleF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmVtb3ZlSXRlbVxuICAgICAqIEBkZXNjIHJlbW92ZXMgYW4gaXRlbSBmcm9tIHRoZSBhcnJheSBvZiB0aGUgbW9kZWxcbiAgICAgKiBAcGFyYW0gdGFnIHtUYWdNb2RlbH1cbiAgICAgKiBAcGFyYW0gaW5kZXgge251bWJlcn1cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlSXRlbSh0YWc6IFRhZ01vZGVsLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLmdldEl0ZW1zV2l0aG91dChpbmRleCk7XG5cbiAgICAgICAgLy8gaWYgdGhlIHJlbW92ZWQgdGFnIHdhcyBzZWxlY3RlZCwgc2V0IGl0IGFzIHVuZGVmaW5lZFxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFRhZyA9PT0gdGFnKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0odW5kZWZpbmVkLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb2N1cyBpbnB1dFxuICAgICAgICB0aGlzLmZvY3VzKHRydWUsIGZhbHNlKTtcblxuICAgICAgICAvLyBlbWl0IHJlbW92ZSBldmVudFxuICAgICAgICB0aGlzLm9uUmVtb3ZlLmVtaXQodGFnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhZGRJdGVtXG4gICAgICogQGRlc2MgYWRkcyB0aGUgY3VycmVudCB0ZXh0IG1vZGVsIHRvIHRoZSBpdGVtcyBhcnJheVxuICAgICAqIEBwYXJhbSBmcm9tQXV0b2NvbXBsZXRlIHtib29sZWFufVxuICAgICAqIEBwYXJhbSBpdGVtIHtUYWdNb2RlbH1cbiAgICAgKiBAcGFyYW0gaW5kZXg/IHtudW1iZXJ9XG4gICAgICogQHBhcmFtIGdpdmV1cEZvY3VzPyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZEl0ZW0oZnJvbUF1dG9jb21wbGV0ZSA9IGZhbHNlLCBpdGVtOiBUYWdNb2RlbCwgaW5kZXg/OiBudW1iZXIsIGdpdmV1cEZvY3VzPzogYm9vbGVhbik6XG4gICAgICAgIFByb21pc2U8VGFnTW9kZWw+IHtcbiAgICAgICAgY29uc3QgZGlzcGxheSA9IHRoaXMuZ2V0SXRlbURpc3BsYXkoaXRlbSk7XG4gICAgICAgIGNvbnN0IHRhZyA9IHRoaXMuY3JlYXRlVGFnKGl0ZW0pO1xuXG4gICAgICAgIGlmIChmcm9tQXV0b2NvbXBsZXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNldElucHV0VmFsdWUodGhpcy5nZXRJdGVtVmFsdWUoaXRlbSwgdHJ1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgcmVzZXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgcmVzZXQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgY29udHJvbCBhbmQgZm9jdXMgaW5wdXRcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsdWUoJycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGdpdmV1cEZvY3VzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXMoZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBmb2N1cyBpbnB1dFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvY3VzKHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKGRpc3BsYXkpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgYXBwZW5kSXRlbSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZFRhZyh0YWcsIGluZGV4KTtcblxuICAgICAgICAgICAgICAgIC8vIGVtaXQgZXZlbnRcbiAgICAgICAgICAgICAgICB0aGlzLm9uQWRkLmVtaXQodGFnKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kcm9wZG93bikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcm9wZG93bi5zaG93RHJvcGRvd25JZkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMuaW5wdXRGb3JtLmZvcm0uc3RhdHVzO1xuICAgICAgICAgICAgY29uc3QgaXNUYWdWYWxpZCA9IHRoaXMuaXNUYWdWYWxpZCh0YWcsIGZyb21BdXRvY29tcGxldGUpO1xuXG4gICAgICAgICAgICBjb25zdCBvblZhbGlkYXRpb25FcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVmFsaWRhdGlvbkVycm9yLmVtaXQodGFnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnVkFMSUQnICYmIGlzVGFnVmFsaWQpIHtcbiAgICAgICAgICAgICAgICBhcHBlbmRJdGVtKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdJTlZBTElEJyB8fCAhaXNUYWdWYWxpZCkge1xuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9uVmFsaWRhdGlvbkVycm9yKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdQRU5ESU5HJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1VwZGF0ZSQgPSB0aGlzLmlucHV0Rm9ybS5mb3JtLnN0YXR1c0NoYW5nZXM7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzVXBkYXRlJFxuICAgICAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcihzdGF0dXNVcGRhdGUgPT4gc3RhdHVzVXBkYXRlICE9PSAnUEVORElORycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3QoKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKHN0YXR1c1VwZGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c1VwZGF0ZSA9PT0gJ1ZBTElEJyAmJiBpc1RhZ1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwZW5kSXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvblZhbGlkYXRpb25FcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0dXBTZXBhcmF0b3JLZXlzTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldHVwU2VwYXJhdG9yS2V5c0xpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBjb25zdCB1c2VTZXBhcmF0b3JLZXlzID0gdGhpcy5zZXBhcmF0b3JLZXlDb2Rlcy5sZW5ndGggPiAwIHx8IHRoaXMuc2VwYXJhdG9yS2V5cy5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9ICgkZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0tleUNvZGUgPSB0aGlzLnNlcGFyYXRvcktleUNvZGVzLmluZGV4T2YoJGV2ZW50LmtleUNvZGUpID49IDA7XG4gICAgICAgICAgICBjb25zdCBoYXNLZXkgPSB0aGlzLnNlcGFyYXRvcktleXMuaW5kZXhPZigkZXZlbnQua2V5KSA+PSAwO1xuICAgICAgICAgICAgLy8gdGhlIGtleUNvZGUgb2Yga2V5ZG93biBldmVudCBpcyAyMjkgd2hlbiBJTUUgaXMgcHJvY2Vzc2luZyB0aGUga2V5IGV2ZW50LlxuICAgICAgICAgICAgY29uc3QgaXNJTUVQcm9jZXNzaW5nID0gJGV2ZW50LmtleUNvZGUgPT09IDIyOTtcblxuICAgICAgICAgICAgaWYgKGhhc0tleUNvZGUgfHwgKGhhc0tleSAmJiAhaXNJTUVQcm9jZXNzaW5nKSkge1xuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMub25BZGRpbmdSZXF1ZXN0ZWQoZmFsc2UsIHRoaXMuZm9ybVZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsaXN0ZW4uY2FsbCh0aGlzLCBjb25zdGFudHMuS0VZRE9XTiwgbGlzdGVuZXIsIHVzZVNlcGFyYXRvcktleXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNldFVwS2V5cHJlc3NMaXN0ZW5lcnNcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFVwS2V5cHJlc3NMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCRldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNDb3JyZWN0S2V5ID0gJGV2ZW50LmtleUNvZGUgPT09IDM3IHx8ICRldmVudC5rZXlDb2RlID09PSA4O1xuXG4gICAgICAgICAgICBpZiAoaXNDb3JyZWN0S2V5ICYmXG4gICAgICAgICAgICAgICAgIXRoaXMuZm9ybVZhbHVlICYmXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhZ3MubGFzdC5zZWxlY3QuY2FsbCh0aGlzLnRhZ3MubGFzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gc2V0dGluZyB1cCB0aGUga2V5cHJlc3MgbGlzdGVuZXJzXG4gICAgICAgIGxpc3Rlbi5jYWxsKHRoaXMsIGNvbnN0YW50cy5LRVlET1dOLCBsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0VXBLZXlkb3duTGlzdGVuZXJzXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRVcElucHV0S2V5ZG93bkxpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnB1dEZvcm0ub25LZXlkb3duLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09PSAnQmFja3NwYWNlJyAmJiB0aGlzLmZvcm1WYWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0VXBPblBhc3RlTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFVwT25QYXN0ZUxpc3RlbmVyKCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuaW5wdXRGb3JtLmlucHV0Lm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgLy8gYXR0YWNoIGxpc3RlbmVyIHRvIGlucHV0XG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGlucHV0LCAncGFzdGUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25QYXN0ZUNhbGxiYWNrKGV2ZW50KTtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZXRVcFRleHRDaGFuZ2VTdWJzY3JpYmVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRVcFRleHRDaGFuZ2VTdWJzY3JpYmVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0Rm9ybS5mb3JtXG4gICAgICAgICAgICAudmFsdWVDaGFuZ2VzXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBkZWJvdW5jZVRpbWUodGhpcy5vblRleHRDaGFuZ2VEZWJvdW5jZSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHZhbHVlOiB7IGl0ZW06IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblRleHRDaGFuZ2UuZW1pdCh2YWx1ZS5pdGVtKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNldFVwT25CbHVyU3Vic2NyaWJlclxuICAgICAqL1xuICAgIHByaXZhdGUgc2V0VXBPbkJsdXJTdWJzY3JpYmVyKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBmaWx0ZXJGbiA9ICgpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHRoaXMuZHJvcGRvd24gJiYgdGhpcy5kcm9wZG93bi5pc1Zpc2libGU7XG4gICAgICAgICAgICByZXR1cm4gIWlzVmlzaWJsZSAmJiAhIXRoaXMuZm9ybVZhbHVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5wdXRGb3JtXG4gICAgICAgICAgICAub25CbHVyXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBkZWJvdW5jZVRpbWUoMTAwKSxcbiAgICAgICAgICAgICAgICBmaWx0ZXIoZmlsdGVyRm4pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNldCA9ICgpID0+IHRoaXMuc2V0SW5wdXRWYWx1ZSgnJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hZGRPbkJsdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkFkZGluZ1JlcXVlc3RlZChmYWxzZSwgdGhpcy5mb3JtVmFsdWUsIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHJlc2V0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZmluZER1cGVcbiAgICAgKiBAcGFyYW0gdGFnXG4gICAgICogQHBhcmFtIGlzRnJvbUF1dG9jb21wbGV0ZVxuICAgICAqL1xuICAgIHByaXZhdGUgZmluZER1cGUodGFnOiBUYWdNb2RlbCwgaXNGcm9tQXV0b2NvbXBsZXRlOiBib29sZWFuKTogVGFnTW9kZWwgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBpZGVudGlmeUJ5ID0gaXNGcm9tQXV0b2NvbXBsZXRlID8gdGhpcy5kcm9wZG93bi5pZGVudGlmeUJ5IDogdGhpcy5pZGVudGlmeUJ5O1xuICAgICAgICBjb25zdCBpZCA9IHRhZ1tpZGVudGlmeUJ5XTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5maW5kKGl0ZW0gPT4gdGhpcy5nZXRJdGVtVmFsdWUoaXRlbSkgPT09IGlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblBhc3RlQ2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHByaXZhdGUgb25QYXN0ZUNhbGxiYWNrID0gYXN5bmMgKGRhdGE6IENsaXBib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGludGVyZmFjZSBJRVdpbmRvdyBleHRlbmRzIFdpbmRvdyB7XG4gICAgICAgICAgICBjbGlwYm9hcmREYXRhOiBEYXRhVHJhbnNmZXI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBnZXRUZXh0ID0gKCk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0lFID0gQm9vbGVhbigod2luZG93IGFzIElFV2luZG93KS5jbGlwYm9hcmREYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaXBib2FyZERhdGEgPSBpc0lFID8gKFxuICAgICAgICAgICAgICAgICh3aW5kb3cgYXMgSUVXaW5kb3cpLmNsaXBib2FyZERhdGFcbiAgICAgICAgICAgICkgOiBkYXRhLmNsaXBib2FyZERhdGE7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gaXNJRSA/ICdUZXh0JyA6ICd0ZXh0L3BsYWluJztcbiAgICAgICAgICAgIHJldHVybiBjbGlwYm9hcmREYXRhID09PSBudWxsID8gJycgOiBjbGlwYm9hcmREYXRhLmdldERhdGEodHlwZSkgfHwgJyc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGdldFRleHQoKTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0cyA9IHRleHRcbiAgICAgICAgICAgIC5zcGxpdCh0aGlzLnBhc3RlU3BsaXRQYXR0ZXJuKVxuICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWcgPSB0aGlzLmNyZWF0ZVRhZyhpdGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsdWUodGFnW3RoaXMuZGlzcGxheUJ5XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub25BZGRpbmdSZXF1ZXN0ZWQoZmFsc2UsIHRhZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXNldElucHV0ID0gKCkgPT4gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldElucHV0VmFsdWUoJycpLCA1MCk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocmVxdWVzdHMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblBhc3RlLmVtaXQodGV4dCk7XG4gICAgICAgICAgICByZXNldElucHV0KCk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2gocmVzZXRJbnB1dCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0QW5pbWF0aW9uTWV0YWRhdGFcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldEFuaW1hdGlvbk1ldGFkYXRhKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbk1ldGFkYXRhID0ge1xuICAgICAgICAgICAgdmFsdWU6ICdpbicsXG4gICAgICAgICAgICBwYXJhbXM6IHsgLi4udGhpcy5hbmltYXRpb25EdXJhdGlvbiB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIl19
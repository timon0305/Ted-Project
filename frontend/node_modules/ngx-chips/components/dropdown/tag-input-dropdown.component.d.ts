import { EventEmitter, Injector, QueryList, TemplateRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ng2Dropdown, Ng2MenuItem } from 'ng2-material-dropdown';
import { TagModel } from '../../core/accessor';
import { TagInputComponent } from '../tag-input/tag-input';
export declare class TagInputDropdown implements AfterViewInit {
    private readonly injector;
    /**
     * @name dropdown
     */
    dropdown: Ng2Dropdown;
    /**
     * @name menuTemplate
     * @desc reference to the template if provided by the user
     */
    templates: QueryList<TemplateRef<any>>;
    /**
     * @name offset
     */
    offset: string;
    /**
     * @name focusFirstElement
     */
    focusFirstElement: boolean;
    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     */
    showDropdownIfEmpty: boolean;
    /**
     * @description observable passed as input which populates the autocomplete items
     * @name autocompleteObservable
     */
    autocompleteObservable: (text: string) => Observable<any>;
    /**
     * - desc minimum text length in order to display the autocomplete dropdown
     * @name minimumTextLength
     */
    minimumTextLength: number;
    /**
     * - number of items to display in the autocomplete dropdown
     * @name limitItemsTo
     */
    limitItemsTo: number;
    /**
     * @name displayBy
     */
    displayBy: string;
    /**
     * @name identifyBy
     */
    identifyBy: string;
    /**
     * @description a function a developer can use to implement custom matching for the autocomplete
     * @name matchingFn
     */
    matchingFn: (value: string, target: TagModel) => boolean;
    /**
     * @name appendToBody
     */
    appendToBody: boolean;
    /**
     * @name keepOpen
     * @description option to leave dropdown open when adding a new item
     */
    keepOpen: boolean;
    /**
     * @name dynamicUpdate
     */
    dynamicUpdate: boolean;
    /**
     * @name zIndex
     */
    zIndex: number;
    /**
     * list of items that match the current value of the input (for autocomplete)
     * @name items
     */
    items: TagModel[];
    /**
     * @name tagInput
     */
    tagInput: TagInputComponent;
    /**
     * @name _autocompleteItems
     */
    private _autocompleteItems;
    /**
     * @name autocompleteItems
     * @param items
     */
    /**
    * @name autocompleteItems
    * @desc array of items that will populate the autocomplete
    */
    autocompleteItems: TagModel[];
    constructor(injector: Injector);
    /**
     * @name ngAfterviewInit
     */
    ngAfterViewInit(): void;
    /**
     * @name updatePosition
     */
    updatePosition(): void;
    /**
     * @name isVisible
     */
    readonly isVisible: boolean;
    /**
     * @name onHide
     */
    onHide(): EventEmitter<Ng2Dropdown>;
    /**
     * @name onItemClicked
     */
    onItemClicked(): EventEmitter<string>;
    /**
     * @name selectedItem
     */
    readonly selectedItem: Ng2MenuItem;
    /**
     * @name state
     */
    readonly state: any;
    /**
     *
     * @name show
     */
    show: () => void;
    /**
     * @name hide
     */
    hide(): void;
    /**
     * @name scrollListener
     */
    scrollListener(): void;
    /**
     * @name onWindowBlur
     */
    onWindowBlur(): void;
    /**
     * @name getFormValue
     */
    private getFormValue;
    /**
     * @name calculatePosition
     */
    private calculatePosition;
    /**
     * @name requestAdding
     * @param item {Ng2MenuItem}
     */
    private requestAdding;
    /**
     * @name createTagModel
     * @param item
     */
    private createTagModel;
    /**
     *
     * @param value {string}
     */
    private getMatchingItems;
    /**
     * @name setItems
     */
    private setItems;
    /**
     * @name resetItems
     */
    private resetItems;
    /**
     * @name populateItems
     * @param data
     */
    private populateItems;
    /**
     * @name getItemsFromObservable
     * @param text
     */
    private getItemsFromObservable;
    /**
     * @name setLoadingState
     * @param state
     */
    private setLoadingState;
}

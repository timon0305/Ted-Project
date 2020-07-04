import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { HighlightPipe } from './core/pipes/highlight.pipe';
import { DragProvider } from './core/providers/drag-provider';
import { OptionsProvider } from './core/providers/options-provider';
import { TagInputComponent } from './components/tag-input/tag-input';
import { DeleteIconComponent } from './components/icon/icon';
import { TagInputForm } from './components/tag-input-form/tag-input-form.component';
import { TagComponent } from './components/tag/tag.component';
import { TagInputDropdown } from './components/dropdown/tag-input-dropdown.component';
import { TagRipple } from './components/tag/tag-ripple.component';
const optionsProvider = new OptionsProvider();
let TagInputModule = class TagInputModule {
    /**
     * @name withDefaults
     * @param options {Options}
     */
    static withDefaults(options) {
        optionsProvider.setOptions(options);
    }
};
TagInputModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            FormsModule,
            Ng2DropdownModule
        ],
        declarations: [
            TagInputComponent,
            DeleteIconComponent,
            TagInputForm,
            TagComponent,
            HighlightPipe,
            TagInputDropdown,
            TagRipple
        ],
        exports: [
            TagInputComponent,
            DeleteIconComponent,
            TagInputForm,
            TagComponent,
            HighlightPipe,
            TagInputDropdown,
            TagRipple
        ],
        providers: [
            DragProvider,
            { provide: COMPOSITION_BUFFER_MODE, useValue: false },
        ]
    })
], TagInputModule);
export { TagInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jaGlwcy8iLCJzb3VyY2VzIjpbInRhZy1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQVcsTUFBTSxtQ0FBbUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDcEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUVsRSxNQUFNLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0FBZ0M5QyxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0lBQ3ZCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBZ0I7UUFDdkMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0osQ0FBQTtBQVJZLGNBQWM7SUE5QjFCLFFBQVEsQ0FBQztRQUNOLE9BQU8sRUFBRTtZQUNMLFlBQVk7WUFDWixtQkFBbUI7WUFDbkIsV0FBVztZQUNYLGlCQUFpQjtTQUNwQjtRQUNELFlBQVksRUFBRTtZQUNWLGlCQUFpQjtZQUNqQixtQkFBbUI7WUFDbkIsWUFBWTtZQUNaLFlBQVk7WUFDWixhQUFhO1lBQ2IsZ0JBQWdCO1lBQ2hCLFNBQVM7U0FDWjtRQUNELE9BQU8sRUFBRTtZQUNMLGlCQUFpQjtZQUNqQixtQkFBbUI7WUFDbkIsWUFBWTtZQUNaLFlBQVk7WUFDWixhQUFhO1lBQ2IsZ0JBQWdCO1lBQ2hCLFNBQVM7U0FDWjtRQUNELFNBQVMsRUFBRTtZQUNQLFlBQVk7WUFDWixFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO1NBQ3hEO0tBQ0osQ0FBQztHQUNXLGNBQWMsQ0FRMUI7U0FSWSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUsIEZvcm1zTW9kdWxlLCBDT01QT1NJVElPTl9CVUZGRVJfTU9ERSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZzJEcm9wZG93bk1vZHVsZSB9IGZyb20gJ25nMi1tYXRlcmlhbC1kcm9wZG93bic7XG5pbXBvcnQgeyBIaWdobGlnaHRQaXBlIH0gZnJvbSAnLi9jb3JlL3BpcGVzL2hpZ2hsaWdodC5waXBlJztcbmltcG9ydCB7IERyYWdQcm92aWRlciB9IGZyb20gJy4vY29yZS9wcm92aWRlcnMvZHJhZy1wcm92aWRlcic7XG5pbXBvcnQgeyBPcHRpb25zUHJvdmlkZXIsIE9wdGlvbnMgfSBmcm9tICcuL2NvcmUvcHJvdmlkZXJzL29wdGlvbnMtcHJvdmlkZXInO1xuaW1wb3J0IHsgVGFnSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnLWlucHV0L3RhZy1pbnB1dCc7XG5pbXBvcnQgeyBEZWxldGVJY29uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2ljb24vaWNvbic7XG5pbXBvcnQgeyBUYWdJbnB1dEZvcm0gfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnLWlucHV0LWZvcm0vdGFnLWlucHV0LWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWcvdGFnLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWdJbnB1dERyb3Bkb3duIH0gZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duL3RhZy1pbnB1dC1kcm9wZG93bi5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGFnUmlwcGxlIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy90YWctcmlwcGxlLmNvbXBvbmVudCc7XG5cbmNvbnN0IG9wdGlvbnNQcm92aWRlciA9IG5ldyBPcHRpb25zUHJvdmlkZXIoKTtcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZSxcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgICAgRm9ybXNNb2R1bGUsXG4gICAgICAgIE5nMkRyb3Bkb3duTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgVGFnSW5wdXRDb21wb25lbnQsXG4gICAgICAgIERlbGV0ZUljb25Db21wb25lbnQsXG4gICAgICAgIFRhZ0lucHV0Rm9ybSxcbiAgICAgICAgVGFnQ29tcG9uZW50LFxuICAgICAgICBIaWdobGlnaHRQaXBlLFxuICAgICAgICBUYWdJbnB1dERyb3Bkb3duLFxuICAgICAgICBUYWdSaXBwbGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgVGFnSW5wdXRDb21wb25lbnQsXG4gICAgICAgIERlbGV0ZUljb25Db21wb25lbnQsXG4gICAgICAgIFRhZ0lucHV0Rm9ybSxcbiAgICAgICAgVGFnQ29tcG9uZW50LFxuICAgICAgICBIaWdobGlnaHRQaXBlLFxuICAgICAgICBUYWdJbnB1dERyb3Bkb3duLFxuICAgICAgICBUYWdSaXBwbGVcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBEcmFnUHJvdmlkZXIsXG4gICAgICAgIHsgcHJvdmlkZTogQ09NUE9TSVRJT05fQlVGRkVSX01PREUsIHVzZVZhbHVlOiBmYWxzZSB9LFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgVGFnSW5wdXRNb2R1bGUge1xuICAgIC8qKlxuICAgICAqIEBuYW1lIHdpdGhEZWZhdWx0c1xuICAgICAqIEBwYXJhbSBvcHRpb25zIHtPcHRpb25zfVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgd2l0aERlZmF1bHRzKG9wdGlvbnM6IE9wdGlvbnMpOiB2b2lkIHtcbiAgICAgICAgb3B0aW9uc1Byb3ZpZGVyLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxufVxuIl19
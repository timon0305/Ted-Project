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
var optionsProvider = new OptionsProvider();
var TagInputModule = /** @class */ (function () {
    function TagInputModule() {
    }
    /**
     * @name withDefaults
     * @param options {Options}
     */
    TagInputModule.withDefaults = function (options) {
        optionsProvider.setOptions(options);
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
    return TagInputModule;
}());
export { TagInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1jaGlwcy8iLCJzb3VyY2VzIjpbInRhZy1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQVcsTUFBTSxtQ0FBbUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDcEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUVsRSxJQUFNLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0FBZ0M5QztJQUFBO0lBUUEsQ0FBQztJQVBHOzs7T0FHRztJQUNXLDJCQUFZLEdBQTFCLFVBQTJCLE9BQWdCO1FBQ3ZDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQVBRLGNBQWM7UUE5QjFCLFFBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRTtnQkFDTCxZQUFZO2dCQUNaLG1CQUFtQjtnQkFDbkIsV0FBVztnQkFDWCxpQkFBaUI7YUFDcEI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1YsaUJBQWlCO2dCQUNqQixtQkFBbUI7Z0JBQ25CLFlBQVk7Z0JBQ1osWUFBWTtnQkFDWixhQUFhO2dCQUNiLGdCQUFnQjtnQkFDaEIsU0FBUzthQUNaO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLGlCQUFpQjtnQkFDakIsbUJBQW1CO2dCQUNuQixZQUFZO2dCQUNaLFlBQVk7Z0JBQ1osYUFBYTtnQkFDYixnQkFBZ0I7Z0JBQ2hCLFNBQVM7YUFDWjtZQUNELFNBQVMsRUFBRTtnQkFDUCxZQUFZO2dCQUNaLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDeEQ7U0FDSixDQUFDO09BQ1csY0FBYyxDQVExQjtJQUFELHFCQUFDO0NBQUEsQUFSRCxJQVFDO1NBUlksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlLCBGb3Jtc01vZHVsZSwgQ09NUE9TSVRJT05fQlVGRkVSX01PREUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmcyRHJvcGRvd25Nb2R1bGUgfSBmcm9tICduZzItbWF0ZXJpYWwtZHJvcGRvd24nO1xuaW1wb3J0IHsgSGlnaGxpZ2h0UGlwZSB9IGZyb20gJy4vY29yZS9waXBlcy9oaWdobGlnaHQucGlwZSc7XG5pbXBvcnQgeyBEcmFnUHJvdmlkZXIgfSBmcm9tICcuL2NvcmUvcHJvdmlkZXJzL2RyYWctcHJvdmlkZXInO1xuaW1wb3J0IHsgT3B0aW9uc1Byb3ZpZGVyLCBPcHRpb25zIH0gZnJvbSAnLi9jb3JlL3Byb3ZpZGVycy9vcHRpb25zLXByb3ZpZGVyJztcbmltcG9ydCB7IFRhZ0lucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy1pbnB1dC90YWctaW5wdXQnO1xuaW1wb3J0IHsgRGVsZXRlSWNvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9pY29uL2ljb24nO1xuaW1wb3J0IHsgVGFnSW5wdXRGb3JtIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy1pbnB1dC1mb3JtL3RhZy1pbnB1dC1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnL3RhZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGFnSW5wdXREcm9wZG93biB9IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi90YWctaW5wdXQtZHJvcGRvd24uY29tcG9uZW50JztcbmltcG9ydCB7IFRhZ1JpcHBsZSB9IGZyb20gJy4vY29tcG9uZW50cy90YWcvdGFnLXJpcHBsZS5jb21wb25lbnQnO1xuXG5jb25zdCBvcHRpb25zUHJvdmlkZXIgPSBuZXcgT3B0aW9uc1Byb3ZpZGVyKCk7XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBOZzJEcm9wZG93bk1vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFRhZ0lucHV0Q29tcG9uZW50LFxuICAgICAgICBEZWxldGVJY29uQ29tcG9uZW50LFxuICAgICAgICBUYWdJbnB1dEZvcm0sXG4gICAgICAgIFRhZ0NvbXBvbmVudCxcbiAgICAgICAgSGlnaGxpZ2h0UGlwZSxcbiAgICAgICAgVGFnSW5wdXREcm9wZG93bixcbiAgICAgICAgVGFnUmlwcGxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIFRhZ0lucHV0Q29tcG9uZW50LFxuICAgICAgICBEZWxldGVJY29uQ29tcG9uZW50LFxuICAgICAgICBUYWdJbnB1dEZvcm0sXG4gICAgICAgIFRhZ0NvbXBvbmVudCxcbiAgICAgICAgSGlnaGxpZ2h0UGlwZSxcbiAgICAgICAgVGFnSW5wdXREcm9wZG93bixcbiAgICAgICAgVGFnUmlwcGxlXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgRHJhZ1Byb3ZpZGVyLFxuICAgICAgICB7IHByb3ZpZGU6IENPTVBPU0lUSU9OX0JVRkZFUl9NT0RFLCB1c2VWYWx1ZTogZmFsc2UgfSxcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIFRhZ0lucHV0TW9kdWxlIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZSB3aXRoRGVmYXVsdHNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyB7T3B0aW9uc31cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHdpdGhEZWZhdWx0cyhvcHRpb25zOiBPcHRpb25zKTogdm9pZCB7XG4gICAgICAgIG9wdGlvbnNQcm92aWRlci5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgIH1cbn1cbiJdfQ==
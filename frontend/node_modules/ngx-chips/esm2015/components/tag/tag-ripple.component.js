import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { animate, trigger, style, transition, keyframes, state } from '@angular/animations';
let TagRipple = class TagRipple {
    constructor() {
        this.state = 'none';
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], TagRipple.prototype, "state", void 0);
TagRipple = tslib_1.__decorate([
    Component({
        selector: 'tag-ripple',
        template: `
        <div class="tag-ripple" [@ink]="state"></div>
    `,
        animations: [
            trigger('ink', [
                state('none', style({ width: 0, opacity: 0 })),
                transition('none => clicked', [
                    animate(300, keyframes([
                        style({ opacity: 1, offset: 0, width: '30%', borderRadius: '100%' }),
                        style({ opacity: 1, offset: 0.5, width: '50%' }),
                        style({ opacity: 0.5, offset: 1, width: '100%', borderRadius: '16px' })
                    ]))
                ])
            ])
        ],
        styles: [`
        :host {
            width: 100%;
            height: 100%;
            left: 0;
            overflow: hidden;
            position: absolute;
        }

        .tag-ripple {
            background: rgba(0, 0, 0, 0.1);
            top: 50%;
            left: 50%;
            height: 100%;
            transform: translate(-50%, -50%);
            position: absolute;
        }
    `]
    })
], TagRipple);
export { TagRipple };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLXJpcHBsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtY2hpcHMvIiwic291cmNlcyI6WyJjb21wb25lbnRzL3RhZy90YWctcmlwcGxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNILFNBQVMsRUFDVCxLQUFLLEVBQ1IsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUNILE9BQU8sRUFDUCxPQUFPLEVBQ1AsS0FBSyxFQUNMLFVBQVUsRUFDVixTQUFTLEVBQ1QsS0FBSyxFQUNSLE1BQU0scUJBQXFCLENBQUM7QUFzQzdCLElBQWEsU0FBUyxHQUF0QixNQUFhLFNBQVM7SUFwQ3RCO1FBcUNvQixVQUFLLEdBQUcsTUFBTSxDQUFDO0lBQ25DLENBQUM7Q0FBQSxDQUFBO0FBRFk7SUFBUixLQUFLLEVBQUU7O3dDQUF1QjtBQUR0QixTQUFTO0lBcENyQixTQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsWUFBWTtRQW1CdEIsUUFBUSxFQUFFOztLQUVUO1FBQ0QsVUFBVSxFQUFFO1lBQ1IsT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDWCxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQzVDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDMUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7d0JBQ25CLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUMsQ0FBQzt3QkFDbEUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQzt3QkFDOUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBQyxDQUFDO3FCQUN4RSxDQUFDLENBQUM7aUJBQ04sQ0FBQzthQUNMLENBQUM7U0FDTDtpQkFoQ1E7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBaUJSO0tBZ0JKLENBQUM7R0FDVyxTQUFTLENBRXJCO1NBRlksU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIElucHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5cbmltcG9ydCB7XG4gICAgYW5pbWF0ZSxcbiAgICB0cmlnZ2VyLFxuICAgIHN0eWxlLFxuICAgIHRyYW5zaXRpb24sXG4gICAga2V5ZnJhbWVzLFxuICAgIHN0YXRlXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3RhZy1yaXBwbGUnLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC50YWctcmlwcGxlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgICAgICAgICAgIHRvcDogNTAlO1xuICAgICAgICAgICAgbGVmdDogNTAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIH1cbiAgICBgXSxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFnLXJpcHBsZVwiIFtAaW5rXT1cInN0YXRlXCI+PC9kaXY+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ2luaycsIFtcbiAgICAgICAgICAgIHN0YXRlKCdub25lJywgc3R5bGUoe3dpZHRoOiAwLCBvcGFjaXR5OiAwfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignbm9uZSA9PiBjbGlja2VkJywgW1xuICAgICAgICAgICAgICAgIGFuaW1hdGUoMzAwLCBrZXlmcmFtZXMoW1xuICAgICAgICAgICAgICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgb2Zmc2V0OiAwLCB3aWR0aDogJzMwJScsIGJvcmRlclJhZGl1czogJzEwMCUnfSksXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCBvZmZzZXQ6IDAuNSwgd2lkdGg6ICc1MCUnfSksXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwLjUsIG9mZnNldDogMSwgd2lkdGg6ICcxMDAlJywgYm9yZGVyUmFkaXVzOiAnMTZweCd9KVxuICAgICAgICAgICAgICAgIF0pKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXSlcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIFRhZ1JpcHBsZSB7XG4gICAgQElucHV0KCkgcHVibGljIHN0YXRlID0gJ25vbmUnO1xufVxuIl19
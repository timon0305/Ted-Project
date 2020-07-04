import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var escape = function (s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };
var ɵ0 = escape;
var HighlightPipe = /** @class */ (function () {
    function HighlightPipe() {
    }
    /**
     * @name transform
     * @param value {string}
     * @param arg {string}
     */
    HighlightPipe.prototype.transform = function (value, arg) {
        if (!arg.trim()) {
            return value;
        }
        try {
            var regex = new RegExp("(" + escape(arg) + ")", 'i');
            return value.replace(regex, '<b>$1</b>');
        }
        catch (e) {
            return value;
        }
    };
    HighlightPipe = tslib_1.__decorate([
        Pipe({
            name: 'highlight'
        })
    ], HighlightPipe);
    return HighlightPipe;
}());
export { HighlightPipe };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtY2hpcHMvIiwic291cmNlcyI6WyJjb3JlL3BpcGVzL2hpZ2hsaWdodC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUVsRCxJQUFNLE1BQU0sR0FBRyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLEVBQTNDLENBQTJDLENBQUM7O0FBS2hFO0lBQUE7SUFrQkEsQ0FBQztJQWpCRzs7OztPQUlHO0lBQ0ksaUNBQVMsR0FBaEIsVUFBaUIsS0FBYSxFQUFFLEdBQVc7UUFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNiLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsSUFBSTtZQUNBLElBQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLE1BQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbEQsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztTQUM1QztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBakJRLGFBQWE7UUFIekIsSUFBSSxDQUFDO1lBQ0YsSUFBSSxFQUFFLFdBQVc7U0FDcEIsQ0FBQztPQUNXLGFBQWEsQ0FrQnpCO0lBQUQsb0JBQUM7Q0FBQSxBQWxCRCxJQWtCQztTQWxCWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuY29uc3QgZXNjYXBlID0gcyA9PiBzLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuXG5AUGlwZSh7XG4gICAgbmFtZTogJ2hpZ2hsaWdodCdcbn0pXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAgIC8qKlxuICAgICAqIEBuYW1lIHRyYW5zZm9ybVxuICAgICAqIEBwYXJhbSB2YWx1ZSB7c3RyaW5nfVxuICAgICAqIEBwYXJhbSBhcmcge3N0cmluZ31cbiAgICAgKi9cbiAgICBwdWJsaWMgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcsIGFyZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCFhcmcudHJpbSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGAoJHtlc2NhcGUoYXJnKX0pYCwgJ2knKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKHJlZ2V4LCAnPGI+JDE8L2I+Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
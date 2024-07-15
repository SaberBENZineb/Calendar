import { Directive, Input } from '@angular/core';
import {
    AbstractControl,
    NG_VALIDATORS,
    ValidationErrors,
    Validator,
} from '@angular/forms';

@Directive({
    selector: '[appDateRangeValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: DateRangeValidatorDirective,
            multi: true,
        },
    ],
})
export class DateRangeValidatorDirective implements Validator {
    @Input('appDateRangeValidator') startDate!: Date;

    validate(control: AbstractControl): ValidationErrors | null {
        const endDate = control.value;
        if (this.startDate && endDate && this.startDate >= endDate) {
            return { dateRangeError: true };
        }
        return null;
    }
}

/*
import{AbstractControl,NG_VALIDATORS,Validator}from'@angular/forms';
import{Directive,Input} from "@angular/core";
@Directive({
  selector:'[isLess ThanStartDate]',
  providers:[{provide:NG_VALIDATORS,useExisting:'EndDateValidator Directive',multi:true}]
})
class EndDateValidatorDirective implements Validator
{

@Input('isLessThanStartDate') shouldbeless:any;
validate(control:AbstractControl):{[key:string]:any}|null
{
   console.log(this.shouldbeless);
   console.log(control.value);
   const sDate=new Date(this.shouldbeless);
   const eDate=new Date(control.value);
   console.log((sDate>eDate)?{'StartDateIsMore':true}:null);
   return(sDate>eDate)? {'StartDateIsMore':true}:null;
}
}
*/

import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('dateStart')?.value;
  const end = control.get('dateEnd')?.value;
  console.log("validators called");
  return start== null && end !== null && start < end ? null :{ dateValid:true };
}



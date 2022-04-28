import { FieldValidation } from "@/validation/protocols/field-validation";
import { RequiredFieldValidation, EmailValidation } from "@/validation/validators";
import { MinLenghtValidation } from "../min-length/min-length-validation";

export class ValidationBuilder {
    private constructor (
        private readonly fieldName: string, 
        private readonly validations: FieldValidation[]
    ) {}

    static field (fieldName: string): ValidationBuilder {
        return new ValidationBuilder(fieldName, [])
    }

    required () : ValidationBuilder{ 
        this.validations.push(new RequiredFieldValidation(this.fieldName))
        return this;
    }
    
    email () : ValidationBuilder{ 
        this.validations.push(new EmailValidation(this.fieldName))
        return this;
    }
  
    min (length: number) : ValidationBuilder{ 
        this.validations.push(new MinLenghtValidation(this.fieldName, length))
        return this;
    }

    build() : FieldValidation[] {
        return this.validations
    }
}
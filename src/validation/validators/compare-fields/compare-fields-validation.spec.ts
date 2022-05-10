import faker from 'faker'
import { InvalidFieldError } from '../email/invalid-field-error';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (valueToCompare: string) : CompareFieldsValidation => new CompareFieldsValidation(faker.database.column(), valueToCompare);

describe('CompareFieldsValidation',  ()=> {
    test('Should return error if compare is invalid', () => {
        const sut = makeSut(faker.random.word());
        const error = sut.validate(faker.random.word());
        expect(error).toEqual(new InvalidFieldError())
    })
})

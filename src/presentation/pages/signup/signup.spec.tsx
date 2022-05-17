import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import SignUp from "./signup";
import faker from 'faker';
import { Helper, ValidationStub } from '@/presentation/tests';

type SutTypes = {
    sut: RenderResult;
}

type SutParams = {
    validationError: string;
}

const makeSut = (params?: SutParams): SutTypes => {
    const validationStub = new ValidationStub();
    validationStub.errorMessage = params?.validationError;
    const sut = render(
        <SignUp validation={validationStub} />
    );

    return {
        sut,
    }
}

const simulateValidSubmit = async (sut: RenderResult, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
    Helper.populateField(sut, 'name', name);
    Helper.populateField(sut, 'email', email);
    Helper.populateField(sut, 'password', password);
    Helper.populateField(sut, 'passwordConfirmation', password);
    const form = sut.getByTestId('form');
    fireEvent.submit(form);
    await waitFor(() => form)
}

describe('SignUp component', () => {
    afterEach(cleanup);

    test('Should start with initial state', () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        Helper.testChildCount(sut, 'error-wrap', 0);
        Helper.testButtonIsDisabled(sut, 'submit', true);
        Helper.testStatusForField(sut, 'name', validationError);
        Helper.testStatusForField(sut, 'email', validationError);
        Helper.testStatusForField(sut, 'password', validationError);
        Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
    });

    test('Should show name error if Validation fails', () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        Helper.populateField(sut, 'name');
        Helper.testStatusForField(sut, 'name', validationError);
    });

    test('Should show email error if Validation fails', () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        Helper.populateField(sut, 'email');
        Helper.testStatusForField(sut, 'email', validationError);
    });

    test('Should show password error if Validation fails', () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        Helper.populateField(sut, 'password');
        Helper.testStatusForField(sut, 'password', validationError);
    });

    test('Should show passwordConfirmation error if Validation fails', () => {
        const validationError = faker.random.words();
        const { sut } = makeSut({ validationError });
        Helper.populateField(sut, 'passwordConfirmation');
        Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
    });

    test('Should show valid name if Validation succeeds', () => {
        const { sut } = makeSut();
        Helper.populateField(sut, 'name');
        Helper.testStatusForField(sut, 'name');
    });

    test('Should show valid email if Validation succeeds', () => {
        const { sut } = makeSut();
        Helper.populateField(sut, 'email');
        Helper.testStatusForField(sut, 'email');
    });

    test('Should show valid password if Validation succeeds', () => {
        const { sut } = makeSut();
        Helper.populateField(sut, 'password');
        Helper.testStatusForField(sut, 'password');
    });

    test('Should show valid passwordConfirmation if Validation succeeds', () => {
        const { sut } = makeSut();
        Helper.populateField(sut, 'passwordConfirmation');
        Helper.testStatusForField(sut, 'passwordConfirmation');
    });

    test('Should enable submit button if form is valid', () => {
        const { sut } = makeSut();
        Helper.populateField(sut, 'name');
        Helper.populateField(sut, 'email');
        Helper.populateField(sut, 'password');
        Helper.populateField(sut, 'passwordConfirmation');
        Helper.testButtonIsDisabled(sut, 'submit', false);
    });

    test('Should show spinner on submit', async () => {
        const { sut } = makeSut();
        await simulateValidSubmit(sut);
        Helper.testElementsExists(sut, 'spinner');
    });
});

import { RemoteAuthentication } from './remote-authentication';
import { HttpPostClientSpy } from '@/data/test/mock-http-cient';
import { HttpStatusCode } from '@/data/protocols/http/http-response';
import { mockAccountModel, mockAuthentication } from '@/domain/test/mock-account';
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error';
import { UnexpectedError } from '@/domain/errors/unexpected-error';
import { AuthenticationParams } from '@/domain/useCases/authentication';
import { AccountModel } from '@/domain/models/accout-models';
import { internet } from 'faker';

type SutTypes = {
    sut: RemoteAuthentication
    httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = internet.url()): SutTypes => {
    const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>();
    const sut =   new RemoteAuthentication(url, httpPostClientSpy);
    return {
        sut,
        httpPostClientSpy
    }
}

describe('RemoteAuthentication' , () => {
    test('Should Call HttpPostClient with correct URL', async () => {
       const url = internet.url()
       const { sut, httpPostClientSpy } = makeSut(url)
       await sut.auth(mockAuthentication())
       expect(httpPostClientSpy.url).toBe(url) 
    })

    test('Should call HttpPostClient with correct body', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        const authenticationParams = mockAuthentication()
        await sut.auth(authenticationParams)
        expect(httpPostClientSpy.body).toEqual(authenticationParams)
    })
   
    test('Should throw InvalidCredentialsError if HttpPostClient return 401', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.unathorized
        };

        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow(new InvalidCredentialsError())
    })
    
    test('Should throw UnexpectedError if HttpPostClient return 400', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.badRequest
        };

        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
    
    test('Should throw UnexpectedError if HttpPostClient return 500', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.serverError
        };

        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
   
    test('Should throw UnexpectedError if HttpPostClient return 404', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.notFound
        };

        const promise = sut.auth(mockAuthentication())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
    
    test('Should return an AccountModel if HttpPostClient return 404', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        const httpResult = mockAccountModel()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.ok,
            body: httpResult
        };

        const account = await sut.auth(mockAuthentication())
        expect(account).toEqual(httpResult)
    })
})
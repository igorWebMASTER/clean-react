import { RemoteAddAccount } from './remote-add-account';
import { HttpPostClientSpy } from '@/data/test';
import { AddAccountParams } from '@/domain/useCases/add-account';
import faker from 'faker'
import { mockAddAccountParams, mockAccountModel  } from '@/domain/test';
import { AccountModel } from '@/domain/models';
import { HttpStatusCode } from '@/data/protocols/http';
import { EmailInUseError, UnexpectedError } from '@/domain/errors';
 
type SutTypes = {
    sut: RemoteAddAccount
    httpPostClientSpy: HttpPostClientSpy<AddAccountParams, AccountModel>
}


const makeSut = (url: string = faker.internet.url()): SutTypes => {
    const httpPostClientSpy = new HttpPostClientSpy<AddAccountParams, AccountModel>();
    const sut = new RemoteAddAccount(url, httpPostClientSpy);
    return {
        sut,
        httpPostClientSpy
    }
}

describe('RemoteAuthentication' , () => {
    test('Should Call HttpPostClient with correct URL', async () => {
       const url = faker.internet.url()
       const { sut, httpPostClientSpy } = makeSut(url)
       await sut.add(mockAddAccountParams())
       expect(httpPostClientSpy.url).toBe(url) 
    })

    test('Should call HttpPostClient with correct body', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        const addAccountParams = mockAddAccountParams()
        await sut.add(addAccountParams)
        expect(httpPostClientSpy.body).toEqual(addAccountParams)
    })

    test('Should throw EmailInUseError if HttpPostClient return 403', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.forbidden
        };

        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow(new EmailInUseError())
    })
    
    test('Should throw UnexpectedError if HttpPostClient return 400', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.badRequest
        };

        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
  
    test('Should throw UnexpectedError if HttpPostClient return 500', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.serverError
        };

        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
   
    test('Should throw UnexpectedError if HttpPostClient return 404', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.notFound
        };

        const promise = sut.add(mockAddAccountParams())
        await expect(promise).rejects.toThrow(new UnexpectedError())
    })
    
    test('Should an AccountModel if HttpPostClients returns 200', async () => {
        const { sut, httpPostClientSpy} = makeSut()
        const httResult = mockAccountModel()    
        httpPostClientSpy.response = {
            statusCode : HttpStatusCode.ok,
        };

        const account = sut.add(mockAddAccountParams())
        expect(account).toEqual(httResult)
    })
})
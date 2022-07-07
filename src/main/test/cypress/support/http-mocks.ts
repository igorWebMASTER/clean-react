import { Method } from 'axios'
import faker from 'faker'

export const mockInvalidCredentialsError = (url: RegExp): void => {
    cy.intercept('POST', url, {
        statusCode: 401,
        response: {
            error: faker.random.words()
        }
    }).as('request')
}

export const mockUnexpectedError = (url: RegExp, method: Method): void => {
    cy.intercept(method, url, {
        statusCode: faker.helpers.randomize([400, 404, 500]),
        response: {
            error: faker.random.words()
        }
    }).as('request')
}

export const mockOk = (url: RegExp, method: Method, response: any): void => {
    cy.intercept(method, url, {
        statusCode: 200,
        response
    }).as('request')
}
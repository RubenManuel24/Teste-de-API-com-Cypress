/// <reference types ="cypress"/>

import contrato from '../contracts/login.contract';


describe('Login - Teste de API servRest', () => {

    it('Deve validar contrato do login', () => {
        cy.request('usuarios').then((response)=>{
           return contrato.validateAsync(response.body)
        })
    })

    it('Deve fazer Login com sucesso', () => {

        cy.request({
            method: 'POST',
            url: 'login',
            body: {
                "email": "fulano@qa.com",
                "password": "teste"
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)
        })

    })

});
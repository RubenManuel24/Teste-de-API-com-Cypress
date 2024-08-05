/// <reference types ="cypress"/>

import contrato from '../contracts/produtos.contract';

describe('Funcionalidade dos produtos', () => {

    let token

    before(() => {
        cy.token("fulano@qa.com", "teste").then((tkn) => { token = tkn })
    });

    it('Deve validar contrato de produtos', () =>{

        cy.request('produtos').then((response) => {

           return contrato.validateAsync(response.body)

        })

    })

    it('Deve listas todos os produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(5000)
        })
    })

    it('Deve cadastrar produto', () => {
        
        let produto = `Produto EBAC 1 ${Math.floor(Math.random() * 100000000)}`;

        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 470,
                "descricao": "produto",
                "quantidade": 381
            },
            headers: {
                authorization: token
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            expect(response.duration).to.be.lessThan(5000)
        })

    })

    it('Deve validar uma mensagem de erro ao cadastrar um produtojá existente', () => {

        cy.cadastrarProduto(token, "Cama de casal", 400, "mobília", 20).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })

    })

    it('Deve editar um produto já cadastrado', () => {
          let produto = `Produto EBAC 1 ${Math.floor(Math.random() * 100000000)}`;

        cy.request('produtos').then((response) => {
            let id = response.body.produtos[0]._id;

            cy.request({
                method: "PUT",
                url: `produtos/${id}`,
                headers: { authorization: token },
                body: {
                    "nome": produto,
                    "preco": 470,
                    "descricao": "produto",
                    "quantidade": 381
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    })

    it('Deve editar um produto cadastrado previamente', () => {

        let produto = `Produto EBAC 1 ${Math.floor(Math.random() * 100000000)}`;

        cy.cadastrarProduto(token, produto, 400, "EBAC", 20).then((response) => {

            expect(response.status).to.equal(201)
            cy.log(response.body._id)

            let id = response.body._id;

            cy.request({
                method: "PUT",
                url: `produtos/${id}`,
                headers: { authorization: token },
                body: {
                    "nome": produto,
                    "preco": 470,
                    "descricao": "produto",
                    "quantidade": 381
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })



        })

    })


    it('Deve deletar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC 1 ${Math.floor(Math.random() * 100000000)}`;

        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome": produto,
                "preco": 470,
                "descricao": "produto",
                "quantidade": 381
            },
            headers: {
                authorization: token
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
            let id = response.body._id;

            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: { authorization: token }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })

        })

    })

}); 
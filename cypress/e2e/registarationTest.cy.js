import { faker } from '@faker-js/faker';
import * as savedUser from '../fixtures/user.json';

let pass;

const user = {};
user.firstName = faker.name.firstName();
user.lastName = faker.name.lastName();
user.email = faker.internet.email();
user.address = faker.address.streetAddress();
user.city = faker.address.city();
user.postCode = faker.address.zipCode('####');
user.username = faker.internet.userName();
user.password = faker.internet.password(15);

it('Registration', () => {
    cy.log('**Open website home page**');
    cy.visit('https://automationteststore.com/');

    cy.log('**Open website login page**');
    cy.get('.topnavbar [data-id="menu_account"]').click();

    cy.log('**Open website sign up page**');
    cy.get('#accountFrm button').click();

    cy.log('**Fill sign up form**');
    cy.get('#AccountFrm_firstname').type(user.firstName);
    cy.get('#AccountFrm_lastname').type(user.lastName);
    cy.get('#AccountFrm_email').type(user.email);
    cy.get('#AccountFrm_address_1').type(user.address);
    cy.get('#AccountFrm_city').type(user.city);
    cy.get('#AccountFrm_postcode').type(user.postCode);
    cy.get('#AccountFrm_country_id').select('Denmark');
    cy.get('#AccountFrm_loginname').type(user.username);
    cy.get('#AccountFrm_password').type(user.password);
    cy.get('#AccountFrm_confirm').type(user.password);
    cy.get('#AccountFrm_zone_id')
    .select(2, {force:true})
    .invoke('val')
    .should('not.eq', 'FALSE');

    cy.log('**Check checkboxes**');
    cy.get('#AccountFrm_newsletter0').check();
    cy.get('#AccountFrm_agree').check();

    cy.log('**Submit sign up form**');
    cy.get('button[title="Continue"]').click();

    cy.log('**Verify user first name on account page**');
    cy.get('h1 span.subtext').should('contain', user.firstName);

    console.log(user);
})

describe('Authorization', () => {
    beforeEach(() => {
        cy.log('Open website login page');
        cy.visit('https://automationteststore.com/index.php?rt=account/login');
    
        cy.log('Check user is unauthorized');
        cy.getCookie('customer').should('be.null');
    
        cy.log('Authorize user');
    });
 
    it('Success', () => {
        cy.get('#loginFrm_loginname').type(user.username);
        cy.get('#loginFrm_password').type(user.password);
    
        cy.get('button[type="submit"]').contains('Login').click();
    
        cy.url().should('eq', 'https://automationteststore.com/index.php?rt=account/account');
        cy.get('h1 span.subtext').should('contain', user.firstName);
    })
    
    it('Fail', () => {
        cy.get('#loginFrm_loginname').type(faker.internet.userName());
        cy.get('#loginFrm_password').type(faker.internet.password(15));

        cy.get('button[type="submit"]').contains('Login').click();

        cy.get('.alert.alert-error').should('contain', 'Error: Incorrect login or password provided');
    });
});

it('Order', () => {
    // login
    cy.visit('https://automationteststore.com/index.php?rt=account/login');
    cy.get('#loginFrm_loginname').type(savedUser.username);
    cy.get('#loginFrm_password').type(savedUser.password);
    cy.get('button[type="submit"]').contains('Login').click();

    // go to homepage
    cy.visit('https://automationteststore.com');

    // add first product to cart
    cy.get('a.productcart').eq(0).click();

    // go to cart
    cy.get('li[data-id="menu_cart"]').eq(0).click();
    cy.url().should('eq', 'https://automationteststore.com/index.php?rt=checkout/cart');

    // checkout
    cy.get('#cart_checkout1').click();
    cy.get('#checkout_btn').click();

    // check success
    cy.url().should('eq', 'https://automationteststore.com/index.php?rt=checkout/success');
    cy.get('h1').should('contain', 'Your Order Has Been Processed');
})




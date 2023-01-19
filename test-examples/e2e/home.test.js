// import { testAttr } from '../../src/utils/test.utils'

describe('Home Page', () => {
  // Creating http request but mocking their response

  beforeEach(() => {
    // Mock server
    cy.server();

    // Mocking response for an endpoint
    cy.fixture('courses.json').as('coursesJSON'); // Auto generated file
    cy.route('/api/courses', '@coursesJSON').as('courses') // `courses now available to frontend to display`;

    cy.visit('/');
  });

  it('should display a list of courses', () => {
    cy.contains('All Courses');
    cy.wait('@courses'); // for courses event to finish
    cy.get('mat-card').should('have.length', 9);
  });

  it('should display the advanced courses', () => {
    // cy.get(testAttr('courses-tab')).should('have.length', 2);
    cy.get('div.mdc-tab').should('have.length', 2);
    cy.get('div.mdc-tab').last().click();
    const advancedTitlesSelector = 'mat-tab-body.mat-mdc-tab-body-active [data-test="course-card-title"]';
    cy.get(advancedTitlesSelector).its('length').should('be.gt', 1);
    cy.get(advancedTitlesSelector).first().should('contain', 'Angular Security Course');
  });

});

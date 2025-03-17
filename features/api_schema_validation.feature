Feature: API Schema Validation
  As a consumer of the API
  I want to ensure that the data returned from the API conforms to published schema
  so that my application can reliably consume and process the data returned

  Background:
    Given the API endpoint is available
    And I have the expected schema definition

  @api-test
  Scenario: Validate API Response Schema
    When I send a GET request to the API endpoint
    Then the response status code should be 200
    And the response should be valid JSON
    And the response should conform to the published schema
    And I should print the validation results in the test report 

Feature: South Africa Official Languages Validation
  As the Minister of Education
  I want to ensure that South African Sign Language (SASL) is included in the list of South Africa's official languages
  So that it is properly integrated into educational curricula and recognized in educational policies

  Background:
    Given the countries API endpoint is available

  @api-test
  Scenario: Validate South African Sign Language (SASL) is recognized as an official language
    When I retrieve information about South Africa from the API
    Then the response status code should be 200
    And the response should be valid JSON
    And I should verify South Africa's official languages
    And I should check if South African Sign Language is included in the list
    And I should print the language validation results in the test report

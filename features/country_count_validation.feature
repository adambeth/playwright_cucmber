Feature: Country Count Validation
  As a map builder
  I want to confirm that there are 195 countries in the world
  So that my maps are accurate and reflect current geopolitical boundaries

  Background:
    Given the countries API endpoint is available

  @api-test
  Scenario: Validate the number of countries in the world
    When I retrieve the list of all countries
    Then the countries API response status code should be 200
    And the countries API response should be valid JSON
    And I should verify the number of countries matches the expected count
    And I should print the country count results in the test report 

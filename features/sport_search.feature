
Feature: Sport Search Results
  As an editor
  I want the search functionality to return at least 4 relevant results for "Sport in 2023"
  So that users have a wide range of articles, reports, and media to explore on the topic

  Scenario: Search for "Sport in 2023" returns minimum required results
    Given I am on the search page
    When I enter "Sport in 2023" in the search field
    And I submit the search
    Then I should see at least 4 search results
    And all results should be relevant to "Sport in 2023"

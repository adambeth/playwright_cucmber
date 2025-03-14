Feature: Formula 1 Race Results
  As a BBC editor
  I want to report on F1 race results
  So that readers get accurate race information

  Scenario: Validate 2023 Las Vegas Grand Prix Top 3 Finishers
    Given I am on the "2023" Formula 1 results page
    When I view the "Las Vegas Grand Prix" race results
    Then I should see the following race results:
      | Position | Driver Name    | Team     |
      |        1 | Max Verstappen | Red Bull |
      |        2 | George Russell | Mercedes |
      |        3 | Sergio Perez   | Red Bull |

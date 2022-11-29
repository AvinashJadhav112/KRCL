@wip
Feature: A logged in user can enroll other user

  Scenario: An existing user can enroll another user
    Given a user "testuser@vervetronics.com" with password "FoxyFox@123" exists
    When logging in user "testuser@vervetronics.com" with password "FoxyFox@123"
    Then login MUST be successful
    When enrolling a new user "anotheruser@vervetronics.com" with password "FoxyFox@123"
    And logging out
    When logging in user "anotheruser@vervetronics.com" with password "FoxyFox@123"
    Then login MUST be successful

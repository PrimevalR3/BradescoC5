Feature: DummyToken tests
  Various DummyToken tests

  Scenario: SC01: Create a DummyToken
    Given we are acting as "CENTRAL_BANK"
    And the number of tokens owned is determined
    When a token is created for "CENTRAL_BANK" of value 100
    Then the number of tokens owned by "CENTRAL_BANK" should have changed by 1

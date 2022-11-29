@wip
Feature: Submission of sensors to IotModels

  Scenario: Submitting a sensor with a wrong formula
    Given the following IotModels:
      | name                                               |
      | Model for submitting a sensor with a wrong formula |
    When adding these sensors to IotModel "Model for submitting a sensor with a wrong formula":
      | sensor_id | formula         | raw_data_type | processed_data_type | unit   |
      | 1         | invalid formula | uint16_t      | bool                | on/off |
    Then the sensor model is rejected with a syntax error from the expression compiler

  Scenario: Submitting a sensor with a correct formula
    Given an IotModel with the following specification:
      """
      {
        "name": "Model for submitting a sensor with a correct formula",
        "sensors": []
      }
      """
    When adding this sensor to IotModel "Model for submitting a sensor with a correct formula":
      """
      {
        "sensorId": "1",
        "formula": "sensor1 as boolean"
      }
      """
    Then the sensor model is created

## BOL Client App -Springboot Rest API 
This will be Euroclear beneficial Owner Ledger Client (BOL Client App) hosting API for Corda node communication.
Internal & External system will consume BOL data via EBOL client.


#### Run the Springboot -Rest API server
1.Run ./gradlew bootRun ( this will also run liquibase script create offledger DB schema,ensure to configure datasource in application.properties file)
2. You could spin up multiple Client instance for each node by configuring `runSpringServer` in the build.gradle file.
3. Access the Swagger-ui from this url http://localhost:8081/swagger-ui/#

** API postman collection available under folder /euroclear-bol/restapi/postman
** Local Postgres DB set up can be done by running docker-compose -f /euroclear-bol/docker-compose/local-postgres.yml  up
** Note - If you are using CSDE for local development you may use the same CSDEPostgres Container for setting up 
offledger Database.

#### Corap-api
1. Provides abstract interface for Client app to interact with Corda vnodes through HTTP REST API.
2. Corda Cluster health check can be done from actuator url http://localhost:8081/actuator/health

#### Simulators
1.BO Simulator - To Simulator BO Position in B&R(Book & Record) System.
Use API http://localhost:8081/api/v1/uploadBOSimulatorFile to upload bo_simulator.json file.
Template can found under /resources/templates folder

2.CA Simulator - To Simulate CA(Corporate Action) event. This will be the trigger to recursively pull
BO position for concerned ISIN(Security) from participating custodians in the ownership hierarchy chain.
Use API http://localhost:8081/api/v1/uploadCASimulatorFile

3.Flow Status - Get the flow status using api http://localhost:8081/api/v1/getFlowStatus by passing holdingIdentityshorthash and clientId as input parameter

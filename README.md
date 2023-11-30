# Digital Assets on Corda 5

## Digital Asset  - NFT marketplace Cordapp
Digital Asset  NFT markeplace Cordapp in Corda.

## Core Workflows
1. Issue - Issue NFT tokens
2. place order - Place DA(eg ART work) to NFT marketplace
3. Approve/Reject - Custodian approve/reject NFT marketplace place order
4. Transfer - Transfer NFT tokens from party a to party b
5. Redeem
6. Settle 

## Local Development setup
1. CSDE-cordapp-template-kotlin (CSDE) is used for local development.
2. Run `startCorda` task . This will download postgres image and install postgres CSDEpostgresql docker container.This will also start Corda CombinedWorker instance.
3. Once Step2 successful completion, Corda REST Apis could be accessed from https://localhost:8888/api/v1/swagger#
4. Run `5-vNodeSetup` task.
    1. This will create GroupPolicy.json(links a Cordapp to Application network through 'groupid' identifier),
    2. create dev keystore files
    3. build and Deploy CPIs
    4. deploy vnodes

## How to make changes to static-network-config.json (local testing)
[Purpose]
- Alter X500 name of vnodes
- Amend CPI name
- Add more particpants for local testing
1. Ensure to delete the workspace folder
2. Run `gradlew clean build`
3. Restart the Corda Service (`startCorda`)\
   Note
- Uploading the same CPI with different group-id will throw error.
- Currently same CPI with different groupid is not allowed to upload.
  Hence if you make any changes to static network file either use same groupId
  which was previously deployed.


## Run the Springboot -Rest API server
1. Run `./gradlew bootRun` ( this will also run liquibase script create offledger DB schema,ensure to configure datasource in application.properties file)
2. You could spin up multiple Client instance for each node by configuring `runSpringServer` in the build.gradle file.
3. Access the Swagger-ui from this url http://localhost:8081/swagger-ui/#

## Client Corda-api
1. Provides abstract interface for Client app to interact with Corda vnodes through HTTP REST API.
2. Corda Cluster health check can be done from actuator url http://localhost:8081/actuator/health

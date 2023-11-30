FROM azul/zulu-openjdk:11.0.19
RUN mkdir logs
ARG JAR_FILE=build/libs/restapi-1.0-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
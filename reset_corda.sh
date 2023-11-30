#!/bin/zsh
pkill -f "java.*corda-combined-worker"
docker stop CSDEpostgresql
~/DEV/CSDE-cordapp-template-kotlin/gradlew clean
rm -rf ~/DEV/CSDE-cordapp-template-kotlin/workspace/
rm -rf ~/.corda/corda5/
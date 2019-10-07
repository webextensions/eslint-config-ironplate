#!/bin/bash

cd "$(dirname "$0")"    # Change directory to the folder containing this file
cd ../..                # Change directory to project's root folder

# Colors:
# http://stackoverflow.com/questions/5412761/using-colors-with-printf/5413029#5413029
# http://stackoverflow.com/questions/4332478/read-the-current-text-color-in-a-xterm/4332530#4332530
NORMAL=$(tput sgr0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)

printf "\n";
printf "\n${BLUE}If you are installing \"eslint-config-ironplate\" as a package, then:${NORMAL}";
printf "\n     To list install peerDependencies:";
printf "\n         $ npm info \"eslint-config-ironplate\" peerDependencies";
printf "\n         And add these dependencies to your project's package.json file";
printf "\n     To install peerDependencies:";
printf "\n         $ npx install-peerdeps --dev eslint-config-ironplate";
printf "\n\n";

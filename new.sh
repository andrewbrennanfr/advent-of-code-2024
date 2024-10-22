[ -z "$1" ] || [ -e "./src/$1" ] || ! [[ "$1" =~ ^0[1-9]$|^1[0-9]$|^2[0-5]$ ]] && exit 1

cp -r "./src/00" "./src/$1"

sed -i "" "s/00/$1/g" ./src/$1/*

open -a "Google Chrome" https://adventofcode.com/2024/day/$((10#$1))
open -a "Google Chrome" https://adventofcode.com/2024/day/$((10#$1))/input

bun start $1

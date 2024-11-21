set -x
firebase emulators:exec --only auth --import .firebase-emulator-data "$*"

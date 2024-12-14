set -x
firebase emulators:exec --only auth,firestore --import .firebase-emulator-data "$*"

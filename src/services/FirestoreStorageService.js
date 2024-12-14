import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

function getData() {
    throw new Error("FirebaseStorageService.getData is not implemented");
}

async function putData(data) {
    const docRef = doc(firestore, "happiness-data", auth.currentUser.uid);
    await setDoc(docRef, data);
}

export { getData, putData };

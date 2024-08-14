import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        if (user) {
          resolve(user.email);
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};
export default getCurrentUser;

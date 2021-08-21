import { jellytoringApi } from "./jellytoringApi";
import cookieService from "./cookieService";

const TOKEN_NAME = "token"

export default {
  login(email, password) {
    const user = { email, password };
    return jellytoringApi.post("/api/sessions", user);
  },
  logout() {
    cookieService.removeCookie(TOKEN_NAME);
  },
  register(user) {
    return jellytoringApi.post("/api/users", user);
  },
  setUserLogged(userJWT) {
    cookieService.setCookie(TOKEN_NAME, userJWT, 1);
  },
  getUserLogged() {
    const jwt = cookieService.getCookie(TOKEN_NAME);
    // TODO: improve this logic
    if (jwt.includes(".")) {
      const userBase64Encoded = jwt.split(".")[1];
      // const userObject = JSON.parse(atob(userBase64Encoded));
      const userObject = JSON.parse(Buffer.from(userBase64Encoded, 'base64'));
      return userObject;
    }
  },
  isUserLogged() {
    const user = cookieService.getCookie(TOKEN_NAME);

    if (!user || user == "") {
      return false;
    }
    return true;
  }
};

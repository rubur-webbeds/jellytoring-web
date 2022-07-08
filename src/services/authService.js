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
      const userObject = decodeBase64AndJSONParse(userBase64Encoded);

      userObject.firstInitial = getUserFirstInitial(userObject.full_name);
      userObject.roleCode = getUserRole(userObject.roles);
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

function decodeBase64AndJSONParse(input) {
  return JSON.parse(decodeBase64(input));
}

function decodeBase64(encoded) {
  return Buffer.from(encoded, 'base64');
}

function getUserFirstInitial(userName) {
  return userName.charAt(0).toUpperCase();
}

function getUserRole(rolesObject){
  var obj = JSON.parse(rolesObject);
  return obj[0].Code;
}
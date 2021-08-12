import axios from 'axios';

// TODO: use axios.create
const BASE_URL = "https://localhost:5001";
const TOKEN_NAME = "token"

export default {
  login(email, password) {
    const user = { email, password };
    return axios.post(BASE_URL + "/api/sessions", user);
  },
  setUserLogged(userJWT) {
    setCookie(TOKEN_NAME, userJWT, 1);
  },
  getUserLogged() {
    const jwt = getCookie(TOKEN_NAME);
    // TODO: improve this logic
    if (jwt.includes(".")) {
      const userBase64Encoded = jwt.split(".")[1];
      const userObject = JSON.parse(atob(userBase64Encoded));
      return userObject;
    }
  },
  isUserLogged() {
    const user = getCookie(TOKEN_NAME);

    if (!user || user == "") {
      return false;
    }
    return true;
  }
};




function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

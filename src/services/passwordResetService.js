import { jellytoringApi } from "./jellytoringApi";

export default {
    sendResetEmail(email){
        return jellytoringApi.post("/api/passwordRecoveries", JSON.stringify(email), {
            headers: {
              "Content-Type": "application/json",
            },
          });
    },
    saveNewPassword(password, confirmationCode){
        var payload = {password, confirmationCode}
        return jellytoringApi.post(`/api/passwordRecoveries/${confirmationCode}`, payload);
    }
}
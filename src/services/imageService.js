import { jellytoringApi } from "./jellytoringApi";

export default {
  getUserImages() {
    return jellytoringApi.get("/api/images/user");
  },
  uploadImage(formData) {
    return jellytoringApi.post("/api/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getPendingImages() {
    return jellytoringApi.get("/api/images");
  },
  setUserImage(image) {
    return jellytoringApi.put("/api/images?statusCode=PEND", image);
  },
}
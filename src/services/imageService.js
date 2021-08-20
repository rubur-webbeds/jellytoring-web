import { jellytoringApi } from "./jellytoringApi";

export default {
  getUserImages() {
    return jellytoringApi.get("/api/images");
  },
  uploadImage(formData) {
    return jellytoringApi.post("/api/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
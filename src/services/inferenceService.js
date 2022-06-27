import { jellytoringApi } from "./jellytoringApi";

export default {
    createInference(formData){
        return jellytoringApi.post("/api/inferences", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
        });
    },
    pollInference(inferenceId){
        return jellytoringApi.get(`/api/inferences/${inferenceId}`);
    },
  }
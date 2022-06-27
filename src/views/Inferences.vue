<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Inference</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-file-input
                label="Upload image"
                accept="image/png,image/jpg,image/jpeg"
                prepend-icon="mdi-camera"
                v-model="image"
                show-size
                required
              ></v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-alert
                v-if="showError"
                dense
                outlined
                type="error"
                transition="scale-transition"
                dismissible
              >
                An error has occurred. Please try again later.
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="hideForm">Cancel</v-btn>
        <v-btn color="green darken-1" text @click="createInference">Infer</v-btn>
      </v-card-actions>
    </v-card>
    <!-- <v-snackbar v-model="showSuccess">
      Image uploaded successfully
      <template v-slot:action="{ attrs }">
        <v-btn color="green" text v-bind="attrs" @click="showSuccess = false">
          Close
        </v-btn>
      </template>
    </v-snackbar> -->
  </v-dialog>
</template>

<script>
import inferenceService from "@/services/inferenceService";

export default {
  name: "Inferences",
  props: ["show"],
  data: () => ({
    image: [],
    showError: false,
    showSuccess: false,
    polling: null,
    runningInferenceId: 0, 
    isInferenceRunning: false,
  }),
  methods: {
    hideForm() {
      this.showError = false;
      this.$emit("update:show", !this.show);
      this.stopPolling();
    },
    resetForm() {
      this.image = [];
    },
    pollData (inferenceId) {
		this.polling = setInterval(async () => {
            try {
                console.log("polling")
                const response = await inferenceService.pollInference(inferenceId);
                console.log(response);

                if (response.data != "RUNNING"){
                    this.isInferenceRunning = false;

                    // stop polling and delete inferenceId from local storage
                    this.stopPolling();
                }
            } catch(e){
                this.showError = true;
                this.buttonLoading = false;
                console.error("Something wrong happened while infering T_T. ", e);
                this.stopPolling();
            }

		}, 5000)
	},
    async createInference() {
      this.showError = false;
      this.buttonLoading = true;

      try {
        let formData = new FormData();

        formData.append("file", this.image);

        console.log("creating inference...");
        const response = await inferenceService.createInference(formData);
        console.log(response);
        this.showSuccess = true;

        // save into local storage
        this.isInferenceRunning = true;
        this.runningInferenceId = response.data;
        localStorage.setItem("runningInferenceId", this.runningInferenceId);

        // start polling
        //this.pollData(this.runningInferenceId)

      } catch (error) {
        this.showError = true;
        this.buttonLoading = false;
      }
    },
    stopPolling(){
        // stop timer
        clearInterval(this.polling)
        console.log("timer stopped")
        localStorage.removeItem("runningInferenceId");
        console.log("local storage cleared")
    }
  },
  mounted(){
      // get running inference, if any
    if (localStorage.getItem("runningInferenceId")) {
      try {
        this.runningInferenceId = localStorage.getItem("runningInferenceId")
      } catch (e) {
        console.error("Something wrong happened reading the runningInferenceId from local storage T_T. ", e);
      }
    }
  },
  beforeDestroy(){
    this.stopPolling()
  },
  watch: {
      runningInferenceId(){
        this.pollData(this.runningInferenceId)
      }
  },
};
</script>

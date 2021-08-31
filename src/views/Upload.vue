<template>
  <span>
    <v-dialog v-model="show" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Upload</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <!-- <v-file-input
                  label="Upload image"
                  accept="image/png,image/jpg,image/jpeg"
                  prepend-icon="mdi-camera"
                  v-model="image"
                  @change="loadFile($event)"
                  show-size
                  required
                ></v-file-input> -->
                <input type="file" @change="onFileChange" />
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  label="Location"
                  v-model="location"
                  prepend-icon="mdi-map"
                  :rules="rules"
                  counter="255"
                  hint="e.g. Playa de S'Arenal or Cala Varques"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-menu
                  v-model="menuDatePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="computedDateFormatted"
                      label="Date"
                      hint="MM/DD/YYYY"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    @input="menuDatePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  :items="['Just upload', 'Label image', 'Infer species']"
                  label="Action"
                  v-model="uploadType"
                  required
                ></v-select>
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
          <template v-if="!uploadType || uploadType == 'Just upload'">
            <v-btn color="green darken-1" text @click="uploadImage"
              >UPLOAD</v-btn
            >
          </template>
          <template v-else-if="uploadType == 'Label image'">
            <v-btn color="green darken-1" text @click="showLabellingTool = true"
              >NEXT STEP</v-btn
            >
          </template>
        </v-card-actions>
      </v-card>
      <v-snackbar v-model="showSuccess">
        Image uploaded successfully
        <template v-slot:action="{ attrs }">
          <v-btn color="green" text v-bind="attrs" @click="showSuccess = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-dialog>
    <v-dialog v-model="showLabellingTool" fullscreen hide-overlay>
      <v-card>
        <v-card-title>
          <span class="text-h5">Label</span>
        </v-card-title>
        <v-card-text>
          <div
            width="800"
            ref="canvas"
            height="500"
            @mousedown="mousedownX"
            @mousemove="mousemoveX"
            @mouseup="mouseupX"
          >
          </div>
          <img ref="image" v-if="previewImage" :src="previewImage" style="display: none;" @load="canvasLoad"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="hideForm">Cancel</v-btn>
          <template v-if="!uploadType || uploadType == 'Just upload'">
            <v-btn color="green darken-1" text @click="uploadImage"
              >UPLOAD</v-btn
            >
          </template>
          <template v-else-if="uploadType == 'Label image'">
            <v-btn color="green darken-1" text @click="openLabellingTool"
              >NEXT STEP</v-btn
            >
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import imageService from "@/services/imageService";

export default {
  name: "Upload",
  props: ["show"],
  data: (this_) => ({
    image: [],
    previewImage: null,
    imageRules: [(value) => !value || "Required"],
    uploadType: "",
    location: null,
    showError: false,
    showSuccess: false,
    showLabellingTool: false, // TODO: true for DEBUG
    rules: [(v) => (v && v.length <= 255) || "Max 255 characters"],

    // DOCS: https://vuetifyjs.com/en/components/date-pickers/#formatting
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    dateFormatted: this_.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    menuDatePicker: false,

    /*
     *
     * LABELLING TOOL
     *
     */
    canvas: null,
    ctx: null,
    canvasx: null,
    canvasy: null,
    last_mousex: 0,
    last_mousey: 0,
    mousex: 0,
    mousey: 0,
    mousedown: false,
  }),
  methods: {
    hideForm() {
      this.showError = false;
      this.$emit("update:show", !this.show);
    },
    resetForm() {
      this.image = [];
      this.uploadType = "";
      this.location = null;
      this.date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
      this.dateFormatted = this.formatDate(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      );
    },
    async uploadImage() {
      this.showError = false;
      this.buttonLoading = true;

      try {
        let formData = new FormData();

        formData.append("file", this.image);
        formData.append("location", this.location);
        formData.append("date", this.date);

        const response = await imageService.uploadImage(formData);
        console.log(response);
        this.showSuccess = true;
        this.resetForm();
        this.hideForm();

        this.syncLocalUserImages();
      } catch (error) {
        this.showError = true;
        this.buttonLoading = false;
      }
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    async syncLocalUserImages() {
      const { data } = await imageService.getUserImages();
      this.$emit("update:images", data);
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.previewImage = URL.createObjectURL(file);
    },
    openLabellingTool() {
      this.showLabellingTool = true;
      // this.ctx.drawImage(img, 0, 0);

      // TESTING:
      // this.ctx.fillStyle = 'green';
      // this.ctx.fillRect(10, 10, 150, 150);
    },
    canvasLoad() {
      alert()
      this.canvas = this.$refs.canvas;
      this.ctx = this.$refs.canvas.getContext("2d");
      this.canvasx = this.canvas.offsetLeft;
      this.canvasy = this.canvas.offsetTop;
      this.canvas.style.background = `url('${this.previewImage}')`;
      this.canvas.style.backgroundRepeat = 'no-repeat';
    },
    // imageLoad() {
    //   this.ctx.drawImage(, 0, 0);
    // },

    /*
     *
     * LABELLING TOOL
     *
     */
    mousedownX(e) {
      this.last_mousex = parseInt(e.pageX - this.canvasx);
      this.last_mousey = parseInt(e.pageY - this.canvasy);
      this.mousedown = true;
    },
    mouseupX(e) {
      console.log(e);
      this.mousedown = false;
    },

    mousemoveX(e) {
      this.mousex = parseInt(e.pageX - this.canvasx);
      this.mousey = parseInt(e.pageY - this.canvasy);
      if (this.mousedown) {
        //clear rect debri
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();

        var width = this.mousex - this.last_mousex;
        var height = this.mousey - this.last_mousey;

        this.ctx.rect(this.last_mousex, this.last_mousey, width, height);

        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
      }
    },
  },
  mounted() {},
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  watch: {
    date(val) {
      console.log(val);
      this.dateFormatted = this.formatDate(this.date);
    },
  },
};
</script>
<style scoped>
canvas {
  cursor: crosshair;
  border: 1px solid #000000;
  background-repeat: no-repeat;
}
</style>
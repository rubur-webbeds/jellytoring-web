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

    <!-- ToDo: Maybe create component label-tool -->
    <v-dialog v-model="showLabellingTool" fullscreen persistent hide-overlay>
      <v-card>
        <v-card-title>
          <span class="text-h5">Label</span>
        </v-card-title>
        <v-card-text>
            <v-row>
              <v-col cols="12" md="9">
                <div class="fill" ref="wrapperparent">
                  <!-- <img src="https://picsum.photos/id/237/320/240" alt="" /> -->
                  <!-- <div
                    id="image-wrapper"
                    ref="wrapper"
                    @mousedown="mousedownX"
                    @mousemove="mousemoveX"
                    @mouseup="mouseupX"
                  >

                  </div> -->
                  <img
                    v-if="previewImage"
                    :src="previewImage"
                    @load="canvasLoad"
                    ref="wrapper"
                    @mousedown="mousedownX"
                    @mousemove="mousemoveX"
                    @mouseup="mouseupX"
                  />
                    <Box
                      v-if="drawingBox.active"
                      :b-width="drawingBox.width"
                      :b-height="drawingBox.height"
                      :b-top="drawingBox.top"
                      :b-left="drawingBox.left"
                    />
                    <Box
                      v-for="(box, i) in boxes"
                      :key="i"
                      :b-top="box.top"
                      :b-left="box.left"
                      :b-label="box.label"
                      :b-width="box.width"
                      :b-height="box.height"
                      :b-active="i === activeBoxIndex"
                      :on-select="makeBoxActive"
                      :b-index="i"
                      :on-delete="removeBox"
                    />
                </div>

              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                  clearable
                  v-model="autocompleteValues"
                  :items="autocompleteItems"
                ></v-autocomplete>
                <ul>
                  <li
                    v-for="(box, i) in boxes"
                    :key="i"
                    v-bind:class="{ active: i === activeBoxIndex }"
                  >
                    <input v-model="box.label" v-on:click="makeBoxActive(i)" />
                    <a @click="removeBox(i)">x</a>
                  </li>
                </ul>
              </v-col>
              <!-- <img ref="image" v-if="previewImage" :src="previewImage" /> -->
              <!-- <div
            width="800"
            ref="canvas"
            height="500"
            @mousedown="mousedownX"
            @mousemove="mousemoveX"
            @mouseup="mouseupX"
          ></div>
          -->
            </v-row>
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
import Box from "@/components/Box";

// const getCoursorLeft = (e) => {
//   return e.pageX - 10;
// };

// const getCoursorTop = (e) => {
//   return e.pageY - 10;
// };

export default {
  name: "Upload",
  props: ["show"],
  components: { Box },
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
    wrapper: null,
    last_mousex: 0,
    last_mousey: 0,
    wrappery: 0,
    wrapperx: 0,
    mousex: 0,
    mousey: 0,

    drawingBox: {
      active: false,
      top: 0,
      left: 0,
      height: 0,
      width: 0,
    },
    boxes: [
      {
        active: false,
        top: 0,
        left: 0,
        height: 100,
        width: 100,
      },
    ],
    activeBoxIndex: null,
    autocompleteValues: [],
    autocompleteItems: ["Especie #1", "Especie #2", "Especie #3", "Especie #4"],
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
    },
    canvasLoad() {
      this.wrapper = this.$refs.wrapper;
      // const wrapperparent = this.$refs.wrapperparent;
      // this.wrapper.style = `background-image: url('${this.previewImage}');background-repeat: no-repeat;`;
      // this.wrapperx = wrapperparent.offsetLeft;
      // this.wrappery = wrapperparent.offsetTop;
      // console.log('this.wrapperx:', this.wrapperx);
      // console.log('this.wrappery', this.wrappery);
    },

    /*
     *
     * LABELLING TOOL
     *
     */
    mousedownX(e) {
      console.log("mousedownX", JSON.stringify(this.drawingBox));
      console.log('e.pageX', e.pageX);
      console.log('e.pageY', e.pageY);
      this.last_mousex = parseInt(e.pageX);
      this.last_mousey = parseInt(e.pageY);
      console.log('this.last_mousey:', this.last_mousey, 'this.last_mousex', this.last_mousex);

      this.drawingBox = {
        width: 0,
        height: 0,
        top: this.last_mousey,
        left: this.last_mousex,
        active: true,
      };
    },
    mousemoveX(e) {
      console.log("mousemoveX", JSON.stringify(this.drawingBox));
      if (this.drawingBox.active) {
        this.mousex = parseInt(e.pageX);
        this.mousey = parseInt(e.pageY);
        var width = this.mousex - this.last_mousex;
        var height = this.mousey - this.last_mousey;

        this.drawingBox = {
          ...this.drawingBox,
          width: width,
          height: height,
        };
      }
    },
    mouseupX() {
      console.log("mouseupX", JSON.stringify(this.drawingBox));
      if (this.drawingBox.active) {
        if (this.drawingBox.width > 5) {
          this.boxes.push({
            ...this.pick(this.drawingBox, ["width", "height", "top", "left"]),
          });
        }
        this.drawingBox = {
          active: false,
          top: 0,
          left: 0,
          height: 0,
          width: 0,
        };
      }
    },
    makeBoxActive(i) {
      this.activeBoxIndex = i;
    },
    removeBox(i) {
      this.boxes = this.boxes.filter((elem, index) => {
        return index !== i;
      });
      this.activeBoxIndex = null;
    },
    pick(object, keys) {
      return keys.reduce((obj, key) => {
        // eslint-disable-next-line
        if (object && object.hasOwnProperty(key)) {
          obj[key] = object[key];
        }
        return obj;
      }, {});
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
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#app #image-wrapper {
  /* width: 512px;
  height: 512px; */
  background-repeat: no-repeat;
  position: relative;
  background-size: contain;
}
#app #label-bar {
  float: right;
  margin-right: 50px;
  width: 220px;
}
#app #label-bar ul {
  padding: 0;
}
#app #label-bar ul li {
  list-style-type: none;
  padding: 8px 16px;
}
#app #label-bar ul li.active {
  background-color: lightblue;
}
#app #label-bar ul li a {
  cursor: pointer;
  display: inline-block;
  margin-left: 4px;
  font-weight: bold;
  color: red;
}
.fill {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fill img {
  object-fit: content;
  /* flex-shrink: 0; */
  min-width: 100%;
  min-height: 100%;

  /* disable image ghosting */
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>
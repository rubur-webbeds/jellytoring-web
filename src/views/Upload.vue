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
                <v-file-input
                  label="Upload image"
                  accept="image/png,image/jpg,image/jpeg"
                  prepend-icon="mdi-camera"
                  v-model="image"
                  show-size
                  required
                ></v-file-input>
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
          <canvas id="canvas" width="800" ref="canvas" height="500" style="background-image: url(https://cdn.vuetifyjs.com/images/cards/house.jpg)"
            @mousedown="mousedownX"
            @mousemove="mousemoveX"
            @mouseup="mouseupX"></canvas>
          <div id="output"></div>
          <!-- <div id="label-bar">
            <h4>Your boxes</h4>
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
          </div>
          <div
            id="image-wrapper"
            :style="{
              backgroundImage: `url(https://cdn.vuetifyjs.com/images/cards/house.jpg)`,
            }"
            @mousedown="startDrawingBox"
            @mousemove="changeBox"
            @mouseup="stopDrawingBox"
          >
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
          </div> -->
          <!-- <v-row>
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
          </v-row> -->
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
    </v-dialog>
  </span>
</template>

<script>
// import Box from "@/components/Box";
import imageService from "@/services/imageService";

// const getCoursorLeft = (e) => {
//   return e.pageX - document.querySelector("#image-wrapper").offsetLeft;
// };

// const getCoursorTop = (e) => {
//   return e.pageY - document.querySelector("#image-wrapper").offsetTop;
// };

export default {
  name: "Upload",
  props: ["show"],
  // components: {Box},
  data: (this_) => ({
    image: [],
    imageRules: [(value) => !value || "Required"],
    uploadType: "",
    location: null,
    showError: false,
    showSuccess: false,
    showLabellingTool: true, // DEBUG
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
    // drawingBox: {
    //   active: false,
    //   top: 0,
    //   left: 0,
    //   height: 0,
    //   width: 0,
    // },
    // boxes: [],
    // activeBoxIndex: null,
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
    // previewFiles(event) {
    //   console.log(event.target.files);
    //   // console.log(this.$refs.imageRef.files);
    //   // this.image = this.$refs.imageRef.files;
    // },

    /*
     *
     * LABELLING TOOL
     *
     */

    //Mousedown
    // $(canvas).on('mousedown', function(e) {
    //     last_mousex = parseInt(e.pageX-canvasx);
    // 	last_mousey = parseInt(e.pageY-canvasy);
    //     mousedown = true;
    // });
    mousedownX(e) {
      // mousedown
      this.last_mousex = parseInt(e.pageX - this.canvasx);
      this.last_mousey = parseInt(e.pageY - this.canvasy);
      this.mousedown = true;
    },
    mouseupX(e) {
      console.log(e);
      this.mousedown = false;
    },
    // stopDrawingBox(e) {
    //   console.log(e);
    //   //Mouseup
    //   mousedown = false;
    // },
    // $(canvas).on('mouseup', function(e) {
    //  mousedown = false;
    // });
    mousemoveX(e) {
      this.mousex = parseInt(e.pageX - this.canvasx);
      this.mousey = parseInt(e.pageY - this.canvasy);
      if (this.mousedown) {
        console.log(this.mousey, this.mousex);

        //clear rect debri
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();

        var width = this.mousex - this.last_mousex;
        var height = this.mousey - this.last_mousey;

        this.ctx.rect(this.last_mousex, this.last_mousey, width, height);

        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
      // this.ctx.fillStyle = 'green';
      // this.ctx.strokeRect(150, 150, 150, 150);
      // $('#output').html('current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown);
    },
    loadCanvas() {
      this.canvas = document.getElementById('canvas'),
      this.ctx = this.canvas.getContext("2d");
      this.canvasx = document.querySelector("#canvas").offsetLeft;
      this.canvasy = document.querySelector("#canvas").offsetTop;
    }
    // //Mousemove
    // $(canvas).on('mousemove', function(e) {
    //     mousex = parseInt(e.pageX-canvasx);
    // 	mousey = parseInt(e.pageY-canvasy);
    //     if(mousedown) {
    //         ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
    //         ctx.beginPath();
    //         var width = mousex-last_mousex;
    //         var height = mousey-last_mousey;
    //         ctx.rect(last_mousex,last_mousey,width,height);
    //         ctx.strokeStyle = 'red';
    //         ctx.lineWidth = 2;
    //         ctx.stroke();
    //     }
    //     //Output
    //     $('#output').html('current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown);
    // });
    // startDrawingBox(e) {
    //   this.drawingBox = {
    //     width: 0,
    //     height: 0,
    //     top: getCoursorTop(e),
    //     left: getCoursorLeft(e),
    //     active: true,
    //   };
    // },
    // changeBox(e) {
    //   if (this.drawingBox.active) {
    //     this.drawingBox = {
    //       ...this.drawingBox,
    //       width: getCoursorLeft(e) - this.drawingBox.left,
    //       height: getCoursorTop(e) - this.drawingBox.top,
    //     };
    //   }
    // },
    // stopDrawingBox() {
    //   if (this.drawingBox.active) {
    //     if (this.drawingBox.width > 5) {
    //       this.boxes.push({...this.pick(this.drawingBox, ["width", "height", "top", "left"])});
    //     }
    //     this.drawingBox = {
    //       active: false,
    //       top: 0,
    //       left: 0,
    //       height: 0,
    //       width: 0,
    //     };
    //   }
    // },
    // makeBoxActive(i) {
    //   this.activeBoxIndex = i;
    // },
    // removeBox(i) {
    //   this.boxes = this.boxes.filter((elem, index) => {
    //     return index !== i;
    //   });
    //   this.activeBoxIndex = null;
    // },
    // pick(object, keys) {
    //   return keys.reduce((obj, key) => {
    //     // eslint-disable-next-line
    //     if (object && object.hasOwnProperty(key)) {
    //       obj[key] = object[key];
    //     }
    //     return obj;
    //   }, {});
    // },
  },
  mounted() {
    // this.loadCanvas();
    // this.canvas = document.getElementById('canvas'),
    // this.ctx = this.canvas.getContext("2d");
    // this.canvasx = document.querySelector("#canvas").offsetLeft;
    // this.canvasy = document.querySelector("#canvas").offsetTop;
    this.canvas = this.$refs.canvas;
    this.ctx = this.$refs.canvas.getContext('2d');
    this.canvasx = this.canvas.offsetLeft;
    this.canvasy = this.canvas.offsetTop;

    // TESTING:
    // this.ctx.fillStyle = 'green';
    // this.ctx.fillRect(10, 10, 150, 100);
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    // ctx() { return document.querySelector("#canvas").getContext("2d"); },
    // canvasx() { return document.querySelector("#canvas").offsetLeft; }, // $(canvas).offset().left,
    // canvasy() { return document.querySelector("#canvas").offsetTop; }, // $(canvas).offset().top,
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
}
/* #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#app #image-wrapper {
  height: 640px;
  width: 640px;
  background-repeat: no-repeat;
  position: relative;
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
} */
</style>
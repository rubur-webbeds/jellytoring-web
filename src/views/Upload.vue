<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Upload</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <v-file-input
                label="Upload image"
                accept="image/*"
                prepend-icon="mdi-camera"
              ></v-file-input>
            </v-col>
            <v-col cols="12" md="4">
              <v-select :items="['Just upload', 'Label image', 'Infer species']" label="Action"></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="Place"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Date"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="hideForm">Cancel</v-btn>
        <v-btn color="blue darken-1" text>Upload</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Upload",
  props: ["show"],
  data: () => ({
    //
  }),
  methods: {
    hideForm() {
      this.$emit("update:show", !this.show);
    },
  },
};
</script>

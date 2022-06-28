<template>
  <div>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              item-text="t"
              item-value="v"
              persistent-hint
              prepend-inner-icon="mdi-filter"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-spacer></v-spacer>

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  large
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
              <v-icon left>mdi-upload</v-icon>
              Upload
            </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(option, index) in uploadOptions"
                  :key="index"
                  @click="option.action"
                >
                  <v-list-item-title>{{ option.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-container>
          <v-row class="pa-4">
            <v-col
              v-for="item in props.items"
              :key="item.filename"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card>
                <v-img
                  :src="`/images/${item.filename}`"
                  class="white--text align-end"
                  height="200px"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                >
                  <v-card-title class="subheading font-weight-bold"
                    >{{ item.date | dateFilter }}
                  </v-card-title>
                </v-img>

                <v-divider></v-divider>
                <v-card-text>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title>Location</v-list-item-title>
                      <v-list-item-subtitle>{{
                        item.location
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title>Status</v-list-item-title>
                      <v-list-item-subtitle>
                        <!-- INSERT INTO `statuses`(`name`, `code`) VALUES ('Pending', 'PEND'), ('Approved', 'APPR'), ('Discarded', 'DISC'); -->
                        <template v-if="item.status.code == 'PEND'">
                          <v-icon color="orange" small>
                            mdi-dots-horizontal-circle
                          </v-icon>
                        </template>
                        <template v-else-if="item.status.code == 'APPR'">
                          <v-icon color="green" small>
                            mdi-check-circle
                          </v-icon>
                        </template>
                        <template v-else-if="item.status.code == 'DISC'">
                          <v-icon color="red" small> mdi-alert-circle </v-icon>
                        </template>
                        {{ item && item.status && item.status.name }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:no-data>
        <div class="grey--text text--darken-1 text-center text-body-4 mt-8">
          <div class="mb-4">No images yet?</div>
          <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
              <v-icon left>mdi-upload</v-icon>
              Upload now
            </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(option, index) in uploadOptions"
                  :key="index"
                  @click="option.action"
                >
                  <v-list-item-title>{{ option.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
        </div>
      </template>
      <template v-slot:footer>
        <v-container>
          <v-row class="mt-2 pa-6" align="center" justify="center">
            <span class="grey--text">Items per page</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  color="primary"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>
            <span class="mr-4 grey--text">
              Page {{ page }} of {{ numberOfPages }}
            </span>
            <v-btn fab dark color="darken-3" class="mr-1" @click="formerPage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab dark color="darken-3" class="ml-1" @click="nextPage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </template>
    </v-data-iterator>
    <Upload :show.sync="showUploadForm" :images.sync="items" />
    <Inferences :show.sync="showInferenceForm" />
    <v-snackbar v-model="showError" timeout="-1">
      Could not retrieve images. Please reload and try again later.
      <template v-slot:action="{ attrs }">
        <v-btn color="green" text v-bind="attrs" @click="reloadPage()">
          Reload
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>



<script>
import Upload from "@/views/Upload.vue";
import Inferences from "@/views/Inferences.vue";
import imageService from "@/services/imageService";

export default {
  components: {
    Upload,
    Inferences,
  },
  data() {
    return {
      showUploadForm: false,
      showInferenceForm: false,
      showError: true,
      itemsPerPageArray: [4, 8, 16, 24, 32, 64],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 8,
      sortBy: "date",
      keys: [
        { t: "Date", v: "date" },
        { t: "Location", v: "location" },
        { t: "Status", v: "status.code" },
      ],
      items: [],
      uploadOptions: [
        { title: 'Just upload', action: () => {this.showUploadForm = true}},
        { title: 'Infer species', action: () => {this.showInferenceForm = true} },
      ],
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },
  created() {
    this.getUserImages();
  },
  methods: {
    async getUserImages() {
      this.showError = false;
      try {
        const response = await imageService.getUserImages();
        console.log("getUserImages - response:", response.data);

        this.items = response.data;
      } catch (error) {
        this.showError = true;
      }
    },
    reloadPage() {
      location.reload();
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
  },
  filters: {
    dateFilter(value) {
      if (!value) return;
      return new Date(value).toLocaleDateString("es-ES");
    },
  },
};
</script>

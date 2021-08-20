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
            <v-btn large color="primary" @click="showUploadForm = true">
              <v-icon left>mdi-upload</v-icon>
              Upload
            </v-btn>
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
              class="ml-auto"
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
                    >{{ item.date }}
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
                      <v-list-item-title>Approved</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              :color="item.confirmed ? 'green' : 'red'"
                              v-bind="attrs"
                              small
                              v-on="on"
                            >
                              {{
                                item.confirmed
                                  ? "mdi-alert-circle-check"
                                  : "mdi-alert-circle"
                              }}
                            </v-icon>
                            <span v-bind="attrs" small v-on="on">
                              {{ item.confirmed ? "Yes" : "Not yet" }}</span
                            >
                          </template>
                          <span>
                            <template v-if="item.confirmed">
                              Your image has been approved. Hooyah!
                            </template>
                            <template v-else>
                              Your image has not been approved yet.
                            </template>
                          </span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-text>
                <!-- <v-divider></v-divider>
                <span>** DEBUG **:</span>
                <br />
                <v-list dense>
                  <v-list-item
                    v-for="(key, index) in filteredKeys"
                    :key="index"
                  >
                    <v-list-item-content
                      :class="{ 'blue--text': sortBy === key }"
                    >
                      {{ key }}:
                    </v-list-item-content>
                    <v-list-item-content
                      class="align-end"
                      :class="{ 'blue--text': sortBy === key }"
                    >
                      {{ item[key.toLowerCase()] }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list> -->
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:no-data>
        <div class="grey--text text--darken-1 text-center text-body-4 mt-8">
          <div class="mb-4">No images yet?</div>
          <v-btn class="ma-1" dark @click="showUploadForm = true">
            UPLOAD NOW
          </v-btn>
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
    <Upload :show.sync="showUploadForm" />
  </div>
</template>



<script>
import Upload from "@/views/Upload.vue";
import { jellytoringApi } from "@/services/jellytoringApi";

export default {
  components: {
    Upload,
  },
  data() {
    return {
      showUploadForm: false,
      itemsPerPageArray: [4, 8, 16, 24, 32, 64],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 8,
      sortBy: "name",
      keys: ["Name", "Confirmed", "Location", "Date"],
      items: [],
      items_TESTING: [
        {
          name: "Image name #1",
          image: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
          confirmed: false,
          location: "Port de Soller",
          date: "13/08/2021",
          user: {
            user_id: 1,
            name: "Joan",
          },
        },
        {
          name: "Image name #2",
          image: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
          confirmed: true,
          location: "Port de Soller #2",
          date: "20/08/2021",
          user: {
            user_id: 1,
            name: "Joan",
          },
        },
        {
          name: "Image name #3",
          image: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
          confirmed: false,
          location: "Port de Soller #3",
          date: "14/08/2021",
          user: {
            user_id: 1,
            name: "Joan",
          },
        },
      ],
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  created() {
    this.getUserImages();
  },
  methods: {
    async getUserImages() {
       try {
        const response = await jellytoringApi.get("/api/images");
        console.log('getUserImages - response:', response.data);

        // PARSE DATA
        for (let index = 0; index < response.data.length; index++) {
          response.data[index].date = new Date(response.data[index].date).toLocaleDateString('es-ES');
        }

        this.items = response.data
      } catch (error) {
        this.showError = true;
      }
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
};
</script>

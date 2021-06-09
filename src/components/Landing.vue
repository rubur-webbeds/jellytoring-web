<template>
  <div>
    <vue-video-section
      v-if="false"
      :elementId="'header-background-video'"
      :ref="'header-background-video'"
      :mp4Source="require('../assets/media/video/jellyfish.mp4')"
      :mobileBreakpoint="992"
      :desktopHeight="550"
      :mobileHeight="450"
      :playsinline="true"
      :loop="true"
      :autoplay="true"
      :autobuffer="true"
      :muted="true"
    >
      <div slot="overlay-content" class="overlay-content">
        <h1>Machine learning applied to the ocean</h1>
        <h3>
          jellyfish video provided by Videvo, downloaded from www.videvo.net
        </h3>
        <!-- <div class="container py-4">
        <div class="row justify-content-center mb-4">
          <div class="col-lg-6">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
              quam laboriosam iusto, sapiente, tempore eaque eos unde.
              Recusandae, officia perferendis tenetur in animi excepturi
              perspiciatis culpa amet quia voluptatibus tempora.
            </p>
          </div>
        </div>
      </div> -->
      </div>
    </vue-video-section>
    <v-parallax
      :src="require('../assets/media/img/jellyfish.jpg')"
    ></v-parallax>
    
  </div>
</template>

<template>
  <section id="hero">
    <div
      class="d-flex justify-space-around mb-6 align-center py-16 container"
      height="900"
    >
      <div>
          <h1 class="text-h2 white--text">
            Bringing artificial intelligence to the oceans
          </h1>

          <p class="mt-4 text-medium-emphasis white--text">
            Ocean ocean ocean, Millions of developers and companies build, ship, and maintain their software on GitHub—the largest and most advanced development platform in the world.
          </p>
      </div>
      <v-img class="pa-2"
        :lazy-src="require('@/assets/media/img/jellyfish_1.jpeg')"
        max-height="1500"
        max-width="500"
        :src="require('@/assets/media/img/jellyfish_1.jpeg')"
      ></v-img>
    </div>
  </section> 
</template>


<script>
  export default {
    name: 'LandingHero'
  }
</script>

<style scoped>
#hero {
  background-color: black;
}
</style>

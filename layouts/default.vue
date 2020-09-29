<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
          href="/"
          class="navbar-item big-title"
        >
          Juan Manuel Bécares Silva - Nuxt Demo
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
    </nav>

    <section class="main-content columns">
      <aside class="column is-2 section">
        <p class="menu-label is-hidden-touch">
          General
        </p>
        <ul class="menu-list">
          <li
            v-for="(item, key) of items"
            :key="key"
          >
            <nuxt-link
              :to="item.to"
              exact-active-class="is-active"
            >
              <b-icon :icon="item.icon" /> {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
      </aside>

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Madrid Parkings',
          icon: 'car',
          to: { name: 'parkings' }
        },
        {
          title: 'Madrid Parkings Map',
          icon: 'map',
          to: { name: 'parkingsMap' }
        },
        {
          title: 'Weather',
          icon: 'cloud',
          to: { name: 'weather' }
        }
      ]
    }
  }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap')

.big-title 
  font-family: "Lobster"
  font-size: 24pt

</style>
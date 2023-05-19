<template>
  <home msg="Welcome to Your Vue.js App"/>
</template>

<script>
import home from './components/home.vue'

export default {
  name: 'App',
  components: {
    home
  }
}
</script>

<style>
html {
  font-size: 62.5%;
  scroll-behavior: smooth;
  overflow-x: hidden;
}
a{
  text-decoration: none;
  color: inherit;
}
@media screen and (max-width: 75em) {
  html {
    font-size: 56.25%;
  }
}
@media screen and (max-width: 56.25em) {
  html {
    font-size: 50%;
  }
}
@media screen and (max-width: 37.5em) {
  html {
    font-size: 50%;
  }
}
@media screen and (min-width: 121.875em) {
  html {
    font-size: 65%;
  }
}

body {
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 400;
  line-height: 1.7;
  overflow-x: hidden;
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

*,
*::after,
*::before {
  box-sizing: inherit;
}
</style>

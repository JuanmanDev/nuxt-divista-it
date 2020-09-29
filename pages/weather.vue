<template>
  <section class="section">
    
    <b-tooltip label="E.g. Madrid, ES">
      <b-field>
        <b-input placeholder="City, Country" type="search" icon="magnify" v-model="newCity">
        </b-input>
        <p class="control">
          <button class="button is-primary" @click="changeWeather()">See Weather</button>
        </p>
      </b-field>
    </b-tooltip>
    <div class="columns is-desktop mt-1" v-if="weatherData.name">

      <card title="City" icon="city">
        {{ weatherData.name }}
      </card>
      <card title="Country" icon="island">
        {{ weatherData.country }}
      </card>
      <card title="Location" icon="crosshairs-gps">
        {{ weatherData.coord.lon }}, {{ weatherData.coord.lat }}
      </card>

      <card :title="weatherData.weather.summary.title" icon="brightness-5">
        {{ weatherData.weather.summary.description }}
      </card>

      <card title="Temperature" icon="home-thermometer">
        {{ (weatherData.weather.temperature.actual - 273.15).toFixed(1) }} ºC
        ({{ (weatherData.weather.temperature.feelsLike - 273.15).toFixed(1) }} ºC)
      </card>

      <card title="Wind" icon="send">
        {{ weatherData.weather.wind.speed }} km/h
      </card>
    </div>
  </section>
</template>

<script lang="ts">
import Card from '~/components/Card'

import { request, gql } from 'graphql-request'


const query = gql`
  query($city: String!) {
    getCityByName(name: $city) {
      id
      name
      country
      coord {
        lon
        lat
      }
      weather {
        summary {
          title
          description
          icon
        }
        temperature {
          actual
          feelsLike
          min
          max
        }
        wind {
          speed
          deg
        }
        clouds {
          all
          visibility
          humidity
        }
        timestamp
      }
    }
  }
`
export default {
  name: 'HomePage',

  components: {
    Card
  },
  data() {
    return {
      newCity: "",
      weatherData: {},
    }
  },
  async created() {
    this.getWeather();
  },
  watch: {
    $route() {
      this.getWeather();
    }
  },
  methods: {
    async getWeather(newCity ? : string) {
      try {
        const data = await request('https://graphql-weather-api.herokuapp.com/', query, {
          city: newCity || this.$route.query["city"] || "Madrid, ES"
        })
        this.weatherData = data.getCityByName;
      } catch (e) {
        console.error(e)
      }
    },
    changeWeather() {
      this.$router.push("/weather?city=" + this.newCity);
      // this.getWeather(this.newCity);
    }
  },
}
</script>

<style lang="sass">
$margin-top: 0

.centered
  margin: $margin-top auto

</style>
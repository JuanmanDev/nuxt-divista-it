<template>
  <client-only>
    <section class="section">
      <div class="box has-text-centered">
        <h2 class="title is-3 has-text-grey">
          Parkings
          <b-icon icon="car" size="is-large" />
        </h2>

        <b-field grouped group-multiline>
          <b-select v-model="perPage" :disabled="!isPaginated">
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="100">100 per page</option>
          </b-select>
          <div class="control is-flex">
            <b-switch v-model="isPaginated">Paginated</b-switch>
          </div>
          <div class="control is-flex">
            <b-switch v-model="isPaginationSimple" :disabled="!isPaginated">Simple pagination</b-switch>
          </div>
        </b-field>

        <b-table :loading="isLoading" :data="data" :paginated="isPaginated" :per-page="perPage"
          :current-page="currentPage" :pagination-simple="isPaginationSimple" :pagination-position="paginationPosition"
          :default-sort-direction="defaultSortDirection" :sort-icon="sortIcon" :sort-icon-size="sortIconSize"
          default-sort="user.first_name" aria-next-label="Next page" aria-previous-label="Previous page"
          aria-page-label="Page" aria-current-label="Current page">

          <b-table-column field="id" label="ID" sortable numeric v-slot="props" searchable>
            <a :href="props.row['@id']"> {{ props.row.id }} </a>
          </b-table-column>
          <b-table-column field="title" label="Name" sortable v-slot="props" searchable>
            {{ props.row.title }}
          </b-table-column>
          <b-table-column field="fullAddress" label="Address" sortable v-slot="props" searchable>
            <span v-html="props.row.address['street-address']"></span>
            <br>
            <span v-html="props.row.address.districtName"></span>
            <span v-html="props.row.address.areaName"></span>
            <br>
            <span v-html="props.row.address['postal-code']"></span>
            <span v-html="props.row.address.locality"></span>
          </b-table-column>
          <b-table-column field="location" label="Location" sortable numeric v-slot="props">
            {{ props.row.location.latitude }}
            {{ props.row.location.longitude }}
          </b-table-column>

          <b-table-column field="distance" label="Distance" v-if="calulatedDistance" sortable numeric v-slot="props">
            {{ props.row.distance.toFixed(1) }} km
          </b-table-column>

          <b-table-column field="maps" label="Maps" v-slot="props">
            <a :href="`http://www.google.com/maps/place/${ props.row.location.latitude },${ props.row.location.longitude }`"
              target="_blank">
              <b-button>
                See on Google Maps
              </b-button>
            </a>
          </b-table-column>
        </b-table>
        <br>
        <b-button type="is-primary" v-if="browserSupportsGeolocation && !calulatedDistance" @click="tryGetDistance()">
          <b-icon icon="map-marker-distance"></b-icon>
          <span> Calculate Distance from current position </span>
        </b-button>
      </div>
    </section>
  </client-only>
</template>

<script lang="ts">
const URL_PARKING_DATA = "https://datos.madrid.es/egob/catalogo/202625-0-aparcamientos-publicos.json";
const MOCK_DATA = require("../mocks/parkings.json");

export default {
  data() {
    return {
      data: [],
      isLoading: true,
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 10,
      calulatedDistance: false,
      userCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      buttonGeoLocationClicks: 0,
    }
  },
  async created() {
    // const result = await this.$axios.get(URL_PARKING_DATA); /// TODO FIX CORS WITH PROXY
    this.data = MOCK_DATA["@graph"];
    this.getDistrictAndArea()
    if (this.browserSupportsGeolocation) {
      this.tryGetDistance();
    }
    this.isLoading = false;
  },
  computed: {
    browserSupportsGeolocation() {
      if (process.browser) {
        return !!navigator.geolocation;
      }
      return false;
    },
  },
  methods: {
    getDistrictAndArea() {
      for (let parking of this.data) {
        parking.address.districtName = parking.address.district["@id"].substring(parking.address.district["@id"].lastIndexOf("/") + 1);
        parking.address.areaName = parking.address.area["@id"].substring(parking.address.area["@id"].lastIndexOf("/") + 1);
        parking.fullAddress =
          unescape(parking.address['street-address']) +
          unescape(parking.address.districtName) +
          unescape(parking.address.areaName) +
          unescape(parking.address['postal-code']) +
          unescape(parking.address.locality);
      }
    },
    async tryGetDistance() {
      this.buttonGeoLocationClicks++;
      if (this.buttonGeoLocationClicks % 4 === 0) {
        this.$buefy.notification.open({
          type: 'is-warning',
          message: 'Please, ensure location is allowed in site settings of yout browser.',
          duration: 12000,
          "has-icon": true
        })
      }
      if (this.browserSupportsGeolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.calulatedDistance = true;
          this.userCoordinates = position.coords as {
            latitude: number,
            longitude: number,
          };

          if (this.data) {
            for (let parking of this.data) {
              parking.distance = this.distance(
                this.userCoordinates.latitude,
                this.userCoordinates.longitude,
                parking.location.latitude,
                parking.location.longitude,
                'K'
              );
            }
          }

        });
      }
    },
    // https://www.geodatasource.com/developers/javascript
    distance(lat1: number, lon1: number, lat2: number, lon2: number, unit: 'M' | 'K' | 'N') {
      if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
      } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
          dist = dist * 1.609344
        }
        if (unit == "N") {
          dist = dist * 0.8684
        }
        return dist;
      }
    }
  },
}
</script>

<style>

</style>
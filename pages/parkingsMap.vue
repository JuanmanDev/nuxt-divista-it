<template>
  <client-only>
    <section class="section">
      <div class="box has-text-centered">
        <div id="map-wrap" style="height: 100vh">
 
   <l-map :zoom=13 :center="[40.416732,-3.7045862]">
     <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
     <l-marker
      v-for="parking in data"
      :key="parking.id"
      :lat-lng="[parking.location.latitude,parking.location.longitude]"
      >
        <l-popup>
          <div @click="innerClick">
            <h5 class="title is-5">{{ parking.title }}</h5>
            
            {{ parking.address['street-address'] }}
            <br>
            {{ parking.address.districtName }}
            {{ parking.address.areaName }}
            <br>
            {{ parking.address['postal-code'] }}
            {{ parking.address.locality }}
          </div>
        </l-popup>
     </l-marker>
   </l-map>
 
</div>
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
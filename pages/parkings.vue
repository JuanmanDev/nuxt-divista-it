<template>
  <section class="section">
    <h2 class="title is-3 has-text-grey">
      Parkings  <b-icon
        icon="car"
        size="is-large"
      />
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
            <!-- <b-select v-model="paginationPosition" :disabled="!isPaginated">
                <option value="bottom">bottom pagination</option>
                <option value="top">top pagination</option>
                <option value="both">both</option>
            </b-select>
            <b-select v-model="sortIcon">
                <option value="arrow-up">Arrow sort icon</option>
                <option value="menu-up">Caret sort icon</option>
                <option value="chevron-up">Chevron sort icon </option>
            </b-select>
            <b-select v-model="sortIconSize">
                <option value="is-small">Small sort icon</option>
                <option value="">Regular sort icon</option>
                <option value="is-medium">Medium sort icon</option>
                <option value="is-large">Large sort icon</option>
            </b-select> -->
        </b-field>

        <b-table
            :loading="isLoading"
            :data="data"
            :paginated="isPaginated"
            :per-page="perPage"
            :current-page="currentPage"
            :pagination-simple="isPaginationSimple"
            :pagination-position="paginationPosition"
            :default-sort-direction="defaultSortDirection"
            :sort-icon="sortIcon"
            :sort-icon-size="sortIconSize"
            default-sort="user.first_name"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page">

            <b-table-column field="id" label="ID" sortable numeric v-slot="props">
                <a :href="props.row['@id']"> {{ props.row.id }} </a>
            </b-table-column>
            <b-table-column field="type" label="Type" sortable numeric v-slot="props">
                <a :href="props.row['@type']"> @type </a>
            </b-table-column>
            <b-table-column field="name" label="Name" sortable numeric v-slot="props">
                {{ props.row.title }}
            </b-table-column>
            <b-table-column field="address" label="Address" sortable numeric v-slot="props">
                <span v-html="props.row.address['street-address']"></span>
                <span v-html="props.row.address['postal-code']"></span>
                <span v-html="props.row.address.locality"></span>
            </b-table-column>
            <b-table-column field="location" label="Location" sortable numeric v-slot="props">
                {{ props.row.location.latitude }}
                {{ props.row.location.longitude }}
            </b-table-column>
            
            <b-table-column field="maps" label="maps" sortable numeric v-slot="props">
              <a
                :href="`http://www.google.com/maps/place/${ props.row.location.latitude },${ props.row.location.longitude }`"
                target="_blank"
              >
                <b-button>
                  See on Google Maps
                </b-button>
              </a>
            </b-table-column>
        </b-table>
  </section>
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
                perPage: 10
            }
        },
        async created() {
          // const result = await this.$axios.get(URL_PARKING_DATA); /// TODO FIX CORS WITH PROXY
          this.data = MOCK_DATA["@graph"];
          this.isLoading = false;
        }
}
</script>

<style>

</style>
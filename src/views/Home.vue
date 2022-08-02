<template>
  <v-container>
    <v-btn v-for="workstation in workstations" :key="workstation.id" x-large :to="{name: 'Production', params: { id: workstation.id}}">
      {{ workstation.name }}
    </v-btn>
  </v-container>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { onMounted } from "vue";

@Component
export default class Home extends Vue {

  private workstations = [];

  mounted() {
    Vue.axios.get('/api/weighing/workstations')
        .then(ws => this.workstations = ws.data);
  }


}
</script>

<style lang="scss" scoped>

</style>

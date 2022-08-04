<template>
  <v-container class="wrapper">

    <v-btn v-for="workstation in workstations" :key="workstation.id" x-large
           :to="{name: 'Production', params: { id: workstation.id}}">
      {{ workstation.name }}
    </v-btn>
  </v-container>

</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

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
.wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 25px;

  > a {
    flex: 1 0 30%;
    min-height: 25vh;
    font-size: 6vh;
  }
}
</style>

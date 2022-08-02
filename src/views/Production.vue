<template>
  <v-container v-if="workstation">
    <div>Production {{ workstation.name }}</div>

    <v-tabs
        fixed-tabs
        centered
        v-model="tab"
    >
      <v-tab>
        Planung
      </v-tab>
      <v-tab>
        Produktion
      </v-tab>

    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <PlanNewProductionRun :workstation="workstation" />
      </v-tab-item>
      <v-tab-item>
        prod
      </v-tab-item>
    </v-tabs-items>

  </v-container>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PlanNewProductionRun from "@/components/planning/PlanNewProductionRun.vue";

@Component({
  components: { PlanNewProductionRun }
})
export default class Production extends Vue {

  @Prop({ type: String, required: true })
  public id!: string;

  private workstation = null;
  private tab = 'planning';

  public mounted() {
    Vue.axios.get('api/weighing/workstations')
        .then(res => this.workstation = res.data.filter(ws => ws.id === this.id)[0]);
  }

}
</script>

<style lang="scss" scoped>

</style>

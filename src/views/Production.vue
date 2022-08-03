<template>
  <div>
    <v-toolbar dense>
      <v-tabs
          fixed-tabs
          v-model="tab"
      >
        <v-tab>

          Planung
        </v-tab>
        <v-tab>Produktion</v-tab>

      </v-tabs>
    </v-toolbar>
    <v-container v-if="workstation">
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <PlanNewProductionRun :workstation="workstation" />
        </v-tab-item>
        <v-tab-item>
          <CurrentProductionRun :workstation="workstation" />
        </v-tab-item>
      </v-tabs-items>

    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PlanNewProductionRun from "@/components/planning/PlanNewProductionRun.vue";
import ProductionWorkstation from "@/models/production/ProductionWorkstation";
import CurrentProductionRun from "@/components/production/CurrentProductionRun.vue";

@Component({
  components: { CurrentProductionRun, PlanNewProductionRun }
})
export default class Production extends Vue {

  @Prop({ type: String, required: true })
  public id!: string;

  private workstation = null;
  private tab = 'planning';

  public mounted() {
    Vue.axios.get('api/weighing/workstations')
        .then(res => this.workstation = res.data.filter((ws: ProductionWorkstation) => ws.id === this.id)[0]);
  }

}
</script>

<style lang="scss" scoped>

</style>

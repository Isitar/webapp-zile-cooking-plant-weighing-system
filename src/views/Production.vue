<template>
  <div class="height-100 d-flex flex-column">
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
          <v-tab>Tara</v-tab>

        </v-tabs>
      </v-toolbar>
    </div>
    <div class="d-flex flex-column grow flex-auto">
      <v-container v-if="workstation" fluid class="grow flex-auto">
        <v-tabs-items v-model="tab" class="height-100">
          <v-tab-item>
            <PlanNewProductionRun :workstation="workstation" v-if="tab === 0" />
          </v-tab-item>
          <v-tab-item class="fill-height">
            <div class="fill-height d-flex flex-column">
              <CurrentProductionRun :workstation="workstation" class="grow flex-auto" v-if="tab === 1" />
            </div>
          </v-tab-item>
          <v-tab-item class="fill-height">
            {{tab}}
            <div class="fill-height d-flex flex-column">
              <TaraControl :workstation="workstation" class="grow flex-auto" v-if="tab === 2" />
            </div>
          </v-tab-item>
        </v-tabs-items>

      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import PlanNewProductionRun from "@/components/planning/PlanNewProductionRun.vue";
import ProductionWorkstation from "@/models/production/ProductionWorkstation";
import CurrentProductionRun from "@/components/production/CurrentProductionRun.vue";
import TaraControl from "@/components/tara/TaraControl.vue";

@Component({
  components: {CurrentProductionRun, PlanNewProductionRun, TaraControl}
})
export default class Production extends Vue {

  @Prop({type: String, required: true})
  public id!: string;

  private workstation = null;
  private tab = 0;

  public mounted() {
    Vue.axios.get('api/weighing/workstations')
        .then(res => this.workstation = res.data.filter((ws: ProductionWorkstation) => ws.id === this.id)[0]);
  }

}
</script>

<style lang="scss" scoped>
</style>

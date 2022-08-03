<template>
  <div>
    <v-form>
      <v-row>
        <v-col>
          <v-autocomplete
              label="FA"
              v-model="selectedFANo"
              :items="fas"
              item-text="productionOrderNumber"
              item-value="productionOrderNumber"
          >
            <template v-slot:selection="data">
              {{ data.item.productionOrderNumber }} ({{ data.item.outputItem.itemNo }} {{ data.item.outputItem.name }})
            </template>

            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title>{{ data.item.productionOrderNumber }}</v-list-item-title>
                <v-list-item-subtitle> {{ data.item.outputItem.itemNo }} {{ data.item.outputItem.name }}</v-list-item-subtitle>
              </v-list-item-content>
            </template>

          </v-autocomplete>
        </v-col>
        <v-col>
          <v-text-field
              label="Prodkution kg /h"
              v-model="prodPerHour"
          />
        </v-col>
      </v-row>
      <div v-if="selectedFANo" class="cards">
        <v-card v-for="component in selectedFA.components" :key="component.item.itemNo" outlined
                class="lighten-3"
                :class="{
          'blue': component.isFluid,
          'grey': component.isSolid
        }"

        >
          <v-card-title>{{ component.item.itemNo }} {{ component.item.name }}</v-card-title>
          <v-card-text>
            <v-list dense class="pt-0 mt-0">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Untere Toleranz
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ component.lowerTolerance }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    Obere Toleranz
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ component.upperTolerance }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </div>
      <v-divider class="my-3" />
      <div class="cards">
        <v-card v-for="scale in scales" :key="scale.id" outlined
                class="lighten-3"
                :class="{
          'blue': scale.canFluid,
          'grey': scale.canSolid
        }">
          <v-card-title>
            {{ scale.name }}
          </v-card-title>
          <v-divider />
          <v-card class="ma-3">
            <v-card-title>Zuegwiesene Komponente 1</v-card-title>
            <v-divider />
            <v-card-actions>
              <v-btn
                  text
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-card>
      </div>
    </v-form>
    <v-divider class="my-3" />
    <v-btn block color=" success    ">Übernehmen</v-btn>

    <template v-if="runningProductionRun">
      <v-divider class="my-3" />
      <div class="cards">
        <AssignedScale
            v-for="scale in scales" :key="scale.id"
            :scale="scale" :assigned-component="runningProductionRunAssignedComponent(scale)" />

      </div>

    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AssignedScale from "@/components/planning/AssignedScale.vue";
@Component({
  components: { AssignedScale }
})
export default class PlanNewProductionRun extends Vue {
  @Prop({ type: Object, required: true })
  public workstation!: object;

  private selectedFANo: object | null = null;
  private prodPerHour = 0;

  private productionRuns = [];

  private plannedProductionRun = null;
  private runningProductionRun = null;


  private fas: [] = [];

  public mounted() {
    Vue.axios.get('api/production/production-orders')
        .then(res => this.fas = res.data);

    Vue.axios.get(`api/production/workstations/${this.workstation.id}/production-runs`)
        .then(res => this.productionRuns = res.data);
  }

  private get selectedFA() {
    return this.fas.concat().filter(fa => fa.productionOrderNumber === this.selectedFANo)[0]
  }

  private get scales() {
    return this.workstation.scales.concat().sort((x1, x2) => x1.name.localeCompare(x2.name));
  }

  @Watch('productionRuns')
  private onProdRunChanged() {
    this.plannedProductionRun = this.productionRuns.find(pr => pr.productionRunState === 0) ?? null;
    if (this.plannedProductionRun !== null) {
      this.selectedFANo = this.plannedProductionRun.productionOrder.productionOrderNumber;
      this.prodPerHour = this.plannedProductionRun.expectedFlowPerHour;
    }

    this.runningProductionRun = this.productionRuns.find(pr => pr.productionRunState === 1) ?? null;
  }

  private runningProductionRunAssignedComponent(scale) {
    return this.runningProductionRun.assignments.find(a => a.productionRunAssignmentScale.id === scale.id) ?? null;
  }


}
</script>
<style lang="scss" scoped>
.cards {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;

  > * {
    flex: 1 0 auto;
  }
}
</style>

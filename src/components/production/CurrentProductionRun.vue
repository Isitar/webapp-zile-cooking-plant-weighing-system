<template>
  <div v-if="productionRun" class="d-flex flex-column">
    <v-row class="mb-3 info-cards">
      <v-col>
        <v-card>
          <v-list-item dense>
            <v-list-item-content v-if="!editMode">
              <v-list-item-title>{{ productionRun.productionOrder.productionOrderNumber }}</v-list-item-title>
              <v-list-item-subtitle>{{ productionRun.productionOrder.outputItem.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-list-item dense>
            <v-list-item-content v-if="!editMode">
              <v-list-item-title>Produktion kg /h</v-list-item-title>
              <v-list-item-subtitle>{{ flowPerHour }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content v-else>
              <v-text-field
                  label="Prodkution kg /h"
                  v-model="flowPerHour"
              />
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                <v-btn @click="editMode = true" v-if="!editMode" icon small>
                  <v-icon small>mdi-pen</v-icon>
                </v-btn>
                <v-btn @click="updateProdPerHour" v-if="editMode" icon small color="success">
                  <v-icon small>mdi-content-save</v-icon>
                </v-btn>
                <v-btn @click="editMode = false" v-if="editMode" icon small>
                  <v-icon small>mdi-cancel</v-icon>
                </v-btn>
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <div class="cards grow flex-auto d-flex flex-row">
      <div v-for="scale in scales" :key="scale.id" class="flex-auto grow d-flex flex-column">
        <AssignedScale
            :scale="scale" :assigned-component="assignedComponent(scale)"
            :production-run-id="productionRun.id"
            compact
            @updated="loadProductionRuns"
            class="grow flex-auto"
        >
          <template v-slot:after
                    v-if="assignedComponent(scale)">
            <ScaleBox :current-value="scaleValue(scale)"
                      :lower-tolerance="assignedComponent(scale).lowerTolerance"
                      :upper-tolerance="assignedComponent(scale).upperTolerance"
                      :target-value="assignedComponent(scale).expectedFlow"
                      class="ma-3 grow flex-auto"
            />
          </template>
        </AssignedScale>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import ProductionRun, {ProductionRunAssignment} from "@/models/production/ProductionRun";
import ProductionScale from "@/models/production/ProductionScale";
import ProductionWorkstation from "@/models/production/ProductionWorkstation";
import AssignedScale from "@/components/planning/AssignedScale.vue";
import ScaleBox from "@/components/production/ScaleBox.vue";
import ScaleMeasurementsGraph from "@/components/production/ScaleMeasurementsGraph.vue";

const scaleRefreshrate = 2000;

@Component({
  components: {ScaleMeasurementsGraph, ScaleBox, AssignedScale}
})
export default class PlanNewProductionRun extends Vue {

  @Prop({type: Object, required: true})
  public workstation!: ProductionWorkstation;

  private dialogOpen = false;
  private editMode = false;
  private productionRun: ProductionRun | null = null;
  private flowPerHour = 0;
  private scaleData: { scaleId: string; val: number }[] = [];


  private scaleTimeout: number | null = null;

  private loadProductionRuns() {
    Vue.axios.get<ProductionRun[]>(`api/production/workstations/${this.workstation.id}/production-runs`)
        .then(res => this.productionRun = res.data.filter((pr: ProductionRun) => pr.productionRunState == 1)[0])
        .then(() => this.flowPerHour = this.productionRun?.expectedFlowPerHour ?? 0)
        .then(() => {
          if (this.scaleTimeout !== null) {
            clearTimeout(this.scaleTimeout);
          }
          if (this.productionRun !== null) {
            this.scaleTimeout = setTimeout(this.loadScaleValues, scaleRefreshrate);
          }
        });
  }

  private loadScaleValues() {
    if (null === this.productionRun) {
      return;
    }
    const promises: Promise<void>[] = [];
    this.productionRun?.assignments.forEach(assignment => {
      const scale = assignment.productionRunAssignmentScale;

      promises.push(
          Vue.axios.get(`api/weighing/scales/${scale.id}/flow?t=${assignment.deltaT}`)
              .then(res => {
                const existingScaleData = this.scaleData.find(s => s.scaleId === scale.id) ?? null;
                if (existingScaleData !== null) {
                  this.scaleData.find(s => s.scaleId === scale.id).val = res.data;
                } else {
                  this.scaleData.push({scaleId: scale.id, val: res.data});
                }
              })
      );
    });
    Promise.all(promises)
        .finally(() => this.scaleTimeout = setTimeout(this.loadScaleValues, scaleRefreshrate))
    ;
  }

  mounted() {
    this.loadProductionRuns()
  }

  beforeUnmount() {
    if (this.scaleTimeout !== null) {
      clearTimeout(this.scaleTimeout);
    }
  }

  private get scales(): ProductionScale[] {
    return this.workstation.scales.concat().sort((x1, x2) => x1.name.localeCompare(x2.name));
  }

  private assignedComponent(scale: ProductionScale): ProductionRunAssignment | null {
    return this.productionRun?.assignments.find(a => a.productionRunAssignmentScale.id === scale.id) ?? null;
  }

  private updateProdPerHour() {
    Vue.axios.put(`api/production/production-runs/${this.productionRun?.id}/flow`, {
      flow: this.flowPerHour
    })
        .then(() => {
          this.loadProductionRuns();
          this.editMode = false;
        });
  }

  private scaleValue(scale: ProductionScale): number {
    return this.scaleData.find(s => s.scaleId === scale.id)?.val ?? 0;
  }
}
</script>
<style lang="scss" scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25px, 1fr));
  gap: 25px;
  flex-wrap: wrap;

  > * {
    flex: 1 0 calc(12.5% - 25px);
  }
}

.scale-intern {
  min-height: 30vh;

  > * {
    flex: 1 0 auto;
  }
}

.info-cards {
  flex: 0 0 auto;
}
</style>

<template>
  <div v-if="productionRun">
    <v-card width="50%" class="my-3">
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

    <div class="cards">
      <div v-for="scale in scales" :key="scale.id">
        <AssignedScale
            :scale="scale" :assigned-component="assignedComponent(scale)"
            :production-run-id="productionRun.id"
            compact

        >
          <template v-slot:after
                    v-if="assignedComponent(scale)">
            <ScaleBox :current-value="scaleValue(scale)"
                      :lower-tolerance="assignedComponent(scale).lowerTolerance"
                      :upper-tolerance="assignedComponent(scale).upperTolerance"
                      :target-value="assignedComponent(scale).expectedFlow"
                      class="ma-3"
            />
          </template>
        </AssignedScale>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ProductionRun, { ProductionRunAssignment } from "@/models/production/ProductionRun";
import ProductionScale from "@/models/production/ProductionScale";
import ProductionWorkstation from "@/models/production/ProductionWorkstation";
import AssignedScale from "@/components/planning/AssignedScale.vue";
import ScaleBox from "@/components/production/ScaleBox.vue";

@Component({
  components: { ScaleBox, AssignedScale }
})
export default class PlanNewProductionRun extends Vue {

  @Prop({ type: Object, required: true })
  public workstation!: ProductionWorkstation;

  private editMode = false;
  private scaleValues: { [scaleId: string]: number } = {};
  private productionRun: ProductionRun | null = null;
  private flowPerHour = 0;

  private scaleTimeout: number | null = null;

  private loadProductionRuns() {
    Vue.axios.get<ProductionRun[]>(`api/production/workstations/${this.workstation.id}/production-runs`)
        .then(res => this.productionRun = res.data.filter((pr: ProductionRun) => pr.productionRunState == 1)[0])
        .then(() => this.flowPerHour = this.productionRun!.expectedFlowPerHour)
        .then(() => {
          if (this.scaleTimeout !== null) {
            clearTimeout(this.scaleTimeout);
          }
          if (this.productionRun !== null) {
            this.scaleTimeout = setTimeout(this.loadScaleValues, 1000);
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
              .then(res => this.scaleValues[scale.id] = res.data)
      );
    });
    Promise.all(promises)
        .finally(() => this.scaleTimeout = setTimeout(this.loadScaleValues, 1000))
        ;
  }

  mounted() {
    this.loadProductionRuns()
  }
  unmounted() {
    console.log('unmounted');
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
        .then(this.loadProductionRuns);
  }

  private scaleValue(scale: ProductionScale): number {
    if (Object.keys(this.scaleValues).find(k => k === scale.id)) {
      return this.scaleValues[scale.id] ?? 0;
    }
    return 0;
  }
}
</script>
<style lang="scss" scoped>
.cards {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;

  > * {
    flex: 1 0 calc(12.5% - 25px);
  }
}
</style>

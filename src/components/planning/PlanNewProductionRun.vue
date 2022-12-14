<template>
  <div>
    <v-form>
      <v-card outlined class="">
        <v-card-title>Geplanter Produktionslauf</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-autocomplete
                  label="FA"
                  v-model="selectedFANo"
                  :items="fas"
                  item-text="productionOrderNumber"
                  item-value="productionOrderNumber"
                  @change="updateProductionOrder"
              >
                <template v-slot:selection="data">
                  {{ data.item.productionOrderNumber }} ({{ data.item.outputItem.itemNo }} {{
                    data.item.outputItem.name
                  }})
                </template>

                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.productionOrderNumber }}</v-list-item-title>
                    <v-list-item-subtitle> {{ data.item.outputItem.itemNo }} {{
                        data.item.outputItem.name
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>

              </v-autocomplete>
            </v-col>
            <v-col>
              <v-text-field
                  label="Prodkution kg /h"
                  v-model="flowPerHour"
                  @change="updateProdPerHour"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <template v-if="selectedFANo">
        <div v-if="selectedFANo" class="cards mt-3">
          <v-card v-for="component in selectedFA.components" :key="component.item.itemNo" outlined
                  class="lighten-3"
                  :class="{
          'blue': component.isFluid,
          'purple': component.isSolid
        }"
                  @dragstart="dragStart(component)"
                  draggable
                  @dragend="dragEnd(component)"
          >
            <v-card-title>{{ component.item.itemNo }} {{ component.item.name }}</v-card-title>
            <v-card-text class="pa-0">
              <v-list dense class="pt-0 mt-0 transparent">
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
                      Komponentenmenge / kg
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ component.componentQty }}
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
      </template>
      <v-divider class="my-3"/>
      <div class="cards">
        <v-card v-for="scale in scales" :key="scale.id" outlined
                class="lighten-3"
                :class="{
          'blue': scale.canFluid,
          'purple': scale.canSolid
        }">
          <v-card-title>
            {{ scale.name }}
          </v-card-title>
          <v-divider class="my-3"/>


          <AssignmentCard
              v-if="plannedProductionRun && plannedProductionRunAssignedComponent(scale)"
              :assigned-component="plannedProductionRunAssignedComponent(scale)"
              :production-run-id="plannedProductionRun.id" @updated="loadProductionRuns">
            <template v-slot:footer>
              <v-card-actions class="justify-end">
                <v-btn color="error" block @click="unassign(plannedProductionRunAssignedComponent(scale))">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </template>
          </AssignmentCard>

          <v-card class="ma-3 d-flex flex-column" v-else>
            <v-card-text class="text-center py-10 grow flex-auto" v-if="canDrop(scale) && currentDrag"
                         @drop.prevent="dropped(scale)" @dragover.prevent>
              Hierhin ziehen
            </v-card-text>
          </v-card>
        </v-card>
      </div>
    </v-form>
    <v-divider class="my-3"/>
    <v-btn block color="success" @click="startProductionRun">??bernehmen</v-btn>

    <template v-if="runningProductionRun">
      <v-divider class="my-3"/>
      <h2 class="mb-3">Aktuelle Produktion</h2>
      <div class="cards">
        <AssignedScale
            v-for="scale in scales" :key="scale.id"
            :scale="scale" :assigned-component="runningProductionRunAssignedComponent(scale)"
            :production-run-id="runningProductionRun.id"
            compact
            :editable="false"
        />

      </div>

    </template>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import AssignedScale from "@/components/planning/AssignedScale.vue";
import AssignmentCard from "@/components/planning/AssignmentCard.vue";
import ProductionWorkstation from "@/models/production/ProductionWorkstation";
import ProductionOrder, {ProductionOrderComponent} from "@/models/production/ProductionOrder";
import ProductionRun, {ProductionRunAssignment} from "@/models/production/ProductionRun";
import ProductionScale from "@/models/production/ProductionScale";

@Component({
  components: {AssignedScale, AssignmentCard}
})
export default class PlanNewProductionRun extends Vue {
  @Prop({type: Object, required: true})
  public workstation!: ProductionWorkstation;

  private selectedFANo: string | null = null;
  private flowPerHour = 0;

  private productionRuns: ProductionRun[] = [];

  private plannedProductionRun: ProductionRun | null = null;
  private runningProductionRun: ProductionRun | null = null;


  private fas: ProductionOrder[] = [];

  public mounted() {
    Vue.axios.get('api/production/production-orders')
        .then(res => this.fas = res.data)
        .then(() => this.loadProductionRuns());
  }

  private get selectedFA(): ProductionOrder | null {
    return this.fas.concat().filter(fa => fa.productionOrderNumber === this.selectedFANo)[0]
  }

  private get scales() {
    return this.workstation.scales.concat().sort((x1, x2) => x1.name.localeCompare(x2.name));
  }

  @Watch('productionRuns')
  private onProdRunChanged() {
    this.plannedProductionRun = this.productionRuns.find(pr => pr.productionRunState === 0) ?? null;
    if (this.plannedProductionRun !== null) {
      this.selectedFANo = this.plannedProductionRun.productionOrder?.productionOrderNumber;
      this.flowPerHour = this.plannedProductionRun.expectedFlowPerHour;
    } else if (this.fas.length > 0) {
      Vue.axios.post(`api/production/workstations/${this.workstation.id}/production-runs`, {
        productionOrderNo: this.fas[0].productionOrderNumber,
        flowPerHour: 500,
      })
          .then(() => this.loadProductionRuns());
    }

    this.runningProductionRun = this.productionRuns.find(pr => pr.productionRunState === 1) ?? null;
  }

  private runningProductionRunAssignedComponent(scale: ProductionScale) {
    return this.runningProductionRun?.assignments.find(a => a.productionRunAssignmentScale.id === scale.id) ?? null;
  }

  private plannedProductionRunAssignedComponent(scale: ProductionScale) {
    return this.plannedProductionRun?.assignments.find(a => a.productionRunAssignmentScale.id === scale.id) ?? null;
  }

  private updateProdPerHour() {
    Vue.axios.put(`api/production/production-runs/${this.plannedProductionRun?.id}/flow`, {
      flow: this.flowPerHour
    })
        .then(this.loadProductionRuns);
  }

  private updateProductionOrder() {
    Vue.axios.put(`api/production/production-runs/${this.plannedProductionRun?.id}/production-order`, {
      ProductionOrderNumber: this.selectedFA?.productionOrderNumber,
    })
        .then(this.loadProductionRuns);
  }

  private unassign(assignment: ProductionRunAssignment) {
    Vue.axios.delete(`api/production/production-runs/${this.plannedProductionRun?.id}/assignments/${assignment.id}`)
        .then(this.loadProductionRuns);

  }


  private currentDrag: ProductionOrderComponent | null = null;

  private dragStart(component: ProductionOrderComponent) {
    this.currentDrag = component;
  }

  private dragEnd(component: ProductionOrderComponent) {
    this.currentDrag = null;
  }

  private dropped(scale: ProductionScale) {
    Vue.axios.post(`api/production/production-runs/${this.plannedProductionRun?.id}/assignments`, {
      scaleId: scale.id,
      lineNumber: this.currentDrag?.lineNumber,
    })
        .then(this.loadProductionRuns);
  }

  private startProductionRun() {
    Vue.axios.post(`api/production/production-runs/${this.plannedProductionRun?.id}/start`)
        .then(() => location.reload());
  }

  private loadProductionRuns() {
    Vue.axios.get(`api/production/workstations/${this.workstation.id}/production-runs`)
        .then(res => {
          this.productionRuns = res.data
        });
  }

  private canDrop(scale: ProductionScale | null): boolean {
    return scale !== null;
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

<template>

  <v-card class="ma-3 mt-0 d-flex flex-column" v-if="assignedComponent">


    <v-card-text class="pa-0">
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="overline"> {{ assignedComponent.component.item.itemNo }}</v-list-item-title>
            <v-list-item-subtitle> {{ assignedComponent.component.item.name }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!compact">
          <v-list-item-content>
            <v-list-item-title>Obere Toleranz</v-list-item-title>
            <v-list-item-subtitle>{{ assignedComponent.upperTolerance }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!compact">
          <v-list-item-content >
            <v-list-item-title>Zielwert</v-list-item-title>
            <v-list-item-subtitle>{{ assignedComponent.expectedFlow }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!compact">
          <v-list-item-content >
            <v-list-item-title>Untere Toleranz</v-list-item-title>
            <v-list-item-subtitle>{{ assignedComponent.lowerTolerance }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="editable">
          <v-list-item-content v-if="!editMode">
            <v-list-item-title>Messung über Sekunden</v-list-item-title>
            <v-list-item-subtitle>{{ assignedComponent.deltaT }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-text-field v-else v-model="updatedDeltaT" label="Messung über Sekunden"></v-text-field>
          <v-list-item-action>
            <v-list-item-action-text>
              <v-btn @click="editMode = true" v-if="!editMode" icon small>
                <v-icon small>mdi-pen</v-icon>
              </v-btn>
              <v-btn @click="save" v-if="editMode" icon small color="success">
                <v-icon small>mdi-content-save</v-icon>
              </v-btn>
              <v-btn @click="editMode = false" v-if="editMode" icon small>
                <v-icon small>mdi-cancel</v-icon>
              </v-btn>
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
    <slot name="footer"/>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {ProductionRunAssignment} from "@/models/production/ProductionRun";

@Component
export default class AssignmentCard extends Vue {

  @Prop({type: Boolean, default: false})
  public compact!: boolean;
  @Prop({type: Object, required: true})
  public assignedComponent!: ProductionRunAssignment;
  @Prop({type: String, required: true})
  public productionRunId!: string;

  @Prop({type: Boolean, default: true})
  public editable!: boolean;

  private editMode = false;

  private updatedDeltaT = 0;

  public mounted() {
    this.updatedDeltaT = this.assignedComponent.deltaT;
  }

  private save() {
    Vue.axios.put(`api/production/production-runs/${this.productionRunId}/assignments/${this.assignedComponent.id}/delta-t`, {
      deltaT: this.updatedDeltaT,
    })
        .then(() => this.editMode = false)
        .then(() => this.$emit('updated'));
  }
}
</script>
<style lang="scss" scoped>

</style>

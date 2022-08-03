<template>
  <v-card outlined
          class="lighten-3"
          :class="{
          'blue': scale.canFluid,
          'grey': scale.canSolid
        }">
    <v-card-title>
      {{ scale.name }}
    </v-card-title>

    <v-card class="ma-3" v-if="assignedComponent">
      <v-card-title>{{ assignedComponent.component.item.itemNo }} {{ assignedComponent.component.item.name }}</v-card-title>
      <v-divider />
      <v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Obere Toleranz</v-list-item-title>
              <v-list-item-subtitle>{{ assignedComponent.upperTolerance }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Zielwert</v-list-item-title>
              <v-list-item-subtitle>{{ assignedComponent.expectedFlow }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Untere Toleranz</v-list-item-title>
              <v-list-item-subtitle>{{ assignedComponent.lowerTolerance }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content v-if="!editMode">
              <v-list-item-title>Messung über Sekunden</v-list-item-title>
              <v-list-item-subtitle>{{ assignedComponent.deltaT }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-text-field v-else v-model="assignedComponent.deltaT" label="Messung über Sekunden"></v-text-field>
            <v-list-item-action>
              <v-list-item-action-text>
              <v-btn @click="editMode = true" v-if="!editMode" icon small>
                <v-icon small>mdi-pen</v-icon>
              </v-btn>
              <v-btn @click="editMode = false" v-if="editMode" icon small color="success">
                <v-icon small>mdi-content-save</v-icon>
              </v-btn>
              <v-btn @click="editMode = false" v-if="editMode" icon small>
                <v-icon small>mdi-cancel</v-icon>
              </v-btn></v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';


@Component
export default class AssignedScale extends Vue {

  @Prop({ type: Object, required: true })
  public scale!: object;

  @Prop({ type: Object, required: true })
  public assignedComponent!: object;

  private editMode =false;

}
</script>
<style lang="scss" scoped>

</style>

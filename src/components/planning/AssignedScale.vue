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

    <AssignmentCard v-if="assignedComponent"
                    :production-run-id="productionRunId"
                    :assigned-component="assignedComponent"
                    :compact="compact"
                    :editable="editable"
                    @updated="$emit('updated')"

    />
    <slot name="after"/>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AssignmentCard from "@/components/planning/AssignmentCard.vue";
@Component({
  components: { AssignmentCard }
})
export default class AssignedScale extends Vue {

  @Prop({ type: Object, required: true })
  public scale!: object;

  @Prop({ type: Object, required: false })
  public assignedComponent!: object | null;

  @Prop({ type: String, required: true })
  public productionRunId!: string;

  @Prop({type: Boolean, default: false})
  public compact!: boolean;

  @Prop({type: Boolean, default: true})
  public editable!: boolean;

  private editMode =false;

}
</script>
<style lang="scss" scoped>

</style>

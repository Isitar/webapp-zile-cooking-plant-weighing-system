<template>
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
      <v-divider class="my-3"/>
      <v-card-text class="title">{{ scaleValue(scale) }}</v-card-text>

      <v-btn @click="setTara(scale)" large>Tara setzen</v-btn>


    </v-card>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import ProductionScale from "@/models/production/ProductionScale";
import ProductionWorkstation from "@/models/production/ProductionWorkstation";
import AssignedScale from "@/components/planning/AssignedScale.vue";
import ScaleBox from "@/components/production/ScaleBox.vue";
import ScaleMeasurementsGraph from "@/components/production/ScaleMeasurementsGraph.vue";


@Component({
  components: {ScaleMeasurementsGraph, ScaleBox, AssignedScale}
})
export default class TaraControl extends Vue {

  @Prop({type: Object, required: true})
  public workstation!: ProductionWorkstation;
  private scaleData: { scaleId: string; val: number[], tara: number }[] = [];
  private scaleTimeout: number | null = null;
  private scaleRefreshrate = 2000;

  private loadScaleValues() {
    const promises: Promise<void>[] = [];
    this.scales?.forEach(scale => {
      promises.push(
          Vue.axios.get(`api/weighing/scales/${scale.id}/measurements?t=5`)
              .then(res => {
                const existingScaleData = this.scaleData.find(s => s.scaleId === scale.id) ?? null;
                if (existingScaleData !== null) {
                  this.scaleData.find(s => s.scaleId === scale.id).val = res.data;
                } else {
                  this.scaleData.push({scaleId: scale.id, val: res.data, tara: 0});
                }
              })
      );
    });
    Promise.all(promises)
        .finally(() => this.scaleTimeout = setTimeout(this.loadScaleValues, this.scaleRefreshrate))
    ;
  }

  private get scales(): ProductionScale[] {
    return this.workstation.scales.concat().sort((x1, x2) => x1.name.localeCompare(x2.name));
  }

  private scaleValue(scale: ProductionScale): number {
    var scaleDatas =this.scaleData.find(s => s.scaleId === scale.id);
    if (scaleDatas === null || scaleDatas === undefined ||scaleDatas.val.length === 0) {
      return 0;
    }
    return scaleDatas.val.reduce((v, c) => v + c) / scaleDatas.val.length - scaleDatas.tara;
  }

  private setTara(scale: ProductionScale) {
    const existingScaleData = this.scaleData.find(s => s.scaleId === scale.id) ?? null;
    if (existingScaleData !== null) {
      this.scaleData.find(s => s.scaleId === scale.id).tara = this.scaleValue(scale);
    } else {
      this.scaleData.push({scaleId: scale.id, val: [], tara: 0});
    }
  }

  mounted() {
    this.loadScaleValues()
  }

  unmounted() {
    if (this.scaleTimeout !== null) {
      clearTimeout(this.scaleTimeout);
    }
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

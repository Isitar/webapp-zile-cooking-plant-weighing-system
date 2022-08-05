<template>
  <div class="outer">

      <svg class="pa-3">
        <rect x="0" y="0" width="100%" height="100%" stroke="black" stroke-width="2" fill="white">

        </rect>
        <rect x="0" class="background" :class="{
            'red': currentValue < lowerTolerance || currentValue > upperTolerance,
            'green':currentValue > lowerTolerance && currentValue < upperTolerance
    }"
              :y="getYPercentStr(currentValue)" width="100%" :height="`${100 - getYPercent(currentValue)}%`"
        />
        <text x="90%" :y="getYPercentStr(currentValue)" text-anchor="end" dominant-baseline="ideographic">{{ currentValue.toFixed(3) }}</text>

        <line x1="0" x2="105%" stroke="red"
              stroke-dasharray="5,5"
              :y1="getYPercentStr(upperTolerance)" :y2="getYPercentStr(upperTolerance)">
        </line>
        <text x="10%" :y="getYPercentStr(upperTolerance)" text-anchor="start" dominant-baseline="ideographic">{{ upperTolerance.toFixed(3) }}</text>


        <line x1="0" x2="105%" stroke="black"
              stroke-dasharray="5,5"
              :y1="getYPercentStr(targetValue)" :y2="getYPercentStr(targetValue)" />
        <text x="10%" :y="getYPercentStr(targetValue)" text-anchor="start" dominant-baseline="ideographic">{{ targetValue.toFixed(3) }}</text>

        <line x1="0" x2="105%" stroke="red"
              stroke-dasharray="5,5"
              :y1="getYPercentStr(lowerTolerance)" :y2="getYPercentStr(lowerTolerance)" />
        <text x="10%" :y="getYPercentStr(lowerTolerance)" text-anchor="start" dominant-baseline="ideographic">{{ lowerTolerance.toFixed(3) }}</text>
      </svg>
      <p class="text-center">{{currentValue.toFixed(3)}}</p>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ScaleBox extends Vue {
  @Prop({ type: Number, required: true })
  public lowerTolerance!: number;
  @Prop({ type: Number, required: true })
  public upperTolerance!: number;
  @Prop({ type: Number, required: true })
  public targetValue!: number;


  @Prop({ type: Number, required: true })
  public currentValue!: number;

  private get maxValue(): number {
    const perc = (this.upperTolerance / this.targetValue);
    return perc * perc * this.upperTolerance;
  }

  private getYPercent(value: number): number {
    return 100 * (this.maxValue - value) / (this.maxValue - this.minValue);
  }

  private getYPercentStr(value: number): string {
    return `${this.getYPercent(value)}%`;
  }

  private get minValue(): number {
    const perc = (this.lowerTolerance / this.targetValue);
    return perc * perc * this.lowerTolerance;
  }

  private get color(): string {
    if (this.currentValue < this.lowerTolerance
        || this.currentValue > this.upperTolerance) {
      return 'red';
    }
    return 'green';
  }
}
</script>
<style lang="scss" scoped>

.outer {
  background-color: white;
  display: flex;
  flex-direction: column;
  > svg {
    flex: 1 0 auto;
  }
  > * {
    flex: 0 0 auto;
  }
}


.background {
  fill: white;

  &.red {
    fill: var(--v-error-lighten2);
    stroke: var(--v-error-lighten1);
  }

  &.green {
    fill: var(--v-success-lighten2);
    stroke: var(--v-success-lighten1);
  }
}
</style>

<template>
  <div class="wrapper">
    <svg class="pa-3" :viewBox="viewbox">
      <rect x="0" :y="-maxWeight" width="100%" :height="maxWeight - minWeight" stroke="black" stroke-width="0.1"
            fill="white"/>
      <line x1="0" y1="0" x2="100" y2="0" stroke="red" stroke-width="0.1" fill="white"/>
      <circle v-for="measurement in normalizedMeasurements" :key="measurement.measuredAt"
              r="0.01"
              :cx="measurement.measuredAt"
              :cy="-measurement.weight"
              fill="blue"/>
    </svg>
    <div>
      <v-slider :min="-5" :max="100" thumb-label="always" v-model="minWeight"/>
      <v-slider :min="-5" :max="100" thumb-label="always" v-model="maxWeight"/>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

interface IMeasurement {
  measuredAt: number;
  weight: number;
}

@Component
export default class ScaleMeasurementsGraph extends Vue {

  private measurements = [
    {
      "measuredAt": 1660202651104,
      "weight": -0.0172
    },
    {
      "measuredAt": 1660202651104,
      "weight": -0.0172
    },
    {
      "measuredAt": 1660202651725,
      "weight": -0.0172
    },
    {
      "measuredAt": 1660202651725,
      "weight": -0.0172
    },
    {
      "measuredAt": 1660202652357,
      "weight": -0.0172
    },
    {
      "measuredAt": 1660202652357,
      "weight": -0.0172
    },
    {
      "measuredAt": 1660202653042,
      "weight": -0.0173
    },
    {
      "measuredAt": 1660202653042,
      "weight": -0.0173
    },
    {
      "measuredAt": 1660202653622,
      "weight": -0.0173
    },
    {
      "measuredAt": 1660202653622,
      "weight": -0.0173
    },
    {
      "measuredAt": 1660202654258,
      "weight": -0.0175
    },
    {
      "measuredAt": 1660202654258,
      "weight": -0.0175
    },
    {
      "measuredAt": 1660202654913,
      "weight": -0.0177
    },
    {
      "measuredAt": 1660202654913,
      "weight": -0.0177
    },
    {
      "measuredAt": 1660202655484,
      "weight": -0.0178
    },
    {
      "measuredAt": 1660202655484,
      "weight": -0.0178
    },
    {
      "measuredAt": 1660202656116,
      "weight": -0.018
    },
    {
      "measuredAt": 1660202656116,
      "weight": -0.018
    },
    {
      "measuredAt": 1660202686535,
      "weight": -0.0188
    },
    {
      "measuredAt": 1660202686669,
      "weight": -0.0187
    },
    {
      "measuredAt": 1660202687298,
      "weight": -0.0184
    },
    {
      "measuredAt": 1660202687928,
      "weight": -0.018
    },
    {
      "measuredAt": 1660202688498,
      "weight": -0.0177
    },
    {
      "measuredAt": 1660202689127,
      "weight": -0.0173
    },
    {
      "measuredAt": 1660202689767,
      "weight": -0.017
    },
    {
      "measuredAt": 1660202690387,
      "weight": -0.0167
    },
    {
      "measuredAt": 1660202691035,
      "weight": -0.0164
    },
    {
      "measuredAt": 1660202691617,
      "weight": -0.0161
    },
    {
      "measuredAt": 1660202692259,
      "weight": -0.0157
    },
    {
      "measuredAt": 1660202692898,
      "weight": -0.0154
    },
    {
      "measuredAt": 1660202693467,
      "weight": -0.0151
    },
    {
      "measuredAt": 1660202694108,
      "weight": -0.0149
    },
    {
      "measuredAt": 1660202694750,
      "weight": -0.0147
    },
    {
      "measuredAt": 1660202695382,
      "weight": -0.0145
    },
    {
      "measuredAt": 1660202696042,
      "weight": -0.0144
    },
    {
      "measuredAt": 1660202696675,
      "weight": -0.0143
    },
    {
      "measuredAt": 1660202697317,
      "weight": -0.0142
    },
    {
      "measuredAt": 1660202697951,
      "weight": -0.0141
    },
    {
      "measuredAt": 1660202698531,
      "weight": -0.014
    },
    {
      "measuredAt": 1660202699174,
      "weight": -0.014
    },
    {
      "measuredAt": 1660202699817,
      "weight": -0.0139
    },
    {
      "measuredAt": 1660202700390,
      "weight": -0.0138
    },
    {
      "measuredAt": 1660202701010,
      "weight": -0.0138
    },
    {
      "measuredAt": 1660202701626,
      "weight": -0.0136
    },
    {
      "measuredAt": 1660202702277,
      "weight": -0.0134
    },
    {
      "measuredAt": 1660202702919,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202703491,
      "weight": -0.0127
    },
    {
      "measuredAt": 1660202704159,
      "weight": -0.0124
    },
    {
      "measuredAt": 1660202704790,
      "weight": -0.012
    },
    {
      "measuredAt": 1660202705408,
      "weight": -0.0117
    },
    {
      "measuredAt": 1660202706064,
      "weight": -0.0114
    },
    {
      "measuredAt": 1660202706654,
      "weight": -0.0112
    },
    {
      "measuredAt": 1660202707296,
      "weight": -0.011
    },
    {
      "measuredAt": 1660202707950,
      "weight": -0.0109
    },
    {
      "measuredAt": 1660202708648,
      "weight": -0.0108
    },
    {
      "measuredAt": 1660202709297,
      "weight": -0.0107
    },
    {
      "measuredAt": 1660202709929,
      "weight": -0.0107
    },
    {
      "measuredAt": 1660202710669,
      "weight": -0.0107
    },
    {
      "measuredAt": 1660202711335,
      "weight": -0.0107
    },
    {
      "measuredAt": 1660202711958,
      "weight": -0.0108
    },
    {
      "measuredAt": 1660202712630,
      "weight": -0.011
    },
    {
      "measuredAt": 1660202713264,
      "weight": -0.0112
    },
    {
      "measuredAt": 1660202713905,
      "weight": -0.0115
    },
    {
      "measuredAt": 1660202714546,
      "weight": -0.0117
    },
    {
      "measuredAt": 1660202715183,
      "weight": -0.0119
    },
    {
      "measuredAt": 1660202715814,
      "weight": -0.0122
    },
    {
      "measuredAt": 1660202716434,
      "weight": -0.0125
    },
    {
      "measuredAt": 1660202716543,
      "weight": -0.0125
    },
    {
      "measuredAt": 1660202717208,
      "weight": -0.0129
    },
    {
      "measuredAt": 1660202717208,
      "weight": -0.0129
    },
    {
      "measuredAt": 1660202717849,
      "weight": -0.0133
    },
    {
      "measuredAt": 1660202717849,
      "weight": -0.0133
    },
    {
      "measuredAt": 1660202718430,
      "weight": -0.0136
    },
    {
      "measuredAt": 1660202718430,
      "weight": -0.0136
    },
    {
      "measuredAt": 1660202719062,
      "weight": -0.0139
    },
    {
      "measuredAt": 1660202719062,
      "weight": -0.0139
    },
    {
      "measuredAt": 1660202719659,
      "weight": -0.0142
    },
    {
      "measuredAt": 1660202719659,
      "weight": -0.0142
    },
    {
      "measuredAt": 1660202720291,
      "weight": -0.0144
    },
    {
      "measuredAt": 1660202720291,
      "weight": -0.0144
    },
    {
      "measuredAt": 1660202720964,
      "weight": -0.0147
    },
    {
      "measuredAt": 1660202720964,
      "weight": -0.0147
    },
    {
      "measuredAt": 1660202721585,
      "weight": -0.015
    },
    {
      "measuredAt": 1660202721585,
      "weight": -0.015
    },
    {
      "measuredAt": 1660202722216,
      "weight": -0.0153
    },
    {
      "measuredAt": 1660202722216,
      "weight": -0.0153
    },
    {
      "measuredAt": 1660202722892,
      "weight": -0.0156
    },
    {
      "measuredAt": 1660202722892,
      "weight": -0.0156
    },
    {
      "measuredAt": 1660202723462,
      "weight": -0.0158
    },
    {
      "measuredAt": 1660202723463,
      "weight": -0.0158
    },
    {
      "measuredAt": 1660202724103,
      "weight": -0.016
    },
    {
      "measuredAt": 1660202724103,
      "weight": -0.016
    },
    {
      "measuredAt": 1660202724685,
      "weight": -0.0162
    },
    {
      "measuredAt": 1660202724686,
      "weight": -0.0162
    },
    {
      "measuredAt": 1660202725334,
      "weight": -0.0163
    },
    {
      "measuredAt": 1660202725335,
      "weight": -0.0163
    },
    {
      "measuredAt": 1660202725978,
      "weight": -0.0163
    },
    {
      "measuredAt": 1660202725978,
      "weight": -0.0163
    },
    {
      "measuredAt": 1660202726584,
      "weight": -0.0162
    },
    {
      "measuredAt": 1660202726584,
      "weight": -0.0162
    },
    {
      "measuredAt": 1660202727248,
      "weight": -0.016
    },
    {
      "measuredAt": 1660202727248,
      "weight": -0.016
    },
    {
      "measuredAt": 1660202727878,
      "weight": -0.0158
    },
    {
      "measuredAt": 1660202727878,
      "weight": -0.0158
    },
    {
      "measuredAt": 1660202728492,
      "weight": -0.0156
    },
    {
      "measuredAt": 1660202728492,
      "weight": -0.0156
    },
    {
      "measuredAt": 1660202729134,
      "weight": -0.0155
    },
    {
      "measuredAt": 1660202729134,
      "weight": -0.0155
    },
    {
      "measuredAt": 1660202729768,
      "weight": -0.0153
    },
    {
      "measuredAt": 1660202729768,
      "weight": -0.0153
    },
    {
      "measuredAt": 1660202730402,
      "weight": -0.0151
    },
    {
      "measuredAt": 1660202730402,
      "weight": -0.0151
    },
    {
      "measuredAt": 1660202731043,
      "weight": -0.015
    },
    {
      "measuredAt": 1660202731043,
      "weight": -0.015
    },
    {
      "measuredAt": 1660202731698,
      "weight": -0.0149
    },
    {
      "measuredAt": 1660202731699,
      "weight": -0.0149
    },
    {
      "measuredAt": 1660202732321,
      "weight": -0.0148
    },
    {
      "measuredAt": 1660202732322,
      "weight": -0.0148
    },
    {
      "measuredAt": 1660202732960,
      "weight": -0.0147
    },
    {
      "measuredAt": 1660202732960,
      "weight": -0.0147
    },
    {
      "measuredAt": 1660202733531,
      "weight": -0.0146
    },
    {
      "measuredAt": 1660202733531,
      "weight": -0.0146
    },
    {
      "measuredAt": 1660202734164,
      "weight": -0.0144
    },
    {
      "measuredAt": 1660202734164,
      "weight": -0.0144
    },
    {
      "measuredAt": 1660202734776,
      "weight": -0.0142
    },
    {
      "measuredAt": 1660202734776,
      "weight": -0.0142
    },
    {
      "measuredAt": 1660202735407,
      "weight": -0.014
    },
    {
      "measuredAt": 1660202735407,
      "weight": -0.014
    },
    {
      "measuredAt": 1660202736045,
      "weight": -0.0137
    },
    {
      "measuredAt": 1660202736046,
      "weight": -0.0137
    },
    {
      "measuredAt": 1660202736627,
      "weight": -0.0135
    },
    {
      "measuredAt": 1660202736627,
      "weight": -0.0135
    },
    {
      "measuredAt": 1660202737290,
      "weight": -0.0133
    },
    {
      "measuredAt": 1660202737290,
      "weight": -0.0133
    },
    {
      "measuredAt": 1660202737927,
      "weight": -0.0132
    },
    {
      "measuredAt": 1660202737927,
      "weight": -0.0132
    },
    {
      "measuredAt": 1660202738535,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202738535,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202739211,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202739211,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202739862,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202739863,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202740481,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202740481,
      "weight": -0.0131
    },
    {
      "measuredAt": 1660202741179,
      "weight": -0.0132
    },
    {
      "measuredAt": 1660202741180,
      "weight": -0.0132
    },
    {
      "measuredAt": 1660202741836,
      "weight": -0.0132
    },
    {
      "measuredAt": 1660202741836,
      "weight": -0.0132
    },
    {
      "measuredAt": 1660202742470,
      "weight": -0.0133
    },
    {
      "measuredAt": 1660202742470,
      "weight": -0.0133
    },
    {
      "measuredAt": 1660202743136,
      "weight": -0.0134
    },
    {
      "measuredAt": 1660202743136,
      "weight": -0.0134
    },
    {
      "measuredAt": 1660202743782,
      "weight": -0.0135
    },
    {
      "measuredAt": 1660202743782,
      "weight": -0.0135
    },
    {
      "measuredAt": 1660202744415,
      "weight": -0.0136
    },
    {
      "measuredAt": 1660202744416,
      "weight": -0.0136
    },
    {
      "measuredAt": 1660202745037,
      "weight": -0.0137
    },
    {
      "measuredAt": 1660202745037,
      "weight": -0.0137
    },
    {
      "measuredAt": 1660202745673,
      "weight": -0.0139
    },
    {
      "measuredAt": 1660202745673,
      "weight": -0.0139
    },
    {
      "measuredAt": 1660202746294,
      "weight": -0.0142
    },
    {
      "measuredAt": 1660202746294,
      "weight": -0.0142
    }
  ] as IMeasurement[];

  private minWeight = -1;
  private maxWeight = 1;

  private get normalizedMeasurements(): IMeasurement[] {
    const minMeasuredAt = this.measurements.reduce((min, measurement) => Math.min(min, measurement.measuredAt), Number.MAX_VALUE);
    const maxMeasuredAt = this.measurements.reduce((max, measurement) => Math.max(max, measurement.measuredAt), Number.MIN_VALUE);
    const minWeight = this.measurements.reduce((min, measurement) => Math.min(min, measurement.weight), Number.MAX_VALUE);
    const maxWeight = this.measurements.reduce((max, measurement) => Math.max(max, measurement.weight), Number.MIN_VALUE);

    const normalized = this.measurements.map(m => ({
      measuredAt: ((m.measuredAt - minMeasuredAt) / (maxMeasuredAt - minMeasuredAt)),
      weight: m.weight
    }));

    const retVal = [] as IMeasurement[];
    normalized.forEach(m => {
      if (!retVal.some(r => r.measuredAt === m.measuredAt)) {
        retVal.push(m);
      }
    });
    return retVal;
  }

  private get viewbox() {
    const minMeasuredAt = this.normalizedMeasurements.reduce((min, measurement) => Math.min(min, measurement.measuredAt), Number.MAX_VALUE);
    const maxMeasuredAt = this.normalizedMeasurements.reduce((max, measurement) => Math.max(max, measurement.measuredAt), Number.MIN_VALUE);
    const minWeight = this.normalizedMeasurements.reduce((min, measurement) => Math.min(min, measurement.weight), Number.MAX_VALUE);
    const maxWeight = this.normalizedMeasurements.reduce((max, measurement) => Math.max(max, measurement.weight), Number.MIN_VALUE);
    return `${minMeasuredAt} ${-1 * this.maxWeight}  ${maxMeasuredAt} ${-1 * this.minWeight}`;

  }

  //
  // @Prop({  required: true })
  // public measurements!: IMeasurement[];


}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
}
</style>

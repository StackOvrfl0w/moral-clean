import assert from "node:assert/strict";
import { calculateFloorCapacity } from "../src/lib/floor-capacity.ts";

const input = { area: 1000, width: 500, speed: 2, utilization: 100, overhead: 0 };
assert.deepEqual(calculateFloorCapacity(input), { theoretical: 1000, effective: 1000, minutes: 60 });
assert.equal(calculateFloorCapacity({ ...input, utilization: 50, overhead: 15 }).minutes, 135);
assert.equal(calculateFloorCapacity({ ...input, area: 2000 }).minutes, 120);
assert.equal(calculateFloorCapacity({ ...input, width: 1000 }).minutes, 30);
assert.ok(Math.abs(calculateFloorCapacity({ area: 3000, width: 500, speed: 3, utilization: 65, overhead: 20 }).minutes - 204.6153846153846) < 0.00001);
for (const invalid of [{ area: 0 }, { area: -1 }, { width: 0 }, { speed: 0 }, { utilization: 0 }, { utilization: 101 }, { overhead: -1 }, { area: NaN }, { speed: Infinity }, { width: Number.MAX_VALUE, speed: Number.MAX_VALUE }]) {
  assert.equal(calculateFloorCapacity({ ...input, ...invalid }), null);
}
console.log("Capacity checks passed: unit conversion, stop time, scaling, example and 10 invalid-input cases.");

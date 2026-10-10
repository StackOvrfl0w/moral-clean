export type FloorCapacityInputs = {
  area: number;
  width: number;
  speed: number;
  utilization: number;
  overhead: number;
};

export function calculateFloorCapacity(input: FloorCapacityInputs) {
  if (!Object.values(input).every(Number.isFinite) || input.area <= 0 || input.width <= 0 || input.speed <= 0 || input.utilization <= 0 || input.utilization > 100 || input.overhead < 0) return null;
  // mm / 1000 × km/h × 1000 = m²/h.
  const theoretical = input.width * input.speed;
  const effective = theoretical * input.utilization / 100;
  const minutes = input.area / effective * 60 + input.overhead;
  if (![theoretical, effective, minutes].every(Number.isFinite) || effective <= 0) return null;
  return { theoretical, effective, minutes };
}

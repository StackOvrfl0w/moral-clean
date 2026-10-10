"use client";

import { useState } from "react";
import { calculateFloorCapacity, type FloorCapacityInputs } from "@/lib/floor-capacity";

const fields: { key: keyof FloorCapacityInputs; label: string; hint: string; min: number; max?: number; step: number }[] = [
  { key: "area", label: "Accessible floor area (m²)", hint: "Exclude permanent obstructions and areas outside this machine's route.", min: 1, step: 1 },
  { key: "width", label: "Brush working width (mm)", hint: "Use the cleaning width, not the wider squeegee measurement.", min: 1, step: 1 },
  { key: "speed", label: "Cleaning travel speed (km/h)", hint: "Use an appropriate cleaning speed, not maximum transport speed.", min: 0.1, step: 0.1 },
  { key: "utilization", label: "Productive-route allowance (%)", hint: "A planning assumption for overlap, turns and interruptions. Replace with trial data.", min: 1, max: 100, step: 1 },
  { key: "overhead", label: "Additional setup and stop time (minutes)", hint: "Add only time not already included in your route allowance.", min: 0, step: 1 },
];
const defaults = { area: "3000", width: "500", speed: "3", utilization: "65", overhead: "20" };
const format = (value: number) => new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);

export function FloorCapacityCalculator() {
  const [values, setValues] = useState(defaults);
  const result = calculateFloorCapacity(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim() ? Number(value) : NaN])) as FloorCapacityInputs);
  return <section id="capacity-calculator" aria-labelledby="capacity-title" className="mt-9 scroll-mt-28 rounded-2xl border border-cyan-200 bg-slate-50 p-5 lg:scroll-mt-44 sm:p-7">
    <p className="text-xs font-bold uppercase tracking-widest text-primary">Interactive planning tool</p>
    <h2 id="capacity-title" className="mt-3 text-2xl text-brand-navy">Estimate your cleaning window</h2>
    <p className="mt-4 text-sm leading-7 text-muted-foreground">The starting values are a hypothetical example, not a specification or performance promise for a Moral Clean model. Adjust them for one compatible scrubber and one pass over your route.</p>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">{fields.map((field) => <div key={field.key}>
      <label htmlFor={`capacity-${field.key}`} className="block text-sm font-semibold text-brand-navy">{field.label}</label>
      <input id={`capacity-${field.key}`} type="number" inputMode="decimal" min={field.min} max={field.max} step={field.step} value={values[field.key]} aria-describedby={`capacity-${field.key}-hint`} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
      <p id={`capacity-${field.key}-hint`} className="mt-2 text-xs leading-5 text-muted-foreground">{field.hint}</p>
    </div>)}</div>
    <div role="status" aria-live="polite" aria-atomic="true" className="mt-6 rounded-xl bg-brand-navy p-5 text-white">
      {result ? <><dl className="grid gap-5 sm:grid-cols-3"><div><dt className="text-sm text-slate-200">Straight-line capacity</dt><dd data-capacity-theoretical className="mt-2 text-xl font-bold">{format(result.theoretical)} m²/h</dd></div><div><dt className="text-sm text-slate-200">Assumed route capacity</dt><dd data-capacity-effective className="mt-2 text-xl font-bold">{format(result.effective)} m²/h</dd></div><div><dt className="text-sm text-slate-200">Estimated total time</dt><dd data-capacity-minutes className="mt-2 text-xl font-bold">{format(result.minutes)} minutes</dd></div></dl><p className="mt-4 text-xs leading-6 text-slate-200">Area ÷ assumed route capacity × 60 + additional stop time. This does not check battery runtime, tank capacity, access or cleaning quality.</p></> : <p>Enter positive area, width and speed, an allowance above 0% and no more than 100%, and non-negative stop time.</p>}
    </div>
    <button type="button" onClick={() => setValues(defaults)} className="mt-5 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary">Reset example</button>
  </section>;
}

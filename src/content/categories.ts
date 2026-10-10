export type CategoryAdvice = {
  title: string;
  intro: string;
  selection: string[];
  questions: { question: string; answer: string }[];
};

export const categoryAdvice: Record<string, CategoryAdvice> = {
  "single-disk-machine": {
    title: "Single Disc Floor Cleaning & Polishing Machines in Pakistan",
    intro: "Compare single disc machines for floor scrubbing, stripping and polishing in commercial facilities. Choose the machine, pad or brush as a system: floor material, required finish and operator experience matter as much as motor power. Moral Clean supplies equipment and handles enquiries for compatible parts and service.",
    selection: ["Check the floor manufacturer's guidance before using an abrasive pad or polishing chemical.", "Choose speed for the task. Low-speed scrubbing and higher-speed polishing require different accessories and operating methods.", "A single disc machine loosens soil but does not recover dirty water. Plan wet-vacuum recovery when the process leaves liquid on the floor.", "Compare working width, cable access, machine weight and pad availability before choosing a model."],
    questions: [{ question: "Is a single disc machine the same as a scrubber dryer?", answer: "No. A scrubber dryer combines washing and water recovery. A single disc machine needs a separate recovery method for wet work." }, { question: "What determines the price?", answer: "Model, motor, working width, supplied accessories and service requirements affect the quotation. Send your floor type and intended task for a model-specific quote." }],
  },
  "walk-behind-scrubber": {
    title: "Walk Behind Scrubber Dryers in Pakistan",
    intro: "Walk behind scrubber dryers wash compatible hard floors and recover dirty water in one pass. They suit facilities where an operator can walk the cleaning route and manoeuvre around rooms, shelving and furniture. Compare working width, tank capacity and power requirements against your actual access and cleaning schedule.",
    selection: ["Measure the narrowest doorway, aisle and turning area, including the route to machine storage.", "Match brush and squeegee width to the cleaning route; the widest machine is not always the fastest around obstacles.", "Compare solution and recovery tank capacities alongside refill and emptying access.", "Confirm whether the quotation includes batteries, charger, brushes and pads. Ask about compatible replacement squeegees."],
    questions: [{ question: "When should I choose a ride-on instead?", answer: "Consider a ride-on for long, open routes when access, storage and operator training allow it. A walk behind is often easier to move through smaller rooms and tight aisles." }, { question: "How much area can a scrubber dryer clean?", answer: "Published theoretical productivity does not include obstacles, refilling, turns or operator breaks. Estimate practical output from your route and required cleaning time." }],
  },
  "ride-on-scrubber-dryer": {
    title: "Ride On Scrubber Dryers for Commercial Floors in Pakistan",
    intro: "Compare ride on scrubber dryers for large commercial and industrial hard-floor cleaning routes. An operator rides the machine while it scrubs and recovers water. Wide open areas can benefit from larger tanks and working widths, but doorway clearance, turning space and safe traffic management must be checked first.",
    selection: ["Measure doorways, lifts, ramps and turning space before selecting working width or chassis size.", "Compare solution and recovery tanks with the distance to refill and discharge points.", "Confirm battery and charger inclusion, charging location and expected duty cycle with the supplier.", "Arrange operator instruction and a route that separates cleaning equipment from pedestrians and vehicle traffic."],
    questions: [{ question: "Is a larger ride-on always a better choice?", answer: "No. Lost time manoeuvring around obstacles can outweigh a wider cleaning path. Select against the usable route, storage space and workload." }, { question: "Are batteries included with every model?", answer: "Do not assume they are. Check the individual product specification and written quotation for batteries, charger and accessories." }],
  },
  "vacuum-cleaner": {
    title: "Industrial, Wet & Dry Vacuum Cleaners in Pakistan",
    intro: "Browse vacuum cleaners for commercial housekeeping and facility cleaning. Match the machine to the material being collected: dry dust, wet spills and specialist industrial debris have different filtration and safety requirements. Tank size alone does not establish performance or suitability.",
    selection: ["Confirm whether the exact model supports wet pickup, dry pickup or both and follow its filter setup instructions.", "Compare capacity, hose and tool compatibility, power supply and handling weight.", "Check filtration and disposal requirements for the actual dust. Ordinary cleaning vacuums must not be assumed suitable for hazardous or combustible dust.", "Plan access to replacement filters, hoses and recovery tools before procurement."],
    questions: [{ question: "Can every vacuum collect water?", answer: "No. Use a model specified for wet pickup and follow the manufacturer's instructions. A dry-only vacuum is unsuitable." }, { question: "How do I choose capacity?", answer: "Estimate debris or liquid volume between emptying stops, then check carrying weight and storage. A larger tank can reduce emptying frequency but increase handling effort." }],
  },
  "pressure-washer": {
    title: "Commercial Pressure Washers in Pakistan",
    intro: "Compare pressure washers for compatible outdoor surfaces, equipment and facility maintenance. Select using water flow, operating pressure, duty cycle and electrical supply together. Maximum pressure alone does not tell you how quickly a machine will clean or which surfaces it can safely handle.",
    selection: ["Confirm the surface can tolerate pressure washing and test the nozzle and distance in a small area.", "Compare water flow and rated operating pressure; request clarification if a specification lists only maximum pressure.", "Check inlet-water supply, power requirements, hose reach and continuous operating limits.", "Specify required nozzles and accessories, and plan drainage and safe management of runoff."],
    questions: [{ question: "Should I buy the highest-pressure model?", answer: "Choose pressure and flow for the cleaning task and surface. Excessive pressure can damage finishes, seals and softer materials." }, { question: "Do all pressure washers heat water?", answer: "No. Confirm hot-water capability for the exact model. Do not assume a cold-water machine can accept heated inlet water." }],
  },
  "sweepers": {
    title: "Commercial & Industrial Floor Sweepers in Pakistan",
    intro: "Floor sweepers collect loose dry debris from suitable indoor or outdoor routes. Compare manual and powered machines by surface, debris volume, working width and hopper handling. Sweepers collect debris; they do not replace wet scrubbing when a floor has adhered dirt or oily residues.",
    selection: ["Identify the surface, debris size and dust level before choosing the brush and collection system.", "Compare working width with aisle clearance and turning space.", "Check hopper capacity, emptying method and access to a suitable waste-disposal point.", "Confirm indoor suitability, filtration, power source and manufacturer limits for the environment."],
    questions: [{ question: "Can a sweeper wash the floor?", answer: "A sweeper collects loose material. Use an appropriate scrubber or other washing process for soil that needs water or detergent to remove." }, { question: "When is a manual sweeper suitable?", answer: "Consider a manual machine for routes and debris volumes an operator can handle comfortably. Larger or frequent routes may justify a powered machine." }],
  },
  "janitorial-equipment": {
    title: "Janitorial Equipment, Mop Buckets & Trolleys in Pakistan",
    intro: "Browse mop buckets, trolleys and janitorial tools for routine commercial housekeeping. Build a system around floor type, chemical compatibility, handling weight and separation of clean and dirty water. Equipment selection should support the cleaning procedure used by your staff.",
    selection: ["Match mop material and wringer type to the floor and cleaning process.", "Compare bucket volume with the weight staff must move and empty.", "Use a documented colour-coding procedure where different zones require separate cleaning tools.", "Check trolley dimensions, wheels, storage compartments and access to replacement components."],
    questions: [{ question: "Does a bigger mop bucket clean better?", answer: "Capacity affects refill frequency and handling weight. Cleaning results also depend on the mop, solution, technique and frequency of water changes." }, { question: "Can I request several tools together?", answer: "Send the required quantities, floor types and facility zones so Moral Clean can quote an appropriate combination." }],
  },
  "steam-cleaners": {
    title: "Commercial Steam Cleaners in Pakistan",
    intro: "Moral Clean supplies steam cleaners for compatible cleaning tasks in Pakistan. Share your surface, type of soil and expected daily workload to request a suitable model and quotation. Model-specific specifications are available through enquiry while the online steam-cleaner catalogue is being updated.",
    selection: ["Confirm surface compatibility and test an inconspicuous area. Heat and moisture can damage sensitive finishes, adhesives and electronics.", "Compare steam pressure, output, heat-up time and refill method for the planned workload.", "Check whether attachments and any vacuum-recovery function are included with the quoted model.", "Request the model datasheet, power requirements, current availability and service terms before ordering."],
    questions: [{ question: "Which steam cleaner models are available?", answer: "Contact Moral Clean with your application to confirm the current range. Individual model specifications and availability are confirmed in the quotation rather than assumed from this category page." }, { question: "Does steam cleaning guarantee disinfection?", answer: "No general guarantee applies. A hygiene claim needs evidence for the exact equipment, temperature, contact time, surface and validated procedure." }],
  },
};

export function isIndexableCategory(slug: string, productCount: number) {
  return productCount > 0 || slug === "steam-cleaners";
}

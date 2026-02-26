/**
 * Static handbook content for MVP destinations.
 * Depth > breadth. Accurate, safety-conscious copy.
 */

import type { HandbookItinerary } from "@/types";
import type { MVPDestination } from "@/types/trip";

function buildDayPlan(day: number, morning: string, afternoon: string, evening: string) {
  return { day, morning, afternoon, evening };
}

const VARANASI: Record<number, HandbookItinerary> = {
  2: {
    bestTimeToVisit: "October to March — cool and comfortable for walking and ghats.",
    dayByDay: [
      buildDayPlan(1, "Arrive, check in. Rest or short walk near your stay.", "Visit Assi Ghat; optional boat on the Ganges.", "Evening aarti at Dashashwamedh Ghat. Light dinner nearby."),
      buildDayPlan(2, "Sunrise boat ride (optional). Walk to Kashi Vishwanath area.", "Sarnath half-day: stupa and museum.", "Last ghat visit or shopping. Prepare for departure."),
    ],
    sightseeing: ["Dashashwamedh Ghat", "Assi Ghat", "Sarnath (stupa & museum)", "Kashi Vishwanath Temple (from outside if restricted)", "Morning boat on the Ganges"],
    foodToTry: ["Kachori sabzi (breakfast)", "Chaat at local stalls", "Banarasi paan (optional)", "Simple vegetarian thali"],
    whatToCarry: ["Comfortable walking shoes", "Modest clothing (covered shoulders/knees for temples)", "Sunscreen, hat", "Reusable water bottle", "Small torch for early morning"],
    dosAndDonts: {
      do: ["Respect rituals and silence at ghats", "Remove shoes where indicated", "Keep valuables secure", "Stay hydrated"],
      dont: ["Don’t photograph cremations without permission", "Don’t drink tap water", "Avoid flash photography in temples"],
    },
    safetyNotes: ["Stick to well-lit, busy ghats after dark.", "Use registered boat operators.", "Keep emergency contact and hotel address handy."],
  },
  3: {
    bestTimeToVisit: "October to March — best weather for ghats and Sarnath.",
    dayByDay: [
      buildDayPlan(1, "Arrive, check in. Rest or short walk near your stay.", "Visit Assi Ghat; optional boat on the Ganges.", "Evening aarti at Dashashwamedh Ghat. Light dinner nearby."),
      buildDayPlan(2, "Sunrise boat ride. Walk to Kashi Vishwanath area.", "Explore lanes and local markets.", "Second ghat of your choice; early night if you want sunrise again."),
      buildDayPlan(3, "Sarnath: stupa and museum (half day).", "Return to city; last-minute ghat visit or shopping.", "Evening at leisure. Prepare for departure."),
    ],
    sightseeing: ["Dashashwamedh Ghat", "Assi Ghat", "Sarnath (stupa & museum)", "Kashi Vishwanath Temple (from outside if restricted)", "Morning boat on the Ganges", "Local lanes and bazaars"],
    foodToTry: ["Kachori sabzi (breakfast)", "Chaat at local stalls", "Banarasi paan (optional)", "Vegetarian thali", "Lassi"],
    whatToCarry: ["Comfortable walking shoes", "Modest clothing (covered shoulders/knees)", "Sunscreen, hat", "Reusable water bottle", "Small torch for early morning"],
    dosAndDonts: {
      do: ["Respect rituals and silence at ghats", "Remove shoes where indicated", "Keep valuables secure", "Stay hydrated"],
      dont: ["Don’t photograph cremations without permission", "Don’t drink tap water", "Avoid flash photography in temples"],
    },
    safetyNotes: ["Stick to well-lit, busy ghats after dark.", "Use registered boat operators.", "Keep emergency contact and hotel address handy."],
  },
  4: {
    bestTimeToVisit: "October to March — cool and comfortable for ghats and day trips.",
    dayByDay: [
      buildDayPlan(1, "Arrive, check in. Rest or short walk.", "Assi Ghat and first boat experience.", "Evening aarti at Dashashwamedh Ghat."),
      buildDayPlan(2, "Sunrise boat. Kashi Vishwanath area and lanes.", "Local markets and a quiet ghat.", "Early dinner; rest."),
      buildDayPlan(3, "Full morning at Sarnath: stupa and museum.", "Return; optional silk or handicraft visit.", "Evening at a different ghat."),
      buildDayPlan(4, "Last sunrise or relaxed morning. Pack.", "Last-minute shopping or ghat visit.", "Departure."),
    ],
    sightseeing: ["Dashashwamedh Ghat", "Assi Ghat", "Sarnath (stupa & museum)", "Kashi Vishwanath area", "Morning boat on the Ganges", "Local bazaars"],
    foodToTry: ["Kachori sabzi", "Chaat", "Vegetarian thali", "Lassi", "Banarasi paan (optional)"],
    whatToCarry: ["Walking shoes", "Modest clothing", "Sunscreen, hat", "Water bottle", "Small torch"],
    dosAndDonts: {
      do: ["Respect rituals at ghats", "Remove shoes where indicated", "Keep valuables secure", "Stay hydrated"],
      dont: ["Don’t photograph cremations without permission", "Don’t drink tap water", "Avoid flash in temples"],
    },
    safetyNotes: ["Well-lit ghats after dark.", "Registered boat operators only.", "Emergency contact and hotel address handy."],
  },
};

const SIKKIM: Record<number, HandbookItinerary> = {
  2: {
    bestTimeToVisit: "March–May and September–November — clear skies and comfortable for sightseeing.",
    dayByDay: [
      buildDayPlan(1, "Arrive Gangtok. Check in and rest.", "Visit MG Marg; optional Ganesh Tok or Hanuman Tok.", "Evening at MG Marg. Light dinner."),
      buildDayPlan(2, "Tsomgo Lake (Changu Lake) half-day if permitted.", "Return to Gangtok. Last-minute sightseeing or rest.", "Prepare for departure."),
    ],
    sightseeing: ["MG Marg, Gangtok", "Ganesh Tok / Hanuman Tok", "Tsomgo Lake (if permits and season allow)"],
    foodToTry: ["Thukpa", "Momos", "Local chhang (if you drink)", "Simple North Indian or Sikkimese meals"],
    whatToCarry: ["Layered clothing (cool at altitude)", "Comfortable shoes", "Sunscreen, cap", "Valid ID for permits", "Water bottle"],
    dosAndDonts: {
      do: ["Carry ID for permit areas", "Dress in layers", "Follow local rules at lakes and monasteries", "Book Tsomgo in advance when required"],
      dont: ["Don’t litter; plastic is banned in parts of Sikkim", "Don’t skip acclimatization if going higher", "Avoid venturing off marked trails alone"],
    },
    safetyNotes: ["Permits may be needed for Tsomgo and other areas — check current rules.", "Altitude: take it easy on Day 1 if you’re coming from plains."],
  },
  3: {
    bestTimeToVisit: "March–May and September–November — best for mountains and lakes.",
    dayByDay: [
      buildDayPlan(1, "Arrive Gangtok. Check in, rest.", "MG Marg and nearby viewpoints (Ganesh Tok/Hanuman Tok).", "Evening at MG Marg."),
      buildDayPlan(2, "Tsomgo Lake (Changu Lake) day trip if permitted.", "Return to Gangtok by afternoon.", "Rest; optional monastery visit next morning."),
      buildDayPlan(3, "Rumtek Monastery or nearby sightseeing.", "Last-minute shopping or rest.", "Departure."),
    ],
    sightseeing: ["MG Marg", "Ganesh Tok / Hanuman Tok", "Tsomgo Lake", "Rumtek Monastery"],
    foodToTry: ["Thukpa", "Momos", "Sikkimese cuisine", "Tea"],
    whatToCarry: ["Layered clothing", "Comfortable shoes", "Sunscreen, cap", "ID for permits", "Water bottle"],
    dosAndDonts: {
      do: ["Carry ID for permits", "Dress in layers", "Respect monasteries and local customs", "Book lake trips in advance when required"],
      dont: ["Don’t litter", "Don’t skip acclimatization", "Avoid unmarked trails alone"],
    },
    safetyNotes: ["Check permit requirements for Tsomgo and other areas.", "Acclimatize if coming from sea level."],
  },
  4: {
    bestTimeToVisit: "March–May and September–November.",
    dayByDay: [
      buildDayPlan(1, "Arrive Gangtok. Check in, rest.", "MG Marg and Ganesh Tok/Hanuman Tok.", "Evening at MG Marg."),
      buildDayPlan(2, "Tsomgo Lake day trip.", "Return to Gangtok.", "Rest."),
      buildDayPlan(3, "Rumtek Monastery or Nathula (if permits and season).", "Back to Gangtok.", "Evening at leisure."),
      buildDayPlan(4, "Relaxed morning; last sightseeing or shopping.", "Pack.", "Departure."),
    ],
    sightseeing: ["MG Marg", "Ganesh Tok / Hanuman Tok", "Tsomgo Lake", "Rumtek Monastery"],
    foodToTry: ["Thukpa", "Momos", "Sikkimese dishes", "Tea"],
    whatToCarry: ["Layered clothing", "Shoes", "Sunscreen, cap", "ID", "Water bottle"],
    dosAndDonts: {
      do: ["Carry ID", "Layers", "Respect monasteries and nature", "Book permits in advance where needed"],
      dont: ["Don’t litter", "Don’t skip acclimatization", "Avoid unmarked trails alone"],
    },
    safetyNotes: ["Permits for Tsomgo/Nathula — check current rules.", "Acclimatize if from plains."],
  },
};

const HAMPTA_PASS: Record<number, HandbookItinerary> = {
  2: {
    bestTimeToVisit: "June to mid-October — trekking season. Avoid monsoon peak (July–Aug) for safer crossing.",
    dayByDay: [
      buildDayPlan(1, "Drive to Jobra; trek to Chika (approx. 2–3 hours).", "Acclimatize at Chika. Rest and short walk.", "Camp; early dinner and sleep."),
      buildDayPlan(2, "Trek back to Jobra; drive to Manali.", "—", "—"),
    ],
    sightseeing: ["Chika camp", "Views of Hampta valley"],
    foodToTry: ["Camp meals (included in trek)", "High-energy snacks", "Hydration"],
    whatToCarry: ["Trekking shoes", "Layered clothing", "Rain gear", "Sunscreen, cap", "Head torch", "Personal meds", "Trek through a registered operator"],
    dosAndDonts: {
      do: ["Trek with a registered operator/guide", "Stay with the group", "Acclimatize", "Carry first aid and inform guide of any health issues"],
      dont: ["Don’t attempt the pass in bad weather", "Don’t litter", "Don’t venture off trail alone", "Don’t skip fitness prep"],
    },
    safetyNotes: ["Hampta Pass is a high-altitude trek. Only attempt with a proper operator and if you’re fit.", "Weather can change quickly; follow guide’s call on crossing."],
  },
  3: {
    bestTimeToVisit: "June to mid-October. Best: June and September.",
    dayByDay: [
      buildDayPlan(1, "Drive to Jobra; trek to Chika.", "Acclimatize at Chika.", "Camp; early night."),
      buildDayPlan(2, "Trek Chika to Balu Ka Gera.", "Rest and hydrate.", "Camp."),
      buildDayPlan(3, "Trek back to Jobra (or as per operator schedule); drive to Manali.", "—", "—"),
    ],
    sightseeing: ["Chika", "Balu Ka Gera", "Hampta valley views"],
    foodToTry: ["Camp meals", "Snacks", "Plenty of water"],
    whatToCarry: ["Trekking shoes", "Layers", "Rain gear", "Sunscreen", "Head torch", "Meds", "Book with registered operator"],
    dosAndDonts: {
      do: ["Use a registered operator", "Stay with group", "Acclimatize", "Carry first aid"],
      dont: ["Don’t attempt pass in bad weather", "Don’t litter", "Don’t go off trail alone"],
    },
    safetyNotes: ["High-altitude trek — only with operator and if fit.", "Follow guide on weather and crossing."],
  },
  4: {
    bestTimeToVisit: "June to mid-October.",
    dayByDay: [
      buildDayPlan(1, "Drive to Jobra; trek to Chika.", "Acclimatize.", "Camp."),
      buildDayPlan(2, "Chika to Balu Ka Gera.", "Rest.", "Camp."),
      buildDayPlan(3, "Balu Ka Gera to Shea Goru (cross Hampta Pass).", "Rest at camp.", "Camp."),
      buildDayPlan(4, "Shea Goru to Chatru; drive to Manali.", "—", "—"),
    ],
    sightseeing: ["Chika", "Balu Ka Gera", "Hampta Pass", "Shea Goru", "Chatru"],
    foodToTry: ["Camp meals", "High-energy snacks", "Hydration"],
    whatToCarry: ["Trekking shoes", "Layers", "Rain gear", "Sunscreen", "Head torch", "Meds", "Registered operator only"],
    dosAndDonts: {
      do: ["Trek with registered operator", "Stay with group", "Acclimatize", "First aid and inform guide of health issues"],
      dont: ["Don’t attempt pass in bad weather", "Don’t litter", "Don’t go off trail alone", "Don’t skip fitness prep"],
    },
    safetyNotes: ["High-altitude trek. Only with operator and if physically prepared.", "Weather can change; follow guide’s decisions."],
  },
};

const HANDBOOKS: Record<MVPDestination, Record<number, HandbookItinerary>> = {
  "Varanasi": VARANASI,
  "Sikkim": SIKKIM,
  "Hampta Pass": HAMPTA_PASS,
};

/** Get handbook for destination and day count. Falls back to nearest day count (2–7). */
export function getHandbookContent(
  destination: string,
  days: number
): HandbookItinerary {
  const byDest = HANDBOOKS[destination as MVPDestination];
  
  // Generic Fallback for non-MVP destinations
  if (!byDest) {
    return {
      bestTimeToVisit: "Check local weather patterns. Generally, post-monsoon or early summer are safe bets in India.",
      dayByDay: Array.from({ length: days }).map((_, i) => buildDayPlan(
        i + 1, 
        `Morning exploration in ${destination}.`, 
        "Afternoon sightseeing and local lunch.", 
        "Evening leisure and dinner."
      )),
      sightseeing: ["Main city center", "Local historical sites", "Popular viewpoints"],
      foodToTry: ["Regional street food", "Local traditional thali", "Popular cafe spots"],
      whatToCarry: ["Comfortable walking shoes", "Weather-appropriate clothing", "Water bottle", "Portable charger"],
      dosAndDonts: {
        do: ["Respect local customs", "Try regional cuisine", "Stay hydrated"],
        dont: ["Don't litter", "Don't photograph without permission", "Don't ignore safety guidelines"]
      },
      safetyNotes: ["Keep emergency contacts handy", "Stick to well-lit areas after dark", "Use registered transport"]
    };
  }

  const keys = Object.keys(byDest).map(Number).sort((a, b) => a - b);
  const chosen = keys.find((k) => k >= days) ?? keys[keys.length - 1] ?? 3;
  const handbook = byDest[chosen];
  if (!handbook) return byDest[3] ?? byDest[2] ?? byDest[4];

  if (chosen === days) return handbook;
  const dayByDay = handbook.dayByDay.slice(0, days);
  while (dayByDay.length < days && handbook.dayByDay.length) {
    const last = handbook.dayByDay[handbook.dayByDay.length - 1];
    dayByDay.push({ ...last, day: dayByDay.length + 1 });
  }
  return { ...handbook, dayByDay };
}

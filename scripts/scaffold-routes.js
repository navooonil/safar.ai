const fs = require('fs');
const path = require('path');

const routes = [
  'auth',
  'onboarding',
  'intent',
  'discovery',
  'justification',
  'planning',
  'budget',
  'itinerary',
  'booking',
  'confirmation'
];

const appDir = path.join(__dirname, 'app');

if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir);
}

// Write the main layout orchestrator logic into a new central hook so pages stay clean
// But since the user just wants slash routes quickly, we will build a generic page template
// that looks at the context. Wait, no. The best is to have page logic moved locally or to context.

const generateRoutePage = (route) => {
  const compPath = path.join(appDir, route);
  if (!fs.existsSync(compPath)) fs.mkdirSync(compPath, { recursive: true });

  const content = `"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTripContext } from "@/context/TripContext";
import PageOrchestrator from "@/components/PageOrchestrator";

export default function ${route.charAt(0).toUpperCase() + route.slice(1)}Page() {
  return <PageOrchestrator activeRoute="${route}" />;
}
`;

  fs.writeFileSync(path.join(compPath, 'page.tsx'), content);
};

routes.forEach(generateRoutePage);

// Instead of refactoring the massive page.tsx into 12 files manually and destroying logic,
// We will rename page.tsx to PageOrchestrator.tsx and make it accept an activeRoute prop.
// Then we just map the 'step' state to the URL.

console.log('Routes generated successfully.');

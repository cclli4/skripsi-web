"use client";

import { diagnosisFields } from "@/app/sections/Diagnosis";

const featureOrder = diagnosisFields.map((f) => f.key);
const featureLabels = diagnosisFields.reduce((acc, field) => {
  acc[field.key] = field.label || field.key;
  return acc;
}, {});

export function buildFeatureEntries(features) {
  if (!features || typeof features !== "object") return [];

  const ordered = [];
  featureOrder.forEach((key) => {
    if (key in features) {
      ordered.push({
        key,
        label: featureLabels[key],
        value: normalizeValue(features[key]),
      });
    }
  });

  Object.entries(features).forEach(([key, value]) => {
    if (!featureLabels[key]) {
      ordered.push({
        key,
        label: key,
        value: normalizeValue(value),
      });
    }
  });

  return ordered;
}

const normalizeValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

export function featureLabelLookup(key) {
  return featureLabels[key] || key;
}

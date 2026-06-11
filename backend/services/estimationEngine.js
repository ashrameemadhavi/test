/**
 * Dynamic Estimation Engine
 * All values loaded from database - no hardcoded pricing
 */

const calculateComplexity = (featureCount) => {
  if (featureCount <= 3) return 'Simple';
  if (featureCount <= 7) return 'Medium';
  return 'Complex';
};

const buildTechnologyStack = (baseStack, featureRules, selectedFeatures) => {
  const stack = {
    frontend: baseStack?.frontend || null,
    backend: baseStack?.backend || null,
    database: baseStack?.database_name || null,
    ai_service: baseStack?.ai_service || null,
  };

  const selectedFeatureIds = new Set(selectedFeatures.map((f) => f.id));

  for (const rule of featureRules) {
    if (selectedFeatureIds.has(rule.feature_id)) {
      const keyMap = {
        frontend: 'frontend',
        backend: 'backend',
        database_name: 'database',
        ai_service: 'ai_service',
      };
      const stackKey = keyMap[rule.stack_key];
      if (stackKey) {
        stack[stackKey] = rule.stack_value;
      }
    }
  }

  return stack;
};

const calculateEstimation = ({
  projectType,
  selectedFeatures,
  baseStack,
  featureRules,
}) => {
  const baseCost = parseFloat(projectType.base_cost);
  const baseDays = parseInt(projectType.base_days, 10);

  let featureCostTotal = 0;
  let featureDaysTotal = 0;
  let complexityWeightSum = 0;

  const costBreakdown = [
    {
      item: `${projectType.name} (Base)`,
      type: 'base',
      cost: baseCost,
      days: baseDays,
    },
  ];

  const timelineBreakdown = [
    {
      phase: 'Project Setup & Planning',
      days: Math.ceil(baseDays * 0.15),
      description: 'Requirements gathering, architecture design',
    },
  ];

  for (const feature of selectedFeatures) {
    const cost = parseFloat(feature.cost);
    const days = parseInt(feature.days, 10);
    const weight = parseFloat(feature.complexity_weight);

    featureCostTotal += cost;
    featureDaysTotal += days;
    complexityWeightSum += weight;

    costBreakdown.push({
      item: feature.feature_name,
      type: 'feature',
      feature_id: feature.id,
      cost,
      days,
      complexity_weight: weight,
    });

    timelineBreakdown.push({
      phase: feature.feature_name,
      days,
      description: feature.description || `Development of ${feature.feature_name}`,
    });
  }

  const totalCost = baseCost + featureCostTotal;
  const totalDays = baseDays + featureDaysTotal;
  const complexity = calculateComplexity(selectedFeatures.length);
  const technologyStack = buildTechnologyStack(baseStack, featureRules, selectedFeatures);

  timelineBreakdown.push({
    phase: 'Testing & QA',
    days: Math.ceil(totalDays * 0.15),
    description: 'Quality assurance, bug fixes, UAT',
  });

  timelineBreakdown.push({
    phase: 'Deployment & Handover',
    days: Math.ceil(totalDays * 0.1),
    description: 'Production deployment and documentation',
  });

  const adjustedTotalDays =
    totalDays +
    Math.ceil(totalDays * 0.15) +
    Math.ceil(totalDays * 0.1);

  return {
    total_cost: Math.round(totalCost * 100) / 100,
    total_days: adjustedTotalDays,
    complexity,
    complexity_score: complexityWeightSum,
    technology_stack: technologyStack,
    cost_breakdown: costBreakdown,
    timeline_breakdown: timelineBreakdown,
    feature_count: selectedFeatures.length,
    project_type: {
      id: projectType.id,
      name: projectType.name,
      base_cost: baseCost,
      base_days: baseDays,
    },
  };
};

module.exports = {
  calculateComplexity,
  buildTechnologyStack,
  calculateEstimation,
};

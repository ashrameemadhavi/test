const { calculateComplexity, calculateEstimation } = require('../services/estimationEngine');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const runTests = () => {
  console.log('Running Estimation Engine Tests...\n');
  let passed = 0;
  let failed = 0;

  const test = (name, fn) => {
    try {
      fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (err) {
      console.log(`  ❌ ${name}: ${err.message}`);
      failed++;
    }
  };

  test('Complexity: 0 features = Simple', () => {
    assert(calculateComplexity(0) === 'Simple', 'Expected Simple');
  });

  test('Complexity: 3 features = Simple', () => {
    assert(calculateComplexity(3) === 'Simple', 'Expected Simple');
  });

  test('Complexity: 5 features = Medium', () => {
    assert(calculateComplexity(5) === 'Medium', 'Expected Medium');
  });

  test('Complexity: 8 features = Complex', () => {
    assert(calculateComplexity(8) === 'Complex', 'Expected Complex');
  });

  test('Cost formula: base + features', () => {
    const result = calculateEstimation({
      projectType: { id: 1, name: 'Website', base_cost: 5000, base_days: 14 },
      selectedFeatures: [
        { id: 1, feature_name: 'Auth', cost: 2500, days: 7, complexity_weight: 1.5 },
        { id: 2, feature_name: 'Admin', cost: 3500, days: 10, complexity_weight: 2.0 },
      ],
      baseStack: { frontend: 'HTML, CSS, JavaScript', database_name: null, backend: null, ai_service: null },
      featureRules: [],
    });

    assert(result.total_cost === 11000, `Expected 11000, got ${result.total_cost}`);
    assert(result.complexity === 'Simple', 'Expected Simple complexity');
    assert(result.cost_breakdown.length === 3, 'Expected 3 breakdown items');
  });

  test('Tech stack: AI feature adds Python', () => {
    const result = calculateEstimation({
      projectType: { id: 3, name: 'Web Application', base_cost: 12000, base_days: 35 },
      selectedFeatures: [
        { id: 6, feature_name: 'AI Features', cost: 8000, days: 20, complexity_weight: 3.5 },
      ],
      baseStack: { frontend: 'React', backend: 'Node.js', database_name: 'MySQL', ai_service: null },
      featureRules: [{ feature_id: 6, stack_key: 'ai_service', stack_value: 'Python' }],
    });

    assert(result.technology_stack.ai_service === 'Python', 'Expected Python AI service');
    assert(result.technology_stack.frontend === 'React', 'Expected React frontend');
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
};

runTests();

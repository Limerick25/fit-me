import { DailyNutrition } from '../types/nutrition';

interface FitnessDashboardProps {
  nutrition: DailyNutrition;
}

const FitnessDashboard = ({ nutrition }: FitnessDashboardProps) => {
  // Goals (these could be user-configurable in the future)
  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 67,
    fiber: 25,
    sodium: 2300,
    sugar: 50,
    saturatedFat: 20
  };

  const getPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'var(--primary-green)';
    if (percentage >= 70) return 'var(--primary-yellow)';
    return 'var(--primary-orange)';
  };

  const MacroCard = ({
    label,
    value,
    unit,
    goal,
    className,
    showProgress = true
  }: {
    label: string;
    value: number;
    unit: string;
    goal?: number;
    className?: string;
    showProgress?: boolean;
  }) => {
    const percentage = goal ? getPercentage(value, goal) : 0;

    return (
      <div className={`macro-card ${className || ''}`}>
        <div className="macro-value">
          {Math.round(value)}
          <span className="macro-unit">{unit}</span>
        </div>
        <div className="macro-label">{label}</div>
        {goal && showProgress && (
          <>
            <div className="macro-progress">
              <div
                className={`macro-progress-fill ${className || ''}`}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: getProgressColor(percentage)
                }}
              />
            </div>
            <div className="macro-goal">
              {Math.round(percentage)}% of {goal}{unit}
            </div>
          </>
        )}
      </div>
    );
  };

  const SecondaryMacro = ({
    label,
    value,
    unit,
    goal
  }: {
    label: string;
    value: number;
    unit: string;
    goal?: number;
  }) => {
    const percentage = goal ? getPercentage(value, goal) : 0;
    const isOverGoal = goal && value > goal;

    return (
      <div className="secondary-macro">
        <div className="value" style={{ color: isOverGoal ? 'var(--accent-red)' : 'var(--text-primary)' }}>
          {Math.round(value * 10) / 10}
          <span style={{ fontSize: '0.8rem', marginLeft: '2px' }}>{unit}</span>
        </div>
        <div className="label">{label}</div>
        {goal && (
          <div className="goal-info" style={{
            fontSize: '0.7rem',
            color: isOverGoal ? 'var(--accent-red)' : 'var(--text-muted)',
            marginTop: '2px'
          }}>
            {isOverGoal ? 'Over' : `${Math.round(percentage)}%`} of {goal}{unit}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Today's Nutrition</h2>

      {/* Primary Macros Grid */}
      <div className="nutrition-grid">
        <MacroCard
          label="Calories"
          value={nutrition.calories}
          unit=""
          goal={goals.calories}
          className="calories"
        />
        <MacroCard
          label="Protein"
          value={nutrition.protein}
          unit="g"
          goal={goals.protein}
          className="protein"
        />
        <MacroCard
          label="Carbs"
          value={nutrition.carbs}
          unit="g"
          goal={goals.carbs}
          className="carbs"
        />
        <MacroCard
          label="Fats"
          value={nutrition.fats}
          unit="g"
          goal={goals.fats}
          className="fats"
        />
      </div>

      {/* Secondary Macros */}
      <div className="secondary-macros">
        <SecondaryMacro
          label="Fiber"
          value={nutrition.fiber || 0}
          unit="g"
          goal={goals.fiber}
        />
        <SecondaryMacro
          label="Sodium"
          value={nutrition.sodium || 0}
          unit="mg"
          goal={goals.sodium}
        />
        <SecondaryMacro
          label="Sugar"
          value={nutrition.sugar || 0}
          unit="g"
          goal={goals.sugar}
        />
        <SecondaryMacro
          label="Sat Fat"
          value={nutrition.saturatedFat || 0}
          unit="g"
          goal={goals.saturatedFat}
        />
        <SecondaryMacro
          label="Cholesterol"
          value={nutrition.cholesterol || 0}
          unit="mg"
        />
        <SecondaryMacro
          label="Potassium"
          value={nutrition.potassium || 0}
          unit="mg"
        />
        <SecondaryMacro
          label="Vitamin C"
          value={nutrition.vitaminC || 0}
          unit="mg"
        />
        <SecondaryMacro
          label="Iron"
          value={nutrition.iron || 0}
          unit="mg"
        />
      </div>

      {/* Calorie Distribution */}
      <div className="calorie-distribution">
        <h3 className="section-title">Calorie Distribution</h3>
        <div className="distribution-chart">
          <div className="distribution-bar">
            <div
              className="distribution-segment protein"
              style={{
                width: `${(nutrition.protein * 4 / nutrition.calories) * 100}%`,
                backgroundColor: 'var(--primary-orange)'
              }}
            />
            <div
              className="distribution-segment carbs"
              style={{
                width: `${(nutrition.carbs * 4 / nutrition.calories) * 100}%`,
                backgroundColor: 'var(--primary-yellow)'
              }}
            />
            <div
              className="distribution-segment fats"
              style={{
                width: `${(nutrition.fats * 9 / nutrition.calories) * 100}%`,
                backgroundColor: 'var(--accent-purple)'
              }}
            />
          </div>
          <div className="distribution-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'var(--primary-orange)' }}></div>
              <span>Protein: {Math.round((nutrition.protein * 4 / nutrition.calories) * 100)}%</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'var(--primary-yellow)' }}></div>
              <span>Carbs: {Math.round((nutrition.carbs * 4 / nutrition.calories) * 100)}%</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'var(--accent-purple)' }}></div>
              <span>Fats: {Math.round((nutrition.fats * 9 / nutrition.calories) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessDashboard;
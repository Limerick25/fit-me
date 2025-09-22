import { DailyNutritionSummary } from '../types/nutrition';

interface DashboardProps {
  nutrition: DailyNutritionSummary;
}

const Dashboard = ({ nutrition }: DashboardProps) => {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Today's Nutrition</h2>
      <div className="nutrition-grid">
        <div className="nutrition-card calories">
          <div className="nutrition-value">{nutrition.totalCalories}</div>
          <div className="nutrition-label">Calories</div>
        </div>

        <div className="nutrition-card protein">
          <div className="nutrition-value">{nutrition.totalProtein}g</div>
          <div className="nutrition-label">Protein</div>
        </div>

        <div className="nutrition-card carbs">
          <div className="nutrition-value">{nutrition.totalCarbs}g</div>
          <div className="nutrition-label">Carbs</div>
        </div>

        <div className="nutrition-card fats">
          <div className="nutrition-value">{nutrition.totalFats}g</div>
          <div className="nutrition-label">Fats</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
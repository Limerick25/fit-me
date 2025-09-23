interface FitnessActionsProps {
  onAddFood: () => void;
  onViewFood: () => void;
  totalMeals: number;
}

const FitnessActions = ({ onAddFood, onViewFood, totalMeals }: FitnessActionsProps) => {
  return (
    <div className="action-buttons">
      <button className="action-btn" onClick={onAddFood}>
        <div className="icon">🍎</div>
        <div className="text">Add Food</div>
        <div className="subtitle">Log what you ate</div>
      </button>

      <button className="action-btn secondary" onClick={onViewFood}>
        <div className="icon">📋</div>
        <div className="text">View Food</div>
        <div className="subtitle">
          {totalMeals === 0 ? 'No meals logged today' : `${totalMeals} meal${totalMeals !== 1 ? 's' : ''} logged`}
        </div>
      </button>
    </div>
  );
};

export default FitnessActions;
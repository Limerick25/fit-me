interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const Header = ({ currentDate, onDateChange }: HeaderProps) => {
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    onDateChange(newDate);
  };

  const handleTodayClick = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="app-title-container">
          <span className="app-logo">💪</span>
          <h1 className="app-title">Fit Me</h1>
        </div>
        <div className="date-picker">
          <label htmlFor="date-input">Date:</label>
          <div className="date-controls">
            <input
              id="date-input"
              type="date"
              value={formatDateForInput(currentDate)}
              onChange={handleDateChange}
              className="date-input"
            />
            <button
              onClick={handleTodayClick}
              className={`today-btn ${isToday(currentDate) ? 'active' : ''}`}
              type="button"
            >
              Today
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
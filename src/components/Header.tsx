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

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">🥗 Master Shredder</h1>
        <div className="date-picker">
          <label htmlFor="date-input">Date:</label>
          <input
            id="date-input"
            type="date"
            value={formatDateForInput(currentDate)}
            onChange={handleDateChange}
            className="date-input"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
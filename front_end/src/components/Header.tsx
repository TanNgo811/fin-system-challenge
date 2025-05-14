interface HeaderProps {
  timer: string;
  stage: string;
  nextStage: string;
  userName: string;
}
const Header: React.FC<HeaderProps> = ({ timer, stage, nextStage, userName }) => (
  <header className="bg-white shadow p-4 flex justify-between items-center">
    <div>
      <div>Timer: <span className="font-semibold text-blue-600">{timer}</span></div>
      <div>Stage: <span className="font-semibold">{stage}</span></div>
      <div>Next Stage: <span className="font-semibold">{nextStage}</span></div>
    </div>
    <div className="text-right">
      <div className="font-semibold text-lg">{userName}</div>
      <button className="text-sm text-blue-500 hover:underline">Logout</button>
    </div>
  </header>
);
export default Header;
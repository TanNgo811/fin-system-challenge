import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FirstTimeGuidance from './components/FirstTimeGuidance';
import InputField from './components/InputField';
import FactorScoreSlider from './components/FactorScoreSlider';
import ValuationDisplay from './components/ValuationDisplay';
import SimulationPieChart from './components/SimulationPieChart';
import VideoModal from './components/VideoModal';
import TextModal from './components/TextModal';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';

export interface TermSharedState {
  ebitda: number;
  interestRate: number;
  multiple: number;
  factorScore: number;
  companyName: string;
  description: string;
  tbdOkStates: {
    ebitda: boolean;
    interestRate: boolean;
    multiple: boolean;
    factorScore: boolean;
    companyName: boolean;
    description: boolean;
  };
}

const INITIAL_SHARED_STATE: TermSharedState = {
  ebitda: 10_000_000,
  interestRate: 0.20,
  multiple: 10,
  factorScore: 3,
  companyName: 'ABC Corp.',
  description: 'This is the company\'s description. This company is #1!',
  tbdOkStates: {
    ebitda: true,
    interestRate: true,
    multiple: true,
    factorScore: true,
    companyName: true,
    description: true,
  },
};

function App() {
  const [timer, setTimer] = useState(60 * 60);

  const [sharedData, setSharedData] = useState<TermSharedState>(INITIAL_SHARED_STATE);
  const [valuation, setValuation] = useState<number>(0);
  const [pieChartValue, setPieChartValue] = useState<number>(0);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  
  const [currentTeam, setCurrentTeam] = useState<'team1' | 'team2'>('team1');
  const [userName, setUserName] = useState('John Doe (Team 1)');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { ebitda, multiple, factorScore, interestRate, tbdOkStates } = sharedData;
    
    const coreTermsOk = !tbdOkStates.ebitda && !tbdOkStates.multiple && !tbdOkStates.factorScore && !tbdOkStates.interestRate;

    if (coreTermsOk) {
      const calculatedValuation = ebitda * multiple * factorScore;
      setValuation(calculatedValuation);
    } else {
      setValuation(0);
    }
    setPieChartValue(interestRate * 100);
  }, [sharedData]);

  const handleTeamSwitch = () => {
    setCurrentTeam(prevTeam => {
      const newTeam = prevTeam === 'team1' ? 'team2' : 'team1';
      setUserName(newTeam === 'team1' ? 'John Doe (Team 1)' : 'Jane Smith (Team 2)');
      return newTeam;
    });
  };

  const handleTeam1InputChange = (id: keyof TermSharedState | 'factorScoreValue', value: string | number) => {
    setSharedData(prevData => {
      const newData = { ...prevData };
      let termIdToReset: keyof TermSharedState['tbdOkStates'] | null = null;

      switch (id) {
        case 'ebitda':
          newData.ebitda = parseFloat(String(value).replace(/\$|,| million/g, '')) * 1000000 || 0;
          termIdToReset = 'ebitda';
          break;
        case 'interestRate':
          newData.interestRate = parseFloat(String(value).replace(/%/g, '')) / 100 || 0;
          termIdToReset = 'interestRate';
          break;
        case 'multiple':
          newData.multiple = parseFloat(String(value).replace(/x/g, '')) || 0;
          termIdToReset = 'multiple';
          break;
        case 'factorScoreValue':
          newData.factorScore = value as number;
          termIdToReset = 'factorScore';
          break;
        case 'companyName':
          newData.companyName = String(value);
          termIdToReset = 'companyName';
          break;
        case 'description':
          newData.description = String(value);
          termIdToReset = 'description';
          break;
      }

      if (termIdToReset) {
        newData.tbdOkStates = {
          ...prevData.tbdOkStates,
          [termIdToReset]: true,
        };
      }
      return newData;
    });
  };
  
  const handleTeam2ToggleTBDOK = (id: keyof TermSharedState['tbdOkStates']) => {
    setSharedData(prevData => ({
      ...prevData,
      tbdOkStates: {
        ...prevData.tbdOkStates,
        [id]: !prevData.tbdOkStates[id],
      },
    }));
  };
  
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isTeam1 = currentTeam === 'team1';

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar 
        onVideoModalOpen={() => setIsVideoModalOpen(true)}
        onTextModalOpen={() => setIsTextModalOpen(true)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          timer={formatTimer(timer)} 
          stage={'ANALYSIS'} 
          nextStage={'STRUCTURING - 1 hour'} 
          userName={userName} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="container mx-auto">
            <div className="mb-4 flex items-center justify-end space-x-2 p-4 bg-white rounded-lg shadow">
              <Label htmlFor="team-switch" className="font-semibold">
                Viewing as: {currentTeam === 'team1' ? "Team 1 (Editor)" : "Team 2 (Approver)"}
              </Label>
              <Switch
                id="team-switch"
                checked={currentTeam === 'team2'}
                onCheckedChange={handleTeamSwitch}
              />
            </div>

            <FirstTimeGuidance />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Input Panel */}
              <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Negotiation Terms</h2>
                <div className="space-y-5">
                  <InputField 
                    id="ebitda"
                    label="EBITDA" 
                    value={`${(sharedData.ebitda / 1000000).toFixed(sharedData.ebitda % 1000000 === 0 ? 0 : 2)} million`}
                    onValueChange={(val) => handleTeam1InputChange('ebitda', val)}
                    isTBD={sharedData.tbdOkStates.ebitda}
                    onToggleTBDOK={() => handleTeam2ToggleTBDOK('ebitda')}
                    disabled={!isTeam1}
                    toggleDisabled={isTeam1}
                  />
                   <InputField
                    id="interestRate"
                    label="Interest Rate" 
                    value={`${(sharedData.interestRate * 100).toFixed(0)}%`}
                    onValueChange={(val) => handleTeam1InputChange('interestRate', val)}
                    isTBD={sharedData.tbdOkStates.interestRate}
                    onToggleTBDOK={() => handleTeam2ToggleTBDOK('interestRate')}
                    disabled={!isTeam1}
                    toggleDisabled={isTeam1}
                  />
                  <InputField 
                    id="multiple"
                    label="Multiple" 
                    value={`${sharedData.multiple}x`}
                    onValueChange={(val) => handleTeam1InputChange('multiple', val)}
                    isTBD={sharedData.tbdOkStates.multiple}
                    onToggleTBDOK={() => handleTeam2ToggleTBDOK('multiple')}
                    disabled={!isTeam1}
                    toggleDisabled={isTeam1}
                  />
                  <FactorScoreSlider 
                    id="factorScore"
                    value={[sharedData.factorScore]} 
                    onValueChange={(newScore) => handleTeam1InputChange('factorScoreValue', newScore[0])} 
                    isTBD={sharedData.tbdOkStates.factorScore}
                    onToggleTBDOK={() => handleTeam2ToggleTBDOK('factorScore')}
                    disabled={!isTeam1}
                    toggleDisabled={isTeam1}
                  />
                  <InputField 
                    id="companyName"
                    label="Company Name" 
                    value={sharedData.companyName}
                    onValueChange={(val) => handleTeam1InputChange('companyName', val)}
                    isTBD={sharedData.tbdOkStates.companyName}
                    onToggleTBDOK={() => handleTeam2ToggleTBDOK('companyName')}
                    disabled={!isTeam1}
                    toggleDisabled={isTeam1}
                  />
                  <InputField 
                    id="description"
                    label="Description" 
                    value={sharedData.description}
                    isTextarea={true}
                    onValueChange={(val) => handleTeam1InputChange('description', val)}
                    isTBD={sharedData.tbdOkStates.description}
                    onToggleTBDOK={() => handleTeam2ToggleTBDOK('description')}
                    disabled={!isTeam1}
                    toggleDisabled={isTeam1}
                  />
                </div>
                <div className="mt-8 flex justify-end">
                  <Button size="lg" onClick={() => alert('Submit clicked! Mock submission.')} disabled={!isTeam1}>
                    SUBMIT (Team 1 only)
                  </Button>
                </div>
              </div>

              {/* Right Output Panel */}
              <div className="md:col-span-1 space-y-6">
                <ValuationDisplay valuation={valuation} termsOk={!Object.values(sharedData.tbdOkStates).some(status => status)} />
                <SimulationPieChart percentage={pieChartValue} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
      <TextModal isOpen={isTextModalOpen} onClose={() => setIsTextModalOpen(false)} />
    </div>
  );
}

export default App;
import React, { useState, useMemo } from 'react';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const STRINGS = [
  { num: 1, name: 'E (1st)', index: 4 },
  { num: 2, name: 'B (2nd)', index: 11 },
  { num: 3, name: 'G (3rd)', index: 7 },
  { num: 4, name: 'D (4th)', index: 2 },
  { num: 5, name: 'A (5th)', index: 9 },
  { num: 6, name: 'E (6th)', index: 4 },
];

function App() {
  const [mode, setMode] = useState('findShape'); // 'findShape' or 'findNote'
  const [inputNote, setInputNote] = useState('C');
  const [capoFret, setCapoFret] = useState(2);

  const inputIndex = NOTES.indexOf(inputNote);

  const result = useMemo(() => {
    if (inputIndex === -1) return null;

    let resultNoteIndex;
    let positions = [];

    if (mode === 'findShape') {
      // User wants to sound the inputNote. We tell them what shape to play.
      resultNoteIndex = (inputIndex - capoFret + 24) % 12;
      
      STRINGS.forEach(string => {
        const fretRel = (inputIndex - string.index - capoFret + 24) % 12;
        positions.push({
          string: string.name,
          fret: fretRel === 0 ? 'Open' : `Fret ${fretRel}`
        });
      });
    } else {
      // User plays the inputNote shape. We tell them what it sounds like.
      resultNoteIndex = (inputIndex + capoFret) % 12;
      
      STRINGS.forEach(string => {
        const fretRel = (inputIndex - string.index + 24) % 12;
        positions.push({
          string: string.name,
          fret: fretRel === 0 ? 'Open' : `Fret ${fretRel}`
        });
      });
    }

    return {
      note: NOTES[resultNoteIndex],
      positions
    };
  }, [inputIndex, capoFret, mode]);

  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>Guitar Transposer</h1>
          <p>Find notes and shapes with a capo</p>
        </div>

        <div className="toggle-group">
          <button 
            className={`toggle-btn ${mode === 'findShape' ? 'active' : ''}`}
            onClick={() => setMode('findShape')}
          >
            I know the Target Note
          </button>
          <button 
            className={`toggle-btn ${mode === 'findNote' ? 'active' : ''}`}
            onClick={() => setMode('findNote')}
          >
            I know the Shape
          </button>
        </div>

        <div className="form-group">
          <label>
            {mode === 'findShape' ? 'Target Note to Sound' : 'Chord/Note Shape to Play'}
          </label>
          <div className="select-wrapper">
            <select 
              value={inputNote} 
              onChange={(e) => setInputNote(e.target.value)}
            >
              {NOTES.map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Capo Position (Fret)</label>
          <div className="select-wrapper">
            <select 
              value={capoFret} 
              onChange={(e) => setCapoFret(parseInt(e.target.value))}
            >
              <option value={0}>No Capo (0)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                <option key={num} value={num}>Fret {num}</option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <div className="result-box">
            <div className="result-header">
              <div className="result-subtitle">
                {mode === 'findShape' ? 'You should play a' : 'It will sound like a'}
              </div>
              <div className="transposed-note">{result.note}</div>
              <div className="result-subtitle" style={{marginTop: '4px'}}>
                Positions (relative to capo)
              </div>
            </div>
            
            <div className="positions-list">
              {result.positions.map((pos, idx) => (
                <div key={idx} className="position-item">
                  <div className="position-string">{pos.string}</div>
                  <div className="position-fret">{pos.fret}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

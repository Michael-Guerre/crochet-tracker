import { useState } from "react";
import { parsePattern } from "./services/patternParser.ts";


function App() {
  const patternText = "R1: 6 sc (6)\nR2: inc x6 (12)\nR3: [sc, inc] x6 (18)";
  const pattern = parsePattern(patternText);
  const [stitches,setStitches] = useState(0);
  const [rowIndex,setrowIndex] = useState(0);

  const target = pattern[rowIndex].target;

const addStitch = () => {
    const next = stitches + 1;

    if (next >= target) {
      setrowIndex(r => r+1);
      setStitches(0);
      return
    }

    setStitches(next);
  }

const delStitch = () => {
    if(rowIndex === 0 && stitches === 0) return;
    if (stitches > 0) {
      setStitches(s => s - 1);
      return;
    }

    if (rowIndex > 0) {
      const prevRow = rowIndex - 1;
      setrowIndex(prevRow);
      setStitches(pattern[prevRow].target-1);
    }

  }

console.log(pattern);

  return (
    <div 
      style = {{
        maxWidth: 500,
        margin: "auto",
        textAlign: "center",
        padding: 20,
      }}
    >
      <h1>Crochet Tracker</h1>
      <p>Row : {pattern[rowIndex].row} / {pattern.length}</p>
      <p>Stitches : {stitches} / {target}</p>
      <p>Instruction :
        {pattern[rowIndex].instruction}
      </p>
      <button onClick={() => delStitch()}>
      -1 stitch
      </button>
      <button onClick={() => addStitch()}>
      +1 stitch
      </button>
    </div>
  );
}

export default App;

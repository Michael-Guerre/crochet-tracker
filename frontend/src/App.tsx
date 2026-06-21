import { useState, useEffect } from "react";
import { parsePattern } from "./services/patternParser.ts";


function App() {
  const [patternText, setPatternText] = useState(() => {
    return (
      localStorage.getItem("pattern") ??
      "R1: 6 sc (6)\nR2: inc x6 (12)\nR3: [sc, inc] x6 (18)"
    );
  });

  const [stitches, setStitches] = useState(() => {
    const saved = localStorage.getItem("stitches");
    return saved ? Number(saved) : 0;
  });

  const [rowIndex, setRowIndex] = useState(() => {
    const saved = localStorage.getItem("rowIndex");
    return saved ? Number(saved) : 0;
  });
  const pattern = parsePattern(patternText);

  useEffect(() => {
    localStorage.setItem(
      "pattern",
      patternText
    );
    localStorage.setItem(
      "rowIndex",
      rowIndex.toString()
    );
    localStorage.setItem(
      "stitches",
      stitches.toString()
    );
  }, [patternText, rowIndex, stitches]);

  const target = pattern[rowIndex]?.target ?? 0;

  const addStitch = () => {
    const next = stitches + 1;

    if (next >= target) {
      if (rowIndex >= pattern.length - 1) {
        setStitches(target);
        return;
      }
      setRowIndex(r => r + 1);
      setStitches(0);
      return
    }

    setStitches(next);
  }

  const delStitch = () => {
    if (rowIndex === 0 && stitches === 0) return;
    if (stitches > 0) {
      setStitches(s => s - 1);
      return;
    }

    if (rowIndex > 0) {
      const prevRow = rowIndex - 1;
      setRowIndex(prevRow);
      setStitches(pattern[prevRow].target - 1);
    }

  }

  if (pattern.length == 0) {
    return (
      <div>
        <h1>Crochet Tracker</h1>

        <textarea
          rows={10}
          cols={40}
          value={patternText}
          onChange={(e) => setPatternText(e.target.value)}
        />
        <p>Aucune row valide détectée</p>
      </div>
    )
  }
  return (
    <div
      style={{
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

      <h2>Pattern</h2>

      <textarea
        rows={10}
        cols={40}
        value={patternText}
        onChange={(e) => {
          setPatternText(e.target.value);
          setRowIndex(0);
          setStitches(0);
        }}
      />
      <button
        onClick={() => {
          localStorage.clear();
          setPatternText(
            "R1: 6 sc (6)\nR2: inc x6 (12)"
          );

          setRowIndex(0);
          setStitches(0);
        }}>
        Reset
      </button>
    </div>
  );
}

export default App;

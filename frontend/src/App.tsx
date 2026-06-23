import { useState, useEffect } from "react";
import { parsePattern } from "./services/patternParser.ts";
import { translateInstruction } from "./services/translateInstruction";

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
  const [locked, setLocked] = useState(false);
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

  useEffect(() => {
    if (rowIndex >= pattern.length) {
      setRowIndex(Math.max(pattern.length - 1, 0));
      setStitches(0);
    }
  }, [pattern, rowIndex]);

  const target = pattern[rowIndex]?.target ?? 0;
  const currentRow = pattern[rowIndex] ?? pattern[0];
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

  const progress = target ? (stitches / target) * 100 : 0;
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

  if (pattern.length === 0) {
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

    <div style={styles.container}>
      <h1 style={styles.title}>Crochet Tracker</h1>

      <div style={styles.card}>
        {/* ROW INFO */}
        <div style={styles.rowInfo}>
          Row {currentRow.row} / {pattern.length}
        </div>

        {/* PROGRESS */}
        <div style={styles.progressText}>
          {stitches} / {target}
        </div>

        <div style={styles.bar}>
          <div
            style={{
              ...styles.barFill,
              width: `${progress}%`
            }}
          />
        </div>

        {/* INSTRUCTION */}
        <div style={styles.instruction}>
          {translateInstruction(currentRow.instruction)}
        </div>
      </div>

      {/* BUTTONS */}
      <div style={styles.controls}>
        <button style={styles.btnMinus} onClick={delStitch}>
          -1
        </button>

        <button style={styles.btnPlus} onClick={addStitch}>
          +1
        </button>
      </div>
      <button onClick={() => setLocked(l => !l)}>
        {locked ? "Unlock pattern" : "Lock pattern"}
      </button><br />
      <textarea
        rows={10}
        cols={40}
        value={patternText}
        disabled={locked}
        onChange={(e) => {
          setPatternText(e.target.value);
          setRowIndex(0);
          setStitches(0);
        }}
      /><br />
      <button
        disabled={locked}
        onClick={() => { localStorage.clear(); setPatternText("R1: 6 sc (6)\nR2: inc x6 (12)"); setRowIndex(0); setStitches(0); }}>
        Reset
      </button>
    </div>

  );
}
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 420,
    margin: "0 auto",
    padding: 16,
    fontFamily: "system-ui",
    textAlign: "center",
  },

  title: {
    fontSize: 24,
    marginBottom: 16,
  },

  card: {
    background: "#111",
    color: "#fff",
    padding: 16,
    borderRadius: 12,
  },

  rowInfo: {
    fontSize: 18,
    marginBottom: 8,
    opacity: 0.8,
  },

  progressText: {
    fontSize: 22,
    marginBottom: 8,
  },

  bar: {
    height: 10,
    background: "#333",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 12,
  },

  barFill: {
    height: "100%",
    background: "#4ade80",
    transition: "width 0.2s",
  },

  instruction: {
    fontSize: 16,
    opacity: 0.9,
  },

  controls: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 20,
  },

  btnPlus: {
    fontSize: 32,
    padding: "20px 40px",
    borderRadius: 12,
    border: "none",
    background: "#22c55e",
    color: "white",
  },

  btnMinus: {
    fontSize: 32,
    padding: "20px 40px",
    borderRadius: 12,
    border: "none",
    background: "#ef4444",
    color: "white",
  },
};
export default App;

import { Box } from "@mui/material";
import "./App.css";

import ThreeContainer from "./components/view3d/ThreeContainer";

function App() {
  return (
    <Box sx={{ position: "absolute", zIndex: 1 }}>
      <h1
        id="mouse-label"
        style={{ position: "absolute", display: "none", zIndex: 1 }}
      ></h1>
      <ThreeContainer />
    </Box>
  );
}

export default App;

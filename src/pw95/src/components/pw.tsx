import { useState, useEffect } from "react"; // Import hooks
import styled from "styled-components";
import { Window, WindowHeader, Button, WindowContent } from "react95";

import { invoke } from '@tauri-apps/api/core';

import { Icons } from "./icons";

// Styled Components
const StyledWindow = styled(Window)`
  margin: 1rem;
  width: 400px;
  position: relative;

  .window-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer {
    margin-top: 1rem;
    padding: 0.5rem;
  }

  -webkit-app-region: no-drag; /* Prevent dragging in specific areas like buttons */
`;

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: rgba(0, 0, 0, 0); /* Background color of your app = transparent*/
  -webkit-app-region: drag; /* Make the entire app draggable */
`;

const Pw = () => {
  const [isActive, setIsActive] = useState(false);

  // Function to check window active status
  const checkWindowActive = async () => {
    const active = await invoke<boolean>('is_window_active');
    setIsActive(active);
  };

  // Poll the active status periodically
  useEffect(() => {
    const interval = setInterval(checkWindowActive, 250); // Check every 0.25 miliseconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Function to close the Tauri window
  const handleClose = async () => {
    await invoke('stop_app'); // This closes the app
  };

  return (
    <AppContainer data-tauri-drag-region>
      <StyledWindow>
        <WindowHeader
          active={isActive}
          className="window-title"
        >
          <span>pw95</span>
          <Button onClick={handleClose}>
            {Icons.Close}
          </Button>
        </WindowHeader>
        <WindowContent>
          {/* Your React95 content */}
          I am a window.
        </WindowContent>
      </StyledWindow>
    </AppContainer>
  );
};

export default Pw;

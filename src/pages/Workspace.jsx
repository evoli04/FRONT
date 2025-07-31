// WorkspacePage.jsx
import React, { useState } from 'react';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspacePopup from './WorkspacePopUp';
import BoardPopup from './BoardPopup.jsx';
import '../components/css/workspace.css';

export default function Workspace() {
  const [workspaces, setWorkspaces] = useState([

    { id: 2, name: "CLUSTER", boards: [] }
  ]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showWorkspacePopup, setShowWorkspacePopup] = useState(false);
  const [showBoardPopup, setShowBoardPopup] = useState(false);

  const handleAddWorkspace = (name) => {
    const newWorkspace = {
      id: Date.now(),
      name,
      boards: [],
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setShowWorkspacePopup(false);
  };

  const handleAddBoard = (boardName) => {
    if (!selectedWorkspace) return;
    setWorkspaces(prev => prev.map(ws =>
      ws.id === selectedWorkspace.id ? { ...ws, boards: [...ws.boards, boardName] } : ws
    ));
    setShowBoardPopup(false);
  };

  return (
    <div className="workspace-page">
      <WorkspaceSidebar
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onSelectWorkspace={setSelectedWorkspace}
        onAddWorkspaceClick={() => setShowWorkspacePopup(true)}
        onAddBoardClick={() => setShowBoardPopup(true)}
      />

      {showWorkspacePopup && (
        <WorkspacePopup
          onClose={() => setShowWorkspacePopup(false)}
          onSubmit={handleAddWorkspace}
        />
      )}

      {showBoardPopup && (
        <BoardPopup
          onClose={() => setShowBoardPopup(false)}
          onSubmit={handleAddBoard}
        />
      )}
    </div>
  );
}
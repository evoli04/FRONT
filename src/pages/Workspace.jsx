import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspacePopup from './WorkspacePopUp';
import BoardPopup from './BoardPopup.jsx';
import '../components/css/workspace.css';

export default function Workspace() {
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: "deneme", boards: ["pano1", "helal"] },
    { id: 2, name: "CLUSTER", boards: [] }
  ]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showWorkspacePopup, setShowWorkspacePopup] = useState(false);
  const [showBoardPopup, setShowBoardPopup] = useState(false);
  const [showAllWorkspaces, setShowAllWorkspaces] = useState(true); // Yeni state
  const navigate = useNavigate();

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

  const handleBoardClick = (boardName) => {
    if (!selectedWorkspace) return;
    navigate(`/board/${selectedWorkspace.id}/${encodeURIComponent(boardName)}`);
  };

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowAllWorkspaces(false); // Çalışma alanı seçildiğinde listeyi gizle
  };

  return (
    <div className="workspace-container">
      <WorkspaceSidebar
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onSelectWorkspace={handleWorkspaceSelect}
        onShowAllWorkspaces={() => {
          setSelectedWorkspace(null);
          setShowAllWorkspaces(true); // Tüm çalışma alanlarını göster
        }}
        onAddWorkspaceClick={() => setShowWorkspacePopup(true)}
        onAddBoardClick={() => selectedWorkspace && setShowBoardPopup(true)}
      />

      <main className="workspace-main-content">
        {showAllWorkspaces ? (
          <div className="workspace-view">
            <h2>Çalışma Alanlarım</h2>
            <div className="workspaces-grid">
              {workspaces.map(workspace => (
                <div
                  key={workspace.id}
                  className="workspace-card"
                  onClick={() => handleWorkspaceSelect(workspace)}
                >
                  <h3>{workspace.name}</h3>
                  <p>{workspace.boards.length} Pano</p>
                </div>
              ))}
              <div
                className="workspace-card add-workspace"
                onClick={() => setShowWorkspacePopup(true)}
              >
                <FiPlus size={24} />
                <span>Çalışma Alanı Ekle</span>
              </div>
            </div>
          </div>
        ) : selectedWorkspace ? (
          <div className="board-view">
            <h2 className="workspace-name">{selectedWorkspace.name}</h2>
            <div className="boards-grid">
              {selectedWorkspace.boards.map((board, index) => (
                <div
                  key={index}
                  className="board-card"
                  onClick={() => handleBoardClick(board)}
                >
                  <div className="board-title">{board}</div>
                </div>
              ))}
              <div
                className="board-card add-board"
                onClick={() => setShowBoardPopup(true)}
              >
                <FiPlus size={24} />
                <span>Pano Ekle</span>
              </div>
            </div>
          </div>
        ) : null}
      </main>

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
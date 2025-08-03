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
  const [showAllWorkspaces, setShowAllWorkspaces] = useState(true);
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

    const updatedWorkspaces = workspaces.map(ws =>
      ws.id === selectedWorkspace.id
        ? { ...ws, boards: [...ws.boards, boardName] }
        : ws
    );

    setWorkspaces(updatedWorkspaces);
    setSelectedWorkspace(updatedWorkspaces.find(ws => ws.id === selectedWorkspace.id));
    setShowBoardPopup(false);
  };

  const handleBoardClick = (boardName) => {
    if (!selectedWorkspace) return;
    navigate(`/board/${selectedWorkspace.id}/${encodeURIComponent(boardName)}`);
  };

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowAllWorkspaces(false);
  };

  const handleDeleteWorkspace = (workspaceId) => {
    if (window.confirm('Bu çalışma alanını ve tüm panolarını silmek istediğinize emin misiniz?')) {
      const updatedWorkspaces = workspaces.filter(ws => ws.id !== workspaceId);
      setWorkspaces(updatedWorkspaces);

      if (selectedWorkspace?.id === workspaceId) {
        setSelectedWorkspace(null);
        setShowAllWorkspaces(true);
      }
    }
  };

  return (
    <div className="workspace-container">
      <WorkspaceSidebar
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onSelectWorkspace={handleWorkspaceSelect}
        onShowAllWorkspaces={() => {
          setSelectedWorkspace(null);
          setShowAllWorkspaces(true);
        }}
        onAddWorkspaceClick={() => setShowWorkspacePopup(true)}
        onAddBoardClick={() => selectedWorkspace && setShowBoardPopup(true)}
        onDeleteWorkspace={handleDeleteWorkspace}
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
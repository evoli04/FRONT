import React, { useState, useContext, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspacePopup from './WorkspacePopup';
import Settings from './Settings';
import BoardPopup from './BoardPopup';
import Board from './Board.jsx';
import { ThemeContext } from '../App';
import { AuthContext } from '../context/AuthContext';
import {
    getWorkspacesByMember,
    createWorkspace,
    getBoardsByWorkspace,
    createBoard
} from '../services/api';
import '../components/css/workspace.css';

export default function Workspace() {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);

    const memberId = user?.memberId ? Number(user.memberId) : null;
    const roleId = user?.roleId ? Number(user.roleId) : null;

    console.log("AuthContext User:", user);
    console.log("Processed Member ID:", memberId);
    console.log("Processed Role ID:", roleId);

    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [showWorkspacePopup, setShowWorkspacePopup] = useState(false);
    const [showAllWorkspaces, setShowAllWorkspaces] = useState(true);
    const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (memberId === null || isNaN(memberId)) {
            console.log('User memberId not available or invalid, skipping workspace load.');
            setIsLoading(false);
            if (memberId === null) setError(null);
            return;
        }

        const loadWorkspaces = async () => {
            try {
                setIsLoading(true);
                const fetchedWorkspaces = await getWorkspacesByMember(memberId);
                const mapped = (fetchedWorkspaces || []).map(ws => ({
                    id: ws.workspaceId,
                    name: ws.workspaceName,
                    boards: ws.boards || []
                }));
                setWorkspaces(mapped);
                setError(null);
            } catch (err) {
                console.error('Workspace load error:', err);
                setError(
                    err.response?.data?.message ||
                    'Çalışma alanları yüklenirken hata oluştu'
                );
                setWorkspaces([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadWorkspaces();
    }, [memberId]);

    useEffect(() => {
        if (!selectedWorkspace?.id || memberId === null || isNaN(memberId)) return;

        const loadBoards = async () => {
            try {
                const fetchedBoards = await getBoardsByWorkspace(selectedWorkspace.id);
                // Panoları map'leyerek boardId'yi id'ye dönüştürün
                const mappedBoards = fetchedBoards.map(board => ({
                    id: board.boardId,
                    title: board.title,
                    bgColor: board.bgColor,
                    memberId: board.memberId,
                    workspaceId: board.workspaceId,
                }));
                setSelectedWorkspace(prev => ({ ...prev, boards: mappedBoards }));
            } catch (error) {
                console.error('Boards load error:', error);
                alert('Panolar yüklenirken hata oluştu.');
            }
        };

        loadBoards();
    }, [selectedWorkspace?.id, memberId]);

    const handleAddWorkspace = async (name) => {
        try {
            if (!name?.trim()) {
                throw new Error('Çalışma alanı adı boş olamaz');
            }
            if (memberId === null || isNaN(memberId)) {
                throw new Error('Kullanıcı bilgisi eksik veya geçersiz');
            }

            const response = await createWorkspace({
                memberId: memberId,
                workspaceName: name.trim()
            });

            setWorkspaces(prev => [
                ...prev,
                {
                    id: response.workspaceId,
                    name: response.workspaceName,
                    boards: []
                }
            ]);
            setShowWorkspacePopup(false);
        } catch (error) {
            console.error('Workspace oluşturma hatası:', {
                error: error.response?.data || error.message,
                sentData: { memberId: memberId, workspaceName: name }
            });
            setError(error.response?.data?.message || error.message);
            alert(error.response?.data?.message || 'Çalışma alanı oluşturulurken hata oluştu');
        }
    };

    const handleAddBoard = async (boardData) => {
        if (!selectedWorkspace) {
            console.error("Selected workspace is missing for board creation.");
            alert("Pano oluşturmak için bir çalışma alanı seçmelisiniz.");
            return;
        }

        try {
            const newBoardResponse = await createBoard({
                workspaceId: selectedWorkspace.id,
                title: boardData.title,
                bgColor: boardData.bgColor,
            });

            // API'den dönen boardId'yi frontend'in beklediği id'ye dönüştürme
            const newBoard = {
                id: newBoardResponse.boardId,
                title: newBoardResponse.title,
                bgColor: newBoardResponse.bgColor,
                memberId: newBoardResponse.memberId,
                workspaceId: newBoardResponse.workspaceId,
            };

            setWorkspaces(prev => prev.map(ws =>
                ws.id === selectedWorkspace.id
                    ? { ...ws, boards: [...(ws.boards || []), newBoard] }
                    : ws
            ));
            setSelectedWorkspace(prev => ({
                ...prev,
                boards: [...(prev.boards || []), newBoard]
            }));
        } catch (error) {
            console.error('Board creation error:', error);
            alert(error.response?.data?.message || 'Pano oluşturulurken hata oluştu');
        }
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
            alert('Çalışma alanı silindi (Bu işlem sadece UI tarafında yapıldı, API entegrasyonu gereklidir).');
        }
    };

    const handleOpenSettings = () => setShowSettingsDrawer(true);
    const handleCloseSettings = () => setShowSettingsDrawer(false);

    if (isLoading) return <div className='loading'>Yükleniyor...</div>;
    if (error) return <div className='error'>{error}</div>;

    return (
        <div className="workspace-container" data-theme={theme}>
            <WorkspaceSidebar
                workspaces={workspaces}
                selectedWorkspace={selectedWorkspace}
                onSelectWorkspace={handleWorkspaceSelect}
                onShowAllWorkspaces={() => {
                    setSelectedWorkspace(null);
                    setShowAllWorkspaces(true);
                }}
                onAddWorkspaceClick={() => setShowWorkspacePopup(true)}
                onDeleteWorkspace={handleDeleteWorkspace}
                onOpenSettings={handleOpenSettings}
                isDarkTheme={theme === 'dark'}
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
                                    <p>{workspace.boards?.length || 0} Pano</p>
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
                        <Board
                            boards={selectedWorkspace.boards}
                            workspaceId={selectedWorkspace.id}
                            onCreateBoardSubmit={handleAddBoard}
                        />
                    </div>
                ) : null}
            </main>

            {showWorkspacePopup && (
                <WorkspacePopup
                    onClose={() => setShowWorkspacePopup(false)}
                    onSubmit={handleAddWorkspace}
                />
            )}

            <Settings open={showSettingsDrawer} onClose={handleCloseSettings} />
        </div>
    );
}
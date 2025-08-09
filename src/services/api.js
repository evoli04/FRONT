import apiClient from './apiClient'

// ——— Auth ———
export const login = credentials =>
  apiClient.post('/api/auth/login', credentials).then(res => res.data)

export const register = data =>
  apiClient.post('/api/auth/signup', data).then(res => res.data)

export const forgotPassword = email =>
  apiClient
    .post('/api/auth/forgot-password', { email })
    .then(res => res.data)
    .catch(error => {
      console.error('Forgot password error:', error.response?.data)
      throw new Error(
        error.response?.data?.message || 'Şifre sıfırlama isteği gönderilemedi'
      )
    })

export const resetPassword = async (currentPassword, newPassword) => {
  try {
    // api yerine apiClient kullanılıyor
    const response = await apiClient.post('/api/auth/reset-password', {
      currentPassword,
      newPassword,
      confirmPassword: newPassword,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Şifre değiştirme işlemi sırasında bir hata oluştu.';
    console.error('API Error:', error.response);
    throw new Error(errorMessage);
  }
};

// ——— Google Auth ———
export const googleAuth = token =>
  apiClient.post('/api/auth/google', { token }).then(res => res.data)

export const testGoogleAuth = () =>
  apiClient.get('/api/auth/google/test').then(res => res.data)

// ——— Admin ———
export const getAdminDashboard = () =>
  apiClient.get('/api/admin/dashboard').then(res => res.data)

export const getAdminWorkspaces = () =>
  apiClient.get('/api/admin/workspaces').then(res => res.data)

export const getAdminWorkspacesCount = () =>
  apiClient.get('/api/admin/workspaces/count').then(res => res.data)

export const getAdminUsersActiveCount = () =>
  apiClient.get('/api/admin/users/active/count').then(res => res.data)

// ——— Workspaces ———

export const createWorkspace = async data => {
  try {
    console.log("API'ye gönderilen veri:", data) // Log ekleyin

    const response = await apiClient.post('/api/workspaces', {
      memberId: Number(data.memberId), // Sayıya dönüştür
      workspaceName: String(data.workspaceName).trim() // String ve trim
    })

    console.log('API yanıtı:', response.data) // Log ekleyin
    return response.data
  } catch (error) {
    console.error('API hatası:', {
      requestData: data,
      error: error.response?.data || error.message
    })
    throw error
  }
}

export const getWorkspacesByMember = memberId =>
  apiClient.get(`/api/workspaces/member/${memberId}`).then(res => res.data)

// ——— Membership ———
export const createMembership = data =>
  apiClient.post('/api/membership', data).then(res => res.data)

export const getMembershipsByWorkspace = workspaceId =>
  apiClient
    .get(`/api/membership/workspace/${workspaceId}`)
    .then(res => res.data)

export const deleteMembership = id =>
  apiClient.delete(`/api/membership/${id}`).then(res => res.data)

// ——— Workspace Members ———
export const updateWorkspaceMemberRole = (id, data) =>
  apiClient.put(`/api/workspace-members/${id}/role`, data).then(res => res.data)

export const inviteWorkspaceMember = data =>
  apiClient.post('/api/workspace-members/invite', data).then(res => res.data)

export const getWorkspaceMembers = workspaceId =>
  apiClient
    .get(`/api/workspace-members/workspace/${workspaceId}`)
    .then(res => res.data)

export const getWorkspaceMember = memberId =>
  apiClient
    .get(`/api/workspace-members/member/${memberId}`)
    .then(res => res.data)

export const deleteWorkspaceMember = id =>
  apiClient.delete(`/api/workspace-members/${id}`).then(res => res.data)

// ——— Roles ———
export const getRole = id =>
  apiClient.get(`/api/roles/${id}`).then(res => res.data)

export const updateRole = (id, data) =>
  apiClient.put(`/api/roles/${id}`, data).then(res => res.data)

export const deleteRole = id =>
  apiClient.delete(`/api/roles/${id}`).then(res => res.data)

export const getRoles = () => apiClient.get('/api/roles').then(res => res.data)

export const createRole = data =>
  apiClient.post('/api/roles', data).then(res => res.data)

// ——— Boards ———
export const getBoardsByWorkspace = (workspaceId, memberId) => {
  if (!workspaceId || isNaN(Number(workspaceId))) {
    return Promise.reject(new Error('Geçersiz çalışma alanı ID'));
  }

  return apiClient
    .get(`/api/boards/workspace/${workspaceId}`, {
      params: { memberId }
    })
    .then(res => res.data)
    .catch(error => {
      console.error('Boards fetch error:', error);
      throw new Error('Panolar alınırken hata oluştu');
    });
};

export const createBoard = async (boardData) => {
  try {
    const response = await apiClient.post('/api/boards', {
      workspaceId: boardData.workspaceId,
      bgColor: boardData.bgColor,
      title: boardData.title,
      roleId: boardData.roleId,
      memberId: boardData.memberId
    });
    return response.data;
  } catch (error) {
    console.error('Create board error:', error);
    throw new Error(error.response?.data?.message || 'Pano oluşturulurken hata oluştu');
  }
};

export const updateBoard = (boardId, data) =>
  apiClient
    .put(`/api/boards/${boardId}`, {
      title: data.title,
      bgColor: data.bgColor,
      memberId: data.memberId,
      roleId: data.roleId
    })
    .then(res => res.data);

export const deleteBoard = (boardId, memberId) =>
  apiClient
    .delete(`/api/boards/${boardId}`, {
      params: { memberId }
    })
    .then(res => res.data);

export const promoteBoardLeader = (boardId, memberId, requesterId) =>
  apiClient
    .post(`/api/boards/${boardId}/promote-leader`, null, {
      params: { memberId, requesterId }
    })
    .then(res => res.data);

// Board Member Endpoints
export const addBoardMember = (boardId, workspaceId, memberId, requesterId) =>
  apiClient
    .post('/api/board-members/add', null, {
      params: { boardId, workspaceId, memberId, requesterId }
    })
    .then(res => res.data);

export const getBoardMembers = boardId =>
  apiClient
    .get('/api/board-members/list', {
      params: { boardId }
    })
    .then(res => res.data);

export const removeBoardMember = (boardId, memberId, requesterId) =>
  apiClient
    .delete('/api/board-members/remove', {
      params: { boardId, memberId, requesterId }
    })
    .then(res => res.data);


// ——— Lists ———
// BİR PANODAKİ TÜM LİSTELERİ GETİRİR (endpoint görselinize göre düzenlendi)
export const getListsByBoard = (boardId) =>
    apiClient.get(`/api/lists/board/${boardId}`).then(res => res.data);

// TEK BİR LİSTEYİ GÜNCELLE
export const updateList = (id, data) =>
    apiClient.put(`/api/lists/${id}`, data).then(res => res.data);

// TEK BİR LİSTEYİ SİL
export const deleteList = id =>
    apiClient.delete(`/api/lists/${id}`).then(res => res.data);

// TÜM LİSTELERİ GETİR (Genelde kullanılmaz, ancak API'de mevcut)
export const getLists = () => apiClient.get('/api/lists').then(res => res.data);

// YENİ LİSTE OLUŞTUR
export const createList = data =>
    apiClient.post('/api/lists', data).then(res => res.data);

// ——— Cards ———

export const getCardsByListId = (listId) =>
  apiClient.get(`/api/cards/list/${listId}`).then(res => res.data);

export const getCard = id =>
  apiClient.get(`/api/cards/${id}`).then(res => res.data)

export const updateCard = (id, data) =>
  apiClient.put(`/api/cards/${id}`, data).then(res => res.data)

export const deleteCard = id =>
  apiClient.delete(`/api/cards/${id}`).then(res => res.data)

export const getCards = () => apiClient.get('/api/cards').then(res => res.data)

export const createCard = data =>
  apiClient.post('/api/cards', data).then(res => res.data)


// ——— Labels ———
export const getLabels = () =>
  apiClient.get('/api/labels').then(res => res.data)

export const createLabel = data =>
  apiClient.post('/api/labels', data).then(res => res.data)

export const getLabel = id =>
  apiClient.get(`/api/labels/${id}`).then(res => res.data)

export const deleteLabel = id =>
  apiClient.delete(`/api/labels/${id}`).then(res => res.data)

// ——— Card Labels ———
export const getCardLabel = id =>
  apiClient.get(`/cardlabels/${id}`).then(res => res.data)

export const updateCardLabel = (id, data) =>
  apiClient.put(`/cardlabels/${id}`, data).then(res => res.data)

export const deleteCardLabel = id =>
  apiClient.delete(`/cardlabels/${id}`).then(res => res.data)

export const getCardLabels = () =>
  apiClient.get('/cardlabels').then(res => res.data)

export const createCardLabel = data =>
  apiClient.post('/cardlabels', data).then(res => res.data)

// ——— Checklists ———
export const getChecklist = checklistId =>
  apiClient.get(`/api/checklists/${checklistId}`).then(res => res.data)

export const updateChecklist = (checklistId, data) =>
  apiClient.put(`/api/checklists/${checklistId}`, data).then(res => res.data)

export const deleteChecklist = checklistId =>
  apiClient.delete(`/api/checklists/${checklistId}`).then(res => res.data)

export const createChecklist = data =>
  apiClient.post('/api/checklists', data).then(res => res.data)

export const getChecklistItems = checklistId =>
  apiClient.get(`/api/checklists/${checklistId}/items`).then(res => res.data)

export const createChecklistItem = (checklistId, data) =>
  apiClient
    .post(`/api/checklists/${checklistId}/items`, data)
    .then(res => res.data)

export const updateChecklistPosition = (checklistId, data) =>
  apiClient
    .patch(`/api/checklists/${checklistId}/position`, data)
    .then(res => res.data)

export const getChecklistItem = itemId =>
  apiClient.get(`/api/checklists/items/${itemId}`).then(res => res.data)

export const updateChecklistItem = (itemId, data) =>
  apiClient.put(`/api/checklists/items/${itemId}`, data).then(res => res.data)

export const deleteChecklistItem = itemId =>
  apiClient.delete(`/api/checklists/items/${itemId}`).then(res => res.data)

export const toggleChecklistItem = itemId =>
  apiClient
    .patch(`/api/checklists/items/${itemId}/toggle`)
    .then(res => res.data)

export const updateChecklistItemText = (itemId, data) =>
  apiClient
    .patch(`/api/checklists/items/${itemId}/text`, data)
    .then(res => res.data)

export const updateChecklistItemPosition = (itemId, data) =>
  apiClient
    .patch(`/api/checklists/items/${itemId}/position`, data)
    .then(res => res.data)

export const getChecklistProgress = checklistId =>
  apiClient.get(`/api/checklists/${checklistId}/progress`).then(res => res.data)

export const getChecklistDetails = checklistId =>
  apiClient.get(`/api/checklists/${checklistId}/details`).then(res => res.data)

export const getCardChecklists = cardId =>
  apiClient.get(`/api/checklists/card/${cardId}`).then(res => res.data)

export const deleteCompletedChecklistItems = checklistId =>
  apiClient
    .delete(`/api/checklists/${checklistId}/completed-items`)
    .then(res => res.data)

import { Button, CircularProgress, Paper, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ThemeContext } from '../App';
import '../components/css/Admin.css';
import '../components/css/Table.css';
import { getLogs } from '../services/api';

const AdminLogs = () => {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        source: '',
        logLevel: '',
        memberId: ''
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async (appliedFilters = filters) => {
        setIsLoading(true);
        try {
            const fetchedLogs = await getLogs(
                appliedFilters.source,
                appliedFilters.logLevel,
                appliedFilters.memberId
            );
            setLogs(fetchedLogs);
            toast.success(t('logs_loaded_successfully'));
        } catch (error) {
            console.error('Loglar çekilirken bir hata oluştu:', error);
            toast.error(t('error_loading_logs'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleApplyFilters = () => {
        fetchLogs(filters);
    };

    const handleResetFilters = () => {
        const resetFilters = { source: '', logLevel: '', memberId: '' };
        setFilters(resetFilters);
        fetchLogs(resetFilters);
    };

    if (isLoading) {
        return (
            <div className={`admin-logs-content ${theme}`}>
                <CircularProgress />
                <p>{t('loading_logs')}</p>
            </div>
        );
    }

    return (
        <div className={`admin-logs-content ${theme}`}>
            <h1 className="admin-logs-title" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                {t('logs')}
            </h1>

            <Paper 
                className="log-filters"
                sx={{ 
                    p: 2,
                    mb: 2,
                    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                }}
            >
                <TextField
                    type="text"
                    name="source"
                    label={t('filter_by_source')}
                    value={filters.source}
                    onChange={handleFilterChange}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2, width: 200 }}
                />
                <TextField
                    type="text"
                    name="logLevel"
                    label={t('filter_by_level')}
                    value={filters.logLevel}
                    onChange={handleFilterChange}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2, width: 200 }}
                />
                <TextField
                    type="number"
                    name="memberId"
                    label={t('filter_by_member_id')}
                    value={filters.memberId}
                    onChange={handleFilterChange}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2, width: 200 }}
                />
                <Button 
                    variant="contained" 
                    onClick={handleApplyFilters}
                    sx={{ mr: 2 }}
                >
                    {t('filter')}
                </Button>
                <Button 
                    variant="outlined" 
                    onClick={handleResetFilters}
                >
                    {t('reset')}
                </Button>
            </Paper>

            {logs.length > 0 ? (
                <Paper
                    sx={{ 
                        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                        color: theme === 'dark' ? '#ffffff' : '#000000'
                    }}
                >
                    <table className={`log-table ${theme}`}>
                        <thead>
                            <tr style={{ 
                                backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f5f5'
                            }}>
                                <th style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t('log_id')}</th>
                                <th style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t('log_source')}</th>
                                <th style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t('log_level')}</th>
                                <th style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t('log_message')}</th>
                                <th style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t('log_timestamp')}</th>
                                <th style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t('log_member_id')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr 
                                    key={log.logId}
                                    style={{ 
                                        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                                        '&:hover': {
                                            backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f5f5'
                                        }
                                    }}
                                >
                                    <td style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{log.logId}</td>
                                    <td style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{log.source}</td>
                                    <td style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{log.level}</td>
                                    <td style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{log.message}</td>
                                    <td style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{log.memberId || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Paper>
            ) : (
                <p style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t('no_logs_found')}</p>
            )}
        </div>
    );
};

export default AdminLogs;
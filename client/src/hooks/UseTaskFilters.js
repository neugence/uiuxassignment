import { useCallback, useMemo } from 'react';
import useTaskStore from '../store/taskStore';

const useTaskFilters = () => {
  const { filters, setFilters } = useTaskStore();

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((searchTerm) => {
      setFilters({ search: searchTerm });
    }, 300),
    [setFilters]
  );

  // Filter handlers
  const handleStatusFilter = useCallback((status) => {
    setFilters({ status });
  }, [setFilters]);

  const handleAssigneeFilter = useCallback((assignee) => {
    setFilters({ assignee });
  }, [setFilters]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      assignee: ''
    });
  }, [setFilters]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return activeFiltersCount > 0;
  }, [activeFiltersCount]);

  // Get current filter values
  const currentFilters = useMemo(() => ({
    search: filters.search || '',
    status: filters.status || '',
    assignee: filters.assignee || ''
  }), [filters]);

  // Filter options (can be extended based on your needs)
  const filterOptions = useMemo(() => ({
    status: [
      { value: '', label: 'All Statuses' },
      { value: 'Backlog', label: 'Backlog' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Paused', label: 'Paused' },
      { value: 'Ready for Launch', label: 'Ready for Launch' }
    ],
    assignee: [
      { value: '', label: 'All Assignees' },
      { value: 'user1@example.com', label: 'User 1' },
      { value: 'user2@example.com', label: 'User 2' }
    ]
  }), []);

  return {
    handleSearch,
    handleStatusFilter,
    handleAssigneeFilter,
    resetFilters,
    currentFilters,
    hasActiveFilters,
    activeFiltersCount,
    filterOptions
  };
};

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default useTaskFilters;
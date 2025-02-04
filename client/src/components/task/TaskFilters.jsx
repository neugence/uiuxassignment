import React, { useCallback } from "react";
import { Search, Filter } from "lucide-react";
import useTaskStore from "../../store/taskStore";

const TaskFilters = () => {
  const { filters, setFilters } = useTaskStore();

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters({ [key]: value });
    },
    [setFilters]
  );

  const debouncedSearch = useCallback(
    debounce((value) => handleFilterChange("search", value), 300),
    [handleFilterChange]
  );

  return <></>;
};

// Debounce utility function
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

export default TaskFilters;

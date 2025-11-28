import { useState, useCallback } from "react";
import { apiClient } from "../utils/api";

export const useTaskManagement = () => {
  const [tasksCache, setTasksCache] = useState({});

  const fetchTasks = useCallback(
    async (dateKey) => {
      if (tasksCache[dateKey]) {
        return tasksCache[dateKey];
      }

      const tasks = await apiClient.fetchTasks(dateKey);
      setTasksCache((prev) => ({ ...prev, [dateKey]: tasks }));
      return tasks;
    },
    [tasksCache]
  );

  const saveTasks = useCallback(async (dateKey, tasks) => {
    setTasksCache((prev) => ({ ...prev, [dateKey]: tasks }));
    await apiClient.saveTasks(dateKey, tasks);
  }, []);

  const updateTasksCache = useCallback((dateKey, tasks) => {
    setTasksCache((prev) => ({ ...prev, [dateKey]: tasks }));
  }, []);

  return { fetchTasks, saveTasks, updateTasksCache, tasksCache };
};

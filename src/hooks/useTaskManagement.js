import { useState, useCallback, useRef } from "react";
import { apiClient } from "../utils/api";

export const useTaskManagement = () => {
  const cacheRef = useRef({});

  const fetchTasks = useCallback(async (dateKey) => {
    // Check cache first - if exists, return immediately without API call
    if (cacheRef.current[dateKey]) {
      return cacheRef.current[dateKey];
    }

    // Make API call only if not in cache
    const tasks = await apiClient.fetchTasks(dateKey);
    
    // Store in cache
    cacheRef.current[dateKey] = tasks;
    
    return tasks;
  }, []);

  const saveTasks = useCallback(async (dateKey, tasks) => {
    // Update cache immediately
    cacheRef.current[dateKey] = tasks;
    
    // Then save to API
    await apiClient.saveTasks(dateKey, tasks);
  }, []);

  const updateTasksCache = useCallback((dateKey, tasks) => {
    cacheRef.current[dateKey] = tasks;
  }, []);

  return { fetchTasks, saveTasks, updateTasksCache, tasksCache: cacheRef.current };
};

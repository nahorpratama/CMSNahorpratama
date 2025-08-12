
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabaseAdapter from '@/services/supabaseAdapter';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [equipment, setEquipment] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(true);

  const fetchEquipment = useCallback(async () => {
    setLoadingEquipment(true);
    const data = await supabaseAdapter.getAllEquipment();
    setEquipment(data);
    setLoadingEquipment(false);
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const createEquipment = useCallback(async (equipmentData) => {
    const result = await supabaseAdapter.createEquipment(equipmentData);
    if (result.success) {
      setEquipment(prev => [result.data, ...prev]);
    }
    return result;
  }, []);

  const updateEquipment = useCallback(async (id, equipmentData) => {
    const result = await supabaseAdapter.updateEquipment(id, equipmentData);
    if (result.success) {
      setEquipment(prev => prev.map(item => item.id === id ? result.data : item));
    }
    return result;
  }, []);

  const deleteEquipment = useCallback(async (id) => {
    const result = await supabaseAdapter.deleteEquipment(id);
    if (result.success) {
      setEquipment(prev => prev.filter(item => item.id !== id));
    }
    return result;
  }, []);
  
  const batchUploadEquipment = useCallback(async (equipmentList) => {
    const result = await supabaseAdapter.batchUploadEquipment(equipmentList);
    if (result.success) {
      // A simple refetch is easiest here, as upsert can be complex to merge manually
      await fetchEquipment(); 
    }
    return result;
  }, [fetchEquipment]);

  const dbService = {
    ...supabaseAdapter,
    equipment,
    loadingEquipment,
    fetchEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    batchUploadEquipment,
  };

  return (
    <DatabaseContext.Provider value={dbService}>
      {children}
    </DatabaseContext.Provider>
  );
};

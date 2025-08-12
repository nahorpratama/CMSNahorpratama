import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskTable from '@/components/project/TaskTable';
import { projectData } from '@/data/projectData';

const TaskManagement = () => {
  const { tasks } = projectData;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Task Management
        </h1>
        <p className="text-gray-400">
          Manajemen task dengan fitur edit dan approval
        </p>
      </motion.div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="glass-effect">
          <TabsTrigger value="all">Semua Task</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TaskTable tasks={tasks} />
        </TabsContent>

        <TabsContent value="pending">
          <TaskTable tasks={tasks.filter(task => task.status === 'pending')} />
        </TabsContent>

        <TabsContent value="in-progress">
          <TaskTable tasks={tasks.filter(task => task.status === 'in-progress')} />
        </TabsContent>

        <TabsContent value="completed">
          <TaskTable tasks={tasks.filter(task => task.status === 'completed')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskManagement;
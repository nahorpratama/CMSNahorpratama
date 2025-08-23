import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckSquare, Calendar, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { projectData } from '@/data/projectData';
import { formatCurrency, getStatusColor, getPriorityColor } from '@/utils/projectUtils';
import { DataCard, ContentGrid } from '@/components/ui/dashboard-card';

const ProjectOverview = () => {
  const { projects, tasks, metrics } = projectData;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <ContentGrid cols={2}>
        {/* Proyek Aktif */}
        <DataCard title="Proyek Aktif" variant="elevated">
          <div className="space-y-4">
            {projects.filter(project => project.status === 'in-progress').map((project) => (
              <div key={project.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors border border-border/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-card-foreground">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status === 'in-progress' ? 'Berlangsung' : project.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-card-foreground font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-emerald-600 font-medium">Budget: {formatCurrency(project.budget)}</span>
                  <span className="text-blue-600 font-medium">Profit: {formatCurrency(project.profit)}</span>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* Task Terbaru */}
        <DataCard title="Task Terbaru" variant="elevated">
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-card-foreground">{task.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Due: {task.dueDate}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status === 'completed' ? 'Selesai' : task.status === 'in-progress' ? 'Berlangsung' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </ContentGrid>

      {/* Project Statistics */}
      <DataCard title="Statistik Proyek" variant="elevated">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">{projects.length}</h3>
            <p className="text-sm text-muted-foreground">Total Proyek</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">{tasks.filter(t => t.status === 'completed').length}</h3>
            <p className="text-sm text-muted-foreground">Task Selesai</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground">
              {projects.reduce((acc, p) => acc + (p.teamSize || 0), 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Team</p>
          </div>
        </div>
      </DataCard>
    </motion.div>
  );
};

export default ProjectOverview;
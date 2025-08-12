import React from 'react';
import { Clock, Edit, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { projectData } from '@/data/projectData';
import { getStatusColor, getPriorityColor } from '@/utils/projectUtils';

const TaskTable = ({ tasks }) => {
  const { toast } = useToast();
  const { projects } = projectData;

  const handleEditProject = (id) => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  const handleApproveTransaction = (id) => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Daftar Task</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Proyek</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Due Date</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <tr key={task.id}>
                    <td>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-gray-400">{task.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {project?.name}
                      </span>
                    </td>
                    <td className="font-medium">{task.assignee}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <div className="w-20">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">
                          {new Date(task.dueDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProject(task.id)}
                          className="text-blue-400 border-blue-400/30 hover:bg-blue-400/20"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {task.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveTransaction(task.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTable;
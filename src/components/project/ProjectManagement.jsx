import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Edit,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { projectData } from '@/data/projectData';
import { formatCurrency, getStatusColor } from '@/utils/projectUtils';

const ProjectManagement = () => {
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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Manajemen Proyek
        </h1>
        <p className="text-gray-400">
          Detail proyek dengan biaya operasional dan keuntungan
        </p>
      </motion.div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="glass-effect">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <p className="text-gray-400 mt-1">{project.client}</p>
                </div>
                <span className={`status-badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-300">{project.description}</p>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Timeline</span>
                  </div>
                  <p className="text-sm">
                    {new Date(project.startDate).toLocaleDateString('id-ID')} - 
                    {new Date(project.endDate).toLocaleDateString('id-ID')}
                  </p>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Budget</span>
                  </div>
                  <p className="text-sm font-semibold text-green-400">
                    {formatCurrency(project.budget)}
                  </p>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-400">Spent</span>
                  </div>
                  <p className="text-sm font-semibold text-red-400">
                    {formatCurrency(project.spent)}
                  </p>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Profit</span>
                  </div>
                  <p className="text-sm font-semibold text-purple-400">
                    {formatCurrency(project.profit)}
                  </p>
                </div>
              </div>

              {/* Team */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Team Members
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.team.map((member, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => handleEditProject(project.id)}
                  className="text-blue-400 border-blue-400/30 hover:bg-blue-400/20"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {project.status === 'in-progress' && (
                  <Button
                    onClick={() => handleApproveTransaction(project.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectManagement;
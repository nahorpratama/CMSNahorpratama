import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Edit, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { projectData } from '@/data/projectData';
import { formatCurrency } from '@/utils/projectUtils';

const ProjectTransactions = () => {
  const { toast } = useToast();
  const { projects, projectTransactions } = projectData;

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
          Transaksi Proyek
        </h1>
        <p className="text-gray-400">
          Detail transaksi proyek yang terhubung dengan data keuangan
        </p>
      </motion.div>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Daftar Transaksi Proyek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Proyek</th>
                  <th>Deskripsi</th>
                  <th>Tipe</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {projectTransactions.map((transaction) => {
                  const project = projects.find(p => p.id === transaction.projectId);
                  return (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString('id-ID')}</td>
                      <td>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {project?.name}
                        </span>
                      </td>
                      <td className="font-medium">{transaction.description}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </div>
                      </td>
                      <td className="font-semibold">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          transaction.status === 'completed' ? 'status-approved' : 'status-pending'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProject(transaction.id)}
                            className="text-blue-400 border-blue-400/30 hover:bg-blue-400/20"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          {transaction.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveTransaction(transaction.id)}
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
    </div>
  );
};

export default ProjectTransactions;

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Users, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const GroupManageModal = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { groupChats, loadGroupChats } = useChat();
  const dbService = useDatabase();
  const { toast } = useToast();

  const handleDeleteGroup = async (groupId) => {
    try {
      const result = await dbService.deleteGroupChat(groupId, user.id);
      if (result.success) {
        toast({ title: "Berhasil", description: "Grup berhasil dihapus." });
        loadGroupChats?.();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus grup.", variant: "destructive" });
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const result = await dbService.leaveGroupChat(groupId, user.id);
      if (result.success) {
        toast({ title: "Berhasil", description: "Berhasil keluar dari grup." });
        loadGroupChats?.();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal keluar dari grup.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Kelola Grup Chat</DialogTitle>
          <DialogDescription>
            Kelola grup chat yang Anda ikuti atau yang Anda buat.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <Label>Grup Yang Anda Ikuti</Label>
              <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-600 rounded-md p-2 bg-slate-800">
                {groupChats.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Anda belum bergabung dengan grup manapun.</p>
                ) : (
                  groupChats.map(group => (
                    <div key={group.id} className="flex items-center justify-between p-3 hover:bg-slate-700 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{group.name}</p>
                          <p className="text-xs text-gray-400">
                            Dibuat: {new Date(group.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {group.created_by === user.id ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Grup</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus grup "{group.name}"? 
                                  Semua pesan dalam grup akan dihapus dan tidak dapat dikembalikan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteGroup(group.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus Grup
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Keluar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Keluar dari Grup</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin keluar dari grup "{group.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleLeaveGroup(group.id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Keluar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupManageModal;

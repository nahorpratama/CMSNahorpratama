
import { supabase } from '@/lib/customSupabaseClient';

const supabaseAdapter = {
  login: async (credential, password) => {
    let email;
    const isEmail = credential.includes('@');

    if (isEmail) {
      email = credential.toLowerCase();
    } else {
      const username = credential.toLowerCase();
      const { data, error } = await supabase
        .from('profiles')
        .select('user_email:users(email)')
        .eq('username', username)
        .single();
      
      if (error || !data || !data.user_email) {
        console.error('Error fetching user by username:', error);
        return { success: false, error: 'Username tidak ditemukan.' };
      }
      email = data.user_email.email;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      return { success: false, error: 'Email atau password salah.' };
    }

    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  onAuthStateChanged: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return subscription;
  },
  
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        name,
        role,
        permissions,
        category
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
      return data;
  },

  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        name,
        role,
        category
      `);

    if (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
    return data;
  },

  createUser: async (userData) => {
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: userData,
    });
    if (error) return { success: false, error: error.message };
    if (data.error) return { success: false, error: data.error };
    return { success: true, data };
  },
  
  updateUser: async (userId, userData) => {
    const { data, error } = await supabase.functions.invoke('update-user', {
      body: { userId, userData },
    });
    if (error) return { success: false, error: error.message };
    if (data.error) return { success: false, error: data.error };
    return { success: true, data };
  },

  deleteUser: async (userId) => {
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: { userId },
    });
    if (error) return { success: false, error: error.message };
    if (data.error) return { success: false, error: data.error };
    return { success: true, data };
  },

  // Procurement Functions
  getAllEquipment: async () => {
    const { data, error } = await supabase.from('equipment').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
    return data;
  },

  createEquipment: async (equipmentData) => {
    const { data, error } = await supabase.functions.invoke('create-equipment', {
      body: { equipmentData },
    });
    if (error) return { success: false, error: error.message };
    if (data.error) return { success: false, error: data.error };
    return { success: true, data: data.data };
  },

  updateEquipment: async (equipmentId, equipmentData) => {
    const { data, error } = await supabase.functions.invoke('update-equipment', {
      body: { equipmentId, equipmentData },
    });
    if (error) return { success: false, error: error.message };
    if (data.error) return { success: false, error: data.error };
    return { success: true, data: data.data };
  },

  deleteEquipment: async (equipmentId) => {
    const { data, error } = await supabase.functions.invoke('delete-equipment', {
      body: { equipmentId },
    });
    if (error) return { success: false, error: error.message };
    if (data.error) return { success: false, error: data.error };
    return { success: true };
  },

  batchUploadEquipment: async (equipmentList) => {
    const { data, error } = await supabase.functions.invoke('batch-upload-equipment', {
      body: { equipmentList },
    });
    if (error) return { success: false, error: error.message };
    if (data.error) return { success: false, error: data.error };
    return { success: true, count: data.count };
  },

  // Chat Functions
  listenToMessages: (chatId, type, callback) => {
    // This is now handled in ChatContext with proper real-time channels
    return { unsubscribe: () => {} };
  },

  sendMessage: async (chatId, type, messageData) => {
    try {
      // Prepare message data
      const messagePayload = {
        chat_type: type,
        text: messageData.text,
        user_id: messageData.userId
      };

      // Add chat_id for non-global messages
      if (type !== 'global') {
        messagePayload.chat_id = chatId;
      }

      // Add file data if exists
      if (messageData.file) {
        messagePayload.file_url = messageData.file.url;
        messagePayload.file_name = messageData.file.name;
        messagePayload.file_type = messageData.file.type;
      }

      console.log('Sending message:', messagePayload);

      const { data, error } = await supabase
        .from('messages')
        .insert(messagePayload)
        .select(`
          id,
          text,
          file_url,
          file_name,
          file_type,
          created_at,
          user_id,
          chat_id,
          chat_type
        `)
        .single();
      
      if (error) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message };
      }
      
      console.log('Message sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return { success: false, error: error.message };
    }
  },

  deleteMessage: async (chatId, messageId, type) => {
    try {
      // First verify the message belongs to the current user
      const { data: messageData, error: fetchError } = await supabase
        .from('messages')
        .select('user_id, file_url')
        .eq('id', messageId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching message:', fetchError);
        return { success: false, error: 'Pesan tidak ditemukan' };
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || messageData.user_id !== user.id) {
        return { success: false, error: 'Anda tidak memiliki izin untuk menghapus pesan ini' };
      }
      
      // Delete file from storage if exists
      if (messageData.file_url) {
        const fileName = messageData.file_url.split('/').pop();
        const filePath = `chat-files/${fileName}`;
        
        const { error: storageError } = await supabase.storage
          .from('chat-files')
          .remove([filePath]);
          
        if (storageError) {
          console.warn('Error deleting file from storage:', storageError);
          // Don't fail the whole operation if file deletion fails
        }
      }
      
      // Delete the message
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (deleteError) {
        console.error('Error deleting message:', deleteError);
        return { success: false, error: deleteError.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return { success: false, error: error.message };
    }
  },
  
  createGroupChat: async (name, memberIds) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Create group chat
      const { data: groupData, error: groupError } = await supabase
        .from('group_chats')
        .insert({
          name: name.trim(),
          created_by: user.id
        })
        .select()
        .single();
      
      if (groupError) {
        console.error('Error creating group chat:', groupError);
        return { success: false, error: groupError.message };
      }
      
      // Add creator and members to group
      const allMemberIds = [user.id, ...memberIds.filter(id => id !== user.id)];
      const memberInserts = allMemberIds.map(userId => ({
        group_id: groupData.id,
        user_id: userId
      }));
      
      const { error: memberError } = await supabase
        .from('group_members')
        .insert(memberInserts);
      
      if (memberError) {
        console.error('Error adding group members:', memberError);
        // Rollback group creation
        await supabase.from('group_chats').delete().eq('id', groupData.id);
        return { success: false, error: memberError.message };
      }
      
      return { success: true, data: groupData };
    } catch (error) {
      console.error('Error creating group chat:', error);
      return { success: false, error: error.message };
    }
  },

  getUserGroupChats: async (userId) => {
    try {
      // Get user's group memberships dengan join
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          group_chats (
            id,
            name,
            created_at,
            created_by
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading user group chats:', error);
        return [];
      }

      // Extract group data
      const groups = data?.map(item => item.group_chats).filter(Boolean) || [];
      return groups;
    } catch (error) {
      console.error('Error in getUserGroupChats:', error);
      return [];
    }
  },

  listenToUserGroups: (userId, callback) => {
    // Simple implementation without complex joins
    return { 
      unsubscribe: () => {}
    };
  },

  getMessages: async (chatId, type) => {
    let query = supabase
      .from('messages')
      .select(`
        id,
        text,
        file_url,
        file_name,
        file_type,
        created_at,
        user_id,
        profiles:user_id (
          name,
          username
        )
      `)
      .order('created_at', { ascending: true });

    if (type === 'global') {
      query = query.eq('chat_type', 'global');
    } else {
      query = query.eq('chat_id', chatId).eq('chat_type', type);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    return data || [];
  },

  deleteGroupChat: async (groupId, userId) => {
    try {
      // Verify user is the creator or admin
      const { data: groupData, error: groupError } = await supabase
        .from('group_chats')
        .select('created_by')
        .eq('id', groupId)
        .single();
        
      if (groupError) {
        return { success: false, error: 'Grup tidak ditemukan' };
      }
      
      if (groupData.created_by !== userId) {
        return { success: false, error: 'Hanya pembuat grup yang dapat menghapus grup ini' };
      }
      
      // Delete all messages in the group
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('chat_id', groupId)
        .eq('chat_type', 'group');
        
      if (messagesError) {
        console.warn('Error deleting group messages:', messagesError);
      }
      
      // Delete group members
      const { error: membersError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId);
        
      if (membersError) {
        return { success: false, error: membersError.message };
      }
      
      // Delete the group
      const { error: deleteError } = await supabase
        .from('group_chats')
        .delete()
        .eq('id', groupId);
      
      if (deleteError) {
        return { success: false, error: deleteError.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting group chat:', error);
      return { success: false, error: error.message };
    }
  },

  leaveGroupChat: async (groupId, userId) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error leaving group chat:', error);
      return { success: false, error: error.message };
    }
  },
};

export default supabaseAdapter;

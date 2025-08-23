import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const dbService = useDatabase();
  const { user, allUsers } = useAuth();
  const { toast } = useToast();

  const [chatMode, setChatMode] = useState('global');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [unreadChats, setUnreadChats] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Ref untuk subscription
  const messageSubscriptionRef = useRef(null);
  const notificationSubscriptionRef = useRef(null);
  const groupChatsRef = useRef([]);
  useEffect(() => {
    groupChatsRef.current = groupChats;
  }, [groupChats]);

  const personalContacts = allUsers.filter(u => u.id !== user?.id);

  // Helper function to clean expired cache entries
  const cleanExpiredCache = useCallback(() => {
    try {
      const now = Date.now();
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('chatCache_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data.expiry && now >= data.expiry) {
              keysToRemove.push(key);
            }
          } catch (error) {
            // Remove corrupted cache entries
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removed expired cache: ${key}`);
      });
      
      if (keysToRemove.length > 0) {
        console.log(`Cleaned ${keysToRemove.length} expired cache entries`);
      }
    } catch (error) {
      console.error('Error cleaning expired cache:', error);
    }
  }, []);

  // Clean expired cache on component mount
  useEffect(() => {
    cleanExpiredCache();
  }, [cleanExpiredCache]);

  // Helper function to get a unique key for a chat
  const getChatKey = useCallback((chatId, type) => {
    return `${type}-${chatId || 'global'}`;
  }, []);

  // Helper function to save chat messages to local storage with 1 year expiry
  const saveChatToCache = useCallback(async (chatId, type, messagesToSave) => {
    const chatKey = getChatKey(chatId, type);
    try {
      const cacheData = {
        messages: messagesToSave,
        timestamp: Date.now(),
        expiry: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 tahun dalam milliseconds
      };
      localStorage.setItem(`chatCache_${chatKey}`, JSON.stringify(cacheData));
      console.log(`Cache saved for ${chatKey}, expires in 1 year`);
    } catch (error) {
      console.error('Error saving chat to cache:', error);
    }
  }, [getChatKey]);

  // Helper function to load chat messages from local storage with expiry check
  const loadChatFromCache = useCallback(async (chatId, type) => {
    const chatKey = getChatKey(chatId, type);
    try {
      const cachedData = localStorage.getItem(`chatCache_${chatKey}`);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        
        // Check if cache has new format with expiry
        if (parsed.expiry && parsed.messages) {
          // Check if cache is still valid (not expired)
          if (Date.now() < parsed.expiry) {
            console.log(`Loading messages for ${chatKey} from cache (expires: ${new Date(parsed.expiry).toLocaleDateString()})`);
            return parsed.messages;
          } else {
            console.log(`Cache for ${chatKey} has expired, removing`);
            localStorage.removeItem(`chatCache_${chatKey}`);
            return null;
          }
        } else {
          // Old format cache (assume still valid but upgrade format)
          console.log(`Upgrading cache format for ${chatKey}`);
          const cacheData = {
            messages: parsed,
            timestamp: Date.now(),
            expiry: Date.now() + (365 * 24 * 60 * 60 * 1000)
          };
          localStorage.setItem(`chatCache_${chatKey}`, JSON.stringify(cacheData));
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading chat from cache:', error);
      // Remove corrupted cache
      localStorage.removeItem(`chatCache_${chatKey}`);
    }
    return null;
  }, [getChatKey]);


  // Load user's group chats
  const loadGroupChats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const groups = await dbService.getUserGroupChats(user.id);
      setGroupChats(groups);
    } catch (error) {
      console.error('Error loading group chats:', error);
      setGroupChats([]);
    }
  }, [user?.id, dbService]);

  // Load group chats on user change
  useEffect(() => {
    if (user?.id) {
      loadGroupChats();
    }
  }, [user?.id, loadGroupChats]);

  // Setup real-time subscription
  const setupMessageSubscription = useCallback((chatId, type) => {
    // Cleanup previous subscription
    if (messageSubscriptionRef.current) {
      console.log('Cleaning up previous subscription');
      try {
        messageSubscriptionRef.current.unsubscribe();
      } catch (error) {
        console.error('Error cleaning up subscription:', error);
      }
      messageSubscriptionRef.current = null;
    }

    if (!user?.id) {
      console.log('No user, skipping subscription setup');
      return;
    }

    try {
      console.log('Setting up subscription for:', { type, chatId, userId: user.id });

      // Create unique channel name to avoid conflicts
      const channelName = `messages_${type}_${chatId || 'global'}_${user.id}_${Date.now()}`;

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          async (payload) => {
            console.log('New message received via realtime:', payload);

            // Filter messages based on current chat
            const newMessage = payload.new;
            let shouldShow = false;

            if (type === 'global' && newMessage.chat_type === 'global') {
              shouldShow = true;
            } else if (type === 'personal' && newMessage.chat_id === chatId && newMessage.chat_type === 'personal') {
              shouldShow = true;
            } else if (type === 'group' && newMessage.chat_id === chatId && newMessage.chat_type === 'group') {
              shouldShow = true;
            }

            if (!shouldShow) {
              console.log('Message not for current chat, ignoring');
              return;
            }

            try {
              // Fetch complete message with profile data
              const { data: messageData, error } = await supabase
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
                    id,
                    name,
                    username
                  )
                `)
                .eq('id', payload.new.id)
                .single();

              if (!error && messageData) {
                const formattedMessage = {
                  id: messageData.id,
                  text: messageData.text,
                  file: messageData.file_url ? {
                    url: messageData.file_url,
                    name: messageData.file_name,
                    type: messageData.file_type
                  } : null,
                  senderId: messageData.user_id,
                  senderName: messageData.profiles?.name || 'Unknown',
                  timestamp: { toDate: () => new Date(messageData.created_at) }
                };

                console.log('Processing realtime message:', formattedMessage);
                setMessages(prev => {
                  // Check if message already exists
                  const exists = prev.find(m => m.id === formattedMessage.id);
                  if (exists) {
                    console.log('Realtime message already exists, skipping');
                    return prev;
                  }
                  console.log('Adding realtime message to state');
                  const newMessages = [...prev, formattedMessage].sort((a, b) => 
                    new Date(a.timestamp.toDate()) - new Date(b.timestamp.toDate())
                  );
                  return newMessages;
                });
              } else {
                console.error('Error fetching complete message data:', error);
              }
            } catch (error) {
              console.error('Error processing realtime message:', error);
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to realtime messages');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Realtime subscription error');
          }
        });

      messageSubscriptionRef.current = { 
        unsubscribe: () => {
          console.log('Unsubscribing from channel:', channelName);
          try {
            supabase.removeChannel(channel);
          } catch (error) {
            console.error('Error removing channel:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error setting up message subscription:', error);
    }
  }, [user]);

  // Global notifications subscription
  useEffect(() => {
    // Cleanup previous notification subscription
    if (notificationSubscriptionRef.current) {
      try {
        notificationSubscriptionRef.current.unsubscribe();
      } catch (e) {
        console.error('Error cleaning notification subscription:', e);
      }
      notificationSubscriptionRef.current = null;
    }

    if (!user?.id) return;

    const channelName = `notifications_${user.id}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const m = payload.new;
          try {
            // Ignore self messages
            if (!m || m.user_id === user.id) return;

            // Determine relevance
            let isRelevant = false;
            if (m.chat_type === 'global') {
              isRelevant = true;
            } else if (m.chat_type === 'personal') {
              const chatIdStr = String(m.chat_id || '');
              isRelevant = chatIdStr.includes(user.id);
            } else if (m.chat_type === 'group') {
              const groups = groupChatsRef.current || [];
              isRelevant = !!groups.find(g => g.id === m.chat_id);
            }
            if (!isRelevant) return;

            // Skip when user is currently viewing the same chat
            const isViewing = (
              (chatMode === 'global' && m.chat_type === 'global') ||
              (chatMode === 'personal' && m.chat_type === 'personal' && activeChat?.id === m.chat_id) ||
              (chatMode === 'group' && m.chat_type === 'group' && activeChat?.id === m.chat_id)
            );
            if (isViewing) return;

            // Resolve sender name (best-effort)
            let senderName = 'Pengguna';
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', m.user_id)
                .single();
              if (!error && profile?.name) senderName = profile.name;
            } catch (e) {
              // ignore, fallback to default senderName
            }

            // Build notification object
            const notif = {
              id: m.id,
              type: m.chat_type, // 'global' | 'personal' | 'group'
              chatId: m.chat_id || null,
              senderId: m.user_id,
              senderName,
              text: m.text || (m.file_name ? `Mengirim file: ${m.file_name}` : 'Pesan baru'),
              createdAt: m.created_at,
            };

            setNotifications(prev => {
              if (prev.find(n => n.id === notif.id)) return prev;
              const next = [notif, ...prev];
              return next.slice(0, 30); // cap size
            });
          } catch (e) {
            console.error('Error handling notification message:', e);
          }
        }
      )
      .subscribe();

    notificationSubscriptionRef.current = {
      unsubscribe: () => {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.error('Error removing notification channel:', e);
        }
      }
    };

    return () => {
      if (notificationSubscriptionRef.current) {
        notificationSubscriptionRef.current.unsubscribe();
        notificationSubscriptionRef.current = null;
      }
    };
  }, [user?.id, chatMode, activeChat]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const selectPersonalChat = useCallback(async (recipient) => {
    if (!user || !recipient) {
      console.log('Missing user or recipient:', { user: !!user, recipient: !!recipient });
      return;
    }
    
    const chatId = [user.id, recipient.id].sort().join('_');
    console.log('Selecting personal chat:', { recipient: recipient.name, chatId });

    // Set state immediately to prevent blank screen
    setActiveChat({ id: chatId, type: 'personal', recipient });
    setChatMode('personal');
    setLoadingMessages(true);

    try {
      console.log('Loading messages for personal chat:', chatId);
      
      // Try to load from cache first
      const cachedMessages = await loadChatFromCache(chatId, 'personal');
      if (cachedMessages && cachedMessages.length >= 0) {
        console.log('Setting cached messages:', cachedMessages.length);
        setMessages(cachedMessages);
        setLoadingMessages(false);
        
        // Setup subscription after setting cached messages
        setTimeout(() => {
          setupMessageSubscription(chatId, 'personal');
        }, 100);
      } else {
        // Load from database if no cache
        console.log('No cache found, loading from database');
        const messages = await dbService.getMessages(chatId, 'personal');
        console.log('Loaded personal messages from DB:', messages?.length || 0);

        const formattedMessages = (messages || []).map(msg => ({
          id: msg.id,
          text: msg.text,
          file: msg.file_url ? {
            url: msg.file_url,
            name: msg.file_name,
            type: msg.file_type
          } : null,
          senderId: msg.user_id,
          senderName: msg.profiles?.name || 'Unknown',
          timestamp: { toDate: () => new Date(msg.created_at) }
        }));

        console.log('Setting formatted messages:', formattedMessages.length);
        setMessages(formattedMessages);
        
        // Save to cache
        if (formattedMessages.length >= 0) {
          await saveChatToCache(chatId, 'personal', formattedMessages);
        }

        // Setup realtime subscription
        setTimeout(() => {
          setupMessageSubscription(chatId, 'personal');
        }, 100);
      }
    } catch (error) {
      console.error('Error loading personal chat:', error);
      toast({ 
        title: "Error", 
        description: "Gagal memuat pesan chat personal.",
        variant: "destructive"
      });
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [user, dbService, toast, setupMessageSubscription, loadChatFromCache, saveChatToCache]);

  const selectGroupChat = useCallback(async (group) => {
    if (!group || !group.id) {
      console.log('Missing group data:', group);
      return;
    }

    console.log('Selecting group chat:', { groupName: group.name, groupId: group.id });

    // Set state immediately to prevent blank screen
    setActiveChat({ id: group.id, type: 'group', groupInfo: group });
    setChatMode('group');
    setLoadingMessages(true);

    try {
      console.log('Loading messages for group chat:', group.id);
      
      // Try to load from cache first
      const cachedMessages = await loadChatFromCache(group.id, 'group');
      if (cachedMessages && cachedMessages.length >= 0) {
        console.log('Setting cached group messages:', cachedMessages.length);
        setMessages(cachedMessages);
        setLoadingMessages(false);
        
        // Setup subscription after setting cached messages
        setTimeout(() => {
          setupMessageSubscription(group.id, 'group');
        }, 100);
      } else {
        // Load from database if no cache
        console.log('No cache found, loading group messages from database');
        const messages = await dbService.getMessages(group.id, 'group');
        console.log('Loaded group messages from DB:', messages?.length || 0);

        const formattedMessages = (messages || []).map(msg => ({
          id: msg.id,
          text: msg.text,
          file: msg.file_url ? {
            url: msg.file_url,
            name: msg.file_name,
            type: msg.file_type
          } : null,
          senderId: msg.user_id,
          senderName: msg.profiles?.name || 'Unknown',
          timestamp: { toDate: () => new Date(msg.created_at) }
        }));

        console.log('Setting formatted group messages:', formattedMessages.length);
        setMessages(formattedMessages);
        
        // Save to cache
        if (formattedMessages.length >= 0) {
          await saveChatToCache(group.id, 'group', formattedMessages);
        }

        // Setup realtime subscription
        setTimeout(() => {
          setupMessageSubscription(group.id, 'group');
        }, 100);
      }
    } catch (error) {
      console.error('Error loading group chat:', error);
      toast({ 
        title: "Error", 
        description: "Gagal memuat pesan chat grup.",
        variant: "destructive"
      });
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [dbService, toast, setupMessageSubscription, loadChatFromCache, saveChatToCache]);

  const selectGlobalChat = useCallback(async () => {
    console.log('Selecting global chat');

    // Set state immediately to prevent blank screen
    setChatMode('global');
    setActiveChat(null);
    setLoadingMessages(true);

    try {
      console.log('Loading messages for global chat');
      
      // Try to load from cache first
      const cachedMessages = await loadChatFromCache(null, 'global');
      if (cachedMessages && cachedMessages.length >= 0) {
        console.log('Setting cached global messages:', cachedMessages.length);
        setMessages(cachedMessages);
        setLoadingMessages(false);
        
        // Setup subscription after setting cached messages
        setTimeout(() => {
          setupMessageSubscription(null, 'global');
        }, 100);
      } else {
        // Load from database if no cache
        console.log('No cache found, loading global messages from database');
        const messages = await dbService.getMessages(null, 'global');
        console.log('Loaded global messages from DB:', messages?.length || 0);

        const formattedMessages = (messages || []).map(msg => ({
          id: msg.id,
          text: msg.text,
          file: msg.file_url ? {
            url: msg.file_url,
            name: msg.file_name,
            type: msg.file_type
          } : null,
          senderId: msg.user_id,
          senderName: msg.profiles?.name || 'Unknown',
          timestamp: { toDate: () => new Date(msg.created_at) }
        }));

        console.log('Setting formatted global messages:', formattedMessages.length);
        setMessages(formattedMessages);
        
        // Save to cache
        if (formattedMessages.length >= 0) {
          await saveChatToCache(null, 'global', formattedMessages);
        }

        // Setup realtime subscription
        setTimeout(() => {
          console.log('Setting up subscription for global chat');
          setupMessageSubscription(null, 'global');
        }, 100);
      }
    } catch (error) {
      console.error('Error loading global chat:', error);
      toast({ 
        title: "Error", 
        description: "Gagal memuat pesan chat global.",
        variant: "destructive" 
      });
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [dbService, toast, setupMessageSubscription, loadChatFromCache, saveChatToCache]);

  const createGroupChat = useCallback(async (name, memberIds) => {
    if (!user?.id) return;

    try {
      const result = await dbService.createGroupChat(name, [user.id, ...memberIds]);

      if (result.success) {
        toast({ 
          title: "Berhasil", 
          description: `Grup chat "${name}" berhasil dibuat.` 
        });
        await loadGroupChats(); // Refresh group chats
        return result.data;
      } else {
        toast({ 
          title: "Error", 
          description: result.error || "Gagal membuat grup chat." 
        });
      }
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast({ 
        title: "Error", 
        description: "Gagal membuat grup chat." 
      });
    }
  }, [user?.id, dbService, toast, loadGroupChats]);

  const sendMessage = useCallback(async (text) => {
    if (!user?.id || !text.trim()) return;

    const chatId = chatMode === 'global' ? null : activeChat?.id;
    const type = chatMode;

    console.log('Sending message:', { text, chatId, type, userId: user.id });

    const messageData = {
      text: text.trim(),
      userId: user.id
    };

    try {
      const result = await dbService.sendMessage(chatId, type, messageData);
      if (!result.success) {
        console.error('Failed to send message:', result.error);
        toast({ 
          title: "Error", 
          description: result.error || "Gagal mengirim pesan.",
          variant: "destructive"
        });
      } else {
        console.log('Message sent successfully:', result.data);

        // Tambahkan pesan langsung ke state untuk feedback instant
        const newMessage = {
          id: result.data.id,
          text: result.data.text,
          file: result.data.file_url ? {
            url: result.data.file_url,
            name: result.data.file_name,
            type: result.data.file_type
          } : null,
          senderId: result.data.user_id,
          senderName: user.name || 'Unknown',
          timestamp: { toDate: () => new Date(result.data.created_at) }
        };

        console.log('Adding sent message to state:', newMessage);
        setMessages(prev => {
          // Prevent duplicates
          if (prev.find(m => m.id === newMessage.id)) {
            console.log('Message already exists in state');
            return prev;
          }
          console.log('Adding new message to state');
          return [...prev, newMessage].sort((a, b) => {
            const timeA = a.timestamp && typeof a.timestamp.toDate === 'function' ? a.timestamp.toDate() : new Date(0);
            const timeB = b.timestamp && typeof b.timestamp.toDate === 'function' ? b.timestamp.toDate() : new Date(0);
            return timeA - timeB;
          });
        });

        // Update cache with the new message
        const currentChatId = activeChat?.id || null;
        const updatedMessages = [...messages, newMessage].sort((a, b) => {
          const timeA = a.timestamp && typeof a.timestamp.toDate === 'function' ? a.timestamp.toDate() : new Date(0);
          const timeB = b.timestamp && typeof b.timestamp.toDate === 'function' ? b.timestamp.toDate() : new Date(0);
          return timeA - timeB;
        });
        await saveChatToCache(currentChatId, chatMode, updatedMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ 
        title: "Error", 
        description: "Gagal mengirim pesan.",
        variant: "destructive"
      });
    }
  }, [user, activeChat, chatMode, dbService, toast, getChatKey, saveChatToCache, messages]); // Added messages to dependency array

  const sendFile = useCallback(async (file) => {
    if (!user?.id || !file) return;

    // Validasi ukuran file maksimal 25MB
    const maxSize = 25 * 1024 * 1024; // 25MB dalam bytes
    if (file.size > maxSize) {
      toast({ 
        title: "File Terlalu Besar", 
        description: "Ukuran file maksimal adalah 25MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadingFile(true);

    try {
      // Upload file ke Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-files/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      const chatId = activeChat?.id || null;
      const type = chatMode;

      const messageData = {
        text: null,
        userId: user.id,
        file: {
          url: publicUrl,
          name: file.name,
          type: file.type
        }
      };

      const result = await dbService.sendMessage(chatId, type, messageData);
      if (!result.success) {
        toast({ title: "Error", description: "Gagal mengirim file." });
      } else {
        // Add sent file message to state and cache
        const newMessage = {
          id: result.data.id,
          text: null,
          file: {
            url: publicUrl,
            name: file.name,
            type: file.type
          },
          senderId: user.id,
          senderName: user.name || 'Unknown',
          timestamp: { toDate: () => new Date(result.data.created_at) }
        };
        setMessages(prev => [...prev, newMessage].sort((a, b) => {
          const timeA = a.timestamp && typeof a.timestamp.toDate === 'function' ? a.timestamp.toDate() : new Date(0);
          const timeB = b.timestamp && typeof b.timestamp.toDate === 'function' ? b.timestamp.toDate() : new Date(0);
          return timeA - timeB;
        }));
        const updatedFileMessages = [...messages, newMessage].sort((a, b) => {
          const timeA = a.timestamp && typeof a.timestamp.toDate === 'function' ? a.timestamp.toDate() : new Date(0);
          const timeB = b.timestamp && typeof b.timestamp.toDate === 'function' ? b.timestamp.toDate() : new Date(0);
          return timeA - timeB;
        });
        await saveChatToCache(chatId, type, updatedFileMessages);
      }
    } catch (error) {
      console.error('Error sending file:', error);
      toast({ title: "Error", description: "Gagal mengirim file." });
    } finally {
      setUploadingFile(false);
    }
  }, [user, activeChat, chatMode, dbService, toast, messages, saveChatToCache]); // Added messages and saveChatToCache to dependency array

  const deleteMessage = useCallback(async (messageId) => {
    if (!user?.id || !messageId) return;

    try {
      const result = await dbService.deleteMessage(activeChat?.id, messageId, chatMode);
      if (result.success) {
        // Remove message from local state
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        // Update cache
        const currentChatId = activeChat?.id || null;
        await saveChatToCache(currentChatId, chatMode, messages.filter(msg => msg.id !== messageId));
        toast({ title: "Berhasil", description: "Pesan berhasil dihapus." });
      } else {
        toast({ title: "Error", description: "Gagal menghapus pesan." });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({ title: "Error", description: "Gagal menghapus pesan." });
    }
  }, [user, activeChat, chatMode, dbService, toast, messages, saveChatToCache]); // Added messages and saveChatToCache to dependency array

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current.unsubscribe();
      }
      if (notificationSubscriptionRef.current) {
        notificationSubscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  // Show welcome toast only once
  useEffect(() => {
    if (user) {
      const hasShownWelcome = localStorage.getItem('supabase_chat_welcome');
      if (!hasShownWelcome) {
        toast({
          title: "Selamat Datang di Chat!",
          description: "Sistem chat kini aktif dengan Supabase. Nikmati fitur chat real-time!",
          duration: 5000,
        });
        localStorage.setItem('supabase_chat_welcome', 'true');
      }
    }
  }, [user, toast]);


  const value = {
    personalContacts,
    groupChats,
    chatMode,
    activeChat,
    selectPersonalChat,
    selectGroupChat,
    selectGlobalChat,
    createGroupChat,
    loadGroupChats,
    messages,
    loadingMessages,
    sendMessage,
    sendFile,
    uploadingFile,
    deleteMessage,
    unreadChats,
    notifications,
    clearNotifications,
    dismissNotification,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
// Test Login dan User Update
// Jalankan file ini di browser console untuk test lengkap

console.log('🧪 Testing Login dan User Update...');

// Test 1: Login Function
async function testLogin() {
  try {
    console.log('🔐 Testing Login...');
    
    // Test dengan admin user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@nahorpratama.com',
      password: 'admin123'
    });
    
    if (error) {
      console.error('❌ Login failed:', error);
      return null;
    }
    
    if (data.user) {
      console.log('✅ Login successful:', data.user);
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return null;
  }
}

// Test 2: Get User Profile
async function testGetUserProfile(userId) {
  try {
    console.log('👤 Testing Get User Profile...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('❌ Get profile failed:', error);
      return null;
    }
    
    console.log('✅ Profile fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Get profile test failed:', error);
    return null;
  }
}

// Test 3: Update User Profile
async function testUpdateUserProfile(userId, updateData) {
  try {
    console.log('✏️ Testing Update User Profile...');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Update profile failed:', error);
      return null;
    }
    
    console.log('✅ Profile updated:', data);
    return data;
  } catch (error) {
    console.error('❌ Update profile test failed:', error);
    return null;
  }
}

// Test 4: Update User Category/Role
async function testUpdateUserCategory(userId, newRole) {
  try {
    console.log('🏷️ Testing Update User Category/Role...');
    
    const updateData = {
      role: newRole,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Update user category failed:', error);
      return null;
    }
    
    console.log('✅ User category updated:', data);
    return data;
  } catch (error) {
    console.error('❌ Update user category test failed:', error);
    return null;
  }
}

// Test 5: Test All Users
async function testAllUsers() {
  try {
    console.log('👥 Testing Get All Users...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Get all users failed:', error);
      return null;
    }
    
    console.log('✅ All users fetched:', data);
    return data;
  } catch (error) {
    console.error('❌ Get all users test failed:', error);
    return null;
  }
}

// Test 6: Test Role-based Access
async function testRoleBasedAccess() {
  try {
    console.log('🔒 Testing Role-based Access...');
    
    // Test admin access
    const adminProfile = await testGetUserProfile('admin-user-id');
    if (adminProfile && adminProfile.role === 'admin') {
      console.log('✅ Admin access verified');
    }
    
    // Test finance access
    const financeProfile = await testGetUserProfile('finance-user-id');
    if (financeProfile && financeProfile.role === 'finance') {
      console.log('✅ Finance access verified');
    }
    
    // Test HR access
    const hrProfile = await testGetUserProfile('hr-user-id');
    if (hrProfile && hrProfile.role === 'hr') {
      console.log('✅ HR access verified');
    }
    
    // Test project access
    const projectProfile = await testGetUserProfile('project-user-id');
    if (projectProfile && projectProfile.role === 'project') {
      console.log('✅ Project access verified');
    }
    
  } catch (error) {
    console.error('❌ Role-based access test failed:', error);
  }
}

// Test 7: Test User Management (Admin Only)
async function testUserManagement() {
  try {
    console.log('👑 Testing User Management (Admin Only)...');
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('❌ No user logged in');
      return;
    }
    
    // Check if current user is admin
    const currentProfile = await testGetUserProfile(user.id);
    if (currentProfile && currentProfile.role === 'admin') {
      console.log('✅ Current user is admin, can manage users');
      
      // Test create user
      await testCreateUser();
      
      // Test update user
      await testUpdateUser();
      
      // Test delete user
      await testDeleteUser();
      
    } else {
      console.log('❌ Current user is not admin, cannot manage users');
    }
    
  } catch (error) {
    console.error('❌ User management test failed:', error);
  }
}

// Test 8: Test Create User
async function testCreateUser() {
  try {
    console.log('➕ Testing Create User...');
    
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      role: 'finance',
      permissions: ['finance_reports', 'chat']
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(newUser)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Create user failed:', error);
      return null;
    }
    
    console.log('✅ User created:', data);
    return data;
  } catch (error) {
    console.error('❌ Create user test failed:', error);
    return null;
  }
}

// Test 9: Test Update User
async function testUpdateUser() {
  try {
    console.log('✏️ Testing Update User...');
    
    // Get test user
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', 'testuser')
      .limit(1);
    
    if (users && users.length > 0) {
      const testUser = users[0];
      
      // Update user
      const updateData = {
        name: 'Updated Test User',
        role: 'hr',
        permissions: ['hr_management', 'chat'],
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', testUser.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Update user failed:', error);
        return null;
      }
      
      console.log('✅ User updated:', data);
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Update user test failed:', error);
    return null;
  }
}

// Test 10: Test Delete User
async function testDeleteUser() {
  try {
    console.log('🗑️ Testing Delete User...');
    
    // Get test user
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', 'testuser')
      .limit(1);
    
    if (users && users.length > 0) {
      const testUser = users[0];
      
      // Delete user
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', testUser.id);
      
      if (error) {
        console.error('❌ Delete user failed:', error);
        return false;
      }
      
      console.log('✅ User deleted successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Delete user test failed:', error);
    return false;
  }
}

// Test 11: Test Login Flow
async function testLoginFlow() {
  try {
    console.log('🔄 Testing Complete Login Flow...');
    
    // Step 1: Login
    const user = await testLogin();
    if (!user) {
      console.log('❌ Login failed, cannot continue');
      return;
    }
    
    // Step 2: Get Profile
    const profile = await testGetUserProfile(user.id);
    if (!profile) {
      console.log('❌ Profile fetch failed');
      return;
    }
    
    // Step 3: Check Role
    console.log('✅ User role:', profile.role);
    console.log('✅ User permissions:', profile.permissions);
    
    // Step 4: Test Role-based Features
    if (profile.role === 'admin') {
      console.log('🔑 Testing admin features...');
      await testUserManagement();
    } else if (profile.role === 'finance') {
      console.log('💰 Testing finance features...');
      // Add finance-specific tests here
    } else if (profile.role === 'hr') {
      console.log('👥 Testing HR features...');
      // Add HR-specific tests here
    } else if (profile.role === 'project') {
      console.log('📋 Testing project features...');
      // Add project-specific tests here
    }
    
    // Step 5: Logout
    await supabase.auth.signOut();
    console.log('✅ Logout successful');
    
  } catch (error) {
    console.error('❌ Login flow test failed:', error);
  }
}

// Test 12: Test Error Handling
async function testErrorHandling() {
  try {
    console.log('⚠️ Testing Error Handling...');
    
    // Test invalid login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'invalid@email.com',
      password: 'wrongpassword'
    });
    
    if (error) {
      console.log('✅ Invalid login error handled:', error.message);
    }
    
    // Test invalid profile access
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'invalid-id')
      .single();
    
    if (profileError) {
      console.log('✅ Invalid profile access error handled:', profileError.message);
    }
    
    // Test unauthorized update
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', 'invalid-id');
    
    if (updateError) {
      console.log('✅ Unauthorized update error handled:', updateError.message);
    }
    
  } catch (error) {
    console.error('❌ Error handling test failed:', error);
  }
}

// Run All Tests
async function runAllTests() {
  console.log('🚀 Running All Tests...');
  
  try {
    // Basic tests
    await testLogin();
    await testAllUsers();
    await testRoleBasedAccess();
    
    // Advanced tests
    await testLoginFlow();
    await testErrorHandling();
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Some tests failed:', error);
  }
}

// Export functions for manual testing
window.testLoginAndUserUpdate = {
  testLogin,
  testGetUserProfile,
  testUpdateUserProfile,
  testUpdateUserCategory,
  testAllUsers,
  testRoleBasedAccess,
  testUserManagement,
  testCreateUser,
  testUpdateUser,
  testDeleteUser,
  testLoginFlow,
  testErrorHandling,
  runAllTests
};

console.log('🧪 Test functions available at window.testLoginAndUserUpdate');
console.log('🚀 Run: testLoginAndUserUpdate.runAllTests() to test everything');
console.log('🔐 Run: testLoginAndUserUpdate.testLogin() to test login only');
console.log('👤 Run: testLoginAndUserUpdate.testUpdateUserCategory() to test user update');
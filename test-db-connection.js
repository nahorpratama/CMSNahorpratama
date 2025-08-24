// Test Database Connection
// Jalankan file ini di browser console untuk test koneksi database

console.log('Testing Database Connection...');

// Test 1: Check if Supabase client is available
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client available');
} else {
  console.log('❌ Supabase client not available');
}

// Test 2: Test authentication
async function testAuth() {
  try {
    console.log('Testing authentication...');
    
    // Test login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@nahorpratama.com',
      password: 'admin123'
    });
    
    if (error) {
      console.error('❌ Login failed:', error);
      return;
    }
    
    if (data.user) {
      console.log('✅ Login successful:', data.user);
      
      // Test get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile fetch failed:', profileError);
      } else {
        console.log('✅ Profile fetched:', profile);
      }
      
      // Test logout
      await supabase.auth.signOut();
      console.log('✅ Logout successful');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test 3: Test profiles table
async function testProfilesTable() {
  try {
    console.log('Testing profiles table...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Profiles table error:', error);
    } else {
      console.log('✅ Profiles table accessible:', data);
    }
  } catch (error) {
    console.error('❌ Profiles test failed:', error);
  }
}

// Test 4: Test RLS policies
async function testRLSPolicies() {
  try {
    console.log('Testing RLS policies...');
    
    // Test without auth
    const { data: noAuthData, error: noAuthError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (noAuthError) {
      console.log('✅ RLS working (no auth blocked):', noAuthError.message);
    } else {
      console.log('❌ RLS not working (no auth allowed):', noAuthData);
    }
  } catch (error) {
    console.error('❌ RLS test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all tests...');
  
  await testProfilesTable();
  await testRLSPolicies();
  
  console.log('✅ All tests completed');
}

// Export functions for manual testing
window.testDBConnection = {
  testAuth,
  testProfilesTable,
  testRLSPolicies,
  runAllTests
};

console.log('Test functions available at window.testDBConnection');
console.log('Run: testDBConnection.runAllTests() to test everything');
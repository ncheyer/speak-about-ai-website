// Test client portal invitation flow with dev auth bypass
async function testInvitation() {
  console.log('Testing client portal invitation flow...\n');
  
  // Step 1: Create a test project
  console.log('1. Creating test project...');
  const createRes = await fetch('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-dev-admin-bypass': 'dev-admin-access'
    },
    body: JSON.stringify({
      project_name: 'Test Client Portal Event',
      client_name: 'John Smith',
      client_email: 'john@example.com',
      company: 'Tech Corp',
      project_type: 'speaking_engagement',
      event_name: 'Annual Tech Conference 2025',
      event_date: '2025-03-15',
      event_location: 'San Francisco, CA',
      event_type: 'conference',
      status: 'invoicing',
      priority: 'high',
      budget: 15000,
      start_date: '2025-03-15'
    })
  });
  
  if (!createRes.ok) {
    console.log('Failed to create project:', await createRes.text());
    return;
  }
  
  const testProject = await createRes.json();
  console.log(`   ✅ Created project: ${testProject.project_name} (ID: ${testProject.id})`);
  
  // Step 2: Send invitation
  console.log('\n2. Sending client portal invitation...');
  const inviteRes = await fetch('http://localhost:3000/api/client-portal/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-dev-admin-bypass': 'dev-admin-access'
    },
    body: JSON.stringify({
      projectId: testProject.id,
      clientEmail: 'test@example.com',
      adminEmail: 'admin@speakaboutai.com'
    })
  });
  
  const inviteData = await inviteRes.json();
  
  if (inviteRes.ok) {
    console.log('   ✅ Invitation created successfully!');
    console.log(`   Invitation URL: ${inviteData.invitationUrl}`);
    
    // Step 3: Validate the invitation
    const token = inviteData.invitationUrl.split('token=')[1];
    console.log('\n3. Validating invitation token...');
    
    const validateRes = await fetch(`http://localhost:3000/api/client-portal/accept-invite?token=${token}`);
    const validateData = await validateRes.json();
    
    if (validateRes.ok && validateData.valid) {
      console.log('   ✅ Invitation is valid!');
      console.log(`   Project: ${validateData.project.project_name}`);
      console.log(`   Client email: ${validateData.clientEmail}`);
      
      // Step 4: Accept the invitation
      console.log('\n4. Accepting invitation...');
      const acceptRes = await fetch('http://localhost:3000/api/client-portal/accept-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });
      
      const acceptData = await acceptRes.json();
      
      if (acceptRes.ok) {
        console.log('   ✅ Invitation accepted!');
        console.log(`   Project ID: ${acceptData.projectId}`);
        console.log(`   Project Token: ${acceptData.projectToken}`);
        
        // Step 5: Test accessing the project with the token
        console.log('\n5. Testing project access with token...');
        const projectRes = await fetch(`http://localhost:3000/api/client-portal/projects/${acceptData.projectId}`, {
          headers: {
            'X-Project-Token': acceptData.projectToken
          }
        });
        
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          console.log('   ✅ Successfully accessed project!');
          console.log(`   Project name: ${projectData.project_name}`);
          console.log(`   Event name: ${projectData.event_name}`);
          console.log(`   Editable fields count: ${projectData.client_editable_fields?.length || 0}`);
          
          // Step 6: Test updating a field
          console.log('\n6. Testing field update...');
          const updateRes = await fetch(`http://localhost:3000/api/client-portal/projects/${acceptData.projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Project-Token': acceptData.projectToken
            },
            body: JSON.stringify({
              venue_name: 'Moscone Center',
              venue_address: '747 Howard St, San Francisco, CA 94103'
            })
          });
          
          if (updateRes.ok) {
            const updateData = await updateRes.json();
            console.log('   ✅ Successfully updated project!');
            console.log(`   Updated fields: ${updateData.updatedFields.join(', ')}`);
          } else {
            console.log('   ❌ Failed to update project:', await updateRes.text());
          }
        } else {
          console.log('   ❌ Failed to access project:', await projectRes.text());
        }
      } else {
        console.log('   ❌ Failed to accept invitation:', acceptData.error);
      }
    } else {
      console.log('   ❌ Invalid invitation:', validateData.error);
    }
  } else {
    console.log('   ❌ Failed to send invitation:', inviteData.error);
  }
  
  console.log('\n✅ Test complete!');
  console.log('\n📝 To test the UI:');
  console.log(`   1. Edit project at: http://localhost:3000/admin/projects/${testProject.id}/edit`);
  console.log(`   2. Click "Send Client Portal Invite" button`);
  console.log(`   3. Check the invitation URL in the response`);
  console.log(`   4. Visit the accept invite page with the token`);
  console.log(`   5. Access the client portal for the project`);
}

testInvitation().catch(console.error);
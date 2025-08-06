// Test client portal invitation flow
async function testInvitation() {
  console.log('Testing client portal invitation flow...\n');
  
  // Step 1: Get a project to test with
  console.log('1. Fetching projects...');
  const projectsRes = await fetch('http://localhost:3000/api/projects');
  const projects = await projectsRes.json();
  
  if (!projects.length) {
    console.log('No projects found. Please create a project first.');
    return;
  }
  
  const testProject = projects[0];
  console.log(`   Found project: ${testProject.project_name} (ID: ${testProject.id})`);
  
  // Step 2: Send invitation
  console.log('\n2. Sending client portal invitation...');
  const inviteRes = await fetch('http://localhost:3000/api/client-portal/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    console.log(`   Token: ${inviteData.invitationUrl.split('token=')[1]}`);
    
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
          console.log(`   Editable fields: ${projectData.client_editable_fields?.slice(0, 3).join(', ')}...`);
          console.log(`   View-only fields: ${projectData.client_view_only_fields?.slice(0, 3).join(', ')}...`);
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
}

testInvitation().catch(console.error);
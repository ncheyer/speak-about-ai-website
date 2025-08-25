#!/bin/bash

echo "==================================="
echo "SYSTEM HEALTH CHECK"
echo "==================================="
echo ""

# Test Contracts API
echo "1. Testing Contracts API..."
CONTRACT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/contracts-v2" -H "x-dev-admin-bypass: dev-admin-access")
if [ "$CONTRACT_RESPONSE" = "200" ]; then
    echo "   ✅ Contracts API: Working"
else
    echo "   ❌ Contracts API: Failed (Status: $CONTRACT_RESPONSE)"
fi

# Test Contacts API
echo "2. Testing Contacts API..."
CONTACT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/contacts" -H "x-dev-admin-bypass: dev-admin-access")
if [ "$CONTACT_RESPONSE" = "200" ]; then
    echo "   ✅ Contacts API: Working"
else
    echo "   ❌ Contacts API: Failed (Status: $CONTACT_RESPONSE)"
fi

# Test Deals API
echo "3. Testing Deals API..."
DEALS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/deals" -H "x-dev-admin-bypass: dev-admin-access")
if [ "$DEALS_RESPONSE" = "200" ]; then
    echo "   ✅ Deals API: Working"
else
    echo "   ❌ Deals API: Failed (Status: $DEALS_RESPONSE)"
fi

# Test Contract Creation
echo "4. Testing Contract Creation..."
CREATE_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/contracts-v2" \
  -H "Content-Type: application/json" \
  -H "x-dev-admin-bypass: dev-admin-access" \
  -d '{
    "type": "speaker_agreement",
    "category": "internal",
    "title": "Test Contract '$(date +%s)'",
    "agency_party": {
      "name": "Speak About AI",
      "company": "Strong Entertainment, LLC",
      "email": "contracts@speakabout.ai",
      "role": "Agency"
    },
    "status": "draft",
    "created_by": "admin"
  }' | grep -c '"id"')

if [ "$CREATE_RESPONSE" = "1" ]; then
    echo "   ✅ Contract Creation: Working"
else
    echo "   ❌ Contract Creation: Failed"
fi

# Test Page Loads
echo "5. Testing Page Loads..."
CONTRACTS_PAGE=$(curl -s "http://localhost:3000/admin/contracts-v2" | grep -c "Contract Management")
if [ "$CONTRACTS_PAGE" -ge "1" ]; then
    echo "   ✅ Contracts Page: Loads"
else
    echo "   ❌ Contracts Page: Failed to load"
fi

CRM_PAGE=$(curl -s "http://localhost:3000/admin/crm" | grep -c "CRM")
if [ "$CRM_PAGE" -ge "1" ]; then
    echo "   ✅ CRM Page: Loads"
else
    echo "   ❌ CRM Page: Failed to load"
fi

echo ""
echo "==================================="
echo "SUMMARY"
echo "==================================="
echo ""

# Count contracts
CONTRACT_COUNT=$(curl -s "http://localhost:3000/api/contracts-v2" -H "x-dev-admin-bypass: dev-admin-access" | jq '. | length')
echo "Total Contracts in Database: $CONTRACT_COUNT"

# Count deals
DEAL_COUNT=$(curl -s "http://localhost:3000/api/deals" -H "x-dev-admin-bypass: dev-admin-access" | jq '. | length')
echo "Total Deals in Database: $DEAL_COUNT"

# Count contacts
CONTACT_COUNT=$(curl -s "http://localhost:3000/api/contacts" -H "x-dev-admin-bypass: dev-admin-access" | jq '. | length')
echo "Total Contacts in Database: $CONTACT_COUNT"

echo ""
echo "==================================="
echo "TEST COMPLETE"
echo "==================================="
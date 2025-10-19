#!/bin/bash

# Test Emergency Classification Triggers

API_URL="http://localhost:5001/api/gemini/analyze"

echo "🚨 TESTING EMERGENCY TRIGGERS"
echo "=============================="
echo ""

test_prompt() {
  local prompt=$1
  echo "📝 Testing: \"$prompt\""
  response=$(curl -s -X POST $API_URL -H "Content-Type: application/json" -d "{\"userText\": \"$prompt\"}")
  key=$(echo $response | grep -o '"key":"[^"]*"' | cut -d'"' -f4)
  
  if [[ $key == emergency_* ]]; then
    echo "   ✅ EMERGENCY: $key"
  else
    echo "   ℹ️  Non-Emergency: $key"
  fi
  echo ""
}

echo "🚑 MEDICAL EMERGENCY TESTS:"
echo "--------------------------"
test_prompt "Help! Can't breathe!"
test_prompt "Heart attack! Need help!"
test_prompt "Child is bleeding heavily!"
test_prompt "Person collapsed and unconscious!"

echo ""
echo "🏠 SHELTER EMERGENCY TESTS:"
echo "--------------------------"
test_prompt "Trapped in flooded building!"
test_prompt "House on fire! Help!"
test_prompt "Earthquake! Evacuate now!"
test_prompt "Roof collapsed! People stuck!"

echo ""
echo "👮 POLICE EMERGENCY TESTS:"
echo "-------------------------"
test_prompt "Someone breaking in right now!"
test_prompt "Active shooting! Danger!"
test_prompt "Being attacked! Help me!"
test_prompt "Robbery in progress!"

echo ""
echo "⚡ EMERGENCY BOOST TESTS:"
echo "------------------------"
test_prompt "Emergency! Need a doctor!"
test_prompt "Urgent! Child is hurt!"
test_prompt "Help immediately! Injured!"
test_prompt "Critical! Need shelter now!"

echo ""
echo "✅ NON-EMERGENCY TESTS (Should NOT trigger emergency):"
echo "----------------------------------------------------"
test_prompt "Need doctor appointment"
test_prompt "Looking for temporary shelter"
test_prompt "Want to report a theft"
test_prompt "I'm feeling sick"

echo ""
echo "🎯 Testing Complete!"


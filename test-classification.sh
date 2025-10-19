#!/bin/bash

# DisAID Classification Testing Script

echo "🧪 Testing DisAID Classification System"
echo "========================================"
echo ""

API_URL="http://localhost:5001/api/gemini/analyze"

test_classification() {
  local description=$1
  local text=$2
  
  echo "📝 $description"
  echo "Input: \"$text\""
  
  response=$(curl -s -X POST $API_URL \
    -H "Content-Type: application/json" \
    -d "{\"userText\": \"$text\"}")
  
  echo "Result: $response"
  echo ""
}

# Medical Tests
echo "🏥 MEDICAL TESTS:"
echo "----------------"
test_classification "Critical Medical" "My father is having a heart attack! Help immediately!"
test_classification "Urgent Medical" "Child fell and broke arm, need medical help"
test_classification "Normal Medical" "I need to see a doctor for a regular checkup"
echo ""

# Shelter Tests
echo "🏠 SHELTER TESTS:"
echo "----------------"
test_classification "Critical Shelter" "Trapped in building during earthquake! Help!"
test_classification "Urgent Shelter" "Lost our home in the flood, need shelter"
test_classification "Normal Shelter" "Looking for temporary accommodation"
echo ""

# Police Tests
echo "👮 POLICE TESTS:"
echo "---------------"
test_classification "Critical Police" "Someone is breaking into my house right now!"
test_classification "Urgent Police" "I was robbed, need police assistance"
test_classification "Normal Police" "I want to report an incident"
echo ""

# Mixed/Complex Tests
echo "🔀 COMPLEX TESTS:"
echo "----------------"
test_classification "Medical + Emergency Words" "Emergency! Child is sick and vomiting"
test_classification "Multiple Categories" "Help! House flooded and someone is injured"
test_classification "Vague Request" "I need help urgently"
echo ""

echo "✅ Testing Complete!"


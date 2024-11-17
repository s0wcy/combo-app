#!/bin/bash

# Input and output files
input_file="nfl-11-17.txt"
output_file="nfl-11-17.result.txt"

# Clear or create the output file
> "$output_file"

# Loop through each line in the input file
while IFS= read -r slug; do
  # Fetch the condition ID using the slug
  condition_id=$(curl -s "https://gamma-api.polymarket.com/markets?slug=$slug" | jq -r ".[0].conditionId")

  curl -s "https://gamma-api.polymarket.com/markets?slug=$slug" | jq
  # Fetch the market data using the condition ID
  market_data=$(curl -s "https://clob.polymarket.com/markets/$condition_id" | jq .tokens)
  curl -s "https://clob.polymarket.com/markets/$condition_id" | jq .
  
  # Write the slug and the result to the output file
  echo "$slug" >> "$output_file"
  echo "$market_data" >> "$output_file"
  echo "" >> "$output_file"  # Add a newline for separation
done < "$input_file"

echo "Results have been written to $output_file"

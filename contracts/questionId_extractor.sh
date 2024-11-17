#!/bin/bash

# Input and output files
input_file="trump_won_now_what.txt"
output_file="trump.questions.txt"

# Clear or create the output file
> "$output_file"

# Loop through each line in the input file
while IFS= read -r slug; do
  # Fetch the question ID using the slug
  question_id=$(curl -s "https://gamma-api.polymarket.com/markets?slug=$slug" | jq -r ".[0].questionID")

  # Write the slug and the result to the output file
  echo "$slug" >> "$output_file"
  echo "$question_id" >> "$output_file"
  echo "" >> "$output_file"  # Add a newline for separation
done < "$input_file"

echo "Results have been written to $output_file"

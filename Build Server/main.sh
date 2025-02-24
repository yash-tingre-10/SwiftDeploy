#!/bin/bash

# Export the GIT_REPOSITORY_URL environment variable
export GIT_REPOSITORY_URL="$GIT_REPOSITORY_URL"

# Print the exported variable (for debugging)
echo "Exported GIT_REPOSITORY_URL: $GIT_REPOSITORY_URL"

# Clone the Git repository
echo "Cloning repository: $GIT_REPOSITORY_URL"
git clone "$GIT_REPOSITORY_URL" /app/output

exec node script.js
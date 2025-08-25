#!/bin/bash
cd /home/kavia/workspace/code-generation/secure-user-authentication-platform-11890-11900/auth_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


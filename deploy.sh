#!/bin/bash
git pull --rebase origin main
docker build . -t sv-onboarding-merchant
docker compose up -d
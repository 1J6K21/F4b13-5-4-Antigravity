# Docker Compose file
version: '3.8'
services:
  db:
    image: postgres
  sync:
    build: .
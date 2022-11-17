#!/bin/sh

# To satisfy Vite's requirement of esbuild for Linux
npm rebuild esbuild

exec "$@"
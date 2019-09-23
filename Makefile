all : ./source/index.ts
	npx tsc
	npx webpack

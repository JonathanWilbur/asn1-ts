all : ./source/index.ts
	npx tsc
	npx webpack --config webpack.config.js

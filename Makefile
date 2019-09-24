all : ./source/index.ts
	npx tsc
	npx webpack --config ber.webpack.config.js
	npx webpack --config der.webpack.config.js
	npx webpack --config webpack.config.js

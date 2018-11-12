# Weird Build Issue

I have to document this here, because I can't even figure out what tool in the
build chain is at fault. When trying to build this library by running
`make -B -f build/Makefile`, I get this error:

```
ERROR in (webpack)/node_modules/util/util.js
Module not found: Error: Can't resolve './support/isBuffer' in '/usr/local/lib/node_modules/webpack/node_modules/util'
 @ (webpack)/node_modules/util/util.js 526:19-48
 @ ./source/x690.ts
 @ ./source/codecs/der.ts
 @ ./source/index.ts
 @ multi ./source/index.ts
```

When I go into that library and change
`exports.isBuffer = require('./support/isBuffer');` to
`exports.isBuffer = require('./support/isBuffer.js');`, it suddenly works.

This seems to have happened after upgrading my macOS to Mojave. Nothing else
changed between then, so far as I know. I also tried removing `webpack` and
`webpack-cli` both globally and locally, then re-installing them. That did not
fix the issue. A search of the `nodejs`, `npm`, `webpack`, and `util`
repositories shows nobody else having this issue. The specific line of code in
`util` where this issue has occurred has not changed in the past five years.

At this point, I suspect it is some quirk about my computer.
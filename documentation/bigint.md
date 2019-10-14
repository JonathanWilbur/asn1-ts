# Big Integers in this library

As of now, this library does not support encoding arbitrarily large integers,
primarily because doing so would introduce the first non-development
dependency, unless I use the built-in `BigInt` object. As the standard `BigInt`
object is only supported in NodeJS versions 10.4 and higher and not widely
supported by web browsers, I cannot support it.

Currently, what I recommend is to simply treat large integers as
`OCTET STRING`s. If you need to do math with them, you will need to figure out
a way to convert the resulting bytes into a type with which math can be done.

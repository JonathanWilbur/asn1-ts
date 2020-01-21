# Competing Implementations

## Go's asn1 Module

I like Go's standard library's implementation of ASN.1, because it is really
easy to use. Simply tagging members of `structs` with metadata gives the
library all it needs to know to unmarshal the serialized data into your
data structures.

In hindsight, I wish I had implemented something like what Go has for ASN.1
deserialization. Using JavaScript decorators is the best way to do this, but
these are still in the process of being incorporated into the standard.

One thing that my library has over Go's `asn1` module is completeness. Go's
module only encodes and decodes a few data types. Mine decodes _almost_ all
of them. (I say "almost" because new very complex data types were added in
later versions of the standard that I was not referencing when I made this.)

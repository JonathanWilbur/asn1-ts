#!/usr/bin/make
#
# Run this from the root directory like so:
# make -f ./build/Makefile
#
# NOTE:
# "It is traditional to use upper case letters in variable names, but we
# recommend using lower case letters for variable names that serve internal
# purposes in the makefile, and reserving upper case for parameters that
# control implicit rules or for parameters that the user should override
# with command options[...]."
# -- GNU Make Reference Manual, Chapter 6: "How to Use Variables"
#

# These lines are recommended by convention
# See Chapter 15 "Makefile Conventions" of the GNU Make Reference Manual
SHELL = /bin/sh
.SUFFIXES:

# The name SRCDIR is chosen because DESTDIR is a standard variable name.
# It should not point to the ./source directory, but rather, the root
# of this entire package. Note that this differs from the lowercase
# 'srcdir', which is the location where the source files are installed.
SRCDIR = .
DESTDIR = ./dist

PACKAGE_SLUG = asn1
VERSION := $(shell cat $(SRCDIR)/version)

all : ber der

base_files = \
	asn1.ts \
	errors.ts \
	index.ts \
	values.ts

type_files = \
	objectidentifier.ts

x690_codecs = \
	ber \
	der

x690_codec_files = $(addsuffix .ts,$(x690_codecs))

codecs = \
	$(x690_codecs)

codec_files = $(addsuffix .ts,$(codecs))

base_source_paths = \
	$(addprefix $(SRCDIR)/source/,$(base_files)) \
	$(addprefix $(SRCDIR)/source/types/,$(type_files))

ber : $(DESTDIR)/ber.js
$(DESTDIR)/ber.js : $(base_source_paths) $(SRCDIR)/source/codecs/ber.ts
	webpack --config build/webpack/ber.webpack.js --output-path $(abspath $(DESTDIR)) --mode production

der : $(DESTDIR)/der.js
$(DESTDIR)/der.js : $(base_source_paths) $(SRCDIR)/source/codecs/der.ts
	webpack --config build/webpack/der.webpack.js --output-path $(abspath $(DESTDIR)) --mode production
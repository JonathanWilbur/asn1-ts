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

all : web_libraries node_libraries declarations

# Modules
base = \
	asn1 \
	errors \
	index \
	values \
	x690

types = \
	objectidentifier

x690_codecs = \
	ber \
	der

codecs = \
	$(x690_codecs)

# Files
base_files = $(addsuffix .ts,$(base))
type_files = $(addsuffix .ts,$(types))
x690_codec_files = $(addsuffix .ts,$(x690_codecs))
codec_files = $(addsuffix .ts,$(codecs))
codec_index_files = $(codec_files)
source_files = $(base_files) $(type_files) $(codec_files)

# Declarations
base_decs = $(addsuffix .d.ts,$(base))
type_decs = $(addsuffix .d.ts,$(types))
x690_codec_decs = $(addsuffix .d.ts,$(x690_codecs))
codec_decs = $(addsuffix .d.ts,$(codecs))
codec_index_decs = $(codec_decs)
all_decs = $(base_decs) $(type_decs) $(codec_decs)

# JavaScripts
base_javascripts = $(addsuffix .js,$(base))
type_javascripts = $(addsuffix .js,$(types))
x690_codec_javascripts = $(addsuffix .js,$(x690_codecs))
codec_javascripts = $(addsuffix .js,$(codecs))
codec_index_javascripts = $(codec_javascripts)
all_javascripts = $(base_javascripts) $(type_javascripts) $(codec_javascripts)

# Paths
base_paths = $(addprefix $(SRCDIR)/source/,$(base_files))
type_paths = $(addprefix $(SRCDIR)/source/types/,$(type_files))
x690_codec_paths = $(addprefix $(SRCDIR)/source/codecs/,$(x690_codec_files))
codec_paths = $(addprefix $(SRCDIR)/source/codecs/,$(codec_files))
codec_index_paths = $(addprefix $(SRCDIR)/source/indices/,$(codec_files))
source_paths = $(base_paths) $(type_paths) $(codec_paths)

# Declaration Paths
base_dec_paths = $(addprefix $(DESTDIR)/types/,$(base_decs))
type_dec_paths = $(addprefix $(DESTDIR)/types/types/,$(type_decs))
x690_codec_dec_paths = $(addprefix $(DESTDIR)/types/codecs/,$(x690_codec_decs))
codec_dec_paths = $(addprefix $(DESTDIR)/types/codecs/,$(codec_decs))
codec_index_dec_paths = $(codec_dec_paths)
all_dec_paths = $(base_dec_paths) $(type_dec_paths) $(codec_dec_paths)

web_libraries : web_asn1 web_ber web_der

web_asn1 : $(DESTDIR)/web/asn1.js
$(DESTDIR)/web/asn1.js : $(base_paths) $(codec_paths)
	webpack --config $(SRCDIR)/build/webpack/web/asn1.webpack.js --output-path $(abspath $(DESTDIR))/web

web_ber : $(DESTDIR)/web/ber.min.js
$(DESTDIR)/web/ber.min.js : $(base_paths) $(SRCDIR)/source/codecs/ber.ts
	webpack --config $(SRCDIR)/build/webpack/web/ber.webpack.js --output-path $(abspath $(DESTDIR))/web

web_der : $(DESTDIR)/web/der.min.js
$(DESTDIR)/web/der.min.js : $(base_paths) $(SRCDIR)/source/codecs/der.ts
	webpack --config $(SRCDIR)/build/webpack/web/der.webpack.js --output-path $(abspath $(DESTDIR))/web

node_libraries : node_asn1

node_asn1 : $(DESTDIR)/node/asn1.js
$(DESTDIR)/node/asn1.js : $(base_paths) $(codec_paths)
	webpack --config $(SRCDIR)/build/webpack/node/asn1.webpack.js --output-path $(abspath $(DESTDIR))/node

declarations : $(all_dec_paths)

$(all_dec_paths) : $(DESTDIR)/types/%.d.ts : $(SRCDIR)/source/%.ts
	tsc \
	--declaration \
	--emitDeclarationOnly \
	--target ESNext \
	--lib ESNext,DOM \
	--declarationDir ./dist/types $<
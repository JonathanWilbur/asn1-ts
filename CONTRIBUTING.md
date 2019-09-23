# Contributing

## RFC 2119 Disclosure

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL
NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and
"OPTIONAL" in this document are to be interpreted as described in
[RFC 2119](https://tools.ietf.org/html/rfc2119).

## Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I
  have the right to submit it under the open source license
  indicated in the file; or

* (b) The contribution is based upon previous work that, to the best
  of my knowledge, is covered under an appropriate open source
  license and I have the right under that license to submit that
  work with modifications, whether created in whole or in part
  by me, under the same open source license (unless I am
  permitted to submit under a different license), as indicated
  in the file; or

* (c) The contribution was provided directly to me by some other
  person who certified (a), (b) or (c) and I have not modified
  it.

* (d) I understand and agree that this project and the contribution
  are public and that a record of the contribution (including all
  personal information I submit with it, including my sign-off) is
  maintained indefinitely and may be redistributed consistent with
  this project or the open source license(s) involved.

## Versioning

This project uses
[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## Git Workflow

### Below Version 1.0.0

Up until, but not including, Version 1.0.0, pushes SHALL be made directly to
the `master` branch. This is done for the expedience of development, and
because development is typically done by a single person and because what
comes before 1.0.0 is no longer supported anyway, so maintainability does
not matter for pre-1.0.0 versions. Tagging is OPTIONAL. Commit messages are
OPTIONAL.

### Version 1.0.0 and higher

#### Version Branches

Once Version 1.0.0 is published, pushes SHALL be made to version-specific
branches. These version-specific branches SHALL have a name starting with a
lowercase `v`, followed by the
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) number.

Commits made to the version-specific branches SHALL leave the software in a
usable state; in other words, commits SHALL NOT be merged into
version branches unless the software is believed to be usable after these
commits are applied.

#### Dev Branch

A separate `dev` branch MAY be used for expedient development, then changes
merged into the appropriate version branches as necessary. If this branch is
not present, simply fork this repository, update your fork, then submit pull
requests as appropriate.

#### Master Branch

The `master` branch SHALL be protected from pushed commits. No other requirements
shall be imposed by this standard on the `master` branch. The `master` branch
SHOULD not be expected to be the most up-to-date version. The `master` branch
MAY be entirely unmaintained. If this is the case, the most up-to-date branch
MUST be configured to be the default branch.

#### Tags

Git tags SHALL indicate semantic versions. For example,
a commit tagged `v1.2.3` should be the last commit of all of the changes
that make version 1.2.2 into 1.2.3. Release candidate tags SHOULD be used for
the last commit that goes into a pull request. For instance, if you submit
a pull request that you hope becomes version 1.2.4, and there have been no
other pull requests to produce a potential version 1.2.4, you MAY tag your
pull request's final commit as `v1.2.4-rc1`.

# VerveTronics CloudApp

[![GitHub CI/CD](https://github.com/VTPL-GitHub/vtiotcloudapp/workflows/CI/CD/badge.svg)](https://github.com/VTPL-GitHub/vtiotcloudapp/actions)

Application for monitoring VerveTronics IoT sensor devices.

## Development System Requirements

* 8 GiB RAM + 24 GiB swap (recommended: 16 GiB RAM, 16 GiB swap)
* OS: Windows, Mac OS, or Linux (recommended: Kubuntu Linux 20.04.1 LTS)
* IDE: IntelliJ IDEA Community Edition (recommended: IntelliJ IDEA Ultimate Edition)
* Java 15 (Oracle OpenJDK or Azul Zulu JDK recommended)
* Kotlin 1.6.10 or newer

## How to build and test

### Preparation
- Make sure that Kotlin is on the `PATH`.
  This is needed for auto-detecting `KOTLIN_HOME` in the `Makefile`.

### Using `make`

This is the official way how to build.

Just run `make`.

Note: You need a _PostgreSQL_ database running for this.
The two supported ways are:
* Use a local PostgreSQL with standard setup (user postgresql)
* Use Docker (run `make postgresd`)

For using a local PostgreSQL managed by your operating system, you need to install postgres using `sudo apt-get install postgresql` and then run `make setup-local-postgres` once to create the user, database, and grant the privileges.

For using Docker, you need to run `make postgresd` after booting your machine.

Using Docker is the recommended way.
Using a local PostgreSQL is supported for users for which running PostgreSQL in Docker interfers with other software.
For example, we have observed that connecting JDBC to a PostgreSQL that runs in Docker will prevent a Citrix HDX RealTime Media Engine from working.
If you have to use a Citrix client with the Citrix HDX RealTime Media Engine (for example, to have Skype calls through Citrix), you should use a local PostgreSQL.

### Using Gradle

Run `./gradlew build`.

**Warning:** Only using `make` is the official way.
Running Gradle directly builds with an incomplete environment.
Information like the git commit id will be missing from the build.

## Verification Mechanisms
All verifications except for PiTest are part of the normal build (`make` or `./gradlew build`).

* Static Code Analysis for Java: Checkstyle, PMD, SonarLint
* Static Code Analysis for Kotlin: KtLint, Detekt, SonarLint
* Developer Test Framework (TDD): JUnit 5
* Acceptance Test Framework (BDD): Cucumber
* Code Coverage: Jacoco
* Mutation Coverage: PiTest (currently unused due to issues with Kotlin)

## License
The modules `app-template`, `lib-template`, `lib-nelkinda`, and the build system are open source by Nelkinda Software Craft Pvt Ltd.
They are governed by the MIT License, see file `LICENSE`.

See also module structure, especially allowed module dependencies.

## Module Structure

### Module Types
* `lib-` modules are library modules that are to be used by other modules.
  `lib-` modules MUST NOT have a `main()` method in their production code.
* `app-` modules are application modules that can be run standalone.
  `app-` modules MUST have a `main()` method (or equivalent).
  Each `app-` module (except for `app-template`) is a separate deployable application.
* `poc-` modules are proof of concepts.
  `poc-` modules MAY (but SHOULD NOT) have reduced code coverage.
  `lib-` and `app-` modules MUST NOT depend on `poc`-modules.

### Allowed module dependencies
* `app-` modules MAY depend on `lib-` modules.
* `poc-` modules MAY depend on `lib-` modules.
* `lib-` modules MAY depend on other `lib-` modules.

Modules MUST NOT depend on other modules outside of the above described allowed dependencies.

Modules with code ownership by Nelkinda or an Open Source license MUST NOT depend on modules with code ownership by VerveTronics or a closed source license.


### Module Descriptions
The modules `app-template` and `lib-template` live outside the module structure.

* `app-cloudapp` is the actual cloud application.
* `app-template` is a template for creating Spring applications.
* `lib-cloudprotocol` is an implementation of the cloudapp protocol for implementing servers or clients for that protocol.
* `lib-edgedevicesim` is a simulator for edge-devices based on `lib-cloudprotocol`.
* `lib-nelkinda` is a library that may be used by any module that needs it.
* `lib-nelkinda-test` is a library that may be used by the tests of any module that needs it.
* `lib-template` is a template for creating libraries.
* `poc-flatfile-server` is a proof of concept for creating a flatfile server.
* `poc-protocol-c` is a proof of concept implementation of the protocol in C.

#!/bin/bash
# Source this to put the portable JDK + JMeter on PATH for this HW05 folder.
# Usage: source tools/env.sh
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export JAVA_HOME="$DIR/jdk-21.0.12+8"
export PATH="$JAVA_HOME/bin:$DIR/apache-jmeter-5.6.3/bin:$PATH"

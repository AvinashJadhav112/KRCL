package com.nelkinda.java.io

import com.sun.management.UnixOperatingSystemMXBean
import java.lang.management.ManagementFactory

fun getOpenFileDescriptorCount() =
    (ManagementFactory.getOperatingSystemMXBean() as UnixOperatingSystemMXBean).openFileDescriptorCount

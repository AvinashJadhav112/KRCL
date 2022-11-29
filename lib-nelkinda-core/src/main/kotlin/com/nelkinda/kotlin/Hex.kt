@file:SuppressWarnings("ImplicitDefaultLocale", "TooManyFunctions")
package com.nelkinda.kotlin

import java.lang.String.format

/* ktlint-disable */
fun Byte  ?.hex(): String = format("0x%02x", this)
fun Byte  ?.heX(): String = format("0x%02X", this)
fun UByte ?.hex(): String = format("0x%02x", this?.toByte())
fun UByte ?.heX(): String = format("0x%02X", this?.toByte())
fun Short ?.hex(): String = format("0x%04x", this)
fun Short ?.heX(): String = format("0x%04X", this)
fun UShort?.hex(): String = format("0x%04x", this?.toShort())
fun UShort?.heX(): String = format("0x%04X", this?.toShort())
fun Int   ?.hex(): String = format("0x%08x", this)
fun Int   ?.heX(): String = format("0x%08X", this)
fun UInt  ?.hex(): String = format("0x%08x", this?.toInt())
fun UInt  ?.heX(): String = format("0x%08X", this?.toInt())
fun Long  ?.hex(): String = format("0x%016x", this)
fun Long  ?.heX(): String = format("0x%016X", this)
fun ULong ?.hex(): String = format("0x%016x", this?.toLong())
fun ULong ?.heX(): String = format("0x%016X", this?.toLong())
/* ktlint-enable */

package com.nelkinda.kotlin

private const val BASE_HEX = 16

fun byteArrayOf(hex: String): ByteArray {
    if (hex.length % 2 != 0)
        throw IllegalArgumentException("Hex string must have even length")
    return (if (hex.startsWith("0x")) hex.substring(2) else hex)
        .chunked(2)
        .map { Integer.parseInt(it, BASE_HEX).toByte() }
        .toByteArray()
}

@ExperimentalUnsignedTypes
fun ubyteArrayOf(hex: String): UByteArray = byteArrayOf(hex).asUByteArray()

fun ByteArray.toHexString(): String = joinToString("") { "%02X".format(it) }

@ExperimentalUnsignedTypes
fun UByteArray.toHexString(): String = asByteArray().toHexString()

@ExperimentalUnsignedTypes
@SuppressWarnings("MagicNumber")
fun toInt(data: UByteArray): Int {
    if (data.isEmpty() || data.size > 4)
        throw IllegalArgumentException("Invalid data length {data.length()} for toInt() conversion.")
    var r = 0
    for (b in data) {
        r = r shl 8
        r = r or b.toInt()
    }
    return r
}

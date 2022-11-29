package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.Data
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.mockito.kotlin.inOrder
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoMoreInteractions

@ExperimentalUnsignedTypes
class TlvParserTest {
    @Test
    fun parseEmpty() {
        val expected = mapOf<UByte, List<Data>>()
        val actual = TlvParser().parse(Data(""))
        assertEquals(expected, actual)
    }

    @Test
    fun parseTwoTags() {
        val expected = mapOf(
            0x01U.toUByte() to listOf(Data("1510448901020304")),
            0x02U.toUByte() to listOf(Data("15104513CAFEBABEAFFEAFFE")),
        )
        val actual = TlvParser().parse(Data("01081510448901020304020C15104513CAFEBABEAFFEAFFE"))
        assertEquals(expected, actual)
    }

    @Test
    fun parseListenerEmpty() {
        val listener = mock<TagListener>()
        TlvParser(listener).parse(Data(""))
        verifyNoMoreInteractions(listener)
    }

    @Disabled
    @Test
    fun parseListenerOneTag() {
        val listener = mock<TagListener>()
        TlvParser(listener).parse(Data("0100"))
        verify(listener).invoke(0x01U, Data(""))
        verifyNoMoreInteractions(listener)
    }

    @Disabled
    @Test
    fun parseListenerTwoTags() {
        val listener = mock<TagListener>()
        TlvParser(listener).parse(Data("010203040201FF"))
        val inOrder = inOrder(listener)
        inOrder.verify(listener).invoke(0x01U, Data("0304"))
        inOrder.verify(listener).invoke(0x02U, Data("FF"))
        inOrder.verifyNoMoreInteractions()
    }

    fun interface TagListener : (UByte, Data) -> Unit
}

package com.vervetronics.pocexp4j

import net.objecthunter.exp4j.Expression
import net.objecthunter.exp4j.ExpressionBuilder
import net.objecthunter.exp4j.operator.Operator
import net.objecthunter.exp4j.tokenizer.UnknownFunctionOrVariableException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class Exp4JTest {
    @Test
    fun testExp4J() {
        val e: Expression = ExpressionBuilder("3 * sin(y) - 2 / (x - 2)")
            .variables("x", "y")
            .build()
            .setVariable("x", 2.3)
            .setVariable("y", 3.14)
        val result: Double = e.evaluate()
        println(result)
    }

    @Test
    fun testExp4J2() {
        val e: Expression = ExpressionBuilder("3 * y - 2 / (x - 2)")
            .variables("x", "y")
            .build()
            .setVariable("x", 4.0)
            .setVariable("y", 3.14)
        val result: Double = e.evaluate()
        assertEquals(8.42, result)
    }

    @Test
    fun testCustomFactorialOperator() {
        val factorial: Operator = object : Operator("!", 1, true, Operator.PRECEDENCE_POWER + 1) {
            override fun apply(vararg args: Double): Double {
                val arg = args[0].toInt()
                require(arg.toDouble() == args[0]) { "Operand for factorial has to be an integer" }
                require(arg >= 0) { "The operand of the factorial can not be less than zero" }
                var result = 1.0
                for (i in 1..arg) {
                    result *= i.toDouble()
                }
                return result
            }
        }
        val result: Double = ExpressionBuilder("3!")
            .operator(factorial)
            .build()
            .evaluate()

        val expected = 6.0
        assertEquals(expected, result, 0.0)
    }

    @Test
    fun customAndOperator() {
        val and: Operator = object : Operator("&", 2, true, Operator.PRECEDENCE_ADDITION - 1) {
            override fun apply(vararg args: Double): Double {
                val arg1 = args[0].toInt()
                val arg2 = args[1].toInt()
                return arg1.and(arg2).toDouble()
            }
        }
        val result: Double = ExpressionBuilder("127 & 254")
            .operator(and)
            .build()
            .evaluate()
        val expected = 126.0
        assertEquals(expected, result, 0.0)
    }

    @Test
    fun noSupportForHexYet() {
        assertThrows<UnknownFunctionOrVariableException> {
            ExpressionBuilder("0x100").build()
        }
    }
}

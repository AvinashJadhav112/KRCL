package com.nelkinda.rel

import java.util.concurrent.ConcurrentHashMap
import kotlin.reflect.KClass

class CachingExpressionCompilerDecorator(private val compiler: ExpressionCompiler) : ExpressionCompiler {

    private val cache = ConcurrentHashMap<String, Function<*, *>>()

    override fun <In : Any, Out : Any> compile(
        expression: String,
        inClass: KClass<In>,
        outClass: KClass<Out>,
    ): Function<In, Out> {
        return cache.getOrPut(expression + inClass.simpleName + outClass.simpleName) {
            compiler.compile(expression, inClass, outClass)
        } as Function<In, Out>
    }
}

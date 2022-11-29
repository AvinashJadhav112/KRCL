package com.nelkinda.javax.swing

import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertSame
import org.junit.jupiter.api.Test

/**
 * Unit Test for [IconCache].
 *
 * @author [Christian Hujer](mailto:Christian.Hujer@nelkinda.com), Nelkinda Software Craft Pvt Ltd
 * @version 0.0.2
 * @since 0.0.2
 */
class IconCacheTest {
    /**
     * The [IconCache] under test.
     */
    private val iconCache = IconCache()

    /**
     * Tests that when getting an icon that does not exist from the cache, the cache returns `null`.
     */
    @Test
    fun unavailableImage_returnsNull() {
        assertNull(iconCache[ICON_THAT_DOES_NOT_EXIST])
    }

    /**
     * Tests that when getting an icon that exists from the cache, the cache returns that icon.
     */
    @Test
    fun emptyCache_loadsImage() {
        assertNotNull(iconCache[ICON_THAT_EXISTS])
    }

    /**
     * Tests that two reads for the same icon in the cache return the same image.
     */
    @Test
    fun filledCache_returnsSameImage() {
        val imageIcon1 = iconCache[ICON_THAT_EXISTS]
        val imageIcon2 = iconCache[ICON_THAT_EXISTS]
        assertSame(imageIcon1, imageIcon2)
    }

    companion object {
        /**
         * An icon to test loading icons into the cache.
         */
        private const val ICON_THAT_EXISTS = "toolbarButtonGraphics/general/About16.gif"

        /**
         * An icon that does not exist.
         */
        private const val ICON_THAT_DOES_NOT_EXIST = "this.does.not.exist"
    }
}

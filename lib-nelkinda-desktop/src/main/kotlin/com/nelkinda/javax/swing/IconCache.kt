package com.nelkinda.javax.swing

import java.net.URL
import javax.swing.ImageIcon

/**
 * A cache for icons so that they would not be unnecessarily loaded multiple times.
 *
 * @author [Christian Hujer](mailto:Christian.Hujer@nelkinda.com), Nelkinda Software Craft Pvt Ltd
 * @version 0.0.2
 * @since 0.0.2
 */
class IconCache {
    /**
     * The actual cache with the icons.
     * Key: URL string from which to load the icon.
     * This can be a URL which is still to be resolved via the class loader.
     * Value: The actual ImageIcon.
     */
    private val cache = mutableMapOf<String, ImageIcon?>()

    /**
     * Resolves the `urlString` for a resource using the class loader.
     *
     * @param urlString URL to resolve
     * @return Resolved URL using the class loader.
     */
    private fun getResource(urlString: String): URL? {
        return IconCache::class.java.classLoader.getResource(urlString)
    }

    /**
     * Gets an Icon from the cache.
     * If the icon is not in the cache already, it is loaded to the cache.
     *
     * @param urlString URL for which to get the icon.
     * Relative URLs are resolved using the ClassLoader of IconCache.
     * Absolute URLs are not yet supported.
     * @return The icon from the cache.
     */
    operator fun get(urlString: String): ImageIcon? =
        cache.computeIfAbsent(urlString) {
            val url = getResource(urlString)
            if (url != null) ImageIcon(url) else null
        }
}

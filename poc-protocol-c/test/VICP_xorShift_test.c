#include "VICP_xorShift_test.h"
#include "VICP_protocol.h"
#include <assert.h>
#include <stdbool.h>

void test_VICP_xorShift()
{
#define testCase(initial, expected, ...) \
    do { \
        uint8_t data[] = { __VA_ARGS__ }; \
        assert(expected == VICP_xorShift(data, sizeof(data), initial)); \
    } while (false)

    testCase(0, 0);
    testCase(0, 1, 0x01);
    testCase(0, 3, 0x01, 0x01);
    testCase(0, 0xF0F, 0xF0, 0x00, 0x00, 0x00, 0x0F);
    testCase(0x8000, 0x0001, 0x00);

#undef testCase
}

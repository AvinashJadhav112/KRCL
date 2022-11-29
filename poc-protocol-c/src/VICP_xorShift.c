#include "VICP_protocol.h"

uint_fast16_t VICP_xorShift(const void *data, size_t length, uint_fast16_t checksum) {
    const uint8_t *ptr = data;
    while (length-- > 0) {
        checksum = (checksum << 1u) | (((checksum & 0x8000u) >> 15u) & 0x7FFFu);
        checksum ^= *ptr++;
    }
    return checksum & 0xFFFFu;
}

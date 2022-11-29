#include "VICP_send_test.h"
#include "VICP_protocol.h"
#include <assert.h>
#include <string.h>
#include <sys/socket.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <err.h>

void hexdump(const void *pVoid, size_t length)
{
    const uint8_t *ptr = pVoid;
    while (length--) {
        printf("%02x ", *ptr++);
    }
    printf("\n");
}

void test_VICP_updateMessage() {
    union
    {
        struct VICP_message message;
        uint8_t raw[256];
    } buffer;
    VICP_initMessage(&buffer.message);

    VICP_updateMessage(&buffer.message, HANDSHAKE_REQUEST, 0);

    uint8_t expected[] = {
            0xAA, 0x55, 0xAA, 0x55, // preamble
            0x14, 0x10, // checksum
            0x00, 0x00, // deviceId
            0x00, 0x00, // sequenceNumber
            0x00, 0x01, // messageType
            0x00, 0x00, // dataLength
    };
    hexdump(expected, sizeof(expected));
    hexdump(&buffer, sizeof(expected));
    assert(0 == memcmp(&buffer, expected, sizeof(expected)));
}

// Demonstration of how sockets work.
// Used for developing further tests.
void test_OpenSocket() {
    int sockets[2];
    int result = socketpair(AF_UNIX, SOCK_STREAM, 0, sockets);
    if (result != 0)
        abort();
    const char hello[] = "Hello\n";
    write(sockets[0], hello, sizeof(hello));
    fprintf(stderr, "Written\n");
    uint8_t buf[256];
    ssize_t bytesRead = read(sockets[1], buf, 256);
    if (bytesRead == -1)
        err(1, NULL);
    fprintf(stderr, "Received: %zd\n", bytesRead);
    fwrite(buf, bytesRead, 1, stdout);
}
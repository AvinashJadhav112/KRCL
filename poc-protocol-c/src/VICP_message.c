#include "VICP_protocol.h"
#include <arpa/inet.h>
#include <stdio.h>
#include <inttypes.h>

void VICP_initMessage(struct VICP_message *message) {
    message->preamble = htonl(PREAMBLE);
    message->deviceId = 0;
    message->sequenceNumber = htons(0xFFFFu);
}

void VICP_updateMessage(struct VICP_message *message, enum MessageType messageType, size_t length) {
    message->sequenceNumber = htons(ntohs(message->sequenceNumber) + 1);
    message->messageType = htons(messageType);
    message->dataLength = htons(length);
    message->checksum = 0;
    uint_fast16_t checksum = VICP_xorShift(message, sizeof(*message) + length, 0);
    message->checksum = htons(checksum);
    fprintf(stderr, "0x%04" PRIxFAST16 "\n", checksum);
}

#ifndef VICP_PROTOCOL_H
#define VICP_PROTOCOL_H

#include <stdint.h>
#include <stddef.h>

#define PREAMBLE UINT32_C(0xAA55AA55)

enum MessageType {
    HANDSHAKE_REQUEST = 0x0001,
    HANDSHAKE_RESPONSE = 0x0002,
    CONFIG_REQUEST = 0x0003,
    CONFIG_RESPONSE = 0x0004,
    DEVICE_INFO_REQUEST = 0x0005,
    DEVICE_INFO_RESPONSE = 0x0006,
    MONITOR_DATA = 0x0007,
    MONITOR_DATA_RESPONSE = 0x0008,
    FIRMWARE_DOWNLOAD_REQUEST = 0x0009,
    FIRMWARE_DOWNLOAD_RESPONSE = 0x000A,
};

enum Tag {
    TAG_VERSION = 0x01,
    TAG_GSM_SIGNAL_STRENGTH = 0x02,
    TAG_FACTORY_DEVICE_ID = 0x03,
    TAG_ACK = 0x04,
};

// All fields kept in Big Endian
struct VICP_message {
    uint32_t preamble; // Always htonl(0xAA55AA55), set by VICP_initMessage
    uint16_t checksum; // htons(xorShift) of the entire message with checksum set to 0
    uint16_t deviceId; // First 0, then to be set after the first response from the server
    uint16_t sequenceNumber; // set by VICP_initMessage and VICP_sendMessage
    uint16_t messageType; // enum MessageType, set by user
    uint16_t dataLength; // set by user, dataLength <= sizeof(data) - 2 (keep 2 bytes in data for the checksum)
    uint8_t data[]; // set by user, last 2 bytes (not included in dataLength) checksum
} __attribute__((packed));

extern uint_fast16_t VICP_xorShift(const void *data, size_t length, uint_fast16_t checksum);

extern void VICP_initMessage(struct VICP_message *message);
extern void VICP_updateMessage(struct VICP_message *message, enum MessageType messageType, size_t length);

#endif

package com.vervetronics.cloudapp.protocol.error

import com.vervetronics.cloudapp.protocol.error.Error.HANDSHAKE_MISSING

@ExperimentalUnsignedTypes
class HandshakeMissing : NonRecoverableProtocolError(HANDSHAKE_MISSING, "Handshake Missing")

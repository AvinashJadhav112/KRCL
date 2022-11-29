package com.vervetronics.cloudapp.protocol.error

@ExperimentalUnsignedTypes
class MandatoryTagMissing constructor(tag: UByte) :
    NonRecoverableProtocolError(Error.MANDATORY_TAG_MISSING, "Mandatory Tag 0x%02X Missing".format(tag.toInt()))

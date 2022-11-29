package com.vervetronics.cloudapp.protocol.error

import java.time.temporal.Temporal

@ExperimentalUnsignedTypes
class FutureDateOrTime(newDate: Temporal) :
    RecoverableProtocolError(
        Error.FUTURE_DATE_OR_TIME,
        "Future Date or Time %s".format(newDate),
    )

#include "VICP_send_test.h"
#include "VICP_xorShift_test.h"

int main(void) {
    test_OpenSocket();
    test_VICP_updateMessage();
    test_VICP_xorShift();
}

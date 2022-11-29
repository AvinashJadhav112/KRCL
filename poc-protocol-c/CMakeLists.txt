cmake_minimum_required(VERSION 3.16)
project(poc-protocol-c LANGUAGES C VERSION 0.0.1)

set(CMAKE_C_STANDARD 11)
#set(CMAKE_C_FLAGS "-W -Wall -pedantic -Werror")

add_library(
        poc-protocol
        include/VICP_protocol.h
        src/VICP_xorShift.c
        src/VICP_message.c)

add_executable(
        poc-protocol-test
        test/test_main.c
        test/VICP_send_test.c
        test/VICP_send_test.h
        test/VICP_xorShift_test.c
        test/VICP_xorShift_test.h
)
target_link_libraries(poc-protocol-test poc-protocol)
include_directories(include)

enable_testing()
add_test(poc-protocol-test poc-protocol-test)

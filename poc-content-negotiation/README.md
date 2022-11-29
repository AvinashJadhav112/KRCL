# `poc-content-negotiation`

The purpose of this PoC is to find out if and how HTTP Content Negotiation can be used to create endpoints that can deliver CSV alternatively to JSON.

Content Negotiation is a mechanism in HTTP by which the user agent can negotiate the presentation of a resource.
For this, the user agent supplies an `Accept:` header with the request.
For example, the same resource could be represented in CSV, JSON, and XML.

// Public certificate of the MAYA CA (Xentoryx Labs). The website database on the VPS
// (api.themaya.site:5433) presents a certificate signed by it; pinned with sslmode=verify-full.
// Public data, safe to commit. The CA private key is not in this repo.
export const MAYA_DB_CA = `-----BEGIN CERTIFICATE-----
MIIBtDCCAVugAwIBAgIUZjeLCJpiPJl4gmgUJyU714sPXkswCgYIKoZIzj0EAwIw
MDEWMBQGA1UECgwNWGVudG9yeXggTGFiczEWMBQGA1UEAwwNTUFZQSBMb2NhbCBD
QTAeFw0yNjExMDYwNjQ2MDJaFw0zNjExMDMwNjQ2MDJaMDAxFjAUBgNVBAoMDVhl
bnRvcnl4IExhYnMxFjAUBgNVBAMMDU1BWUEgTG9jYWwgQ0EwWTATBgcqhkjOPQIB
BggqhkjOPQMBBwNCAATiua1mKPVhH3TdRfgWu8qAyeYK3d5bLEGp3PMQlKNW6Iu4
ZMlLIjsfqaVukyvlGmLiJJQyokCFFaq7p+r3QaL8o1MwUTAdBgNVHQ4EFgQUTuFx
jllwmHpqUcqSuAwjew2cLq0wHwYDVR0jBBgwFoAUTuFxjllwmHpqUcqSuAwjew2c
Lq0wDwYDVR0TAQH/BAUwAwEB/zAKBggqhkjOPQQDAgNHADBEAiAZa7r1Bs7dGbBM
FN6VsqYl7oCuE9KdEGMlHdbEZujZaAIgUd+H9ugfNWizQTHsRMblAHYLrU7hbTXB
BvBje6owqbY=
-----END CERTIFICATE-----`;

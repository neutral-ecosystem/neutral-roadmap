# Neutral v0 secret-delivery capability fixtures

These cases separate Neutral type checking from a selected consumer/profile's
broker capabilities. They do not resolve a secret.

| Declared shape | Profile capability | Expected result |
| --- | --- | --- |
| `SecretRef<string>` | Supports `string` delivery | Neutral accepts; profile capability check succeeds |
| `SecretRef<Ref<Config>>` | Does not support reference delivery | Neutral type is well formed; profile emits unsupported-delivery-shape before broker access |
| `SecretRef<List<SecretRef<string>>>` | Does not support nested secret handles | Neutral type is well formed; profile emits unsupported-delivery-shape before broker access |
| Bare `SecretRef` | Irrelevant | Neutral rejects malformed generic type before profile validation |

No diagnostic or fixture output may disclose the secret identifier.

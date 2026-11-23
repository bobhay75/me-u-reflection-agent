import vinext from 'vinext';
import { defineConfig } from 'vite';

// A checkout must build without private Sites-generated modules or bindings.
// This configuration targets a standalone Node server; hosting adapters can be
// supplied by the target platform without changing the reflection application.
export default defineConfig({ plugins: [vinext()] });

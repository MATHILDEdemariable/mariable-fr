import { assertEquals } from 'https://deno.land/std@0.190.0/testing/asserts.ts';
import { escapeEmailHtml } from './emailSecurity.ts';

Deno.test('email text escapes HTML and attribute delimiters', () => {
  assertEquals(escapeEmailHtml('<img src=x onerror="alert(1)"> & \'test\''),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;test&#39;');
});
Deno.test('email text handles absent and numeric values', () => {
  assertEquals(escapeEmailHtml(null), '');
  assertEquals(escapeEmailHtml(12), '12');
});
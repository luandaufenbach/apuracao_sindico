Text field with label, hint and error — use for any free-text entry (search, email, amounts, long-form with `multiline`).

```jsx
<Input label="Email" type="email" placeholder="you@team.xyz" required />
<Input label="Amount" suffix="USDC" inputMode="decimal" hint="Min. 10 USDC" />
<Input iconLeft="search" placeholder="Search docs" size="sm" />
<Input label="Describe the issue" multiline rows={5} error="Required" />
```

- Labels sit above, sentence case. Never use placeholder as the only label.
- 16px input text on all sizes so mobile Safari doesn't zoom.

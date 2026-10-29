Expandable rows for FAQs and tiered details; keeps long content scannable on mobile.

```jsx
<Accordion items={[{ title: 'When is the deadline to apply?', content: 'Applications are reviewed on a rolling basis.' }]} />
<Accordion numbered accentOpen defaultOpen={['2']} items={tiers} />
<Accordion variant="divided" type="multiple" items={faq} />
```

Blocking confirmation or short task (submit report, connect wallet). Becomes a bottom sheet on phones.

```jsx
<Dialog open={open} onClose={() => setOpen(false)} title="Submit report" description="We reply within 48 hours."
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button>Submit</Button></>}>
  <Input label="Summary" />
</Dialog>
```

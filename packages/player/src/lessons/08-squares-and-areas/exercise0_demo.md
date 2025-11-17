# Lesson 8 — Squares & Areas • "Paint the Wall"

## Real-World Hook

You need to paint a wall that's **3 m × 3 m**.  
One coat of paint covers **9 m²/L**.

```js
askForEstimation({ prompt: "What is the area of the wall in m²?", expect: 9, units: "m²" });
```

```js
resetSlideRule();
```

Now align the inner disk so its **1** lines up with **3** on the outer ring.

### Check

```js
waitForAlignmentTo(3);
```

Now, take a look at **3** on the inner ring, then type the area shown on the outer ring.

```js
askForEstimation({ prompt: "What area do you see on the outer ring?", expect: 9, units: "m²" });
```

Perfect! 3 × 3 = 9 m².

Since one coat covers 9 m²/L, you need **1 liter** for one coat.  
For three coats: **3 liters** total.

```js
askForEstimation({
  prompt: "If the wall were 5 m × 5 m, how many litres for three coats?",
  expect: 8.33,
  tolerance: 0.5,
  units: "L",
});
```

# Lesson 6 — Orders of Magnitude • "Rank-the-Weights"

## Real-World Hook

Our brains are great at telling a baseball from a bus, but they struggle with vast differences in scale. Is a grain of sand closer in weight to an eyelash or to a baseball? Is a motorcycle closer to a baseball or a school bus?

Thinking in orders of magnitude helps us develop a feel for these scales. Let's see how well you can rank objects by their mass before we use the slide rule for precise comparisons.

Let's try a more hands-on task. Drag the objects below to arrange them by weight, from lightest on the left to heaviest on the right.

```js
createManualSorter({
  "School bus": "7e4",
  "Grain of sand": "0.0004",
  Eyelash: "0.02",
  Baseball: "1.3",
  Motorcycle: "250",
});
```

### Check

```
waitForSorterComplete()
```

#### Correct

Great job! You've correctly arranged the objects from lightest to heaviest. The order shows a huge range - from a grain of sand at 0.0004 grams to a school bus at 70,000 grams!

#### Incorrect

Not quite right. Remember to think about the relative scale of each object. A grain of sand is tiny, an eyelash is very light, a baseball fits in your hand, a motorcycle is heavy machinery, and a school bus is massive!

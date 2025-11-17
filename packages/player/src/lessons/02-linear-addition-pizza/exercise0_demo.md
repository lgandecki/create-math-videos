# Lesson 2 — Linear Addition • “How Far for Pizza?”

## Exercise Flow

School just ended and you are **250 m** from the bus stop;  
the pizzeria is **450 m** farther east.

```ts
askForEstimation({ prompt: "How far will you have walked?", expect: 700 });
```

```ts
showLinearSlideRule();
```

Now slide the inner ring so its **0** lines up with **250 m** on the outer ring.

### Check

```ts
waitForAlignmentLinear(250);
```

Take a look at **450 m** on the inner ring, then type the total distance shown on the outer ring.

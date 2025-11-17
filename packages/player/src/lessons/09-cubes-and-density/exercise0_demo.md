# Lesson 9 — Cubes & Density • "Steel vs. Styrofoam"

## Exercise Flow

Calculate the mass of a 10 cm cube of steel (ρ = 7.8 g/cm³)

```ts
setCube({
  side: 10,
  density: 7.8,
  units: "g/cm³",
  cubeType: "steel",
  tolerance: 100,
});
```

### Check

```js
waitForCorrectAnswer();
```

#### Incorrect Answer

Not quite yet.. Try using the formula: Mass = Density × Volume

#### Correct Answer

Good job! You've correctly calculated the mass of the steel cube!

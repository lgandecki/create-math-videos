# Lesson 1: Guided Practice

## Exercise Flow

Now, it's your turn. I'll guide you step by step to multiply 4 by 2.

```js
trackMultiplication(4, 2);
askForEstimation({ prompt: "First, let me know, what do you think would be the result?", expect: 8 });
```

Now, move the inner circle so that its “1” aligns with “4” on the outer circle. I’ll wait for you.

### Check

```js
waitForAlignmentTo(4);
```

Now, look at the number “2” on the inner circle.

The answer is on the outer circle right next to it.

```js
askForEstimation({ prompt: "Please type your answer to me.", expect: 8 });
```

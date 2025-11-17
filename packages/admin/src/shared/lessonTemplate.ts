export const lessonTemplate = `## Notes for AI Guide

This lesson explains the concepts of... 

Anticipate common misunderstandings: ...

## Content

Please change me in the admin panel.

\`\`\`
askForEstimation({
  question: "Have you made changes in the admin panel?",
  expect: "not yet",
});
\`\`\`

Since I see this question, I'm assuming you haven't.

\`\`\`
ask({ question: "Have you done it now?", expect: "increase" });
\`\`\`
`;

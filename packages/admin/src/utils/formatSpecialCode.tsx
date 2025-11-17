import React from "react";

function camelCaseToSentence(str: string) {
  const result = str.replace(/([A-Z])/g, " $1");
  return (
    result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()
  ).trim();
}

const parseObjectString = (objStr: string): Record<string, any> | null => {
  try {
    const content = objStr.trim();
    if (!content.startsWith("{") || !content.endsWith("}")) {
      return null;
    }

    const objectContent = content.slice(1, -1).trim();
    // This regex handles keys (identifiers) and values (double-quoted strings or numbers).
    const regex = /([\w\d_]+)\s*:\s*("(?:[^"\\]|\\.)*"|-?\d*\.?\d+)/g;
    const result: Record<string, any> = {};
    let match;
    while ((match = regex.exec(objectContent))) {
      const key = match[1];
      let value: string | number = match[2];

      if (value.startsWith('"')) {
        // It's a string, so parse it to handle escapes
        value = JSON.parse(value);
      } else {
        // It's a number
        value = parseFloat(value);
      }
      result[key] = value;
    }

    // A simple validation to ensure we've parsed something.
    if (Object.keys(result).length === 0) {
      const plainMatch = objStr.match(/{\s*([^}]+)\s*}/);
      if (plainMatch && !plainMatch[1].includes(":")) {
        return null;
      }
      if (Object.keys(result).length === 0 && objStr.includes(":")) {
        return null;
      }
    }

    return result;
  } catch (e) {
    // If parsing fails for any reason, we return null.
    return null;
  }
};

export const formatSpecialCode = (code: string): React.ReactNode | null => {
  const trimmedCode = code.trim();
  // This regex captures the function name and its arguments.
  // It allows for an optional semicolon at the end.
  const match = trimmedCode.match(/^(\w+)\(([\s\S]*)\);?$/);

  if (!match) return null;

  const functionName = match[1];
  let argsString = match[2].trim();
  // Handles trailing commas in the object definition for better flexibility.
  if (argsString.endsWith(",")) {
    argsString = argsString.slice(0, -1);
  }

  switch (functionName) {
    case "askForEstimation":
    case "ask":
    case "askEstimation": {
      const parsedObject = parseObjectString(argsString);
      if (!parsedObject) return null;

      let askText: string;
      if (functionName === "askForEstimation") {
        askText = "Ask To Estimate:";
      } else if (functionName === "ask") {
        askText = "Ask:";
      } else {
        // askEstimation
        askText = "Ask To Estimate:";
      }

      return (
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "0.5em" }}>
            User Interaction
          </h3>
          <p style={{ margin: 0, marginLeft: "1em" }}>
            <strong>{askText}</strong> "
            {parsedObject.question || parsedObject.prompt}"
          </p>
          <p style={{ margin: 0, marginLeft: "1em" }}>
            <strong>Expected Answer:</strong> "{parsedObject.expect}"
          </p>
        </div>
      );
    }
    default: {
      // Attempt to parse as an object for generic function calls with object arguments
      const parsedObject = parseObjectString(argsString);
      if (parsedObject) {
        const title = `${camelCaseToSentence(functionName)}:`;
        return (
          <div>
            <strong>{title}</strong>
            <ul
              style={{ margin: 0, paddingLeft: "20px", listStyleType: "'* '" }}
            >
              {Object.entries(parsedObject).map(([key, value]) => (
                <li key={key}>
                  {key}: "{String(value)}"
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Fallback for single-argument or no-argument functions
      let displayArg = argsString;
      if (
        (displayArg.startsWith('"') && displayArg.endsWith('"')) ||
        (displayArg.startsWith("'") && displayArg.endsWith("'"))
      ) {
        displayArg = displayArg.substring(1, displayArg.length - 1);
      }

      return (
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "0.5em" }}>Action</h3>
          <p style={{ margin: 0, marginLeft: "1em" }}>
            <strong>{camelCaseToSentence(functionName)}</strong>
            {displayArg && `: ${displayArg}`}
          </p>
        </div>
      );
    }
  }
};

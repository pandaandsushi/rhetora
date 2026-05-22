const parseModelJson = (text) => {
  if (!text) {
    return null;
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    return null;
  }

  const sliced = text.slice(start, end + 1);
  try {
    return JSON.parse(sliced);
  } catch {
    return null;
  }
};

export default parseModelJson;

const toSingleString = (value) => {
  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === "string" && item.trim());
    return first?.trim();
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return undefined;
};

const getLlmOptionsFromRequest = (req) => {
  const provider =
    toSingleString(req.body?.llmProvider) ||
    toSingleString(req.query?.llmProvider) ||
    toSingleString(req.headers["x-llm-provider"]);

  const model =
    toSingleString(req.body?.llmModel) ||
    toSingleString(req.query?.llmModel) ||
    toSingleString(req.headers["x-llm-model"]);

  return {
    ...(provider ? { provider } : {}),
    ...(model ? { model } : {}),
  };
};

export { getLlmOptionsFromRequest };

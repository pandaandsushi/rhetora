export const getEvaluationRouteByMode = (mode: string) => {
  const normalizedMode = mode.toLowerCase();

  if (normalizedMode.includes("storytelling")) {
    return "/storytelling-evaluation";
  }

  if (normalizedMode.includes("story mode")) {
    return "/story-mode-evaluation";
  }

  if (normalizedMode.includes("pitch")) {
    return "/pitch-lab-evaluation";
  }

  if (normalizedMode.includes("filler")) {
    return "/filler-free-evaluation";
  }

  if (normalizedMode.includes("vr")) {
    return "/vr-evaluation";
  }

  return "/home";
};
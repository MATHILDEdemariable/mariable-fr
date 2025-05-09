export const extractMetas = (
  form: Record<string, any>,
  exclude: string[] = ["id", "slug"]
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(form)
      .filter(
        ([key, value]) =>
          !exclude.includes(key) &&
          value !== null &&
          value !== undefined
      )
      .map(([key, value]) => [key, String(value)])
  );
};

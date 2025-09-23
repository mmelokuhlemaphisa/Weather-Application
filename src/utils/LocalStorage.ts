export const saveLocation = (city: string) => {
  const saved = JSON.parse(localStorage.getItem("locations") || "[]");
  if (!saved.includes(city)) saved.push(city);
  localStorage.setItem("locations", JSON.stringify(saved));
};

export const getLocations = (): string[] => {
  return JSON.parse(localStorage.getItem("locations") || "[]");
};

export const removeLocation = (city: string) => {
  const saved = JSON.parse(localStorage.getItem("locations") || "[]");
  const updated = saved.filter((loc: string) => loc !== city);
  localStorage.setItem("locations", JSON.stringify(updated));
};

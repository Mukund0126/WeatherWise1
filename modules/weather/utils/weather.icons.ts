export const weatherIcons = {
  getIconByCode(code?: number, text = ""): string {
    const textLower = text.toLowerCase();

    if (code === 1000) return "sun";
    if (code === 1003) return "cloud-sun";

    if (code && [1006, 1009, 1030, 1135, 1147].includes(code)) return "cloud";

    if (
      code &&
      [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201].includes(code)
    ) {
      return "cloud-drizzle";
    }

    if (
      code &&
      [
        1186, 1189, 1192, 1195, 1240, 1243, 1246, 1273, 1276, 1279, 1282,
      ].includes(code)
    ) {
      return "cloud-rain";
    }

    // Text back-up matchers
    if (textLower.includes("sunny") || textLower.includes("clear")) return "sun";
    if (textLower.includes("partly cloudy")) return "cloud-sun";
    if (
      textLower.includes("thunder") ||
      textLower.includes("rain") ||
      textLower.includes("shower")
    ) {
      return "cloud-rain";
    }
    if (
      textLower.includes("drizzle") ||
      textLower.includes("mist") ||
      textLower.includes("sleet") ||
      textLower.includes("snow") ||
      textLower.includes("patchy")
    ) {
      return "cloud-drizzle";
    }
    if (
      textLower.includes("cloud") ||
      textLower.includes("overcast") ||
      textLower.includes("fog")
    ) {
      return "cloud";
    }

    return "cloud-sun";
  },
};

export default weatherIcons;

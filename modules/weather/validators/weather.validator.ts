export const weatherValidator = {
  validateCity(city: unknown): { isValid: boolean; error?: string } {
    if (typeof city !== "string") {
      return { isValid: false, error: "City name must be a string." };
    }
    const trimmed = city.trim();
    if (!trimmed) {
      return { isValid: false, error: "City name cannot be empty." };
    }
    if (trimmed.length < 2) {
      return { isValid: false, error: "City name must be at least 2 characters long." };
    }
    const cityRegex = /^[a-zA-Z0-9\s\-',():]+$/;
    if (!cityRegex.test(trimmed)) {
      return { isValid: false, error: "City name contains invalid characters." };
    }
    return { isValid: true };
  },

  validateCoords(
    lat: unknown,
    lon: unknown
  ): { isValid: boolean; error?: string } {
    const latitude = Number(lat);
    const longitude = Number(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return { isValid: false, error: "Latitude and Longitude must be numbers." };
    }

    if (latitude < -90 || latitude > 90) {
      return { isValid: false, error: "Latitude must be between -90 and 90." };
    }

    if (longitude < -180 || longitude > 180) {
      return { isValid: false, error: "Longitude must be between -180 and 180." };
    }

    return { isValid: true };
  },
};

export default weatherValidator;

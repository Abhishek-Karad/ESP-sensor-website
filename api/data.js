let readings = []; // in-memory storage (resets on every deployment)

module.exports = (req, res) => {
  if (req.method === "POST") {
    try {
      const { temperature, humidity } = req.body;

      if (typeof temperature !== "number" || typeof humidity !== "number") {
        return res.status(400).json({ error: "Invalid data" });
      }

      const reading = {
        temperature,
        humidity,
        createdAt: new Date().toISOString(),
      };

      readings.unshift(reading); // add new at the start
      if (readings.length > 10) readings = readings.slice(0, 10); // keep only last 10

      return res.status(201).json({ message: "Data saved", reading });
    } catch (err) {
      return res.status(500).json({ error: "Failed to save data" });
    }
  }

  if (req.method === "GET") {
    return res.status(200).json(readings);
  }

  return res.status(405).json({ error: "Method not allowed" });
};

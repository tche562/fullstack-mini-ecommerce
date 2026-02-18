import express from "express";

const app = express();
const PORT = 3001;

app.get("/health", (_req, res) => {
  res.send("ok");
});

app.get("/api/product", (req, res) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({
    id: 1,
    title: "Classic Tee",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 75.0,
    imageURL:
      "https://mrdevelopertestassets.s3.ap-southeast-2.amazonaws.com/classic-tee.jpg",
    sizeOptions: [
      { id: 1, label: "S" },
      { id: 2, label: "M" },
      { id: 3, label: "L" },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Backend running: http://localhost:${PORT}`);
});

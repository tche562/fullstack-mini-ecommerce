import express from "express";

const app = express();
const PORT = 3001;

app.get("/health", (_req, res) => {
  res.send("ok");
});

app.get("/api/product", (req, res) => {
  const base = {
    id: 1,
    title: "Classic Tee",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 75,
    imageURL:
      "https://mrdevelopertestassets.s3.ap-southeast-2.amazonaws.com/classic-tee.jpg",
    sizeOptions: [
      { id: 1, label: "S" },
      { id: 2, label: "M" },
      { id: 3, label: "L" },
    ],
  };

  const variant = String(req.query.variant || "");

  let out = base;

  if (variant === "dirtyPrice") {
    out = { ...base, price: "abc" };
  } else if (variant === "noSizes") {
    out = { ...base, sizeOptions: [] };
  } else if (variant === "longLabel") {
    // keep schema compatible but remove label and provide long
    out = {
      ...base,
      sizeOptions: [
        { id: 1, long: "Small" },
        { id: 2, long: "Medium" },
        { id: 3, long: "Large" },
      ],
    };
  } else if (variant === "missingLabelAndLong") {
    // label/long both missing -> frontend should fallback to String(id)
    out = { ...base, sizeOptions: [{ id: 1 }, { id: 2 }, { id: 3 }] };
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(out);
});

app.listen(PORT, () => {
  console.log(`Backend running: http://localhost:${PORT}`);
});

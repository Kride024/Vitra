import React, { useState } from "react";

const MedicineComparator = () => {
  // -------------------- Medicine Database --------------------
  const medicines = [
  // Fever / Pain
  {
    name: "Paracetamol 500mg",
    generic: "Acetaminophen",
    diseases: ["Fever", "Headache", "Body Pain", "Cold"],
    brands: [
      { brand: "Crocin", price: 35 },
      { brand: "Calpol", price: 32 },
      { brand: "Dolo 650", price: 28 },
      { brand: "Generic Paracetamol", price: 18 }
    ]
  },
  {
    name: "Ibuprofen 400mg",
    generic: "Ibuprofen",
    diseases: ["Body Pain", "Toothache", "Inflammation", "Fever"],
    brands: [
      { brand: "Brufen", price: 40 },
      { brand: "Ibugesic", price: 38 },
      { brand: "Advil", price: 45 },
      { brand: "Generic Ibuprofen", price: 22 }
    ]
  },

  // Cold & Allergy
  {
    name: "Cetirizine 10mg",
    generic: "Cetirizine",
    diseases: ["Allergy", "Cold", "Sneezing", "Skin Allergy"],
    brands: [
      { brand: "Cetzine", price: 25 },
      { brand: "Okacet", price: 22 },
      { brand: "Alerid", price: 28 },
      { brand: "Generic Cetirizine", price: 15 }
    ]
  },
  {
    name: "Levocetirizine 5mg",
    generic: "Levocetirizine",
    diseases: ["Allergy", "Runny Nose", "Sneezing"],
    brands: [
      { brand: "Xyzal", price: 35 },
      { brand: "Levozet", price: 30 },
      { brand: "LCZ", price: 28 },
      { brand: "Generic Levocetirizine", price: 18 }
    ]
  },

  // Acidity / Gas
  {
    name: "Pantoprazole 40mg",
    generic: "Pantoprazole",
    diseases: ["Acidity", "Gastric Problem", "Ulcer", "Heartburn"],
    brands: [
      { brand: "Pantocid", price: 90 },
      { brand: "Pan 40", price: 85 },
      { brand: "Pantodac", price: 88 },
      { brand: "Generic Pantoprazole", price: 55 }
    ]
  },
  {
    name: "Omeprazole 20mg",
    generic: "Omeprazole",
    diseases: ["Acidity", "Gas", "Heartburn"],
    brands: [
      { brand: "Omez", price: 75 },
      { brand: "Ocid", price: 70 },
      { brand: "Protoloc", price: 78 },
      { brand: "Generic Omeprazole", price: 50 }
    ]
  },

  // Infection
  {
    name: "Amoxicillin 500mg",
    generic: "Amoxicillin",
    diseases: ["Bacterial Infection", "Throat Infection", "Ear Infection"],
    brands: [
      { brand: "Mox", price: 95 },
      { brand: "Amoxil", price: 110 },
      { brand: "Novamox", price: 100 },
      { brand: "Generic Amoxicillin", price: 70 }
    ]
  },
  {
    name: "Azithromycin 500mg",
    generic: "Azithromycin",
    diseases: ["Chest Infection", "Bacterial Infection", "Typhoid"],
    brands: [
      { brand: "Azee", price: 120 },
      { brand: "Azax", price: 110 },
      { brand: "Zithromax", price: 150 },
      { brand: "Generic Azithromycin", price: 85 }
    ]
  },

  // Diabetes
  {
    name: "Metformin 500mg",
    generic: "Metformin",
    diseases: ["Diabetes Type 2"],
    brands: [
      { brand: "Glycomet", price: 55 },
      { brand: "Glucophage", price: 75 },
      { brand: "Obimet", price: 60 },
      { brand: "Generic Metformin", price: 40 }
    ]
  },

  // Blood Pressure
  {
    name: "Amlodipine 5mg",
    generic: "Amlodipine",
    diseases: ["High Blood Pressure", "Hypertension"],
    brands: [
      { brand: "Amlong", price: 60 },
      { brand: "Amlip", price: 55 },
      { brand: "Amlovas", price: 65 },
      { brand: "Generic Amlodipine", price: 35 }
    ]
  },

  // Vomiting / Nausea
  {
    name: "Ondansetron 4mg",
    generic: "Ondansetron",
    diseases: ["Vomiting", "Nausea", "Food Poisoning"],
    brands: [
      { brand: "Emeset", price: 85 },
      { brand: "Ondem", price: 80 },
      { brand: "Vomikind", price: 75 },
      { brand: "Generic Ondansetron", price: 50 }
    ]
  },

  // ORS / Dehydration
  {
    name: "ORS Powder",
    generic: "Oral Rehydration Salts",
    diseases: ["Dehydration", "Diarrhea", "Vomiting"],
    brands: [
      { brand: "Electral", price: 20 },
      { brand: "Prolyte", price: 18 },
      { brand: "Enerzal", price: 22 },
      { brand: "Generic ORS", price: 12 }
    ]
  },

  // Asthma
  {
    name: "Salbutamol Inhaler",
    generic: "Salbutamol",
    diseases: ["Asthma", "Breathing Problem"],
    brands: [
      { brand: "Asthalin", price: 150 },
      { brand: "Ventorlin", price: 165 },
      { brand: "Salbair", price: 140 },
      { brand: "Generic Salbutamol", price: 110 }
    ]
  }
];

  // -------------------- States --------------------
  const [search, setSearch] = useState("");
const [results, setResults] = useState([]);

const handleSearch = (e) => {
  const value = e.target.value.toLowerCase();
  setSearch(value);

  if (!value) {
    setResults([]);
    return;
  }

  const filtered = medicines.filter((med) =>
    // Search in medicine name
    med.name.toLowerCase().includes(value) ||

    // Search in generic name
    med.generic.toLowerCase().includes(value) ||

    // Search in disease names
    med.diseases.some((disease) =>
      disease.toLowerCase().includes(value)
    ) ||

    // Search in brand names
    med.brands.some((brand) =>
      brand.brand.toLowerCase().includes(value)
    )
  );

  setResults(filtered);
};

  return (
  <div id="medicine-comparator" style={styles.section}>
    <h2 style={styles.title}>Medicine & Disease Comparator</h2>

    <input
      type="text"
      placeholder="Search by medicine OR disease (e.g. fever, vomiting, crocin)"
      value={search}
      onChange={handleSearch}
      style={styles.input}
    />

    {/* Show message if nothing found */}
    {search && results.length === 0 && (
      <p style={{ color: "#ff6b6b", marginTop: "20px" }}>
        No medicine found for "{search}"
      </p>
    )}

    {/* Show Results */}
    {results.length > 0 &&
      results.map((medicine, index) => {
        const cheapest = Math.min(
          ...medicine.brands.map((b) => b.price)
        );

        return (
          <div key={index} style={styles.card}>
            <h3>{medicine.name}</h3>

            <p style={styles.generic}>
              Generic: {medicine.generic}
            </p>

            <p style={styles.disease}>
              Recommended For: {medicine.diseases.join(", ")}
            </p>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {medicine.brands.map((brand, i) => (
                  <tr
                    key={i}
                    style={
                      brand.price === cheapest
                        ? styles.cheapestRow
                        : styles.row
                    }
                  >
                    <td style={styles.td}>{brand.brand}</td>
                    <td style={styles.td}>₹{brand.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.suggestion}>
              💡 Cheapest Option: ₹{cheapest}
            </div>
          </div>
        );
      })}
  </div>
);
};
// -------------------- Styles --------------------

const styles = {
  section: {
    backgroundColor: "#0b1a2f",
    minHeight: "100vh",
    padding: "60px 10%",
    color: "white",
    fontFamily: "Segoe UI, sans-serif"
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#4da6ff"
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "30px",
    backgroundColor: "#132b4f",
    color: "white",
    fontSize: "16px",
    boxShadow: "0 0 8px rgba(77,166,255,0.3)"
  },

  card: {
    backgroundColor: "#132b4f",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 0 20px rgba(77, 166, 255, 0.3)",
    marginBottom: "30px"
  },

  generic: {
    marginBottom: "10px",
    color: "#a0c4ff"
  },

  disease: {
    marginBottom: "20px",
    color: "#7fbfff"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px"
  },

  th: {
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#1e3a66",
    color: "#4da6ff"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #244a80"
  },

  row: {},

  cheapestRow: {
    backgroundColor: "#163d2f"
  },

  suggestion: {
    backgroundColor: "#0d2445",
    padding: "12px",
    borderRadius: "10px",
    color: "#4da6ff",
    fontWeight: "bold"
  }
};

export default MedicineComparator;
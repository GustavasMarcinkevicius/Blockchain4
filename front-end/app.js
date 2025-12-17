if (!sessionStorage.getItem("connected")) {
  window.location.href = "index.html";
}

let provider, signer, contract;

const contractAddress = "0x7ee6c4E8c6f1F0a52d112BF3d8cB5551dA2F1343";
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_mechanic",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_model",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_pricePerDay",
        type: "uint256",
      },
    ],
    name: "addCar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "cars",
    outputs: [
      {
        internalType: "string",
        name: "model",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "pricePerDay",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "available",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentalId",
        type: "uint256",
      },
    ],
    name: "endRental",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getCar",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCarsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mechanic",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentalId",
        type: "uint256",
      },
    ],
    name: "payDue",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentalId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_damageFound",
        type: "bool",
      },
    ],
    name: "postInspect",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentalId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_damageFound",
        type: "bool",
      },
    ],
    name: "preInspect",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rentals",
    outputs: [
      {
        internalType: "address payable",
        name: "renter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "carId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "preInspected",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "postInspected",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "due",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "awaitingPayment",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_carId",
        type: "uint256",
      },
    ],
    name: "reserveCar",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentalId",
        type: "uint256",
      },
    ],
    name: "startRental",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

init();

async function init() {
  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    contract = new ethers.Contract(contractAddress, abi, signer);
    document.getElementById("account").innerText =
      address.substring(0, 6) + "..." + address.substring(38);

    await displayCars();
    await displayActiveRentals();
  } catch (err) {
    console.error(err);
  }
}

function selectCar(id, priceEth) {
  document.getElementById("carId").value = id;
  document.getElementById("deposit").value = priceEth;
}

async function displayCars() {
  const grid = document.getElementById("carsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  try {
    const count = await contract.getCarsCount();
    for (let i = 0; i < count; i++) {
      const car = await contract.getCar(i);
      const card = document.createElement("div");
      card.className = "car-card";

      const displayPrice = car[1].toString();

      card.innerHTML = `
    <div>
        <h4>${car[0]} <small>(ID: ${i})</small></h4>
        <p class="price">${displayPrice} wei / Day</p>
        <p class="status ${car[3] ? "free" : "busy"}">
            ● ${car[3] ? "Available" : "Rented"}
        </p>
    </div>
    ${
      car[3]
        ? `<button onclick="selectCar(${i}, '${displayPrice}')" class="btn-outline">Select</button>`
        : ""
    }
`;
      grid.appendChild(card);
    }
  } catch (err) {
    console.error("Klaida atvaizduojant automobilius:", err);
  }
}

async function addCar() {
  const model = document.getElementById("model").value;
  const price = document.getElementById("price").value;

  const tx = await contract.addCar(model, price);
  await tx.wait();
  window.location.reload();
}

async function reserve() {
  const id = document.getElementById("carId").value;
  const car = await contract.getCar(id);
  const pricePerDay = car[1];

  const autoDeposit = pricePerDay * 2n;

  const tx = await contract.reserveCar(id, { value: autoDeposit });
  await tx.wait();
  window.location.reload();
}

async function startRental() {
  const id = document.getElementById("startId").value;
  const tx = await contract.startRental(id);
  await tx.wait();
  window.location.reload();
}

async function endRental() {
  const id = document.getElementById("endId").value;
  const tx = await contract.endRental(id);
  await tx.wait();
  window.location.reload();
}

async function preInspect() {
  const id = document.getElementById("inspectId").value;
  const damage = document.getElementById("damageStatus").value === "true";

  try {
    const tx = await contract.preInspect(id, damage);
    console.log("Transaction sent:", tx.hash);

    await tx.wait();
    alert("Inspection successfully submitted!");
    window.location.reload();
  } catch (err) {
    console.error("Error details:", err);

    if (err.message.includes("execution reverted")) {
      alert(
        "Access Denied: Only the authorized mechanic can perform inspections."
      );
    } else if (err.code === "ACTION_REJECTED") {
      alert("Transaction cancelled by user.");
    } else {
      alert("An error occurred: " + (err.reason || "Internal Contract Error"));
    }
  }
}

async function postInspect() {
  const id = document.getElementById("inspectId").value;
  const damage = document.getElementById("damageStatus").value === "true";

  try {
    const tx = await contract.postInspect(id, damage);
    console.log("Post-inspection transaction sent:", tx.hash);

    await tx.wait();
    alert("Post-rental inspection completed successfully!");
    window.location.reload();
  } catch (err) {
    console.error("Post-inspection error:", err);

    if (err.message.includes("execution reverted")) {
      alert(
        "Access Denied: You must be the authorized mechanic to submit post-inspection reports."
      );
    } else if (err.code === "ACTION_REJECTED") {
      alert("Transaction cancelled by user.");
    } else {
      alert(
        "Error: " +
          (err.reason ||
            "The inspection could not be processed. Please check the Rental ID.")
      );
    }
  }
}
async function displayActiveRentals() {
  const list = document.getElementById("rentalsList");
  if (!list) return;
  list.innerHTML = "Loading rentals...";

  try {
    let rentalId = 0;
    let html = "";
    let activeFound = false;

    while (rentalId < 100) {
      try {
        const rental = await contract.rentals(rentalId);

        if (rental.renter === "0x0000000000000000000000000000000000000000")
          break;

        if (!rental.completed) {
          activeFound = true;
          const car = await contract.getCar(rental.carId);

          let statusText = "";
          let statusClass = "";

          if (rental.postInspected) {
            statusText = "Ready for Payment";
            statusClass = "status-pay";
          } else if (rental.endTime > 0) {
            statusText = "Returned (Awaiting Post-Inspection)";
            statusClass = "status-inspect";
          } else if (rental.startTime > 0) {
            statusText = "Currently Rented";
            statusClass = "status-active";
          } else if (rental.preInspected) {
            statusText = "Inspected (Ready to Start)";
            statusClass = "status-ready";
          } else {
            statusText = "Reserved (Awaiting Pre-Inspection)";
            statusClass = "status-pending";
          }

          html += `
            <div class="rental-card">
                <p><strong>Rental ID: #${rentalId}</strong></p>
                <p>Car: ${car[0]} (ID: ${rental.carId})</p>
                <p>Renter: ${rental.renter.substring(
                  0,
                  6
                )}...${rental.renter.substring(38)}</p>
                <p>Status: <span class="badge ${statusClass}">${statusText}</span></p>
                <div class="rental-actions">
                    <button onclick="copyRentalId(${rentalId})" class="btn-primary">Use ID</button>
                </div>
                <hr>
            </div>
          `;
        }
        rentalId++;
      } catch (e) {
        break;
      }
    }

    list.innerHTML = activeFound ? html : "<p>No active rentals found.</p>";
  } catch (err) {
    console.error("Error fetching rentals:", err);
    list.innerHTML = "Error loading rentals.";
  }
}

function copyRentalId(id) {
  const fields = ["inspectId", "payId", "startRentalId", "endRentalId"];
  fields.forEach((fieldId) => {
    const el = document.getElementById(fieldId);
    if (el) el.value = id;
  });
  alert("Rental ID #" + id + " selected!");
}

async function payDue() {
  const id = document.getElementById("payId").value;
  try {
    const rental = await contract.rentals(id);
    const amountToPay = rental.due;

    if (amountToPay === 0n) {
      alert("No debt found.");
      return;
    }

    const tx = await contract.payDue(id, { value: amountToPay });
    await tx.wait();
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

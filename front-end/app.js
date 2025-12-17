if (!sessionStorage.getItem("connected")) {
  window.location.href = "index.html";
}

let provider, signer, contract;

const contractAddress = "0xbEF58DD1B2ade3Cd96d83Fc050233d10A1dc7f66";
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "renter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DepositRefunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalPaid",
        type: "uint256",
      },
    ],
    name: "PaymentCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountDue",
        type: "uint256",
      },
    ],
    name: "PaymentDue",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "damageFound",
        type: "bool",
      },
    ],
    name: "PostInspectionCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
    ],
    name: "PreInspectionCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
    ],
    name: "RentalEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
    ],
    name: "RentalStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
    ],
    name: "ReservationConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rentalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "renter",
        type: "address",
      },
    ],
    name: "ReservationCreated",
    type: "event",
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
    name: "confirmReservation",
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
        name: "_carId",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_rentalId",
        type: "uint256",
      },
    ],
    name: "getRental",
    outputs: [
      {
        internalType: "address",
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
        name: "preDamageFound",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "postDamageFound",
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
    inputs: [],
    name: "getRentalsCount",
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
        name: "preDamageFound",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "postDamageFound",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "awaitingPayment",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "due",
        type: "uint256",
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
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  const address = await signer.getAddress();

  contract = new ethers.Contract(contractAddress, abi, signer);
  document.getElementById("account").innerText = address;

  await displayCars();
}

/* -------- FUNCTIONS -------- */

async function addCar() {
  const model = modelInput().value;
  const price = priceInput().value;
  await (await contract.addCar(model, price)).wait();
  window.location.reload();
}

async function reserve() {
  await (
    await contract.reserveCar(carId().value, { value: deposit().value })
  ).wait();
}

async function preInspect() {
  await (
    await contract.preInspect(preId().value, preDamage().value === "true")
  ).wait();
}

async function startRental() {
  await (await contract.startRental(startId().value)).wait();
}

async function endRental() {
  await (await contract.endRental(endId().value)).wait();
}

async function postInspect() {
  await (
    await contract.postInspect(postId().value, postDamage().value === "true")
  ).wait();
}

async function payDue() {
  await (
    await contract.payDue(payId().value, { value: payAmount().value })
  ).wait();
}
async function displayCars() {
  const grid = document.getElementById("carsGrid");
  grid.innerHTML = "";

  const count = await contract.getCarsCount();

  for (let i = 0; i < count; i++) {
    const car = await contract.getCar(i);

    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
            <h4>ID: ${i} | ${car[0]}</h4>
            <p style="color: #00d4ff; font-weight: bold;">${
              car[1]
            } WEI / Day</p>
            <p style="color: ${car[3] ? "#00ff88" : "#ff4444"}">
                ${car[3] ? "● Available" : "● Rented"}
            </p>
        `;
    grid.appendChild(card);
  }
}

/* -------- SHORTCUTS -------- */
const preId = () => document.getElementById("inspectId");
const preDamage = () => document.getElementById("damageStatus");
const postId = () => document.getElementById("inspectId");
const modelInput = () => document.getElementById("model");
const priceInput = () => document.getElementById("price");
const carId = () => document.getElementById("carId");
const deposit = () => document.getElementById("deposit");
const startId = () => document.getElementById("startId");
const endId = () => document.getElementById("endId");
const postDamage = () => document.getElementById("postDamage");
const payId = () => document.getElementById("payId");
const payAmount = () => document.getElementById("payAmount");

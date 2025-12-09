let web3;
let contract;
let accounts;

const contractAddress = "ČIA_PASTATYK_DEPLOYED_ADDRESS"; // po deploy Remix
const contractABI = [
  /* čia įklijuok ABI iš CarRental.json */
];

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Connected to CarRental contract");
  } else {
    alert("Please install MetaMask");
  }
});

// ---------------- Functions ----------------

async function addCar() {
  const model = document.getElementById("carModel").value;
  const price = document.getElementById("carPrice").value;
  await contract.methods.addCar(model, price).send({ from: accounts[0] });
  alert("Car added!");
}

async function reserveCar() {
  const carId = document.getElementById("reserveCarId").value;
  const deposit = document.getElementById("deposit").value;
  await contract.methods
    .reserveCar(carId)
    .send({ from: accounts[0], value: deposit });
  alert("Car reserved!");
}

let provider, signer;

document.getElementById("connectBtn").onclick = connect;

async function connect() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);

  try {
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    sessionStorage.setItem("connected", "true");

    document.getElementById("status").innerText = "Connected: " + address;

    setTimeout(() => {
      window.location.href = "app.html";
    }, 500);
  } catch (e) {
    alert("Wallet connection rejected");
  }
}

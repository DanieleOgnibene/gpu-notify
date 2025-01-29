import { INTERVAL } from "./environment";
import { fetchGpusInStock } from "./utils/getGpusInStock";
import { isShopUpdated } from "./utils/isShopUpdated";
import { notifyUser } from "./utils/notifyUser";

const getDateString = () => {
  return new Date().toLocaleTimeString();
};

const fetchGpusAndNotify = async () => {
  const gpusInStock = await fetchGpusInStock();
  if (gpusInStock.length === 0) {
    console.log(`${getDateString()} [GPUs] No GPUs in stock`);
    return;
  }
  await notifyUser(
    `${getDateString()} [GPUs] GPUs in stock: ${gpusInStock
      .map((gpu) => gpu.gpu_name)
      .join(", ")}`
  );
};

const fetchShopAndNotify = async () => {
  const shopUpdates = await isShopUpdated();
  if (!shopUpdates.hasChanged) {
    console.log(`${getDateString()} [SHOP] No changes`);
    return;
  }
  let message = `${getDateString()} [SHOP] Shop has been updated! `;
  if (shopUpdates.containsGpus.length === 0) {
    message += "No GPUs in stock.";
  } else {
    message += `GPUs in stock: ${shopUpdates.containsGpus
      .map((gpu) => gpu.name)
      .join(", ")}`;
  }
  await notifyUser(message);
};

const fetchAllAndNotify = async () => {
  await fetchGpusAndNotify();
  await fetchShopAndNotify();
};

const main = async () => {
  await fetchAllAndNotify();

  setInterval(async () => {
    await fetchAllAndNotify();
  }, parseInt(INTERVAL));
};

main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});

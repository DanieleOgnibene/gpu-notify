import gpus from "./data/gpus.json";
import { INTERVAL, NVIDIA_LOCALE } from "./environment";
import { fetchGpusInStock } from "./utils/getGpusInStock";
import { isShopUpdated } from "./utils/isShopUpdated";
import { notifyUsers } from "./utils/notifyUser";

const getDateString = () => {
  return new Date().toLocaleTimeString();
};

const getShopUrl = () => {
  return `https://marketplace.nvidia.com/${NVIDIA_LOCALE}/consumer/graphics-cards/`;
};

const previouslyNotifiedGPUs = new Set<string>();

const fetchGpusAndNotify = async () => {
  const gpusInStock = await fetchGpusInStock();
  if (gpusInStock.length === 0) {
    console.log(`${getDateString()} [GPUs] No GPUs in stock`);
    previouslyNotifiedGPUs.clear();
    return;
  }
  const gpusToNotify = gpusInStock.filter(
    (gpu) => !previouslyNotifiedGPUs.has(gpu.gpu_name)
  );
  if (gpusToNotify.length === 0) {
    console.log(`${getDateString()} [GPUs] No changes`);
    return;
  }
  const message = `${getDateString()} [GPUs] GPUs in stock: ${gpusToNotify
    .map((gpu) => gpu.gpu_name)
    .join(", ")}\n${getShopUrl()}`;
  await notifyUsers(message);
  console.log(message);
  previouslyNotifiedGPUs.clear();
  gpusToNotify.forEach((gpu) => previouslyNotifiedGPUs.add(gpu.gpu_name));
};

const fetchShopAndNotify = async () => {
  const shopUpdates = await isShopUpdated();
  if (!shopUpdates.isAvailable) {
    console.log(`${getDateString()} [SHOP] No changes`);
    return;
  }
  let message = `${getDateString()} [SHOP] ${shopUpdates.title} - ${
    shopUpdates.stock
  } GPUs in stock. \n${shopUpdates.purchaseLink}`;
  console.log(message);
  await notifyUsers(message);
};

const fetchAllAndNotify = async () => {
  await fetchGpusAndNotify();
  await fetchShopAndNotify();
};

const main = async () => {
  const gpuNames = gpus.map((gpu) => gpu.name).join(", ");
  await notifyUsers(
    `GPU monitor started.\nYou will be notified when ${gpuNames} ${
      gpus.length > 1 ? "are" : "is"
    } in stock.`
  );

  await fetchAllAndNotify();

  setInterval(async () => {
    await fetchAllAndNotify();
  }, INTERVAL);
};

main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});

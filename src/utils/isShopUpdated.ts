import gpus from "../data/gpus.json";
import { NVIDIA_LOCALE } from "../environment";

const SHOP_API_URL =
  "https://api.nvidia.partners/edge/product/search?page=1&limit=12&category=GPU";

let previousResponse: any = null;

const DEFAULT_RESPONSE = {
  hasChanged: false,
  containsGpus: [],
};

export interface ShopUpdateResponse {
  hasChanged: boolean;
  containsGpus: { name: string; api_url: string }[];
}

export const isShopUpdated = async (): Promise<ShopUpdateResponse> => {
  let response: Response;
  try {
    response = await fetch(`${SHOP_API_URL}&locale=${NVIDIA_LOCALE}`);
  } catch (error) {
    console.error(`Failed to fetch SHOP with error ${JSON.stringify(error)}`);
    return DEFAULT_RESPONSE;
  }

  if (!response.ok) {
    console.error(`Failed to fetch SHOP with status ${response.status}`);
    return DEFAULT_RESPONSE;
  }

  const responseBody = await response.json();

  if (!previousResponse) {
    previousResponse = responseBody;
    return DEFAULT_RESPONSE;
  }

  const prevString = JSON.stringify(previousResponse);
  const newString = JSON.stringify(responseBody);

  previousResponse = responseBody;

  const hasChanged = prevString !== newString;
  const containsGpus = gpus.filter((gpu) => {
    const gpuName = gpu.name;
    return newString.includes(gpuName);
  });

  return {
    hasChanged,
    containsGpus,
  };
};

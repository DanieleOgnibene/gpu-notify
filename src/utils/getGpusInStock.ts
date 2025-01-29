import gpus from "../data/gpus.json";
import { NVIDIA_LOCALE } from "../environment";
import { FeInventoryResponse } from "../types/feinventory-response";

const isInStock = (response: FeInventoryResponse) => {
  const isApiReachable =
    response.listMap &&
    Array.isArray(response.listMap) &&
    response.listMap.length > 0 &&
    "is_active" in (response.listMap[0] ?? {});

  if (!isApiReachable) {
    return false;
  }

  return response.listMap.some((item) => item.is_active === "true");
};

export const fetchGpusInStock = async (): Promise<FeInventoryResponse[]> => {
  const requests = gpus.map(async (gpu) => {
    let response: Response;
    try {
      response = await fetch(`${gpu.api_url}&locale=${NVIDIA_LOCALE}`);
    } catch (error) {
      console.error(
        `Failed to fetch GPU ${gpu.name} with error ${JSON.stringify(error)}`
      );
      return null;
    }
    if (!response.ok) {
      console.error(
        `Failed to fetch GPU ${gpu.name} with status ${response.status}`
      );
      return null;
    }
    const data = response.json() as Promise<
      Omit<FeInventoryResponse, "gpu_name">
    >;

    return {
      ...data,
      gpu_name: gpu.name,
    };
  });
  const responses = await Promise.all(requests);

  const validResponses = responses.filter(Boolean) as FeInventoryResponse[];
  return validResponses.filter((response) => isInStock(response));
};

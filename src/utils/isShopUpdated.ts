const SHOP_API_URL = `https://api.nvidia.partners/products/v1/buy-now?sku=1145576&locale=es`;

let previousResponse: ShopApiResponseItem[] | null = null;

const DEFAULT_RESPONSE = {
  title: "",
  isAvailable: false,
  stock: 0,
  purchaseLink: "",
};

export interface ShopUpdateResponse {
  title: string;
  isAvailable: boolean;
  stock: number;
  purchaseLink: string;
}

interface ShopApiResponseItem {
  directPurchaseLink: string;
  hasOffer: boolean;
  isAvailable: boolean;
  logoUrl: string | null;
  offerText: string | null;
  partnerId: string;
  productTitle: string;
  purchaseLink: string;
  retailerName: string;
  salePrice: string;
  sku: string | null;
  stock: number;
  storeId: string;
  type: number;
}

export const isShopUpdated = async (): Promise<ShopUpdateResponse> => {
  let response: Response;
  try {
    response = await fetch(SHOP_API_URL);
  } catch (error) {
    console.error(`Failed to fetch SHOP with error ${JSON.stringify(error)}`);
    return DEFAULT_RESPONSE;
  }

  if (!response.ok) {
    console.error(`Failed to fetch SHOP with status ${response.status}`);
    return DEFAULT_RESPONSE;
  }

  const responseBody: string = await response.json();
  const parsedResponse = JSON.parse(responseBody);

  const hasChanged =
    JSON.stringify(previousResponse) !== JSON.stringify(parsedResponse);
  if (!hasChanged) {
    return DEFAULT_RESPONSE;
  }

  previousResponse = parsedResponse;

  const firstItem = parsedResponse[0];

  if (!firstItem) {
    return DEFAULT_RESPONSE;
  }

  const isAvailable = firstItem.isAvailable;
  const stock = firstItem.stock;
  const purchaseLink = firstItem.directPurchaseLink;

  return {
    isAvailable,
    stock,
    purchaseLink,
    title: firstItem.productTitle,
  };
};

export interface FeInventoryResponse {
  gpu_name: string;
  success: boolean;
  map: null | undefined;
  listMap: Array<{
    is_active: string;
    product_url: string;
    price: string;
    fe_sku: string;
    locale: string;
  }>;
}

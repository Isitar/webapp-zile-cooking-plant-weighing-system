import ProductionScale from "@/models/production/ProductionScale";

export default interface ProductionWorkstation {
    id: string;
    name: string;
    scales: ProductionScale[];
}

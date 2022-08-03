import Item from "@/models/production/Item";

export interface ProductionOrderComponent {
    lineNumber: number;
    item: Item;
    lowerTolerance: number;
    upperTolerance: number;
    componentQty: number;
    isFluid: boolean;
    isSolid: boolean;
}

export default interface ProductionOrder {
    productionOrderNumber: string;
    outputItem: Item;
    components: ProductionOrderComponent[];
}

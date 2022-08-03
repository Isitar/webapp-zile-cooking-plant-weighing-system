import ProductionOrder, { ProductionOrderComponent } from "@/models/production/ProductionOrder";
import ProductionScale from "@/models/production/ProductionScale";

export default interface ProductionRun {
    id: string;
    productionOrder: ProductionOrder;
    expectedFlowPerHour: number;
    productionRunState: number;
    assignments: ProductionRunAssignment [];
}

export interface ProductionRunAssignment {
    id: string;
    productionRunAssignmentScale: ProductionScale;
    component: ProductionOrderComponent;
    deltaT: number;
    componentPart: number;
    expectedFlow: number;
    upperTolerance: number;
    lowerTolerance: number;
}

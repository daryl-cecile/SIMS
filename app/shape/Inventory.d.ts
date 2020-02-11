
interface IBase{
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

interface IInventory extends IBase{
    item: IItem;
    quantity: number;
    storageLocation: IStorageLocation;
}

interface IStorageLocation extends IBase{
    name:string;
    location:string;
}

interface IItem extends IBase{

    name:string;
    description:string;
    notices: INotice[];
    unitCount:number;
    previewImg:string;
    expiry:Date;
    inventoryEntry: IInventory;
}

interface INotice extends IBase{
    title:string;
}
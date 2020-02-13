
interface IBase{
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

interface IStorageLocation extends IBase{
    name:string;
    location:string;
}

interface IItem extends IBase{

    name:string;
    description:string;
    notices: string;
    unitCount:number;
    previewImg:string;
    expiry:Date;
    quantity: number;
    storageLocation: IStorageLocation;

}

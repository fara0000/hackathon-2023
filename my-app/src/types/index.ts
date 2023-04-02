type Participant = {
    id: number;
    itn: string;
    status: boolean;
}

type Contract = {
    contractConclusionDate: string;
    contractRegNumber: string;
    price: number;
}

type PurchaseListData = {
    contractCategory: string
    contractList: Array<Contract>
    customerInn: string
    customerName: string
    deliveryRegion: string
    id: string
    lotName: string
    participantList: Array<Participant>
    price: number;
    publishDate: string
    purchaseName: string;
    statusMeWin: boolean;
}

export type CompanyData = {
    id: number;
    itn: string;
    name: string;
    purchaseDtoList: Array<PurchaseListData>;
    status: boolean;
}
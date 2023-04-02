import React, {FC, useEffect, useState} from 'react';
import { Table, Input, Button, Menu, Dropdown } from 'antd';
import { stringify } from 'csv-stringify';
import {Box, Flex, Link, SelectField, Text} from "@chakra-ui/react";
import {useRouter} from "next/router";
import axios from "axios";
import styles from '@src/styles/Table.module.css'
import { CompanyData } from "@src/types";


interface IProps {
    inn: number;
}
interface IData {
    contractCategory: string
    contractConclusionDate: string;
    contractPrice: number;
    customerInn: string;
    customerName: string;
    deliveryRegion: string;
    id: string;
    lotName: string;
    price: number;
    publishDate: string
    purchaseName: string;
    statusMeWin: boolean;
}

const columns = [
    {
        title: 'Customer Inn',
        dataIndex: 'customerInn',
        key: 'customerInn',
    },
    {
        title: 'Contract Price',
        dataIndex: 'contractPrice',
        key: 'contractPrice',
    },
    {
        title: 'Lot Name',
        dataIndex: 'lotName',
        key: 'lotName',
    },
    {
        title: 'Max Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Contract Conclusion Date',
        dataIndex: 'contractConclusionDate',
        key: 'contractConclusionDate',
    },
    {
        title: 'Win',
        dataIndex: 'statusMeWin',
        key: 'statusMeWin',
    },
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const TableData:FC<IProps> = () => {
    const router = useRouter();
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);
    const [regions, setRegions] = useState<Array<string>>([]);
    const [selectedRegion, setSelectedRegion] = useState(regions[0]);
    const [selectedBusiness, setSelectedBusiness] = useState('MIN');
    const data = companyData?.purchaseDtoList.map((item, index) => ({
        key: (index + 1).toString(),
        contractPrice: item.statusMeWin ? item.contractList[0]?.price : '',
        contractConclusionDate:  item.statusMeWin && item.contractList[0]?.contractConclusionDate  ? formatDate(item.contractList[0]?.contractConclusionDate) : '',
        customerInn: item.customerInn,
        lotName: item.lotName,
        price: item.price,
        statusMeWin: item.statusMeWin ? 'да' : 'нет'
    }))

    console.log(data);
    // const [filteredData, setFilteredData] = useState<IData[]>(data);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    
    useEffect(() => {
        const url = `http://95.163.241.203:10280/api/v1/companies/${router.query.id}`;
        const regionsUrl = `http://95.163.241.203:10280/api/v1/companies/${router.query.id}/regions`;


        axios.get(url).then(res => setCompanyData(res.data));
        axios.get(regionsUrl).then(res => setRegions(res.data));
        setSelectedRegion(regions[0]);
    }, []);

    console.log(selectedRegion);

    // const handleSearch = (value: string) => {
    //     const lowerCaseValue = value.toLowerCase();
    //     const filtered = data.filter((record) =>
    //         Object.values(record)
    //             .join(' ')
    //             .toLowerCase()
    //             .includes(lowerCaseValue)
    //     );
    //     setSearchText(value);
    //     setCurrentPage(1);
    //     setFilteredData(filtered);
    // };

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const getPagination = () => {
        return {
            current: currentPage,
            pageSize: pageSize,
            // total: filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
        };
    };

    // const tableRows = data.map((record: IData) => ({
    //     ...record,
    //     className: 'ant-table-row-clickable',
    // }));

    const getRowClassName = (record: IData, index: number) => {
        return 'ant-table-row-clickable';
    };

    const handleExportCSV = () => {
        // @ts-ignore
        stringify(data, { header: true }, (err, output) => {
            if (err) {
                console.error(err);
                return;
            }
            const csvBlob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', URL.createObjectURL(csvBlob));
            downloadLink.setAttribute('download', 'table.csv');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }

    return (
        <section style={{width: '100%', height: '100vh', justifyContent: 'center' , display: 'flex', padding: '40px' }}>
            <div style={{width: '100%', flexDirection: 'column'}}>
                {/*<Input*/}
                {/*    placeholder="Search"*/}
                {/*    prefix={<SearchOutlined />}*/}
                {/*    value={searchText}*/}
                {/*    onChange={(e) => handleSearch(e.target.value)}*/}
                {/*    style={{ width: 200, marginBottom: 16 }}*/}
                {/*/>*/}
                {companyData?.id ?
                    <>
                        <Flex justifyContent={'space-between'}>
                            <Box>
                                <h3 style={{ marginBottom: '10px' }}>Инфа Поставщика</h3>
                                <h3 style={{ marginBottom: '10px' }}>ИНН: <span>{companyData.itn}</span></h3>
                                <h3 style={{ marginBottom: '10px' }}>Компания: <span>{companyData.name}</span></h3>
                                <Button onClick={handleExportCSV} type="primary" style={{ marginBottom: '10px' }}>Export CSV</Button>
                            </Box>
                            <Flex flexDirection='column' gap="10px" marginRight="30px">
                                <Link href={`http://95.163.241.203:3000/d/D1VdtmLVk/home?orgId=1&from=1605183226297&to=1638863780980&var-itn=${companyData.itn}`} isExternal>
                                    <Button type="primary">
                                        Моя статистика
                                    </Button>
                                </Link>
                                <Flex flexDirection="column" gap="10px">
                                    <Flex gap="10px">
                                        <Box>
                                            <Text>
                                                Регион:
                                            </Text>
                                            <select id="regions" onChange={(e) => setSelectedRegion(e.target.value)}>
                                                {regions?.map(option => (
                                                    <option value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </Box>
                                        <Box>
                                            <Text>
                                                Малый бизнес:
                                            </Text>
                                            <select id="smallB" onChange={(e) => {
                                                setSelectedBusiness(e.target.value)
                                            }}>
                                                <option value={'MIN'}>{'MIN'}</option>
                                                <option value={'MIDDLE'}>{'MIDDLE'}</option>
                                                <option value={'BIG'}>{'BIG'}</option>
                                            </select>
                                        </Box>
                                    </Flex>
                                    <Link href={`http://95.163.241.203:3000/d/R-J0nWLVk/sravnenie-s-drugimi-kompanijami?orgId=1&from=1555204361457&to=1702141489843&var-status=${selectedBusiness}&var-region=${selectedRegion}&var-itn=${companyData.itn}`} isExternal>
                                        <Button type="primary">
                                            Cравнить с другими
                                        </Button>
                                    </Link>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Box>
                            <Table<any>
                                columns={columns}
                                dataSource={data}
                                // onRow={(record: IData) => ({
                                //     onClick: () => handleRowClick(record),
                                // })}
                                rowClassName={getRowClassName}
                                onChange={handleTableChange}
                                pagination={getPagination()}
                            />
                        </Box>
                    </> :
                    <Text fontWeight={'bold'} fontSize="28" className={styles.loadingAnimation}><span>Loading Data...</span></Text>
                }
            </div>
        </section>
    )
}

export default TableData;
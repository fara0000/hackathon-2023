import {ChangeEvent, useEffect, useState} from "react";
import Head from 'next/head'
import styles from '@src/styles/Home.module.css'
import { Button, Input } from "antd";
import { Flex, Text } from "@chakra-ui/react";
import * as yup from 'yup';
import Link from "next/link";
import axios from 'axios'
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    const router = useRouter();
    const [inn, setInn] = useState('');
    const [valid, setValid] = useState(false);
    const [id, setId] = useState<number | null>(null)

    const schema = yup.object().shape({
        inn: yup.string().matches(/^\d{10}$|^\d{12}$/),
    });

    const handleInnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInn(value);
        schema.isValid({ inn: value }).then((isValid) => {
            setValid(isValid);
        });
    };

    const sendInn = async (itn: number) => {
        setInn('');
        const response = await axios.get(`http://95.163.241.203:10280/api/v1/companies?itn=${itn}`)

        if(response?.data.status) {
                setId(response.data.id);
                id && router.push({ pathname: '/table', query: { id } });
        } else {
            toast.error('такой ИНН не существует в базе', {
                position: toast.POSITION.TOP_LEFT
            });
        }
    }


    return (
        <>
          <Head>
            <title>Tender Hack</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className={styles.main}>
              <div className={styles.bg}>
                  <Flex flexDirection="column" gap="12px" justifyContent="center" alignItems="start" ml="3px">
                      <Text fontSize="22px" fontWeight="540" color="burlywood">
                          Введите свой ИНН:
                      </Text>
                      <Flex gap={'12px'}>
                          <Input
                              className={styles.input}
                              min={1}
                              maxLength={12}
                              onChange={handleInnChange}
                              inputMode="numeric"
                              type="text"
                              value={inn}
                          />
                          {/*<Link href="/table">*/}
                              <Button className={styles.btn} disabled={!valid} onClick={() => sendInn(+inn)}>Поиск</Button>
                          {/*</Link>*/}
                      </Flex>
                      {/*{error && <div style={{ color: "red" }}>{error}</div>}*/}
                  </Flex>
              </div>

              {/*<TableContent />*/}
          </main>
        </>
    )
}

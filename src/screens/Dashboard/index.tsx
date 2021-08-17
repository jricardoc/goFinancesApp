import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
    Container,
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    HighlightCards,
    Transactions,
    Tilte,
    TransactionsList,
    LogoutButton
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
}
interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    async function LoadTransactions() {
        const dataKey = '@gofinance:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {

                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount)
                }

                const amount = Number(item.amount)
                    .toLocaleString('pt-Br', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                const date = Intl.DateTimeFormat('pt-Br', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            });

        setTransactions(transactionsFormatted);

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }
        });
    }
    useEffect(() => {
        LoadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {
        LoadTransactions();
    }, []));

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/38188946?v=4' }}
                        />
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Ricardo</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => { }}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard
                    type="up"
                    title="Entradas"
                    amount={highlightData.entries.amount}
                    lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount={highlightData.expensives.amount}
                    lastTransaction="Última saída dia 3 de abril"
                />
                <HighlightCard
                    type="total"
                    title="Total"
                    amount={highlightData.total.amount}
                    lastTransaction="1 à 16 de abril"
                />
            </HighlightCards>
            <Transactions>
                <Tilte>Listagem</Tilte>

                <TransactionsList
                    data={transactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />


            </Transactions>
        </Container>
    )

}

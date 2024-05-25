import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import PieChart from 'react-native-pie-chart';
import { supabase } from '../../util/supabase';

export default function Statistic() {
    const [advCountNextMonth, setAdvCountNextMonth] = useState(0);
    const [advCountCurrentPreviousMonth, setAdvCountCurrentPreviousMonth] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const widthAndHeight = 220;
    const sliceColor = ['orange', 'blue'];

    const fetchCounts = async () => {
        setRefreshing(true);
        try {
            const currentDate = new Date();
            const nextMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            const currentMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const previousMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const previousMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            console.log("H"+previousMonthEndDate)
            const { count: nextMonthCount } = await supabase
                .from('Adv')
                .select('id', { count: 'exact' })
                .gte('Date', `${nextMonthStartDate.toISOString().slice(0, 10)}`) // Greater than or equal to next month's start date
                .lt('Date', `${currentMonthStartDate.toISOString().slice(0, 10)}`) // Less than current month's start date
                .single();
    
            const { count: currentPreviousMonthCount } = await supabase
                .from('Adv')
                .select('id', { count: 'exact' })
                .gte('Date', `${previousMonthStartDate.toISOString().slice(0, 10)}`) // Greater than or equal to previous month's start date
                .lt('Date', `${previousMonthEndDate.toISOString().slice(0, 10)}`) // Less than previous month's end date
                .single();
    
            
    
            setAdvCountNextMonth(nextMonthCount * 2000);
            setAdvCountCurrentPreviousMonth(currentPreviousMonthCount * 2000);
        } catch (error) {
            console.error('Error fetching counts:', error.message);
        } finally {
            setRefreshing(false);
        }
    };
    
    useEffect(() => {
        fetchCounts();
    }, []);

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                {/* <PieChart
                    style={{ marginLeft: '2%', marginTop: 20 }}
                    widthAndHeight={widthAndHeight}
                    series={[advCountNextMonth, advCountCurrentPreviousMonth]}
                    sliceColor={sliceColor}
                    coverRadius={0.1}
                    coverFill={'#FFF'}
                /> */}
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 10, height: 10, backgroundColor: sliceColor[0], marginRight: 5 }} />
                        <Text>{`Next Month: $${advCountNextMonth}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ width: 10, height: 10, backgroundColor: sliceColor[1], marginRight: 5 }} />
                        <Text>{`Current & Previous Month: $${advCountCurrentPreviousMonth}`}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

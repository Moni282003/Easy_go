import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import PieChart from 'react-native-pie-chart';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../util/supabase';

export default function Statistic() {
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState('');
    const [counts, setCounts] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [currentMonthPaymentCount, setCurrentMonthPaymentCount] = useState(0);
    const [nextMonthAdCount, setNextMonthAdCount] = useState(0);

    const widthAndHeight = 220;
    const sliceColor = ['orange', 'blue'];
    const otherSliceColor = ['green', 'red'];

    const fetchPlaces = async () => {
        try {
            const { data, error } = await supabase
                .from('AddItem')
                .select('Place');

            if (error) throw error;

            const uniquePlaces = [...new Set(data.map(item => item.Place))];
            setPlaces(uniquePlaces);
        } catch (error) {
            console.error('Error fetching places:', error.message);
        }
    };

    const fetchCounts = async (place) => {
        setRefreshing(true);
        try {
            const { data: names, error: namesError } = await supabase
                .from('AddItem')
                .select('Name')
                .eq('Place', place);

            if (namesError) throw namesError;

            const nameList = names.map(item => item.Name);

            const { count: normalCount, error: normalCountError } = await supabase
                .from('Payment')
                .select('id', { count: 'exact' })
                .in('Name', nameList)
                .eq('Plan', 'Normal');
            
            if (normalCountError) throw normalCountError;

            const { count: priorityCount, error: priorityCountError } = await supabase
                .from('Payment')
                .select('id', { count: 'exact' })
                .in('Name', nameList)
                .eq('Plan', 'Priority');

            if (priorityCountError) throw priorityCountError;

            const addItemCount = nameList.length;

            const { count: paymentCount, error: paymentCountError } = await supabase
                .from('Payment')
                .select('Name', { count: 'exact' })
                .in('Name', nameList);

            if (paymentCountError) throw paymentCountError;

            const differenceInCounts = Math.max(addItemCount - paymentCount, 0);

            setCounts(prevCounts => ({
                ...prevCounts,
                [place]: {
                    normalPlanCount: normalCount,
                    priorityPlanCount: priorityCount,
                    nameCountInAddItem: addItemCount,
                    nameCountInPayment: paymentCount,
                    differenceInCounts: differenceInCounts,
                }
            }));
        } catch (error) {
            console.error('Error fetching counts:', error.message);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    useEffect(() => {
        if (selectedPlace) {
            fetchCounts(selectedPlace);
        }
    }, [selectedPlace]);

    const selectedPlaceCounts = counts[selectedPlace] || {};

    useEffect(() => {
        // Fetch current month priority payments count
        const fetchCurrentMonthPaymentCount = async () => {
            try {
                const currentDate = new Date();
                const startOfMonth = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-01`;
                const endOfMonth = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}`;

                const { count: currentMonthPaymentCount } = await supabase
                    .from('Payment')
                    .select('id', { count: 'exact' })
                    .eq('Plan', 'Priority')
                    .gte('Start', startOfMonth)
                    .lte('Start', endOfMonth);

                setCurrentMonthPaymentCount(currentMonthPaymentCount);

                console.log('Payment table count where Plan=Priority:', currentMonthPaymentCount);
            } catch (error) {
                console.error('Error fetching current month priority payment count:', error.message);
            }
        };

        // Fetch next month ads count
        const fetchNextMonthAdCount = async () => {
            try {
                const currentDate = new Date();
                const startOfNextMonth = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 2)).slice(-2)}-01`;
                const endOfNextMonth = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 2)).slice(-2)}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).getDate()}`;

                const { count: nextMonthAdCount } = await supabase
                    .from('Advertisement')
                    .select('id', { count: 'exact' })
                    .gte('Date', startOfNextMonth)
                    .lte('Date', endOfNextMonth);

                setNextMonthAdCount(nextMonthAdCount);

                // Log Adv table total count
                console.log('Adv table total count:', nextMonthAdCount);
            } catch (error) {
                console.error('Error fetching next month ad count:', error.message);
            }
        };

        fetchCurrentMonthPaymentCount();
        fetchNextMonthAdCount();
    }, []);

    return (
        <View>
            {(typeof places !== 'undefined' && places.length > 0) && (
                <Picker
                    selectedValue={selectedPlace}
                    onValueChange={(itemValue) => setSelectedPlace(itemValue)}
                >
                    <Picker.Item label="Select Place" value="" />
                    {places.map((place, index) => (
                        <Picker.Item key={index} label={place} value={place} />
                    ))}
                </Picker>
            )}
            {selectedPlace && selectedPlaceCounts && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 20 }}>
                    {(selectedPlaceCounts.nameCountInAddItem || selectedPlaceCounts.nameCountInPayment || selectedPlaceCounts.differenceInCounts) ? (
                        <PieChart
                            style={{ marginLeft: '2%', marginTop: 20 }}
                            widthAndHeight={widthAndHeight}
                            series={[selectedPlaceCounts.nameCountInPayment, selectedPlaceCounts.differenceInCounts]}
                            sliceColor={otherSliceColor}
                            coverRadius={0.3}
                            coverFill={'#FFF'}
                        />
                    ) : null}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 10, height: 10, backgroundColor: otherSliceColor[0], marginRight: 5 }} />
                            <Text>{`Active Plan: ${selectedPlaceCounts.nameCountInPayment}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 10, height: 10, backgroundColor: otherSliceColor[1], marginRight: 5 }} />
                            <Text>{`Deactive Plan: ${selectedPlaceCounts.differenceInCounts}`}</Text>
                        </View>
                    </View>
                </View>
            )}
            {selectedPlace && selectedPlaceCounts && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20}}>
                    {(selectedPlaceCounts.normalPlanCount || selectedPlaceCounts.priorityPlanCount) ? (
                        <PieChart
                            style={{ marginLeft: '2%', marginTop: 20 }}
                            widthAndHeight={widthAndHeight}
                            series={[selectedPlaceCounts.normalPlanCount, selectedPlaceCounts.priorityPlanCount]}
                            sliceColor={sliceColor}
                            coverRadius={0.3}
                            coverFill={'#FFF'}
                        />
                    ) : null}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 10, height: 10, backgroundColor: sliceColor[0], marginRight: 5 }} />
                            <Text>{`Normal Plan: ${selectedPlaceCounts.normalPlanCount}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <View style={{ width: 10, height: 10, backgroundColor: sliceColor[1], marginRight: 5 }} />
                            <Text>{`Priority Plan: ${selectedPlaceCounts.priorityPlanCount}`}</Text>
                        </View>
                    </View>
                </View>
            )}
           
        </View>
    );
}


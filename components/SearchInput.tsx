// SearchInput.tsx
import useDebounce from '@/hooks/useDebounce';
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// See next snippet for the hook

const SearchInput = ({ filters, setFilters }) => {
    const [localSearch, setLocalSearch] = useState(filters.searchText || '');
    const debouncedSearch = useDebounce(localSearch, 500);

    // Update parent filters when the debounced value changes
    useEffect(() => {
        setFilters(prev => ({ ...prev, searchText: debouncedSearch }));
    }, [debouncedSearch]);

    // Force update searchText on button press (in case the user taps immediately)
    const handleSearchButtonPress = () => {
        setFilters(prev => ({ ...prev, searchText: localSearch }));
    };

    useEffect(() => {
        console.log('Local search value:', localSearch);
    }, [localSearch]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search..."
                value={localSearch}
                onChangeText={setLocalSearch}
            />
            <TouchableOpacity style={styles.button} onPress={handleSearchButtonPress}>
                <Icon name="magnify" size={24} color="gray" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
    },
    button: {
        padding: 8,
    },
});

export default SearchInput;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import {
    useGetDivisionsQuery,
    useGetDistrictsByDivisionQuery,
    useGetAreasByDistrictQuery,
    useSearchLocationQuery,
} from '@/features/map/mapapi';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Lead } from '@/features/lead/leadApi';
import { MeetingContext } from './MeetingContext';

interface AddressProps {
    lead?: Lead;
    onChange: (updatedAddress: {
        division: string;
        district: string;
        area: string;
        address: string;
    }) => void;
    defaultAddress?: {
        division: string;
        district: string;
        area: string;
        address: string;
    };
}

export default function Address({ lead, onChange = () => { }, defaultAddress }: AddressProps) {
    const { leadId } = useLocalSearchParams();
    const router = useRouter();
    const { meetingData, setMeetingData } = useContext(MeetingContext);

    // Start in edit mode if no default address exists
    const [isEditing, setIsEditing] = useState(defaultAddress?.address ? false : true);

    // Local state for each field
    const [division, setDivision] = useState<{ _id: string; division: string | null }>({
        _id: '',
        division: lead?.address?.division || null,
    });
    const [district, setDistrict] = useState<{ _id: string; name: string | null }>({
        _id: '',
        name: lead?.address?.district || null,
    });
    const [area, setArea] = useState<{ _id: string; name: string | null }>({
        _id: '',
        name: lead?.address?.area || null,
    });
    const [specificAddress, setSpecificAddress] = useState<string>(
        lead?.address?.address || ''
    );
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedSearchResult, setSelectedSearchResult] = useState<any>(null);

    // Dropdown states for Division, District, and Area
    const [divisionOpen, setDivisionOpen] = useState(false);
    const [divisionItems, setDivisionItems] = useState<{ label: string; value: string; id: string }[]>([]);

    const [districtOpen, setDistrictOpen] = useState(false);
    const [districtItems, setDistrictItems] = useState<{ label: string; value: string; id: string }[]>([]);

    const [areaOpen, setAreaOpen] = useState(false);
    const [areaItems, setAreaItems] = useState<{ label: string; value: string; id: string }[]>([]);

    // Fetch location data from API hooks
    const { data: divisions, isLoading: divisionsLoading } = useGetDivisionsQuery();
    const {
        data: districts,
        isLoading: districtsLoading,
        refetch: refetchDistricts,
    } = useGetDistrictsByDivisionQuery(division._id, { skip: !division._id });
    const {
        data: areas,
        isLoading: areasLoading,
        refetch: refetchAreas,
    } = useGetAreasByDistrictQuery(district._id, { skip: !district._id });
    const { data: searchResults, refetch: refetchSearchResults } = useSearchLocationQuery(searchQuery, {
        skip: !searchQuery,
    });

    const isFormComplete = () => {
        return division.division && district.name && area.name && specificAddress;
    };

    // Auto-fetch districts when division changes
    useEffect(() => {
        if (division._id) {
            refetchDistricts();
        }
    }, [division._id, refetchDistricts]);

    // Auto-fetch areas when district changes
    useEffect(() => {
        if (district._id) {
            refetchAreas();
        }
    }, [district._id, refetchAreas]);

    // Populate dropdown items when API data changes
    useEffect(() => {
        if (divisions) {
            setDivisionItems(
                divisions.map((d: any) => ({
                    label: d.division,
                    value: d.division, // or use d._id if preferred
                    id: d._id,
                }))
            );
            if (!division.division && divisions.length > 0) {
                setDivision({ _id: divisions[0]._id, division: divisions[0].division });
            }
        }
    }, [divisions]);

    useEffect(() => {
        if (districts) {
            setDistrictItems(
                districts.map((d: any) => ({
                    label: d.name,
                    value: d.name,
                    id: d._id,
                }))
            );
            if (!district.name && districts.length > 0) {
                setDistrict({ _id: districts[0]._id, name: districts[0].name });
            }
        }
    }, [districts]);

    useEffect(() => {
        if (areas) {
            setAreaItems(
                areas.map((a: any) => ({
                    label: a.name,
                    value: a.name,
                    id: a._id,
                }))
            );
            if (!area.name && areas.length > 0) {
                setArea({ _id: areas[0]._id, name: areas[0].name });
            }
        }
    }, [areas]);

    // When a search result is selected, auto-set division/district/area
    useEffect(() => {
        if (selectedSearchResult) {
            const pathParts = selectedSearchResult.path.split('>').map((part: string) => part.trim());
            const [divisionName, districtName, areaName] = pathParts;
            setDivision({
                _id: selectedSearchResult.divisionId,
                division: divisionName || '',
            });
            setDistrict({
                _id: selectedSearchResult.districtId,
                name: districtName || '',
            });
            setArea({
                _id: selectedSearchResult._id,
                name: areaName || '',
            });
        }
    }, [selectedSearchResult]);

    // Propagate any changes upward
    useEffect(() => {
        onChange({
            division: division.division || '',
            district: district.name || '',
            area: area.name || '',
            address: specificAddress,
        });
    }, [division, district, area, specificAddress, onChange]);

    const handleCancel = () => {

        router.back();
    }

    const handleSaveForm = () => {
        if (!isFormComplete()) {
            alert('Please fill out all address fields.');
            return;
        }
        setMeetingData(prev => ({
            ...prev,
            address: {
                division: division.division || '',
                district: district.name || '',
                area: area.name || '',
                address: specificAddress,
            }
        }));
        router.push(`/meeting-fix/fix-new-meeting?leadId=${leadId}`);
    };

    return (
        <View className="flex-1 bg-white justify-center p-4">
            <Text className="text-xl font-bold mb-6 text-center text-gray-500">
                Meeting Address
            </Text>

            {!isEditing && defaultAddress ? (
                <View>
                    <Text className="text-lg font-bold mb-2">Current Address</Text>
                    <Text className="text-base mb-2">
                        {`${defaultAddress.division}, ${defaultAddress.district}, ${defaultAddress.area}, ${defaultAddress.address}`}
                    </Text>
                    <TouchableOpacity onPress={() => setIsEditing(true)} className="p-2">
                        <Ionicons name="pencil" size={20} color="#046289" />
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <TextInput
                        placeholder="Search Division/District/Area"
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.length > 2) {
                                refetchSearchResults();
                            }
                        }}
                        className="border border-gray-300 p-2 mb-3 rounded"
                    />
                    {searchQuery.length > 2 && searchResults && (
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedSearchResult(item);
                                        setSearchQuery('');
                                    }}
                                    className="border-b border-gray-200 p-2"
                                >
                                    <Text className="text-sm">{item.path}</Text>
                                </TouchableOpacity>
                            )}
                            className="max-h-40 mb-3"
                        />
                    )}

                    {/* Division Dropdown */}
                    <DropDownPicker
                        open={divisionOpen}
                        onOpen={() => {
                            setDivisionOpen(true);
                            setDistrictOpen(false);
                            setAreaOpen(false);
                        }}
                        value={division.division}
                        items={divisionItems}
                        setOpen={setDivisionOpen}
                        setValue={(callback) => {
                            const newValue = callback(division.division);
                            const selected = divisions?.find((d: any) => d.division === newValue);
                            setDivision({ _id: selected?._id || '', division: newValue });
                        }}
                        setItems={setDivisionItems}
                        placeholder="Select Division"
                        containerStyle={{ marginBottom: 12, zIndex: 3000 }}
                    />

                    {/* District Dropdown */}
                    <DropDownPicker
                        open={districtOpen}
                        onOpen={() => {
                            setDistrictOpen(true);
                            setDivisionOpen(false);
                            setAreaOpen(false);
                        }}
                        value={district.name}
                        items={districtItems}
                        setOpen={setDistrictOpen}
                        setValue={(callback) => {
                            const newValue = callback(district.name);
                            const selected = districts?.find((d: any) => d.name === newValue);
                            setDistrict({ _id: selected?._id || '', name: newValue });
                        }}
                        setItems={setDistrictItems}
                        placeholder="Select District"
                        containerStyle={{ marginBottom: 12, zIndex: 2000 }}
                    />

                    {/* Area Dropdown */}
                    <DropDownPicker
                        open={areaOpen}
                        onOpen={() => {
                            setAreaOpen(true);
                            setDivisionOpen(false);
                            setDistrictOpen(false);
                        }}
                        value={area.name}
                        items={areaItems}
                        setOpen={setAreaOpen}
                        setValue={(callback) => {
                            const newValue = callback(area.name);
                            const selected = areas?.find((a: any) => a.name === newValue);
                            setArea({ _id: selected?._id || '', name: newValue });
                        }}
                        setItems={setAreaItems}
                        placeholder="Select Area"
                        containerStyle={{ marginBottom: 12, zIndex: 1000 }}
                    />

                    <TextInput
                        placeholder="Specific Address"
                        value={specificAddress}
                        onChangeText={setSpecificAddress}
                        className="border border-gray-300 p-2 mb-4 rounded"
                    />

                    <View className="flex-row justify-between space-x-6">
                        <TouchableOpacity onPress={handleCancel} className="bg-gray-400 py-2 px-4 rounded">
                            <Text className="text-white">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSaveForm} className="bg-[#046289] py-2 px-4 rounded">
                            <Text className="text-white">Save</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

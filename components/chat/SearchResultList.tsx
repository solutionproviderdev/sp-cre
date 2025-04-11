import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import ConversationItem from './ConversationItem';
import { SearchLeadsResponse } from '@/features/lead/leadApi';

interface SearchResultListProps {
  searchResult: SearchLeadsResponse | undefined;
  isLoading: boolean;
}

const SearchResultList = ({ searchResult, isLoading }: SearchResultListProps) => {
  // Show loading skeletons if data is loading
  if (isLoading) {
    return (
      <View style={{ padding: 8 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Circle skeleton */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#e0e0e0',
                }}
              />
              <View style={{ marginLeft: 16, flex: 1 }}>
                {/* Text skeletons */}
                <View
                  style={{
                    height: 30,
                    width: '60%',
                    backgroundColor: '#e0e0e0',
                    marginBottom: 4,
                  }}
                />
                <View
                  style={{
                    height: 20,
                    width: '40%',
                    backgroundColor: '#e0e0e0',
                  }}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  // If no search results are available, display a message.
  if (
    !searchResult ||
    (searchResult.matchedNames.length === 0 &&
      searchResult.matchPhoneNumber.length === 0)
  ) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: 'red', fontSize: 16 }}>No results found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Render Name Matches using a FlatList if available */}
      {searchResult.matchedNames && searchResult.matchedNames.length > 0 && (
        <View style={{ flex: 1, marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: 8,
              marginBottom: 8,
            }}
          >
            Name Matches
          </Text>
          <FlatList
            data={searchResult.matchedNames}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ConversationItem item={item} />
            )}
            // Ensure each FlatList handles its own scrolling
            // Note: Depending on your UI, you might leave scrollEnabled as true.
            // If you want both lists to scroll as one, consider using SectionList instead.
          />
        </View>
      )}

      {/* Render Phone Matches using a second FlatList if available */}
      {searchResult.matchPhoneNumber &&
        searchResult.matchPhoneNumber.length > 0 && (
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 8,
                marginBottom: 8,
              }}
            >
              Phone Matches
            </Text>
            <FlatList
              data={searchResult.matchPhoneNumber.map((conversation) => ({
                ...conversation,
                lastMessage: conversation.phone, // Override lastMessage with phone number
              }))}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <ConversationItem item={item} />
              )}
            />
          </View>
        )}
    </View>
  );
};

export default SearchResultList;
